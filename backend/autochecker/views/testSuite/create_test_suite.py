from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from autochecker.permissions.professor import IsProfessor
from autochecker.models.test_suite_model import TestSuite
from autochecker.serializers.test_suite_serializer import TestSuiteSerializers
import os
import subprocess
from django.conf import settings
import json
class CreateTestSuiteViewAPI(generics.CreateAPIView):
     serializer_class = TestSuiteSerializers
     permission_classes = [IsAuthenticated, IsProfessor]
     
     def perform_create(self, serializer):
          print('Creating test suite...')
          token = settings.GITHUB_TOKEN
          username = settings.GITHUB_USERNAME
          data = self.request.data.copy()
          print(data)
          description = data.get('description')
          lang = data.get('language')
          try:
               
               test_cases_raw = data.pop('test_cases', '[]')
               if isinstance(test_cases_raw, list):
                    test_cases_json_str = test_cases_raw[0]  # It's a string like '[{...}]'
                    print('List test cases loaded:', test_cases_json_str)
               elif isinstance(test_cases_raw, str):
                    test_cases_json_str = test_cases_raw
                    print('String test cases loaded:', test_cases_json_str)
               else:
                    return Response({'error': 'Invalid test_cases format'}, status=400)
               test_cases = json.loads(test_cases_json_str)  # ✅ parse it here!
               print('Parsed test cases:', test_cases)
          except json.JSONDecodeError:
               return Response({'error': 'Invalid test_cases JSON format'}, status=400)
          #github_token = data['github_token']
          #github_repo = data['github_repo']
          #input_type = data['input_type'] # 
          repo_path = 'C:/Users/Seth/Desktop/python/checker'
          title = data.get('title').lower().replace(' ', '_')
          if lang not in ['c', 'py']:
               return Response({
                    'detail': 'Unable to delete: You are not the owner of the Assigned teacher.'
                    },status=status.HTTP_403_FORBIDDEN)
          
          isDuplicate = TestSuite.objects.filter(title=title).exists()
          if isDuplicate:
               return Response(
                    {'details': 'duplicate testname'}, status=status.HTTP_400_BAD_REQUEST 
               )
          slug = f'check50 mmanrus/checker/main/{title}'
          base_path = os.path.join(repo_path, title)
          os.makedirs(base_path, exist_ok=True)
          
          # Write .cs50.yaml
          with open(os.path.join(base_path, '.cs50.yaml'), 'w') as f:
               f.write(f"check50: 50")
          
          # Write __init__.py
          with open(os.path.join(base_path, '__init__.py'), 'w') as f:
               f.write(f'''
import check50

@check50.check()                       
def exists():
     """Checks if {title}.{lang} exists"""              
     check50.exists("{title}.{lang}")                  
                       ''')
               runPython = ''
               runC = ''
               if lang == 'c':
                    f.write(f'''
@check50.check(exists)
def compiles():
    """Checks if {title}.{lang} compiles successfully"""
    check50.run("gcc -o {title} {title}.{lang}").exit(0)
    # or make {title}.{lang}''')
               runC = f'check50.run("./{title}").stdin("").stdout()'
               
               if lang == 'py':
                    # if the language is python
                    runPython = f'check50.run("python3 {title}.{lang}").stdout()'
               

               for i, case in enumerate(test_cases):
                    #
                    print('case',case)
                    test_input = case.get('input')
                    output = case.get('output')
                    helper = case.get('helper')
                    f.write(f'''
{ '@check50.check(compiles)' if runC != '' else '@check50.check(exists)'}
def test_case_{i}():
     // Test case for {i}
     result = { runC.replace('""', test_input) if runC != '' else runPython }
     if "{output}" not in result:
          raise check50.Mismatch(expected_output, "{output}"{', helper={helper}' if helper else ''})
                    ''')
          
          try:
               subprocess.run(["git", "add", "."], cwd=repo_path, check=True)
               subprocess.run(["git", "commit", "-m", f"Add {title}.{lang}  test suite"], cwd=repo_path, check=True)
               if token:
                    print(token)
                    repo_url = f"https://{username}:{token}@github.com/{token}/checker.git"
                    subprocess.run(["git", "remote", "set-url", "origin", repo_url], cwd=repo_path, check=True)
               else:
                    print('No github token')
               subprocess.run(["git", "push", "origin", "main"], cwd=repo_path, check=True)
          except subprocess.CalledProcessError as e:
               return Response({"error": str(e)})
          
          return serializer.save(
               title=title,
               filename=f"{title}.{lang}",
               language=lang,
               check50_slug = slug,
               description=description,
               created_by=self.request.user
          )
