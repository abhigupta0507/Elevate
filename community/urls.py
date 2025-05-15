from django.urls import path
from .views import CommunityPostListView, CommunityPostCreateView, UserPostsView, LikePostView

urlpatterns = [
    path('posts/', CommunityPostListView.as_view(), name='community-posts'),        
    path('posts/create/', CommunityPostCreateView.as_view(), name='create-community-post'), 
    path('posts/user/', UserPostsView.as_view(), name='user-posts'),                  
    path('posts/<int:pk>/like/', LikePostView.as_view(), name='like-post'),            
]
