from django.db import models

class Bookmark(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now_add=True)
    url = models.TextField(max_length=500)
    category = models.CharField(max_length=50)