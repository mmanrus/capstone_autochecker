
from django.db import models
from django.conf import settings
from .classroom_model import Classroom
from django.utils import timezone
from django.core.exceptions import ValidationError
from .utils import default_time_closed, professor_filter


class Activity(models.Model):
     ACTIVITY_TYPE = (
          ('practice', 'practice'),

          ('activity', 'activity'),
     )
     title = models.CharField(max_length=255)
     teacher_assigned = models.ForeignKey(
          settings.AUTH_USER_MODEL, 
          on_delete=models.CASCADE, 
          limit_choices_to=professor_filter, 
          blank=True
     )
     activity_type = models.CharField(choices=ACTIVITY_TYPE, default='')
     description = models.TextField()
     instructions = models.FileField(upload_to='instructions/', null=False)
     check50_slug = models.CharField(max_length=255)
     created_at = models.DateTimeField(auto_now_add=True)
     time_open = models.DateTimeField(null=False, default=timezone.now)
     time_limit = models.DateTimeField(null=True, default=default_time_closed)
     isClosed = models.BooleanField(default=False)
     classroom = models.ForeignKey(
          Classroom, 
          related_name='assigned_activities', 
          on_delete=models.CASCADE, 
          null=True, 
          blank=True
     )
     def clean(self):
          # Get the values safely
          time_open = getattr(self, 'time_open', None)
          time_limit = getattr(self, 'time_limit', None)

          # Validate if time_open is before time_limit
          if time_open and time_limit and time_open >= time_limit:
               raise ValidationError({'time_limit': 'Closing time must be after the opening time.'})
     def save(self, *args, **kwargs):
          # Ensure only professors can create activities
          if self.teacher_assigned.role and self.teacher_assigned.role != 'professor':
               raise ValueError("Only professors can create activities.")
          super().save(*args, **kwargs)

     def __str__(self):
          return self.title