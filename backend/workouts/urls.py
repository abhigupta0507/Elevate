#urls.py
from django.urls import path
from .views import UserWorkoutPlanView, WorkoutListView, ExitWorkoutPlanView,TodaysExercisesView

urlpatterns = [
    path('user-workout-plan/', UserWorkoutPlanView.as_view(), name='select_workout_plan'),
    path('user-workout-plan/<int:user_id>/', UserWorkoutPlanView.as_view(), name='user_workout_plan'),
    path('exit-workout-plan/<int:user_id>/', ExitWorkoutPlanView.as_view(), name='exit_workout_plan'),
    path('workout-plans/', WorkoutListView.as_view(), name='workout_plans'),
    path('exercises/today/', TodaysExercisesView.as_view(), name='todays_exercises'),
]
