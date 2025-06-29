from autochecker.forms import CreateClassroomForm
from autochecker.models.classroom_model import Classroom
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView


# Rest
from rest_framework import generics, status
from autochecker.serializers.classroom_serializer import ClassroomSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from autochecker.permissions.professor import IsProfessor
class ClassroomCreateView(LoginRequiredMixin, CreateView):
    template_name = 'main/create_classroom.html'
    form_class = CreateClassroomForm
    model = Classroom
    
    def form_valid(self, form):
        schedule = form.cleaned_data.get('schedule')
        class_name = form.cleaned_data.get('class_name')
        if class_name == None:
            messages.error(self.request, 'Empty class_name')
        if schedule == None:
            messages.error(self.request, 'No Schedule')
            return self.form_invalid(form)
        user = self.request.user
        if user.role != 'professor':
            messages.error(self.request, 'Classroom Creation Failed you are not the FATHER XD')
            return self.form_invalid(form)
        form.instance.teacher_assigned = user
        print("Form data before saving:", form.cleaned_data)
        self.object = form.save()
        return super().form_valid(form)
        
    def get_success_url(self):
        return reverse('classroom_detail', kwargs={'pk': self.object.pk})
    
class ClassroomCreateViewAPI(generics.CreateAPIView):
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated, IsProfessor]


    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(teacher_assigned=user)

    
class ClassroomDeleteViewAPI(generics.DestroyAPIView):
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated, IsProfessor]
    
    def get_queryset(self):
        return Classroom.objects.filter(teacher_assigned=self.request.user)
    
    def delete(self, request, pk):
        try:
            user = self.request.user
            print(user.role)
            if user.role == 'student':
                return Response({
                    'detail': 'Students are fobidden to delete classroom'
                    },status=status.HTTP_403_FORBIDDEN)
            
            classroom = Classroom.objects.get(pk=pk)
            if classroom.teacher_assigned != user:
                return Response({
                    'detail': 'Unable to delete: You are not the owner of the classroom.'
                    },status=status.HTTP_403_FORBIDDEN)
            
            classroom.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Classroom.DoesNotExist:
            return Response({
                'detail': 'Classroom not found'
            }, status=status.HTTP_404_NOT_FOUND)