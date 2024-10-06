from django.contrib import admin
from .models import CommunityPost

class CommunityPostAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'user', 'likes', 'created_at') 
    search_fields = ('title', 'content')

admin.site.register(CommunityPost, CommunityPostAdmin)
