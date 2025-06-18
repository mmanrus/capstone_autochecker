from datetime import datetime
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.views.generic import CreateView
from autochecker.models.submission_model import Submission
from autochecker.models.activity_model import Activity
from autochecker.models.classroom_model import Classroom
from autochecker.forms import SubmitForm
import pytz
from django.contrib import messages
from django.shortcuts import get_object_or_404, render
class SubmitView(LoginRequiredMixin, CreateView):
    model = Submission
    form_class = SubmitForm
    template_name = 'main/activity.html'
    
    def form_valid(self, form):
        activity = get_object_or_404(Activity, pk=self.kwargs['pk'])
        student = self.request.user
        now = datetime.now()
        print(now)
        print(activity.time_limit)
        manila_tz = pytz.timezone('Asia/Manila')
        now = manila_tz.localize(now)
        if now > activity.time_limit:
            print('Failed: ')
            messages.error(self.request, "Submission Failed: The tests is close")
            return self.form_invalid(form)
        # Check if the student has already submitted
        existing_submission = Submission.objects.filter(student=student, activity=activity).first()
        if existing_submission:
            messages.error(self.request, "You have already submitted this activity. Please unsubmit first before resubmitting.")
            return self.form_invalid(form)

        # Assign the student and activity before saving
        form.instance.activity = activity
        form.instance.student = student
        form.instance.is_submitted = True

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
    