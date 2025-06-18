from autochecker.models.classroom_model import Classroom
from rest_framework import serializers

from autochecker.serializers.user_serializer import UserSerializer

class ClassroomSerializer(serializers.ModelSerializer):
     teacher_assigned = UserSerializer(read_only=True)
     class Meta:
          model = Classroom
          fields = '__all__'
          extra_kwargs = {
               "teacher_assigned": {'read_only': True}, 
               "students_assigned": {'read_only': True}
               }