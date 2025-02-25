from .models import CustomUser, Activity, Submission
from django.contrib.auth.forms import UserCreationForm
from django.forms import ModelForm

class CustomSignupForm(UserCreationForm):
     class Meta:
          model = CustomUser
          fields = ['username','first_name', 'last_name','email', 'role', 'password1', 'password2']

class SubmitForm(ModelForm):
     class Meta:
          model = Submission
          fields = ['submitted_file']
          
class ActivityForm(ModelForm):
     class Meta:
          model = Activity
          
          fields = ['title', 'description', 'instructions', 'classroom']
          
class ActivityCreationForm(ModelForm):
     class Meta:
          model = Activity
          
          fields = '__all__'