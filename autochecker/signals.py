from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Submission, Classroom

@receiver(post_save, sender=Submission)
def check_submission(sender, instance, created, **kwargs):
     if created:
          instance.run_check50()

@receiver(post_save, sender=Classroom)
def create_classroom(sender,instance, created, **kwargs):
     if created:
          instance.generate_class_code()