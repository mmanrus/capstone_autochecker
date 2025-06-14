from django.contrib import admin
from .models import Classroom, Activity, Submission, CustomUser
# Register your models here.

admin.site.register(Activity)
admin.site.register(Submission)
admin.site.register(CustomUser)
admin.site.register(Classroom)
