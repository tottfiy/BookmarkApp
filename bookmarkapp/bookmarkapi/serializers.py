from rest_framework import serializers
from .models import Bookmark


from rest_framework import serializers
from .models import Bookmark

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'title', 'date', 'url', 'category', 'user']  # Include user if needed

    def create(self, validated_data):
        # Automatically set the user to the logged-in user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)