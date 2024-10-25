from django.db.models import Sum,F,DateField
from django.db.models.functions import TruncDate,Cast
from django.utils import timezone
from datetime import timedelta
from workouts.models import UserWorkouts
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class CaloriesBurnedLast7Days(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        today = timezone.now().date()
        start_date = today - timedelta(days=6)  # Get data from the last 7 days

        if not user_id:
            return Response({"error": "user_id is required"}, status=400)

        try:
            completed_workouts = UserWorkouts.objects.filter(
                user_id=user_id,
                completed_date__range=[start_date, today]
            ).annotate(
                day=Cast('completed_date', DateField())
            ).values('day').annotate(
                total_calories=Sum('calories_burned')
            ).order_by('day')

            # Prepare the data
            data = []
            for i in range(7):
                day = start_date + timedelta(days=i)
                calories = next(
                    (item['total_calories'] for item in completed_workouts if item['day'] == day),
                    0
                )
                data.append({
                    "day": day.strftime("%a"),
                    "calories": calories
                })

            return Response({"calories_data": data})

        except Exception as e:
            print(f"An error occurred: {e}")  # Debugging output
            return Response({"error": str(e)}, status=500)


