
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView
from autochecker.models.activity_model import Activity
from autochecker.models.submission_model import Submission
from autochecker.forms import SubmitForm
from django.db.models import OuterRef, Subquery

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
from autochecker.serializers.activity_serializer import ActivitySerializer
class ActivityDetailAPI(generics.RetrieveAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return Activity.objects.all()
    