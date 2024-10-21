# # serializers.py
# from rest_framework import serializers
# from .models import Workout,Exercise, UserWorkoutPlan,WorkoutExercise, UserWorkouts, UserProgress

# class WorkoutSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Workout
#         fields = '__all__'

# class ExerciseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Exercise
#         fields = ['id', 'exercise_name', 'muscle_group', 'video_url', 'description', 'calories_burned']

# class UserWorkoutPlanSerializer(serializers.ModelSerializer):
#     workout_plan = WorkoutSerializer()
#     class Meta:
#         model = UserWorkoutPlan
#         fields = ['user', 'workout_plan', 'start_date', 'is_active']

# class WorkoutExerciseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = WorkoutExercise
#         fields = ['id', 'exercise', 'sets', 'reps', 'day_of_week']

# class UserWorkoutSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserWorkouts
#         fields = ['user', 'workout_exercise', 'calories_burned']

# class UserProgressSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserProgress
#         fields = ['user', 'progress_date', 'total_calories_burned']
# serializers.py
from rest_framework import serializers
from .models import Workout,Exercise, UserWorkoutPlan,WorkoutExercise, UserWorkouts, UserProgress

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'exercise_name', 'muscle_group', 'video_url', 'description', 'calories_burned']

class UserWorkoutPlanSerializer(serializers.ModelSerializer):
    workout_plan = WorkoutSerializer()
    class Meta:
        model = UserWorkoutPlan
        fields = ['user', 'workout_plan', 'start_date', 'is_active']

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = ['id', 'exercise', 'sets', 'reps', 'day_of_week']

class UserWorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWorkouts
        fields = ['user', 'workout_exercise', 'calories_burned']

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['user', 'progress_date', 'total_calories_burned']
