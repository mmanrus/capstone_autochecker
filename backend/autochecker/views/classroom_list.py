from autochecker.models.classroom_model import Classroom
from django.db.models import Q
from ..forms import ClassroomCodeForm

from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView

class ClassroomListView(LoginRequiredMixin, ListView):
    template_name = 'main/index.html'
    model = Classroom
    context_object_name = 'classrooms'
    def get_queryset(self):
        user = self.request.user
        classrooms = Classroom.objects.filter(
            Q(students_assigned=user) |Q(teacher_assigned=user) 
        ).distinct()
        print("DEBUG: Retrieved Classrooms ->", classrooms)  # ✅ Debugging line
        if not classrooms.exists():
            print("❌ No classrooms found for this user!")
        return classrooms
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['join_classroom_form'] = ClassroomCodeForm()
        
        return context
    
from rest_framework import generics

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
#from autochecker.models.classroom_model import Classroom
from autochecker.serializers.classroom_serializer import ClassroomSerializer

        
class ClassroomListViewAPI(generics.ListAPIView):
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated] #AllowAny for testing
    
    def get_queryset(self):
        user = self.request.user
        
        return Classroom.objects.filter(
            Q(students_assigned=user) | Q(teacher_assigned=user)
        ).distinct()
        # For testing if it works
        # return Classroom.objects.all()