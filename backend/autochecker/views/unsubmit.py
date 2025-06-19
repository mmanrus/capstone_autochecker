from django.contrib import messages
from django.shortcuts import get_object_or_404
from autochecker.models.submission_model import Submission
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import View
from django.http import HttpResponseRedirect

from autochecker.serializers.submission_serializer import SubmissionSerializer

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

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class UnsubmitViewAPI(generics.DestroyAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Submission.objects.filter(student=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        submission_id = self.kwargs.get('pk')
        user = self.request.user
        submission = get_object_or_404(Submission, pk=submission_id, student=user)
        
        if submission.submitted_file:
            submission.submitted_file.delete()
        
        self.perform_destroy(submission)
        return Response(status=204)
        
    