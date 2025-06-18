from django.contrib import messages
from django.shortcuts import get_object_or_404
from autochecker.models.submission_model import Submission
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import View
from django.http import HttpResponseRedirect

class UnsubmitView(LoginRequiredMixin, View):
    def post(self, request, pk):
        submission = get_object_or_404(Submission, pk=pk, student=request.user)

        # Delete the submitted file
        if submission.submitted_file:
            submission.submitted_file.delete()

        # Delete the submission record
        submission.delete()

        messages.success(request, "Your submission has been removed. You may now submit again.")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
