#urls.py
from django.urls import path
from .views import UserWorkoutPlanView, WorkoutListView, ExitWorkoutPlanView,TodaysExercisesView,MarkExerciseDoneView
from .views import UserCompletedExercisesView

urlpatterns = [
    path('user-workout-plan/', UserWorkoutPlanView.as_view(), name='select_workout_plan'),
    path('exit-workout-plan/', ExitWorkoutPlanView.as_view(), name='exit_workout_plan'),
    path('workout-plans/', WorkoutListView.as_view(), name='workout_plans'),
    path('exercises/today/', TodaysExercisesView.as_view(), name='todays_exercises'),
    path('mark_done/', MarkExerciseDoneView.as_view(), name='mark-exercise-done'),
    path('completed_exercises/', UserCompletedExercisesView.as_view(), name='completed_exercises'),
]
