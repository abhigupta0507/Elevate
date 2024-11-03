from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import Workout, UserWorkoutPlan,WorkoutExercise, UserWorkouts, UserProgress,Exercise
from .serializers import WorkoutSerializer, UserWorkoutPlanSerializer,WorkoutExerciseSerializer, UserWorkoutSerializer, UserProgressSerializer,ExerciseSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils import timezone
from badges.views import award_badges
from datetime import date
from .models import UserWorkouts, WorkoutExercise, User
from .serializers import UserWorkoutSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date
from .models import User, WorkoutExercise, UserWorkouts
from badges.models import UserBadge
from .serializers import UserWorkoutSerializer
import pytz

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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id=request.user.id
        user_workout_plan = UserWorkoutPlan.objects.filter(user_id=user_id, is_active=True).first()
        if user_workout_plan:
            serializer = UserWorkoutPlanSerializer(user_workout_plan)
            return Response(serializer.data)
        else:
            return Response({"workout_plan": None})

    def post(self, request):
        user_id = request.user.id
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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_id=request.user.id
            user_workout_plan = UserWorkoutPlan.objects.get(user_id=user_id, is_active=True)
            user_workout_plan.is_active = False  # Mark the plan as inactive
            user_workout_plan.save()

            return Response({"message": "Successfully exited the workout plan."}, status=status.HTTP_200_OK)
        except UserWorkoutPlan.DoesNotExist:
            return Response({"error": "No active workout plan found."}, status=status.HTTP_400_BAD_REQUEST)


#To display the list of exercises he has to do
class TodaysExercisesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id

        if user_id is None:
            return Response({"detail": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_workout_plan = UserWorkoutPlan.objects.filter(user_id=user_id, is_active=True).first()

        if not user_workout_plan:
            return Response({"detail": "No active workout plan found for the user"}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().strftime('%A')  # Get day 'Monday'
        workout_exercises = WorkoutExercise.objects.filter(workout=user_workout_plan.workout_plan, day_of_week=today)


        if not workout_exercises.exists():
            return Response({"detail": "No exercises for today","exercises":[]})

        exercises = workout_exercises.select_related('exercise').values('exercise', 'sets', 'reps', 'day_of_week')

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

        return Response({"exercises": exercise_details})

class MarkExerciseDoneView(APIView):
    def post(self, request):
        user_id = request.user.id
        workout_exercise_id = request.data.get("workout_exercise_id")

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            workout_exercise = WorkoutExercise.objects.get(id=workout_exercise_id)
        except WorkoutExercise.DoesNotExist:
            return Response({"error": "Workout exercise not found"}, status=status.HTTP_404_NOT_FOUND)

        today = date.today()
        if UserWorkouts.objects.filter(user=user, workout_exercise=workout_exercise, completed_date=today).exists():
            return Response({"message": "Exercise already marked as done for today"}, status=status.HTTP_200_OK)

        calories_burned = workout_exercise.exercise.calories_burned
        user_workout = UserWorkouts.objects.create(
            user=user,
            workout_exercise=workout_exercise,
            calories_burned=calories_burned
        )

        serializer = UserWorkoutSerializer(user_workout)
        newly_awarded_badges = award_badges(user)
        
        return Response({
            "success": True,
            "data": serializer.data,
            "calories_burned": calories_burned,
            "newly_awarded_badges": newly_awarded_badges
        }, status=status.HTTP_201_CREATED)
        #return Response({"success": True, "data": serializer.data, "calories_burned": calories_burned}, status=status.HTTP_201_CREATED)

class UserCompletedExercisesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        india_tz = pytz.timezone('Asia/Kolkata')
        today = timezone.now().astimezone(india_tz).date()
       # today = timezone.now().date()
        print(timezone.now())

        completed_exercises = UserWorkouts.objects.filter(user_id=user_id, completed_date=today).values('workout_exercise', 'calories_burned')
        completed_exercise_ids = [exercise['workout_exercise'] for exercise in completed_exercises]
        total_calories_burned = sum(exercise['calories_burned'] for exercise in completed_exercises)

        return Response({
            #"date":timezone.now(),
            "completed_exercises": completed_exercise_ids,
            "total_calories_burned": total_calories_burned
        })