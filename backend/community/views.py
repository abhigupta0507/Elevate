from rest_framework import generics
from .models import CommunityPost
from .serializers import CommunityPostSerializer
from rest_framework.response import Response
from rest_framework import status
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


class UserPostsView(generics.ListAPIView):
    serializer_class = CommunityPostSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return CommunityPost.objects.filter(user_id=user_id).order_by('-created_at')

class LikePostView(generics.UpdateAPIView):
    queryset = CommunityPost.objects.all()
    serializer_class = CommunityPostSerializer

    def patch(self, request, *args, **kwargs):
        post = self.get_object()
        post.likes += 1
        post.save()
        return Response({'status': 'post liked'}, status=status.HTTP_200_OK)
