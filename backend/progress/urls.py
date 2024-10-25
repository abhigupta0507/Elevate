from django.urls import path
from .views import CaloriesBurnedLast7Days

urlpatterns = [
    path('calories_burned_last_7_days/', CaloriesBurnedLast7Days.as_view(), name='calories_burned_last_7_days'),
]
