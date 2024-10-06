from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'gender', 'age', 'height', 'weight', 'join_date')
    ordering = ('email',) 
    search_fields = ('email',)

admin.site.register(CustomUser, CustomUserAdmin)
