from django.urls import path, include
from django.contrib.auth.views import LogoutView
from .views import SignupView, CustomLoginView, CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('signup/', CreateUserView.as_view(), name='signup'),
    path('token/', TokenObtainPairView.as_view(), name="get_token"),
    path('token/refrest', TokenRefreshView.as_view(), name="refrest_token"),
    path('api/auth/', include('rest_framework.urls')),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('login/', CustomLoginView.as_view(), name='login')
]
