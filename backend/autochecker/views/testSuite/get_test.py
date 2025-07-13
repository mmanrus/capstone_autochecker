from rest_framework import generics
from backend.autochecker.models.test_suite_model import TestSuite
from autochecker.serializers.test_suite_serializer import TestSuiteSerializers
from autochecker.permissions.professor import IsProfessor
from rest_framework.permissions import IsAuthenticated
class CreateTestSuiteViewAPI(generics.RetrieveAPIView):
     permission_classes  = [IsAuthenticated, IsProfessor]
     serializer_class = 