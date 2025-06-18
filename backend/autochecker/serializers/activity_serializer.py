from rest_framework import serializers
from autochecker.models.activity_model import Activity

class ActivitySerializer(serializers.ModelSerializer):
     class Meta:
          model = Activity
          fields = '__all__'
          extra_kwargs = {
               "teacher_assigned": {'read_only': True}, 
               "students_assigned": {'read_only': True}
               }

