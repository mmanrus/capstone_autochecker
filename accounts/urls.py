from django.urls import path
from django.contrib.auth.views import LogoutView
from .views import SignupView


urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('logout/', LogoutView.as_view(), name='logout'),
    #path('login/', LoginView.as_view(), name='login')
]
