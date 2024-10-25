from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Badge,UserBadge

# Register Workout model
@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('badge_name',)

# Register Exercise model
@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge',)

