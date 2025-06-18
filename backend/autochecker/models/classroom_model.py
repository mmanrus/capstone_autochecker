import random
import string
from django.db import models
from .utils import professor_filter, student_filter
from django.conf import settings

class Classroom(models.Model):
     class_name = models.CharField(max_length=50,)
     class_code = models.CharField(max_length=10, null= False, unique=True)
     schedule = models.CharField(max_length=20)
     teacher_assigned = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to=professor_filter)
     students_assigned = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='student_classes',limit_choices_to=student_filter, blank=True)
     def __str__(self):
          return f'{self.class_name} - Prof. {self.teacher_assigned.last_name}, { self.teacher_assigned.first_name}'
     
     def save(self, *args, **kwargs):
          # ✅ Generate a class code if it's empty
          if not self.class_code:
               self.class_code = self.generate_class_code()
          super().save(*args, **kwargs)

          '''
          def generate_class_code(self):
          
          # Generates Class Code After Created
          
          while True:
               random_classcode = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
               if not Classroom.objects.filter(class_code=random_classcode).exists():
                    self.class_code = random_classcode
                    self.save()
                    break'''
     def generate_class_code(self):
          while True:
               random_classcode = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
               if not Classroom.objects.filter(class_code=random_classcode).exists():
                    return random_classcode
                    