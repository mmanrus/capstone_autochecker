import string
from django.db import models
from django.conf import settings
#from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User, AbstractUser
from django.db import models
from django.utils.timezone import now
import subprocess
import os
import json

import random
# Create your models here.

class CustomUser(AbstractUser):
     ROLE = (
          ('professor', 'professor'),
          ('student', 'student')
     )
     role = models.CharField(max_length=10, choices=ROLE)
     
     def __str__(self):
          return f"{self.role} - {self.get_full_name()}"
def student_filter():
     return {'role': 'student'}

def professor_filter():
     return {'role': 'professor'}
# Class Room
class Classroom(models.Model):
     className = models.CharField(max_length=50,)
     class_code = models.CharField(max_length=10, null= False, unique=True)
     schedule = models.CharField(max_length=20)
     teacher_assigned = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to=professor_filter)
     students_assigned = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='student_classes', limit_choices_to=student_filter, blank=True)
     def __str__(self):
          return f'{self.className} - Prof. {self.teacher_assigned.last_name}, { self.teacher_assigned.first_name}'
     
     def enter_class(self):
          ...

     def generate_class_code(self):
          '''
          # Generates Class Code After Created
          '''
          while True:
               random_classcode = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
               if not Classroom.objects.filter(class_code=random_classcode).exists():
                    self.class_code = random_classcode
                    self.save()
                    break
# Activity
class Activity(models.Model):
    title = models.CharField(max_length=255)
    teacher_assigned = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        limit_choices_to=professor_filter, 
        blank=True
    )
    description = models.TextField()
    instructions = models.FileField(upload_to='instructions/', null=True, blank=True)
    check50_slug = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_submitted = models.BooleanField(default=False) 
    time_open = models.DateTimeField(null=True, blank=True)
    time_limit = models.DateTimeField(null=True, blank=True)
    isClosed = models.BooleanField(default=False)
    classroom = models.ForeignKey(
        Classroom, 
        related_name='assigned_activities', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )

    def save(self, *args, **kwargs):
        # Ensure only professors can create activities
        if self.teacher_assigned.role != 'professor':
            raise ValueError("Only professors can create activities.")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
     
class Submission(models.Model):
     STATUS_CHOICE = [("Pending", 'Pending'), ('Passed', '✅ Passed'), ('Failed', '❌ Failed')]
     student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
     activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
     grade = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)  # Allows numerical grades
     max_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)  # Optional
     submitted_file = models.FileField(upload_to='submissions/', null=False, blank=False)
     status = models.CharField(max_length=20, choices= STATUS_CHOICE)
     feedback = models.TextField(blank=True, null=True)
     submitted_at = models.DateTimeField(auto_now_add=True)
     professor_feedback = models.TextField(blank=True, null=True)
     class Meta:
          ordering = ['-submitted_at']
     def __str__(self):
          return f"{self.student.get_full_name()} - {self.activity.title}, result:{self.status}, SCORE: {self.grade}"
     
    
     def run_check50(self):
          """Run check50 and capture both JSON and raw output in one execution."""
          if not self.activity.check50_slug:
               self.feedback = "No check50 Slug"
               self.status = "Pending"
               self.save()
               return 
          
          file_dir = os.path.dirname(self.submitted_file.path)

          try:
               # Run check50 command ONCE
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
                    passed_tests = [test['name'] for test in test_result if test.get('passed') is True]
                    failed_test = [test['name'] for test in test_result if test.get('passed') is False]
                    null_test = [test['name'] for test in test_result if test.get('passed') is None]
                    
                    feedback_msg = (
                         '✅ All test passed\n' if not failed_test and not null_test 
                         else '❌ failed: None Passed\n' 
                         if not passed_tests else '❌  Some tests failed:\n'
                         )
                    for test in test_result:
                         status = "✅ Passed" if test.get('passed') else '❌ Failed'
                         feedback_msg += f"- {test['name']}: {status}\n"
                    score = self.calculate(json_output)
                    self.status = "✅ Passed" if score >= 75 else "❌ Failed"
                    self.grade = score
               else:
                    self.feedback = "⚠️ No test results found. Check for errors."
                    self.status = "Pending"
                    self.grade = 0

               # Store both JSON and raw output
               self.feedback = feedback_msg
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
               if result.get('passed') is True:
                    score += 1
               elif result.get('passed') is None:
                    score += 0.3  
          return round((score/max_score) * 100, 2)

