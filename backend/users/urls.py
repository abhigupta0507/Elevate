from django.urls import path
from .views import (
    UserSignupInitiateView, VerifyOTPView, ResendOTPView,
    UserDetailView, CustomUserLoginView, delete_account, UpdateUserDetailsView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/initiate/', UserSignupInitiateView.as_view(), name='signup-initiate'),
    path('signup/verify/', VerifyOTPView.as_view(), name='verify-otp'),
    path('signup/resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('login/', CustomUserLoginView.as_view(), name='login'),
    path('details/', UserDetailView.as_view(), name='user-detail'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('update-details/', UpdateUserDetailsView.as_view(), name='update-user-details'),
    path('delete_account/', delete_account, name='delete_account'),
]

