from django.db import models

class TestSuite(models.Model):
     CHOICES = (
          ('c', 'c'),
          ('py','py')
     )
     title = models.CharField(max_length=100)
     filename = models.CharField(max_length=100)
     language = models.CharField(max_length=3, choices=CHOICES)
     
     