from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView
from models import Activity, Classroom
from forms import ActivityCreationForm
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
