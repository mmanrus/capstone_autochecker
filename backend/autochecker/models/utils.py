from django.utils.timezone import now
from datetime import timedelta
import os
def student_filter():
     return {'role': 'student'}

def professor_filter():
     return {'role': 'professor'}

def default_time_closed():
     return now() + timedelta(hours=1)


def create_dir(instance, filename):
     return os.path.join(f'submissions/{instance.activity.title}/{instance.student.last_name}, {instance.student.first_name}/', filename)
