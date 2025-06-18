from venv import logger
from django.views.generic import FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from autochecker.forms import ClassroomCodeForm
from autochecker.models.classroom_model import Classroom
from django.contrib import messages
from django.shortcuts import get_object_or_404,redirect

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