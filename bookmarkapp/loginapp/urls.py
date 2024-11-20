from django.contrib import admin
from django.urls import path, include, re_path
from . import views

from django.urls import re_path
from . import views

urlpatterns = [
    re_path('login/', views.login, name='login'),  # Added name='login'
    re_path('signup/', views.signup, name='signup'),  # Added name='signup'
    re_path('test_token/', views.test_token, name='test_token'),  # Added name='test_token'
    re_path('logout/', views.logout, name='logout'),  # Added name='logout'
]
