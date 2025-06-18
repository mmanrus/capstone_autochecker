from rest_framework import serializers
from autochecker.models.submission_model import Submission

class SubmissionSerializer(serializers.ModelSerializer):
     class Meta:
          model = Submission
          fields = '__all__'
          extra_kwargs = {
               "submitted_at": {'read_only': True}, 
               "student": {'read_only': True},
               "professor_feedback": {'read_only': True},
               "grade": {'read_only': True},
               "feedback": {'read_only': True},
               }