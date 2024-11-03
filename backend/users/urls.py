from django.urls import path
from .views import UserSignupView,UserDetailView, CustomUserLoginView, delete_account,UpdateUserDetailsView  # Make sure to import CustomUserLoginView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='signup'),
    path('login/', CustomUserLoginView.as_view(), name='login'),
    path('details/', UserDetailView.as_view(), name='user-detail'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('update-details/', UpdateUserDetailsView.as_view(), name='update-user-details'),
    path('delete_account/',delete_account, name='delete_account'),
]

