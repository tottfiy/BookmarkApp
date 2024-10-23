from django.contrib import admin
from django.urls import path, include, re_path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)



urlpatterns = [
    path("admin/", admin.site.urls),
    path('bookmarks/', include('bookmarkapi.urls')),
    path('auth/', include('loginapp.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # re_path('login/', views.login),
    # re_path('signup', views.signup),
    # re_path('test_token', views.test_token),
]
