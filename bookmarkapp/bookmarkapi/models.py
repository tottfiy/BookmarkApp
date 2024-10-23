from django.db import models
from django.conf import settings
class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=1)
    title = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now_add=True)
    url = models.TextField(max_length=500)
    category = models.CharField(max_length=50)