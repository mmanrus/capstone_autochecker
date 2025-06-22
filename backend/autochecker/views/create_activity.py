from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView
from autochecker.models.activity_model import Activity
from autochecker.models.classroom_model import Classroom
from autochecker.forms import ActivityCreationForm
from django.shortcuts import get_object_or_404
from django.contrib import messages
from django.urls import reverse


class CreateActivityView(LoginRequiredMixin, CreateView):
    template_name = 'main/create_activity.html'
    model = Activity
    form_class = ActivityCreationForm
    
    def form_valid(self, form):
        self.classroom = get_object_or_404(Classroom, id=self.kwargs['classroom_pk'])
        user = self.request.user
        if not self.request.FILES.get('instructions'):  # Check if file is missing
            form.instance.instructions = None  # Prevent error when no file is uploaded

        form.instance.classroom= self.classroom
        if user.role != 'professor':
            messages.error(self.request, 'Activity Creation Failed you are not the FATHER XD')
            return self.form_invalid(form)
        form.instance.teacher_assigned = user
        print("Form data before saving:", form.cleaned_data)
        self.activity = form.save()
        return super().form_valid(form)
        
    def get_success_url(self):
        return reverse('activity_detail', kwargs={'classroom_pk': self.classroom.pk, 'pk': self.activity.pk})
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from autochecker.permissions.professor import IsProfessor
from autochecker.serializers.activity_serializer import ActivitySerializer
class CreateActivityViewAPI(generics.CreateAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsProfessor]
    
    def perform_create(self, serializer):
        user = self.request.user
        classroom_id = self.kwargs.get('classroom_pk')
        classroom = get_object_or_404(Classroom, pk=classroom_id)
        serializer.save(teacher_assigned=user, classroom=classroom)
        
class DeleteActivityViewAPI(generics.DestroyAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsProfessor]
    
    def get_queryset(self):
        return Activity.objects.filter(teacher_assigned=self.request.user)
    
    def delete(self, request, pk):
        try:
            user = self.request.user
            classroom = Activity.objects.get(pk=pk)
            if classroom.teacher_assigned != user:
                return Response({
                    'detail': 'Unable to delete: You are not the owner of the Assigned teacher.'
                    },status=status.HTTP_403_FORBIDDEN)
            
            classroom.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Classroom.DoesNotExist:
            return Response({
                'detail': 'Classroom not found'
            }, status=status.HTTP_404_NOT_FOUND)