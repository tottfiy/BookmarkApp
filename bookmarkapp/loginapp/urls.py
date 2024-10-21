from django.contrib import admin
from django.urls import path, include, re_path
from . import views

urlpatterns = [
    re_path('login/', views.login),
    re_path('signup', views.signup),
    re_path('test_token', views.test_token),
    re_path('logout', views.logout),
]
