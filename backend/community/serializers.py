from rest_framework import serializers
from .models import CommunityPost

class CommunityPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityPost
        fields = ['id', 'user_id', 'title', 'content', 'likes', 'created_at']

# # serializers.py
# from rest_framework import serializers
# from .models import CommunityPost

# class CommunityPostSerializer(serializers.ModelSerializer):
#     is_liked_by_user = serializers.SerializerMethodField()

#     class Meta:
#         model = CommunityPost
#         fields = ['id', 'user_id', 'title', 'content', 'likes', 'is_liked_by_user', 'created_at']

#     def get_is_liked_by_user(self, obj):
#         user = self.context['request'].user
#         return user in obj.liked_by.all()
# class CommunityPostSerializer(serializers.ModelSerializer):
#     is_liked_by_user = serializers.SerializerMethodField()

#     class Meta:
#         model = CommunityPost
#         fields = ['id', 'user', 'title', 'content', 'likes', 'created_at', 'is_liked_by_user']

#     def get_is_liked_by_user(self, obj):
#         request = self.context.get('request')  # Get the request context
#         if request and request.user.is_authenticated:
#             # Check if the user has liked the post
#             return obj.likes.filter(id=request.user.id).exists()
#         return False  # Return False if the user is not authenticated
# class CommunityPostSerializer(serializers.ModelSerializer):
#     is_liked_by_user = serializers.SerializerMethodField()

#     class Meta:
#         model = CommunityPost
#         fields = ['id', 'user', 'title', 'content', 'likes', 'created_at', 'is_liked_by_user']

#     def create(self, validated_data):
#         user_id = validated_data.pop('user_id', None)  # Get user_id from validated_data
#         user = settings.AUTH_USER_MODEL.objects.get(id=user_id)  # Fetch the user object

#         # Create the post with the user as the author
#         return CommunityPost.objects.create(user=user, **validated_data)

#     def get_is_liked_by_user(self, obj):
#         request = self.context.get('request')
#         if request and request.user.is_authenticated:
#             return obj.liked_by.filter(id=request.user.id).exists()
#         return False
