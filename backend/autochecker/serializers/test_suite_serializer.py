from rest_framework import serializers
from autochecker.models.test_suite import TestSuite

class TestSuiteSerializers(serializers.ModelSerializer):
     class Meta:
          model = TestSuite
          fields = '__all__'