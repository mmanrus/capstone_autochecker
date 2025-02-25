from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.views import LoginView

from autochecker.forms import CustomSignupForm

class SignupView(CreateView):
     form_class = CustomSignupForm
     template_name = "registration/register.html"
     success_url = reverse_lazy('login')

     def get_context_data(self, **kwargs):
          context = super().get_context_data(**kwargs)
          context['template'] = 'register'
          return context
     
class CustomLoginView(LoginView):
     form_class = AuthenticationForm
     template_name = 'registration/login.html'
     success_url = reverse_lazy('home')
     redirect_authenticated_user = True

     def get_context_data(self, **kwargs):
          context = super().get_context_data(**kwargs)
          context['template'] = 'login'
          return context