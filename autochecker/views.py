from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import os
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from .models import Activity, Submission, Classroom
from .forms import SubmitForm, ActivityCreationForm, ClassroomCodeForm, CreateClassroomForm
from django.views.generic import CreateView, View, DetailView, ListView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.contrib.auth import get_user_model, logout
import logging
from django.db.models import OuterRef, Subquery, Exists, Value, BooleanField
import csv
from datetime import datetime
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.utils.timezone import now
import pytz
import socket
from django.views.decorators.http import require_POST


logger = logging.getLogger(__name__)

def get_csv_filename():
    today = now().strftime("%Y-%m-%d")  # File named with the current date
    return os.path.join("logs", f"{today}.csv")

    # Ensure the logs directory exists
if not os.path.exists("logs"):
    os.makedirs("logs")

# Capture login event
@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    device_name = socket.gethostname()  # Get remote PC name
    timestamp = now().strftime("%Y-%m-%d %H:%M:%S")
    full_name = f"{user.last_name}, {user.first_name}"
    csv_file = get_csv_filename()
    is_new_file = not os.path.exists(csv_file)
    with open(csv_file, mode="a", newline="") as file:
        writer = csv.writer(file)
        
        # Write header if file is new
        if is_new_file:
            writer.writerow(["Username", "Device", "Login Time", "Logout Time"])
        
        # Write login data
        writer.writerow([full_name, device_name, timestamp, ""])
@csrf_exempt  # Allow CSRF bypass only for logout (since CSRF is sent in JS)
@require_POST  # Ensure logout is only done via POST request
def auto_logout(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({"message": "User logged out successfully"}, status=200)
    return JsonResponse({"error": "User is not logged in"}, status=400)

@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    if user is None:  # Fix: Ensure user is not None
        return  
    device_name = socket.gethostname()
    timestamp = now().strftime("%Y-%m-%d %H:%M:%S")
    full_name = f"{user.last_name}, {user.first_name}"
    csv_file = get_csv_filename()
    updated_rows = []


    # Update the last row where the logout time is empty
    if os.path.exists(csv_file):
        with open(csv_file, mode="r") as file:
            reader = csv.reader(file)
            rows = list(reader)

        for row in rows:
            if row and row[0] == full_name and row[1] == device_name and row[3] == "":
                row[3] = timestamp  # Update logout time
            updated_rows.append(row)

        # Rewrite updated CSV
        with open(csv_file, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerows(updated_rows)
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


class ClassroomListView(LoginRequiredMixin, ListView):
    template_name = 'main/index.html'
    model = Classroom
    context_object_name = 'classrooms'
    def get_queryset(self):
        user = self.request.user
        classrooms = Classroom.objects.filter(
            Q(students_assigned=user) |Q(teacher_assigned=user) 
        ).distinct()
        print("DEBUG: Retrieved Classrooms ->", classrooms)  # ✅ Debugging line
        if not classrooms.exists():
            print("❌ No classrooms found for this user!")
        return classrooms
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['join_classroom_form'] = ClassroomCodeForm()
        
        return context
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

    
class SubmittedActivityScoreDetailView(LoginRequiredMixin, DetailView):
    template_name = 'main/submitted_acitivity_detail.html'
    model = Submission
    context_object_name = 'submitted_activity'
    
    def form_valid(self, form):
        self.object = form.save()
        new_filename = self.object.submitted_file.name
        return super().form_valid(form)
    
    
    
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


class ActivityDetail( LoginRequiredMixin,DetailView):
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

# Join Classroomclass 
class JoinClassroomView(LoginRequiredMixin,FormView):
    template_name = 'main/index.html'
    form_class = ClassroomCodeForm
    
 
    def form_valid(self, form):
        logger.debug("🚀 DEBUG: form_valid() is being executed!")
        
        class_code = form.cleaned_data.get('class_code')  
        classroom = get_object_or_404(Classroom, class_code=class_code)  
        print(f"DEBUG: {classroom.class_name}")

        if self.request.user in classroom.students_assigned.all():
            messages.warning(self.request, "You are already in the classroom")
            print(f'DEBUG: {self.request.user} is already in the classroom')
            return redirect('home')

        # ✅ Add the user to the classroom correctly
        classroom.students_assigned.add(self.request.user)
        print(f"DEBUG: Adding {self.request.user} to {classroom.class_name}")

        # ✅ Refresh user session to reflect the update
        classroom.refresh_from_db()
        self.request.user.refresh_from_db()

        # ✅ Debugging: Check if user is in the classroom
        print(f"DEBUG: Updated Classroom Students -> {classroom.students_assigned.all()}")

        messages.success(self.request, f"Welcome, you have successfully joined {classroom.class_name}")
        return redirect('home')