from autochecker.models.activity_model import Activity
from autochecker.models.classroom_model import Classroom
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from autochecker.serializers.classroom_serializer import ClassroomSerializer
from autochecker.serializers.activity_serializer import ActivitySerializer

#!SECTION Get Activities in the Classroom
class ClassroomActivitiesAPI(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        # Get the classroom
        classroom_id = self.kwargs.get('pk')
        classroom = get_object_or_404(Classroom, id=classroom_id)
        
        # Serialize Classroom and Activities
        classroom_data = ClassroomSerializer(classroom).data
        # get Activities assigned to the classroom
        activities = Activity.objects.filter(classroom=classroom)
        # serializer Activities
        activity_data = ActivitySerializer(activities, many=True).data
        return Response({
            'classroom': classroom_data,
            'activity': activity_data
        })

    