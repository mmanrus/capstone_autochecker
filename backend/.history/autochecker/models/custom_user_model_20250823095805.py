from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class CustomUser(AbstractUser):
     ROLE = (
          ('professor', 'professor'),
          ('student', 'student')
     )
     validators=[
            MinValueValidator(2200000),
            MaxValueValidator(3000000)
        ]
     role = models.CharField(max_length=10, choices=ROLE)
     student_id = models.CharField(max_length=10)
     def __str__(self):
          return f"{self.role} - {self.get_full_name()}"