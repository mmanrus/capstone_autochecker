from django.views.generic import ListView
from autochecker.models import Activity, Classroom
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404

class ClassroomActivities(LoginRequiredMixin, ListView):
    template_name = 'main/classroom_activities.html'
    model = Activity
    context_object_name = 'activities'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        classroom_pk = self.kwargs.get('pk')
        context['classroom_pk'] = classroom_pk 
        context['classroom'] = get_object_or_404(Classroom, pk=classroom_pk)
        return context
    def get_queryset(self):
        classroom_id = self.kwargs.get('pk')
        classroom = get_object_or_404(Classroom, id=classroom_id)
        return Activity.objects.filter(classroom=classroom)

    