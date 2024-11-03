from django.urls import path
from . import views

urlpatterns = [
    path('all-badges-and-user/',views.UserBadgesView.as_view(),name='user-badges-view')
]
