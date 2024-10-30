# from django.urls import path
# from . import views

# urlpatterns = [
#     path('posts/', views.CommunityPostListView.as_view(), name='all-posts'),
#     path('posts/create/', views.CommunityPostCreateView.as_view(), name='create-post'),
#     path('posts/<int:user_id>/', views.UserPostsView.as_view(), name='user-posts'),
#     path('posts/<int:pk>/like/', views.LikePostView.as_view(), name='like-post'),
# ]
from django.urls import path
from .views import CommunityPostListView, CommunityPostCreateView, UserPostsView, LikePostView

urlpatterns = [
    path('posts/', CommunityPostListView.as_view(), name='community-posts'),           # List all posts
    path('posts/create/', CommunityPostCreateView.as_view(), name='create-community-post'),  # Create a new post
    path('posts/user/', UserPostsView.as_view(), name='user-posts'),                   # List posts by the authenticated user
    path('posts/<int:pk>/like/', LikePostView.as_view(), name='like-post'),            # Like or unlike a specific post
]
