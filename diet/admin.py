from django.contrib import admin

# Register your models here.

from .models import DietPlanCategory, DietPlan, MealType, DietPlanMeal, UserDietPlan

@admin.register(DietPlanCategory)
class DietPlanCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'category_name')
    search_fields = ('category_name',)

@admin.register(DietPlan)
class DietPlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'plan_name', 'category', 'description')
    search_fields = ('plan_name', 'description')
    list_filter = ('category',)

@admin.register(MealType)
class MealTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'meal_type_name')
    search_fields = ('meal_type_name',)

@admin.register(DietPlanMeal)
class DietPlanMealAdmin(admin.ModelAdmin):
    list_display = ('id', 'diet_plan', 'meal_type', 'meal_name', 'calories')
    search_fields = ('meal_name', 'diet_plan__plan_name')
    list_filter = ('diet_plan', 'meal_type')

@admin.register(UserDietPlan)
class UserDietPlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'diet_plan')  # Add more fields if needed
    search_fields = ('user__email', 'diet_plan__plan_name')  # Searching by user's email and diet plan name
