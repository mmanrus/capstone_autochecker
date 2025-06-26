from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from autochecker.permissions.professor import IsProfessor
from autochecker.serializers.test_suite_serializer import TestSuiteSerializers
import os
import subprocess


class CreateTestSuiteViewAPI(generics.CreateAPIView):
     serializer_class = TestSuiteSerializers
     permission_classes = [IsProfessor, IsAuthenticated]
     
     def perform_create(self, serializer):
          
          data = self.request.data
          lang = data.get('language')
          github_token = data['github_token']
          github_repo = data['github_repo']
          input_type = data['input_type'] # 
          if lang != 'c' or lang != 'py':
               return Response({
                    'detail': 'Unable to delete: You are not the owner of the Assigned teacher.'
                    },status=status.HTTP_403_FORBIDDEN)
          
          title = data.get('title').lower().replace(' ', '_')
          base_path = f'/tmp/test/{title}'
          os.makedirs(base_path, exist_ok=True)
          
          with open(os.path.join(base_path, '.cs50.yaml'), 'w') as f:
               f.write(f"check50: 50")
               
          with open(os.path.join(base_path, '__init.py'), 'w') as f:
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

          else:
               # if the language is python
               runPython = f'check50.run("python3 {title}.{lang}").stdout()'
          test_cases = data.get('test_cases')
          for i, case in enumerate(test_cases):
               test_input = ' '.join(case['inputs'])
               output = case['output']
               helper = case['helper']
               f.write(f'''
{ '@check50.check(compiles)' if runC != '' else '@check50.check(exists)'}
def test_case_{i}
     // Test case for {i}
     result = { runC.replace('""', test_input) if runC != '' else runPython }
     if "{output}" not in result:
          raise check50.Mismatch(expected_output, "{output}"{', helper={helper}' if helper else ''})
                    ''')
          
          try:
               if not os.path.exists(os.path.join(base_path, ".git")):
                    # Initialize Git if not already a repo
                    subprocess.run(["git", "init"], cwd=base_path, check=True)

               subprocess.run(["git", "remote", "remove", "origin"], cwd=base_path, check=False)
               subprocess.run(["git", "remote", "add", "origin", github_repo.replace("https://", f"https://{github_token}@")], cwd=base_path, check=True)

               # Optional: Pull latest changes (if you already have files in the repo)
               subprocess.run(["git", "pull", "origin", "master", "--allow-unrelated-histories"], cwd=base_path, check=False)

               subprocess.run(["git", "add", "."], cwd=base_path, check=True)
               subprocess.run(["git", "commit", "-m", "Pushed from Django app"], cwd=base_path, check=True)
               subprocess.run(["git", "push", "-u", "origin", "master"], cwd=base_path, check=True)

               return Response({"status": "success", "repo": github_repo})

          except subprocess.CalledProcessError as e:
               return Response({"error": str(e)})
