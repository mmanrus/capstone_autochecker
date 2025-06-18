from django.contrib import admin
from autochecker.models.activity_model import Activity
from autochecker.models.submission_model import Submission
from autochecker.models.classroom_model import Classroom
from autochecker.models.custom_user_model import CustomUser
# Register your models here.

admin.site.register(Activity)
admin.site.register(Submission)
admin.site.register(CustomUser)
admin.site.register(Classroom)
