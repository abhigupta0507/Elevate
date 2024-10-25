from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Badge(models.Model):
    badge_name = models.CharField(max_length=100)
    badge_description = models.TextField()
    condition_to_earn = models.CharField(max_length=255)
    badge_icon = models.CharField(max_length=255)

    def __str__(self):
        return self.badge_name


class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user}'s badge: {self.badge}"
