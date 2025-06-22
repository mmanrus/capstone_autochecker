
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView
from autochecker.models.activity_model import Activity
from autochecker.models.submission_model import Submission
from autochecker.forms import SubmitForm
from django.db.models import OuterRef, Subquery

from autochecker.models.classroom_model import Classroom
from autochecker.serializers.submission_serializer import SubmissionSerializer
from autochecker.serializers.user_serializer import UserSerializer

class ActivityDetail(LoginRequiredMixin,DetailView):
    model = Activity
    template_name = 'main/activity.html'
    context_object_name = 'activity'

   
    def get_queryset(self):
        user = self.request.user
        return Activity.objects.filter(classroom_id=self.kwargs.get('classroom_pk'))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        activity = self.get_object()  # This ensures the DetailView works correctly
        classroom = activity.classroom

        submission_subquery = Submission.objects.filter(
            activity=activity, student=OuterRef('pk')
        ).values('id')[:1]  # Get only the first submission (if multiple exist)

        # Query students and annotate with submission ID
        students = classroom.students_assigned.annotate(
            submission_id=Subquery(submission_subquery),
            is_submitted=Subquery(submission_subquery)  # Will be None if no submission
        )

        # Convert to a list of dictionaries to include the full submission object
        student_data = []
        for student in students:
            submission = Submission.objects.filter(activity=activity, student=student).first()
            student_data.append({
                'student': student,
                'is_submitted': submission is not None,
                'submission': submission  # Include full submission object
            })

        context['student_submitted'] = student_data
        context['submitted_activities'] = Submission.objects.filter(student=user, activity=activity)
        context['submit_form'] = SubmitForm()

        return context

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from autochecker.serializers.activity_serializer import ActivitySerializer
import json
class ActivityDetailAPI(generics.RetrieveAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Activity.objects.all()
    
    def retrieve(self, request, *args, **kwargs):
        user = self.request.user
        activity_id = self.kwargs.get('pk')
        classroom_id = self.kwargs.get('classroom_pk')
        
        activity = get_object_or_404(Activity, id=activity_id, classroom=classroom_id)
        classroom = activity.classroom
        
        # See who submits
        submission_subquery = Submission.objects.filter(
            activity=activity, student=OuterRef('pk')
        ).values('id')[:1]

        # Convert to a list of dictionaries to include the full submission object
        students = classroom.students_assigned.all()
        student_data = []
        for student in students:
            submission = Submission.objects.filter(activity=activity, student=student).first()
            student_data.append({
                'student': UserSerializer(student).data,
                'is_submitted': submission is not None,
                'submission': SubmissionSerializer(submission).data if submission else None  # Include full submission object
            })
        # Serialize
        own_submission = Submission.objects.filter(activity=activity, student=user).first()
        serialized_submission = SubmissionSerializer(own_submission).data if own_submission else None
        serialized_activity = self.get_serializer(activity).data

        return Response({
            'activity': serialized_activity,
            'submission': serialized_submission,
            'student': student_data
        })
    