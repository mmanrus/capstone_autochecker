from django import forms
from django.contrib.auth.forms import AuthenticationForm
import socket
device_name = socket.gethostname()

class CustomLoginForm(AuthenticationForm):
     device_name = forms.CharField(required=True, widget=forms.TextInput(attrs={'class': 'form-control', "placeholder": f"Enter {device_name}",}))

     
     def clean(self):
          cleaned_data = super().clean()
          verification = cleaned_data.get('device_name')
          print(verification)
          print(device_name)
          if verification != device_name:
               raise forms.ValidationError("This device is not recognized.")
              
     def __init__(self, *args, **kwargs):
          super().__init__(*args, **kwargs)  # Call the parent constructor

          # Modify widget attributes correctly
          self.fields["username"].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Username",
               "autofocus": True
          })
          self.fields["password"].widget.attrs.update({
               "class": "form-control",
               "placeholder": "Password",
               "autocomplete": "current-password"
          })
          self.error_messages = {
          "invalid_login": "Invalid username or password.",
          }
          if self.errors:
               self.fields["password"].widget.attrs["class"] = self.fields["password"].widget.attrs.get("class", "") + " is-invalid"
               self.fields['device_name'].widget.attrs['class'] = self.fields['device_name'].widget.attrs.get("class", "") + " is-invalid"
               self.fields["username"].widget.attrs["class"] = self.fields["username"].widget.attrs.get("class", "") + " is-invalid"
