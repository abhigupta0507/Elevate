from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.CommunityPostListView.as_view(), name='all-posts'),
    path('posts/create/', views.CommunityPostCreateView.as_view(), name='create-post'),
    path('posts/<int:user_id>/', views.UserPostsView.as_view(), name='user-posts'),
    path('posts/<int:pk>/like/', views.LikePostView.as_view(), name='like-post'),
]
