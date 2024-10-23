from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from datetime import timedelta
from workouts.models import UserWorkouts
from django.db.models import Sum

class CaloriesBurnedLast7Days(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        today = timezone.now().date()
        start_date = today - timedelta(days=6)  # Get data from the last 7 days

        # Query for workouts completed by the user in the last 7 days
        completed_workouts = UserWorkouts.objects.filter(
            user_id=user_id,
            completed_date__range=[start_date, today]
        ).values('completed_date').annotate(total_calories=Sum('calories_burned'))

        # Prepare the data in a dict with days as keys and calories as values
        data = []
        for i in range(7):
            day = start_date + timedelta(days=i)
            calories = next(
                (item['total_calories'] for item in completed_workouts if item['completed_date'] == day),
                0
            )
            data.append({
                "day": day.strftime("%a"),  # Short day name like Mon, Tue, etc.
                "calories": calories
            })

        return Response({"calories_data": data})
