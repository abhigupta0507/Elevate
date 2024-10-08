from rest_framework import generics,status
from .models import CommunityPost
from .serializers import CommunityPostSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class CommunityPostListView(generics.ListAPIView):
    queryset = CommunityPost.objects.all().order_by('-created_at')  # List all posts, newest first
    serializer_class = CommunityPostSerializer

class CommunityPostCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = CommunityPost.objects.all()
    serializer_class = CommunityPostSerializer

    def perform_create(self, serializer):
        # Extract user_id from the request data
        user_id = self.request.data.get('user_id')
        # Save the post with the provided user_id
        serializer.save(user_id=user_id)

# class CommunityPostCreateView(generics.CreateAPIView):
#     permission_classes = [AllowAny]
#     queryset = CommunityPost.objects.all()
#     serializer_class = CommunityPostSerializer

#     def perform_create(self, serializer):
#         user_id = self.request.data.get('user_id')

#         # Handle if user_id is not provided
#         if not user_id:
#             raise serializers.ValidationError("User ID is required.")

#         # Save the post with the user retrieved from user_id
#         serializer.save(user_id=user_id)

class UserPostsView(generics.ListAPIView):
    serializer_class = CommunityPostSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return CommunityPost.objects.filter(user_id=user_id).order_by('-created_at')

class LikePostView(generics.UpdateAPIView):
    permission_classes = [AllowAny]
    queryset = CommunityPost.objects.all()
    serializer_class = CommunityPostSerializer

    def patch(self, request, *args, **kwargs):
        post = self.get_object()
        user_id = request.data.get('user_id')

        if user_id is None:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user has already liked the post
        if post.liked_by.filter(id=user_id).exists():
            # Unlike the post
            post.liked_by.remove(user_id)
            post.likes -= 1
            post.save()
            return Response({'message': 'Post unliked successfully!', 'likes': post.likes, 'is_liked_by_user':False})

        # Like the post
        post.liked_by.add(user_id)
        post.likes += 1
        post.save()
        return Response({'message': 'Post liked successfully!', 'likes': post.likes ,'is_liked_by_user':True})
