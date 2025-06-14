from autochecker.forms import CreateClassroomForm
from autochecker.models import Classroom
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView
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
