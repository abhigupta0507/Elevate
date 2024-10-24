from rest_framework import serializers
from .models import UserBadge, Badge

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['badge_name', 'badge_description', 'badge_icon']

class UserBadgesSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer()

    class Meta:
        model = UserBadge
        fields = ['badge', 'earned_date']
