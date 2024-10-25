from django.shortcuts import render

# Create your views here.
from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import DietPlanCategory, DietPlan, MealType, DietPlanMeal, UserDietPlan
from .serializers import DietPlanCategorySerializer, DietPlanSerializer,MealTypeSerializer, DietPlanMealSerializer, UserDietPlanSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

#List of diet plan to display if user isn't enrolled in one
class DietPlanView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        diet_plans = DietPlan.objects.all()
        serializer = DietPlanSerializer(diet_plans, many=True)
        return Response(serializer.data)

#To either get the userdietplan or giving user a diet plan
class UserDietPlanView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        user_diet_plan = UserDietPlan.objects.filter(user_id=user_id, is_active=True).first()
        if user_diet_plan:
            serializer = UserDietPlanSerializer(user_diet_plan)
            return Response(serializer.data)
        else:
            return Response({"Diet_plan": None})

    def post(self, request):
        user_id = request.data.get("user_id")
        diet_plan_id = request.data.get("diet_plan_id")

        diet_plan = get_object_or_404(DietPlan, pk=diet_plan_id)

        user_diet_plan, created = UserDietPlan.objects.get_or_create(
            user_id=user_id, defaults={'diet_plan': diet_plan}
        )
        if not created:
            user_diet_plan.workout_plan = diet_plan
            user_diet_plan.is_active = True  # Set the new plan as active
            user_diet_plan.save()

        serializer = UserDietPlanSerializer(user_diet_plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    
    
#To exit the diet plan he currently is enrolled in
class ExitDietPlanView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, user_id):
        try:
            user_diet_plan = UserDietPlan.objects.get(user_id=user_id, is_active=True)
            user_diet_plan.is_active = False  # Mark the plan as inactive
            user_diet_plan.save()

            return Response({"message": "Successfully exited the workout plan."}, status=status.HTTP_200_OK)
        except UserDietPlan.DoesNotExist:
            return Response({"error": "No active workout plan found."}, status=status.HTTP_400_BAD_REQUEST)
    

from datetime import datetime
# To display today's meals
class TodaysMealsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Get the user_id from query parameters
        user_id = request.query_params.get('user_id')

        if user_id is None:
            return Response({"detail": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get the active user diet plan
        user_diet_plan = UserDietPlan.objects.filter(user_id=user_id, is_active=True).first()

        if not user_diet_plan:
            return Response({"detail": "No active diet plan found for the user"}, status=status.HTTP_404_NOT_FOUND)

        # Get the current day of the week (0 = Monday, ..., 6 = Sunday)
        current_day_of_week = datetime.now().weekday()

        # Retrieve meals for the current day of the week in the user's diet plan
        meals = DietPlanMeal.objects.filter(
            diet_plan=user_diet_plan.diet_plan,
            day_of_week=current_day_of_week
        )

        if not meals.exists():
            return Response({"detail": "No meals found for today's diet plan."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize and return the meals for today
        serializer = DietPlanMealSerializer(meals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)