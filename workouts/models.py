# models.py
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

class Exercise(models.Model):
    exercise_name = models.CharField(max_length=255)
    muscle_group = models.CharField(max_length=100)
    video_url = models.CharField(max_length=255)
    description = models.TextField()
    calories_burned = models.IntegerField()

    def __str__(self):
        return self.exercise_name

class WorkoutExercise(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length=10)  # e.g. "Monday"
    sets = models.IntegerField(default=3)
    reps = models.IntegerField()
    duration = models.IntegerField(null=True, blank=True)  # For isometric exercises like Plank

    def __str__(self):
        return f"{self.exercise.exercise_name} for {self.workout.workout_name} on {self.day_of_week}"

class UserWorkoutPlan(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    workout_plan = models.ForeignKey(Workout, on_delete=models.CASCADE)
    start_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user}'s plan: {self.workout_plan.workout_name}"

class UserWorkouts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workout_exercise = models.ForeignKey(WorkoutExercise, on_delete=models.CASCADE)
    completed_date = models.DateField(auto_now_add=True)
    calories_burned = models.DecimalField(max_digits=6, decimal_places=2)  # Increased precision

    def __str__(self):
        return f"{self.user}'s workout on {self.completed_date}"

    # This method will help get workouts done in the last 7 days
    @classmethod
    def get_last_7_days_calories(cls, user):
        last_7_days = timezone.now().date() - timedelta(days=7)
        workouts = cls.objects.filter(user=user, completed_date__gte=last_7_days)
        return workouts.aggregate(total_calories=models.Sum('calories_burned'))['total_calories'] or 0.00

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    progress_date = models.DateField(auto_now_add=True)
    total_calories_burned = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.user}'s progress on {self.progress_date}"
