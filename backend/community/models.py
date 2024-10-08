# from django.db import models
# from django.conf import settings

# class CommunityPost(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     title = models.CharField(max_length=255)
#     content = models.TextField()
#     likes = models.IntegerField(default=0) # Ensure this field exists
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title

# models.py
from django.db import models
from django.conf import settings

class CommunityPost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    likes = models.IntegerField(default=0)
    liked_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
