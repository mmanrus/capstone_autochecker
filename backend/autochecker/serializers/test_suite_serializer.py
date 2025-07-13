from rest_framework import serializers
from autochecker.models.test_suite_model import TestSuite

class TestSuiteSerializers(serializers.ModelSerializer):
     class Meta:
          model = TestSuite
          fields = '__all__'
          read_only_fields = ('filename', 'check50_slug', 'created_by', 'created_at')