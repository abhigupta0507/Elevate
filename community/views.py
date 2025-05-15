
from rest_framework import generics, status
from .models import CommunityPost
from .serializers import CommunityPostSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class CommunityPostListView(generics.ListAPIView):
    queryset = CommunityPost.objects.all().order_by('-created_at')
    serializer_class = CommunityPostSerializer

class CommunityPostCreateView(generics.CreateAPIView):
    serializer_class = CommunityPostSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 

class UserPostsView(generics.ListAPIView):
    serializer_class = CommunityPostSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return CommunityPost.objects.filter(user=self.request.user).order_by('-created_at')

class LikePostView(generics.UpdateAPIView):
    queryset = CommunityPost.objects.all()
    serializer_class = CommunityPostSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def patch(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user

        if post.liked_by.filter(id=user.id).exists():
            # Unlike
            post.liked_by.remove(user)
            post.likes -= 1
            post.save()
            return Response({'message': 'Post unliked successfully!', 'likes': post.likes, 'is_liked_by_user': False})

        # Like
        post.liked_by.add(user)
        post.likes += 1
        post.save()
        return Response({'message': 'Post liked successfully!', 'likes': post.likes, 'is_liked_by_user': True})
