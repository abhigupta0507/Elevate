from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import DietPlan, DietPlanMeal, UserDietPlan
from .serializers import DietPlanSerializer, UserDietPlanSerializer, DietPlanMealSerializer
from datetime import datetime

class DietPlanView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        diet_plans = DietPlan.objects.all()
        serializer = DietPlanSerializer(diet_plans, many=True)
        return Response(serializer.data)



class UserDietPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_diet_plan = UserDietPlan.objects.filter(user=request.user, is_active=True).first()
        if user_diet_plan:
            serializer = UserDietPlanSerializer(user_diet_plan)
            return Response(serializer.data)
        else:
            return Response({"Diet_plan": None})

    def post(self, request):
        diet_plan_id = request.data.get("diet_plan_id")
        diet_plan = get_object_or_404(DietPlan, pk=diet_plan_id)
        
        user_diet_plan, created = UserDietPlan.objects.get_or_create(
            user=request.user, defaults={'diet_plan': diet_plan}
        )
        if not created:
            user_diet_plan.diet_plan = diet_plan
            user_diet_plan.is_active = True
            user_diet_plan.save()
        
        serializer = UserDietPlanSerializer(user_diet_plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class ExitDietPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_diet_plan = UserDietPlan.objects.get(user=request.user, is_active=True)
            user_diet_plan.is_active = False
            user_diet_plan.save()
            return Response({"message": "Successfully exited the diet plan."}, status=status.HTTP_200_OK)
        except UserDietPlan.DoesNotExist:
            return Response({"error": "No active diet plan found."}, status=status.HTTP_400_BAD_REQUEST)



class TodaysMealsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_diet_plan = UserDietPlan.objects.filter(user=request.user, is_active=True).first()
        
        if not user_diet_plan:
            return Response({"detail": "No active diet plan found for the user"}, status=status.HTTP_404_NOT_FOUND)

        current_day_of_week = datetime.now().weekday()
        meals = DietPlanMeal.objects.filter(diet_plan=user_diet_plan.diet_plan, day_of_week=current_day_of_week)
        
        if not meals.exists():
            return Response({"detail": "No meals found for today's diet plan."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DietPlanMealSerializer(meals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
