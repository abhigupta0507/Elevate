from django.db import models
from django.conf import settings

class DietPlanCategory(models.Model):
    category_name = models.CharField(max_length=255)

    def __str__(self):
        return self.category_name


class DietPlan(models.Model):
    category = models.ForeignKey(DietPlanCategory, on_delete=models.CASCADE)
    plan_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.plan_name


class MealType(models.Model):
    meal_type_name = models.CharField(max_length=255)

    def __str__(self):
        return self.meal_type_name
    
class DietPlanMeal(models.Model):
    diet_plan = models.ForeignKey(DietPlan, on_delete=models.CASCADE)
    meal_type = models.ForeignKey(MealType, on_delete=models.CASCADE)
    meal_name = models.CharField(max_length=255)
    calories = models.IntegerField()
    day_of_week = models.IntegerField(choices=[(i, day) for i, day in enumerate(
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    )], default=0)

    def __str__(self):
        return f"{self.meal_name} ({self.get_day_of_week_display()})"


class UserDietPlan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    diet_plan = models.ForeignKey(DietPlan, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user}'s {self.diet_plan.plan_name} plan"
