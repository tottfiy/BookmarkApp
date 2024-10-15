from django.urls import path
from . import views
# from .views import (
#     BookmarkDetailView,
#     BookmarkListView,
#     BookmarkCreateView,
#     BookmarkDeleteView,
#     BookmarkUpdateView
# )
#
# urlpatterns = [
#     path('', BookmarkListView.as_view()),
#     path('add/', BookmarkCreateView.as_view()),
#     path('<pk>/', BookmarkDetailView.as_view()),
#     path('<pk>/delete/', BookmarkDeleteView.as_view()),
#     path('<pk>/update/', BookmarkUpdateView.as_view())
# ]

from bookmarkapi.views import BookmarkViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', BookmarkViewSet, basename='bookmarks')
urlpatterns = router.urls