# # In urls.py

# from django.urls import path
# from .views import DietPlanView, UserDietPlanView, ExitDietPlanView, TodaysMealsView

# urlpatterns = [
#     path('diet-plans/', DietPlanView.as_view(), name='diet-plan-list'),  # List all diet plans
#     path('user-diet-plan/', UserDietPlanView.as_view(), name='user-diet-plan'),
#     path('user-diet-plan/<int:user_id>/', UserDietPlanView.as_view(), name='user-diet-plan'),
#     path('exit-diet-plan/<int:user_id>/', ExitDietPlanView.as_view(), name='exit-diet-plan'),  # Exit the active diet plan
#     path('todays-meals/', TodaysMealsView.as_view(), name='todays-meals'),  # Display today's meals for the user's diet plan
# ]


from django.urls import path
from .views import DietPlanView, UserDietPlanView, ExitDietPlanView, TodaysMealsView

urlpatterns = [
    path('diet-plans/', DietPlanView.as_view(), name='diet-plan-list'),
    path('user-diet-plan/', UserDietPlanView.as_view(), name='user-diet-plan'),
    path('exit-diet-plan/', ExitDietPlanView.as_view(), name='exit-diet-plan'),
    path('todays-meals/', TodaysMealsView.as_view(), name='todays-meals'),
]
