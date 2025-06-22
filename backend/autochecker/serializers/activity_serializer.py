from rest_framework import serializers
from autochecker.models.activity_model import Activity
from django.contrib import messages
class ActivitySerializer(serializers.ModelSerializer):
     class Meta:
          model = Activity
          fields = '__all__'
          extra_kwargs = {
               "teacher_assigned": {'read_only': True}, 
               "students_assigned": {'read_only': True},
               'isClosed': {'read_only': True}
               }

     def create(self, validated_data):
          user = self.context['request'].user
          return Activity.objects.create(**validated_data)
     
