from django.urls import path
from .views import UserSignupView, CustomUserLoginView  # Make sure to import CustomUserLoginView

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='signup'),
    path('login/', CustomUserLoginView.as_view(), name='login'),  # Update this line to use CustomUserLoginView
]
