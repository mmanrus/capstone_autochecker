from django.db import models
from django.conf import settings
from .utils import professor_filter
class TestSuite(models.Model):
     CHOICES = (
          ('c', 'c'),
          ('py','py')
     )
     title = models.CharField(max_length=100)
     filename = models.CharField(max_length=100)
     description = models.CharField(max_length=255, blank=True, null=True)
     language = models.CharField(max_length=3, choices=CHOICES)
     check50_slug = models.CharField(max_length=100)
     created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to=professor_filter)
     created_at = models.DateTimeField(auto_now_add=True)