from django.contrib.auth.forms import AuthenticationForm
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.views import LoginView
from .forms import CustomLoginForm
from autochecker.forms import CustomSignupForm
from autochecker.serializers.user_serializer import UserSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from autochecker.models import CustomUser

#!SECTION React and Django
class CreateUserView(generics.CreateAPIView):
     queryset = CustomUser.objects.all()
     serializer_class = UserSerializer # Accept data  to make another user [username, password, role]
     permission_classes = [AllowAny] # Allow anyone to create user
class SignupView(CreateView):
     form_class = CustomSignupForm
     template_name = "registration/register.html"
     success_url = reverse_lazy('login')

     def get_context_data(self, **kwargs):
          context = super().get_context_data(**kwargs)
          context['template'] = 'register'
          return context
     
class CustomLoginView(LoginView):
     form_class = CustomLoginForm
     template_name = 'registration/login.html'
     success_url = reverse_lazy('home')
     redirect_authenticated_user = True

     def get_context_data(self, **kwargs):
          context = super().get_context_data(**kwargs)
          context['template'] = 'login'
          return context