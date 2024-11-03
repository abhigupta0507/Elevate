from rest_framework import serializers
from .models import DietPlanCategory, DietPlan, MealType, DietPlanMeal, UserDietPlan

class DietPlanCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DietPlanCategory
        fields = ['id', 'category_name']


class DietPlanSerializer(serializers.ModelSerializer):
    category = DietPlanCategorySerializer(read_only=True)  # To show category details in the response

    class Meta:
        model = DietPlan
        fields = ['id', 'plan_name', 'category', 'description']


class MealTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealType
        fields = ['id', 'meal_type_name']


class DietPlanMealSerializer(serializers.ModelSerializer):
    diet_plan = DietPlanSerializer(read_only=True)  # To show diet plan details in the response
    meal_type = MealTypeSerializer(read_only=True)  # To show meal type details in the response

    class Meta:
        model = DietPlanMeal
        fields = ['diet_plan', 'meal_type', 'meal_name', 'calories'] 


class UserDietPlanSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Assuming user has a __str__ defined, shows user's email or username
    diet_plan = DietPlanSerializer(read_only=True)  # To show diet plan details

    class Meta:
        model = UserDietPlan
        fields = ['id', 'user', 'diet_plan', 'is_active']
