# conftest.py
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Bookmark

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(db):
    from django.contrib.auth.models import User
    return User.objects.create_user(username='testuser', password='testpassword')

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def create_bookmark(user):
    def make_bookmark(**kwargs):
        return Bookmark.objects.create(user=user, **kwargs)
    return make_bookmark
