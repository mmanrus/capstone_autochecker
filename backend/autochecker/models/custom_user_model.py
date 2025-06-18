from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
     ROLE = (
          ('professor', 'professor'),
          ('student', 'student')
     )
     role = models.CharField(max_length=10, choices=ROLE)
     
     def __str__(self):
          return f"{self.role} - {self.get_full_name()}"