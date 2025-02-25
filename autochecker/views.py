from django.http import JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import os
from django.db.models import Q
from django.shortcuts import get_object_or_404, render
from django.contrib import messages
from .models import Activity, Submission, Classroom
from .forms import SubmitForm, ActivityCreationForm
from django.views.generic import CreateView, DetailView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin


class ClassroomListView(LoginRequiredMixin, ListView):
    template_name = 'main/index.html'
    model = Classroom
    context_object_name = 'classrooms'

    def get_queryset(self):
        user = self.request.user
        return Classroom.objects.filter(
            Q(teacher_assigned = user) | Q(students_assigned=user)
        ).distinct
        
class ClassroomActivities(LoginRequiredMixin, ListView):
    template_name = 'main/classroomactivities.html'
    model = Activity
    context_object_name = 'activities'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['classroom_pk'] = self.kwargs.get('pk')
        return context
    def get_queryset(self):
        classroom_id = self.kwargs.get('pk')
        classroom = get_object_or_404(Classroom, id=classroom_id)
        return Activity.objects.filter(classroom=classroom)

class SubmitView(CreateView):
    model = Submission
    form_class = SubmitForm
    template_name = 'main/activity.html'
    
    def form_valid(self, form):
        activity = get_object_or_404(Activity, pk=self.kwargs['pk'])
        form.instance.activity=activity
        form.instance.student=self.request.user
        return super().form_valid(form)
    def form_invalid(self, form):
        """Display error messages when submission fails"""
        activity = get_object_or_404(Activity, pk=self.kwargs['pk'])
        classroom = get_object_or_404(Classroom,pk=self.kwargs['classroom_pk'])
        messages.error(self.request, "Submission failed. Please upload a valid .py or .c file.")
        return render(self.request, 'main/activity.html', {
            'activity': activity,
            'classroom': classroom,
            'submit_form': form
        })
    def get_success_url(self):
        return reverse('activity_detail', kwargs={'classroom_pk': self.object.activity.classroom.pk,'pk': self.object.activity.pk})
    
    
class CreateActivity(CreateView):
    model = Activity
    form_class = ActivityCreationForm
    template_name = 'main/create_activity.html'

class ActivityDetail(DetailView):
    model = Activity
    template_name = 'main/activity.html'
    context_object_name = 'activity'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['submit_form'] = SubmitForm()
        return context
        
