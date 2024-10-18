#views.py
from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import Workout, UserWorkoutPlan,WorkoutExercise, UserWorkouts, UserProgress,Exercise
from .serializers import WorkoutSerializer, UserWorkoutPlanSerializer,WorkoutExerciseSerializer, UserWorkoutSerializer, UserProgressSerializer,ExerciseSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

#List of workout plan to display if user isn't enrolled in one
class WorkoutListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        workout_plans = Workout.objects.all()
        serializer = WorkoutSerializer(workout_plans, many=True)
        return Response(serializer.data)

#To either get the userworkoutplan or giving user a workout plan
class UserWorkoutPlanView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        user_workout_plan = UserWorkoutPlan.objects.filter(user_id=user_id, is_active=True).first()
        if user_workout_plan:
            serializer = UserWorkoutPlanSerializer(user_workout_plan)
            return Response(serializer.data)
        else:
            return Response({"workout_plan": None})

    def post(self, request):
        user_id = request.data.get("user_id")
        workout_plan_id = request.data.get("workout_plan_id")

        workout_plan = get_object_or_404(Workout, pk=workout_plan_id)

        user_workout_plan, created = UserWorkoutPlan.objects.get_or_create(
            user_id=user_id, defaults={'workout_plan': workout_plan}
        )
        if not created:
            user_workout_plan.workout_plan = workout_plan
            user_workout_plan.is_active = True  # Set the new plan as active
            user_workout_plan.save()

        serializer = UserWorkoutPlanSerializer(user_workout_plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


#To exit the workout plan he currently is enrolled in
class ExitWorkoutPlanView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, user_id):
        try:
            user_workout_plan = UserWorkoutPlan.objects.get(user_id=user_id, is_active=True)
            user_workout_plan.is_active = False  # Mark the plan as inactive
            user_workout_plan.save()

            return Response({"message": "Successfully exited the workout plan."}, status=status.HTTP_200_OK)
        except UserWorkoutPlan.DoesNotExist:
            return Response({"error": "No active workout plan found."}, status=status.HTTP_400_BAD_REQUEST)


#TO display the list of exercises he has to do
class TodaysExercisesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Get the user_id from query parameters
        user_id = request.query_params.get('user_id')

        if user_id is None:
            return Response({"detail": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get the active user workout plan
        user_workout_plan = UserWorkoutPlan.objects.filter(user_id=user_id, is_active=True).first()

        if not user_workout_plan:
            return Response({"detail": "No active workout plan found for the user"}, status=status.HTTP_404_NOT_FOUND)

        # Get today's exercises based on the workout plan
        today = timezone.now().strftime('%A')  # Get current day of the week (e.g., 'Monday')
        workout_exercises = WorkoutExercise.objects.filter(workout=user_workout_plan.workout_plan, day_of_week=today)


        if not workout_exercises.exists():
            return Response({"detail": "No exercises for today","exercises":[]})

        # Get the exercise details
        exercises = workout_exercises.select_related('exercise').values('exercise', 'sets', 'reps', 'day_of_week')

        # Fetch the actual exercise objects and append the additional fields like sets and reps
        exercise_details = []
        for x in exercises:
            exercise = Exercise.objects.get(id=x['exercise'])
            exercise_data = {
                'id': exercise.id,
                'exercise_name': exercise.exercise_name,
                'muscle_group': exercise.muscle_group,
                'video_url': exercise.video_url,
                'description': exercise.description,
                'calories_burned': exercise.calories_burned,
                'sets': x['sets'],
                'reps': x['reps'],
            }
            exercise_details.append(exercise_data)

        # Serialize the exercise details
        return Response({"exercises": exercise_details})
