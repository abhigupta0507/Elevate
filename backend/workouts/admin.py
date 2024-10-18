# admin.py
from django.contrib import admin
from .models import Workout, UserWorkoutPlan, UserWorkouts

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('workout_name', 'workout_type', 'program_duration', 'days_per_week')
    search_fields = ('workout_name', 'workout_type')

@admin.register(UserWorkoutPlan)
class UserWorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'workout_plan', 'start_date')
    search_fields = ('user__email', 'workout_plan__workout_name')

@admin.register(UserWorkouts)
class UserWorkoutsAdmin(admin.ModelAdmin):
    list_display = ('user', 'workout_plan', 'date', 'exercises_done')
    search_fields = ('user__email', 'workout_plan__workout_name')
