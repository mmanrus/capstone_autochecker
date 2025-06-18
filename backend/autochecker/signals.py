from django.db.models.signals import post_save
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.utils.timezone import now
from django.dispatch import receiver
from autochecker.models.submission_model import Submission
from autochecker.models.classroom_model import Classroom

@receiver(post_save, sender=Submission)
def check_submission(sender, instance, created, **kwargs):
     if created:
          instance.run_check50()

@receiver(post_save, sender=Classroom)
def create_classroom(sender,instance, created, **kwargs):
     if created:
          instance.generate_class_code()
          
