# # serializers.py
# from rest_framework import serializers
# from .models import Workout, UserWorkoutPlan, UserWorkouts

# class WorkoutSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Workout
#         fields = '__all__'

# class UserWorkoutPlanSerializer(serializers.ModelSerializer):
#     workout_plan = WorkoutSerializer()

#     class Meta:
#         model = UserWorkoutPlan
#         fields = ['user', 'workout_plan', 'start_date']


# class UserWorkoutsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserWorkouts
#         fields = '__all__'
from rest_framework import serializers
from .models import Workout, UserWorkoutPlan, UserWorkouts

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'

class UserWorkoutPlanSerializer(serializers.ModelSerializer):
    workout_plan = WorkoutSerializer()
    class Meta:
        model = UserWorkoutPlan
        fields = ['user', 'workout_plan', 'start_date', 'is_active']

class UserWorkoutsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWorkouts
        fields = '__all__'
