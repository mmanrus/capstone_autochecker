from django.db import models
from django.conf import settings
from .activity_model import Activity
import subprocess
from .utils import create_dir
import os
import json
from django.utils.timezone import now

class Submission(models.Model):
     STATUS_CHOICE = [("Pending", 'Pending'), ('Passed', '✅ Passed'), ('Failed', '❌ Failed')]
     student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
     activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
     grade = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)  # Allows numerical grades
     max_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)  # Optional
     submitted_file = models.FileField(upload_to=create_dir, null=False, blank=False)
     status = models.CharField(max_length=20, choices= STATUS_CHOICE)
     feedback = models.TextField(blank=True, null=True)
     submitted_at = models.DateTimeField(auto_now_add=True)
     is_submitted = models.BooleanField(default=False)
     professor_feedback = models.TextField(blank=True, null=True)
     class Meta:
          ordering = ['-submitted_at']

     def replace_old_file(self):
          ...
     def __str__(self):
          return f"{self.student.last_name}, {self.student.first_name}- {self.activity.title}, result:{self.status}, SCORE: {self.grade}"
    
     def run_check50(self):
          """Run check50 and capture both JSON and raw output in one execution."""
          if not self.activity.check50_slug:
               self.feedback = "No check50 Slug"
               self.status = "Pending"
               self.save()
               return
     
          if not self.submitted_at:
               self.feedback ="No uploaded"
               self.status = "Pending"
               self.save()
          submitted = self.submitted_file.path
          file_dir = os.path.dirname(submitted)

          try:
               if not os.path.exists(submitted):
                    self.feedback = 'Submitted file not found'
                    self.status = 'Pending'
                    self.save()
                    return
               print('Debug: Check')
               command = ['check50', self.activity.check50_slug, '--local', '-o', 'json']
               result = subprocess.run(command, capture_output=True, text=True, timeout=60, cwd=file_dir)
               
               # Capture raw command output (stdout + stderr)
               raw_output = result.stdout + result.stderr

               # Try parsing JSON output
               try:
                    json_output = json.loads(result.stdout)
               except json.JSONDecodeError:
                    json_output = {"error": "Invalid JSON output", "raw_output": raw_output}
               test_result = json_output.get('results')
               # Determine status and grade
               if test_result:
                    passed_tests = [test['name'] for test in test_result if test.get('passed') == True]
                    failed_test = [test['name'] for test in test_result if test.get('passed') == False]
                    feedback_msg = (
                         '✅ All test passed\n' if not failed_test 
                         else '❌ failed: None Passed\n' 
                         if not passed_tests else '❌  Some tests failed:\n'
                         )
                    for test in test_result:
                         status = "✅ Passed" if test.get('passed') == True else '❌ Failed'
                         feedback_msg += f"- {test['name']}: {status}\n"
                    score = self.calculate(json_output)
                    self.status = "✅ Passed" if score >= 75 else "❌ Failed"
                    self.grade = score
                    self.feedback = feedback_msg
               else:
                    self.feedback = "⚠️ No test results found. Check for errors."
                    self.status = "Pending"
                    self.grade = 0
               # Store both JSON and raw output
               self.is_submitted = True
               self.reviewed_at = now()
               self.save()

          except Exception as e:
               self.feedback = f"Error running check50: {str(e)}"
               self.status = "Pending"
               self.save()
          
     def calculate(self,json_data):
          '''
          Calculate the grade based on check50 results.
          '''
          score = 0
          results = json_data.get('results',[])
          max_score = len(results)
          if max_score == 0:
               return
          
          for result in results:
               if result.get('passed') == True:
                    score += 1
               elif result.get('passed') == False:
                    score += 0.3  
          return round((score/max_score) * 100, 2)
  
     