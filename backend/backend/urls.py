from django.contrib import admin
from django.urls import path, include  # Include 'include' for app URLs

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')), 
    path('api/community/', include('community.urls')),
    path('api/workouts/', include('workouts.urls')),
]
