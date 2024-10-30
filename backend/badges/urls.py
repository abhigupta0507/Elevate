from django.urls import path
from . import views

urlpatterns = [
    path('user-badges/', views.get_user_badges, name='get_user_badges'),
    path('all-badges-and-user/',views.UserBadgesView.as_view(),name='user-badges-view')
]
