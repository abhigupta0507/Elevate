# # views.py
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework.permissions import AllowAny
# from .models import Workout, UserWorkoutPlan
# from .serializers import WorkoutSerializer, UserWorkoutPlanSerializer
# from django.shortcuts import get_object_or_404

# from django.contrib.auth import get_user_model

# class WorkoutListView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         # List all available workout plans
#         workout_plans = Workout.objects.all()
#         serializer = WorkoutSerializer(workout_plans, many=True)
#         return Response(serializer.data)
    
# class UserWorkoutPlanView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request, user_id):
#         # Fetch the current workout plan for the user
#         user_workout_plan = UserWorkoutPlan.objects.filter(user_id=user_id).first()
#         if user_workout_plan:
#             serializer = UserWorkoutPlanSerializer(user_workout_plan)
#             return Response(serializer.data)
#         else:
#             return Response({"workout_plan": None})

#     def post(self, request):
#         # Assign a new workout plan to the user
#         user_id = request.data.get("user_id")
#         workout_plan_id = request.data.get("workout_plan_id")

#         if not user_id or not workout_plan_id:
#             return Response({"error": "user_id and workout_plan_id are required."},
#                             status=status.HTTP_400_BAD_REQUEST)

#         workout_plan = get_object_or_404(Workout, pk=workout_plan_id)

#         user_workout_plan, created = UserWorkoutPlan.objects.get_or_create(
#             user_id=user_id, defaults={'workout_plan': workout_plan}
#         )
#         if not created:
#             user_workout_plan.workout_plan = workout_plan
#             user_workout_plan.save()

#         serializer = UserWorkoutPlanSerializer(user_workout_plan)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)


# # class ExitWorkoutPlanView(APIView):
# #     def post(self, request, *args, **kwargs):
# #         user = request.user
# #         try:
# #             # Get the active workout plan for the user
# #             user_workout_plan = UserWorkoutPlan.objects.get(user=user)
            
# #             # Delete the user workout plan to "exit" the plan
# #             user_workout_plan.delete()

# #             return Response({"message": "Workout plan exited successfully."}, status=status.HTTP_200_OK)
# #         except UserWorkoutPlan.DoesNotExist:
# #             return Response({"error": "No active workout plan found."}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import Workout, UserWorkoutPlan
from .serializers import WorkoutSerializer, UserWorkoutPlanSerializer
from django.shortcuts import get_object_or_404

from django.contrib.auth import get_user_model

class WorkoutListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        workout_plans = Workout.objects.all()
        serializer = WorkoutSerializer(workout_plans, many=True)
        return Response(serializer.data)

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
