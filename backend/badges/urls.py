from django.urls import path
from . import views

urlpatterns = [
    path('user-badges/<int:user_id>/', views.get_user_badges, name='get_user_badges'),
]
