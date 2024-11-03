from rest_framework import serializers
from .models import CommunityPost

class CommunityPostSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = CommunityPost
        fields = ['id', 'user_id','first_name', 'last_name', 'title', 'content', 'likes', 'created_at']