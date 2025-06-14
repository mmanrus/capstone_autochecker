from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView
from models import Submission

class SubmittedActivityScoreDetailView(LoginRequiredMixin, DetailView):
    template_name = 'main/submitted_acitivity_detail.html'
    model = Submission
    context_object_name = 'submitted_activity'
    
    def form_valid(self, form):
        self.object = form.save()
        new_filename = self.object.submitted_file.name
        return super().form_valid(form)
    
    