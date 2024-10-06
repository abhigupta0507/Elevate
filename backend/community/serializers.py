from rest_framework import serializers
from .models import CommunityPost

class CommunityPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityPost
        fields = ['id', 'user_id', 'title', 'content', 'likes', 'created_at']

