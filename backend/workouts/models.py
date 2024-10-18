from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Workout(models.Model):
    workout_name = models.CharField(max_length=255)
    workout_type = models.CharField(max_length=100)
    program_duration = models.IntegerField()  # In minutes
    days_per_week = models.IntegerField()
    description = models.TextField()

    def __str__(self):
        return self.workout_name


class UserWorkoutPlan(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    workout_plan = models.ForeignKey(Workout, on_delete=models.CASCADE)
    start_date = models.DateField(auto_now_add=True)  # New field to track active status

    def __str__(self):
        return f"{self.user}'s plan: {self.workout_plan.workout_name}"



class UserWorkouts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workout_plan = models.ForeignKey(Workout, on_delete=models.CASCADE)
    date = models.DateField()
    exercises_done = models.TextField()  # Store exercises completed in a day

    def __str__(self):
        return f"{self.user} workouts on {self.date}"

