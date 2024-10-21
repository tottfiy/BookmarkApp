from .models import Bookmark
from .serializers import BookmarkSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets


class BookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = BookmarkSerializer
    queryset = Bookmark.objects.all()  # This line can be omitted
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(f"Fetching bookmarks for user: {self.request.user}")
        return Bookmark.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate the logged-in user with the new bookmark
        serializer.save(user=self.request.user)