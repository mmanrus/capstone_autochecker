from rest_framework import generics
from autochecker.serializers.user_serializer import UserSerializer
from rest_framework.permissions import IsAuthenticated

class getUserAPIView(generics.RetrieveAPIView):
     serializer_class = UserSerializer
     permission_classes = [IsAuthenticated]
     
     def get_object(self):
          return self.request.user