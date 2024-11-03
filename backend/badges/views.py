from .models import Badge, UserBadge
from workouts.models import UserWorkouts
from django.db.models import Sum
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

def award_badges(user):
    today = timezone.now().date()
    newly_awarded_badges = []

    # Check if the user has already earned the badge
    def has_badge(badge_name):
        return UserBadge.objects.filter(user=user, badge__badge_name=badge_name).exists()

    # Get the badge by name
    def get_badge(badge_name):
        return Badge.objects.get(badge_name=badge_name)

    #These are awards when user completes a number of workouts
    total_workouts = UserWorkouts.objects.filter(user=user).count()

    if total_workouts >= 5 and not has_badge('Workout Beginner 1'):
        UserBadge.objects.create(user=user, badge=get_badge('Workout Beginner 1'))
        newly_awarded_badges.append('Workout Beginner 1')

    if total_workouts >= 10 and not has_badge('Workout Beginner 2'):
        UserBadge.objects.create(user=user, badge=get_badge('Workout Beginner 2'))
        newly_awarded_badges.append('Workout Beginner 2')

    if total_workouts >= 20 and not has_badge('Workout Beginner 3'):
        UserBadge.objects.create(user=user, badge=get_badge('Workout Beginner 3'))
        newly_awarded_badges.append('Workout Beginner 3')

    if total_workouts >= 50 and not has_badge('Workout Beginner 4'):
        UserBadge.objects.create(user=user, badge=get_badge('Workout Beginner 4'))
        newly_awarded_badges.append('Workout Beginner 4')

    if total_workouts >= 100 and not has_badge('Workout Beginner 5'):
        UserBadge.objects.create(user=user, badge=get_badge('Workout Beginner 5'))
        newly_awarded_badges.append('Workout Beginner 5')

    #These are the badges for seeing if he burned a specific amount ot calories
    total_calories = UserWorkouts.objects.filter(user=user).aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0

    if total_calories >= 500 and not has_badge('Calorie Burner 1'):
        UserBadge.objects.create(user=user, badge=get_badge('Calorie Burner 1'))
        newly_awarded_badges.append('Calorie Burner 1')

    if total_calories >= 1000 and not has_badge('Calorie Burner 2'):
        UserBadge.objects.create(user=user, badge=get_badge('Calorie Burner 2'))
        newly_awarded_badges.append('Calorie Burner 2')

    if total_calories >= 2000 and not has_badge('Calorie Burner 3'):
        UserBadge.objects.create(user=user, badge=get_badge('Calorie Burner 2'))
        newly_awarded_badges.append('Calorie Burner 3')

    if total_calories >= 5000 and not has_badge('Calorie Burner 4'):
        UserBadge.objects.create(user=user, badge=get_badge('Calorie Burner 4'))
        newly_awarded_badges.append('Calorie Burner 4')

    if total_calories >= 10000 and not has_badge('Calorie Burner 5'):
        UserBadge.objects.create(user=user, badge=get_badge('Calorie Burner 5'))
        newly_awarded_badges.append('Calorie Burner 5')

    return newly_awarded_badges

class UserBadgesView(APIView):
    def get(self, request):
        user_id=request.user.id
        all_badges = Badge.objects.all()
        earned_badges = UserBadge.objects.filter(user_id=user_id).values_list('badge_id', flat=True)
        
        badges_data = [
            {
                'id': badge.id,
                'name': badge.badge_name,
                'description': badge.badge_description,
                'icon': badge.badge_icon,
                'earned': badge.id in earned_badges  #true if badge is earned
            }
            for badge in all_badges
        ]

        return Response(badges_data, status=status.HTTP_200_OK)