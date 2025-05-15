from django.contrib import admin
from .models import Workout, Exercise, WorkoutExercise, UserWorkoutPlan, UserWorkouts, UserProgress

# Register Workout model
@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('workout_name', 'workout_type', 'program_duration', 'days_per_week')
    search_fields = ('workout_name', 'workout_type')
    list_filter = ('workout_type', 'days_per_week')

# Register Exercise model
@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('exercise_name', 'muscle_group', 'calories_burned')
    search_fields = ('exercise_name', 'muscle_group')
    list_filter = ('muscle_group',)

# Register WorkoutExercise model
@admin.register(WorkoutExercise)
class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ('workout', 'exercise', 'day_of_week', 'sets', 'reps', 'duration')
    search_fields = ('workout__workout_name', 'exercise__exercise_name', 'day_of_week')
    list_filter = ('day_of_week', 'workout')

# Register UserWorkoutPlan model
@admin.register(UserWorkoutPlan)
class UserWorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'workout_plan', 'start_date', 'is_active')
    search_fields = ('user__email', 'workout_plan__workout_name')
    list_filter = ('is_active', 'start_date')

# Register UserWorkouts model
@admin.register(UserWorkouts)
class UserWorkoutsAdmin(admin.ModelAdmin):
    list_display = ('user', 'workout_exercise', 'completed_date', 'calories_burned')
    search_fields = ('user__email', 'workout_exercise__exercise__exercise_name', 'workout_exercise__workout__workout_name')
    list_filter = ('completed_date',)

# Register UserProgress model
@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'progress_date', 'total_calories_burned')
    search_fields = ('user__email',)
    list_filter = ('progress_date',)



