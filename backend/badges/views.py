from .models import Badge, UserBadge
from workouts.models import UserWorkouts
from django.db.models import Sum, Count
from datetime import timedelta
from django.utils import timezone

def award_badges(user):
    today = timezone.now().date()

    # Check if the user has already earned the badge
    def has_badge(badge_name):
        return UserBadge.objects.filter(user=user, badge__badge_name=badge_name).exists()

    # Get the badge by name
    def get_badge(badge_name):
        return Badge.objects.get(badge_name=badge_name)

    # Check conditions and award badges if conditions are met
    # 1. Award for completing 5 workouts ('Workout Beginner')
    total_workouts = UserWorkouts.objects.filter(user=user).count()
    if total_workouts >= 5 and not has_badge('Workout Beginner'):
        UserBadge.objects.create(user=user, badge=get_badge('Workout Beginner'))

    # 2. Award for burning 500 calories ('Calorie Burner')
    total_calories = UserWorkouts.objects.filter(user=user).aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0
    if total_calories >= 500 and not has_badge('Calorie Burner'):
        UserBadge.objects.create(user=user, badge=get_badge('Calorie Burner'))

    # 3. Award for completing workouts for 7 consecutive days ('Consistent Performer')
    # streak = UserWorkouts.objects.filter(
    #     user=user,
    #     completed_date__range=[today - timedelta(days=6), today]
    # ).values('completed_date').distinct().count()

    # if streak == 7 and not has_badge('Consistent Performer'):
    #     UserBadge.objects.create(user=user, badge=get_badge('Consistent Performer'))

    # # 4. Award for 50 workouts ('Fitness Enthusiast')
    # if total_workouts >= 50 and not has_badge('Fitness Enthusiast'):
    #     UserBadge.objects.create(user=user, badge=get_badge('Fitness Enthusiast'))

    # # 5. Award for a workout longer than 60 minutes ('Marathon Runner')
    # workout_duration = UserWorkouts.objects.filter(user=user).order_by('-duration').first()
    # if workout_duration and workout_duration.duration >= 60 and not has_badge('Marathon Runner'):
    #     UserBadge.objects.create(user=user, badge=get_badge('Marathon Runner'))

    # # 6. Award for a 30-day streak ('Streak Master')
    # max_streak = UserWorkouts.objects.filter(user=user).count()  # You can implement streak logic similar to before
    # if max_streak >= 30 and not has_badge('Streak Master'):
    #     UserBadge.objects.create(user=user, badge=get_badge('Streak Master'))


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserBadge, Badge
from .serializers import UserBadgesSerializer

@api_view(['GET'])
def get_user_badges(request, user_id):
    user_badges = UserBadge.objects.filter(user_id=user_id).select_related('badge')
    badges_serialized = UserBadgesSerializer(user_badges, many=True)
    return Response(badges_serialized.data)


# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Badge, UserBadges
# from .serializers import BadgeSerializer

# class UserBadgesView(APIView):
#     def get(self, request, user_id):
#         # Get all badges
#         all_badges = Badge.objects.all()
#         # Get earned badges for the user
#         earned_badges = UserBadges.objects.filter(user_id=user_id).values_list('badge_id', flat=True)
        
#         # Distinguish between earned and unearned badges
#         badges_data = []
#         for badge in all_badges:
#             badge_data = {
#                 'id': badge.id,
#                 'name': badge.badge_name,
#                 'description': badge.badge_description,
#                 'icon': badge.badge_icon,
#                 'earned': badge.id in earned_badges  # Mark if earned or not
#             }
#             badges_data.append(badge_data)

#         return Response(badges_data, status=status.HTTP_200_OK)
