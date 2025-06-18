from autochecker.models.custom_user_model import CustomUser
from autochecker.models.activity_model import Activity
from autochecker.models.submission_model import Submission
from autochecker.models.classroom_model import Classroom
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.forms import ModelForm
from django import forms
from django.core import validators


from .validators import validate_custom_slug
class CustomSignupForm(UserCreationForm):
     class Meta:
          model = CustomUser
          fields = ['username','first_name', 'last_name','email', 'role', 'password1', 'password2']
          help_texts = {
               'username': 'Enter a unique username.'
          }
     def __init__(self, *args, **kwargs):
          super().__init__(*args, **kwargs)
          # Add classes to all fields
          self.fields['username'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Username",
               "autofocus": True
          })
          self.fields['first_name'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "First name",
          })
          self.fields['last_name'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Last name"
          })
          self.fields['email'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Email"
          })
          self.fields['password1'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Enter password"
          })
          self.fields['password2'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Confirm password"
          })
          self.fields['role'].widget.attrs.update({
               "class": "form-select",
          })
          self.full_clean()
          if self.errors.get('username'):
               self.fields["username"].widget.attrs["class"] = self.fields["username"].widget.attrs.get("class", "") + " is-invalid"
          if self.errors.get("password2"):
               self.fields["password1"].widget.attrs["class"] = self.fields["password1"].widget.attrs.get("class", "") + " is-invalid"
               self.fields["password2"].widget.attrs["class"] = self.fields["password2"].widget.attrs.get("class", "") + " is-invalid"
          if self.errors.get('role'):
               self.fields["role"].widget.attrs["class"] = self.fields["role"].widget.attrs.get("class", "") + " is-invalid"

          if self.errors.get('email'):
               self.fields["email"].widget.attrs["class"] = self.fields["email"].widget.attrs.get("class", "") + " is-invalid"
class SubmitForm(ModelForm):
     class Meta:
          model = Submission
          fields = ['submitted_file']
     def clean(self):
          cleaned_data = super().clean()
class CreateClassroomForm(ModelForm):
     class_code = forms.CharField(required=False)  # This makes it optional
     class Meta:
          model = Classroom
          exclude = ['teacher_assigned', 'created_at', 'students_assigned']
          
          fields = '__all__'
     
     def clean(self):
          cleaned_data = super().clean()
          class_code = cleaned_data.get('class_code')
          class_name = cleaned_data.get('class_name')
          schedule = cleaned_data.get('schedule')
          if not class_name:
               self.add_error('class_name', 'Empty class name')
          if len(schedule) > 20 or len(schedule) < 1:
               self.add_error('schedule', 'Invalid schedule placement')
          if class_code and len(class_code) != 10:
               self.add_error("class_code", "Class code must be exactly 10 characters long.")
          return cleaned_data
     def __init__(self, *args, **kwargs):
          super().__init__(*args, **kwargs)
          # Add classes to all fields
          self.fields['class_name'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "class_name",
               "autofocus": True
          })
          self.fields['class_code'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Leave empty to auto Generate class code",
               "required": False
          })
          self.fields['schedule'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Schedule",
          })
          
class ActivityCreationForm(ModelForm):
     check50_slug = forms.CharField(validators=[validate_custom_slug])
     instructions = forms.FileField(required=False)
     time_open = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
     time_limit = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
     class Meta:
          model = Activity
          exclude = ['teacher_assigned', 'created_at', 'is_submitted', 'isClosed', 'classroom']
          fields = '__all__'
          
     def clean(self):
          cleaned_data = super().clean()
          title = cleaned_data.get('title')
          description = cleaned_data.get('description')
          check50_slug = cleaned_data.get('check50_slug')
          time_open = cleaned_data.get('time_open')
          time_limit = cleaned_data.get('time_limit')
          if time_limit and time_open and time_open >= time_limit:
               self.add_error('time_limit', 'Closing time must be after openning time.')
          return cleaned_data
     def __init__(self, *args, **kwargs):
          super().__init__(*args, **kwargs)
          # Add classes to all fields
          self.fields['title'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Title",
               "autofocus": True
          })
          self.fields['description'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Description",
               "required": False
          })
          self.fields['check50_slug'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Schedule",
          })
          self.fields['time_open'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Description",
               "required": False
          })
          self.fields['time_limit'].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Description",
               "required": False
          })
  
   
class ClassroomCodeForm(forms.Form): # Instead, it should be a forms.Form, since students are just entering a code, not modifying the Classroom model.
     class_code = forms.CharField(max_length=10, required=True)
     
     def clean(self):
          cleaned_data = super().clean()
          class_code = cleaned_data.get('class_code')
          
          if class_code and len(class_code) != 10:
               self.add_error("class_code", "Class code must be exactly 10 characters long.")
               
          return cleaned_data
     def __init__(self, *args, **kwargs):
          super().__init__(*args, **kwargs)
          # Add classes to all fields
          self.fields['class_code'].widget.attrs.update({
                    "class": "form-control",
                    'id':'subject-code',
                    "placeholder": "e.g., ITCP11",
                    "autofocus": True
          })
