from autochecker.models import Classroom
from rest_framework import serializers

class ClassroomSerializer(serializers.ModelSerializer):
     class Meta:
          model = Classroom
          fields = '__all__'
          extra_kwargs = {"teacher_assigned": {'read_only': True}, "students_assigned": {'read_only': True}}