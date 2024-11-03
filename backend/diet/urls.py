from django.urls import path
from .views import DietPlanView, UserDietPlanView, ExitDietPlanView, TodaysMealsView

urlpatterns = [
    path('diet-plans/', DietPlanView.as_view(), name='diet-plan-list'),
    path('user-diet-plan/', UserDietPlanView.as_view(), name='user-diet-plan'),
    path('exit-diet-plan/', ExitDietPlanView.as_view(), name='exit-diet-plan'),
    path('todays-meals/', TodaysMealsView.as_view(), name='todays-meals'),
]
