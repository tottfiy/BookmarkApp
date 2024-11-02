# test_bookmarks.py
import pytest
from .models import Bookmark
from rest_framework import status
from django.urls import reverse

@pytest.mark.django_db
def test_bookmark_list(authenticated_client, create_bookmark):
    # Create bookmarks
    create_bookmark(title='Test Bookmark 1', url='http://example.com/1')
    create_bookmark(title='Test Bookmark 2', url='http://example.com/2')

    # Make a GET request to the bookmarks endpoint
    response = authenticated_client.get(reverse('bookmarks-list'))

    # Check that the response status is 200 OK
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2  # Ensure both bookmarks are returned

@pytest.mark.django_db
def test_create_bookmark(authenticated_client):
    # Data for new bookmark
    data = {
        'title': 'New Bookmark',
        'url': 'http://example.com/new',
        'category': 'test'
    }

    # Make a POST request to create a new bookmark
    response = authenticated_client.post(reverse('bookmarks-list'), data)

    # Check that the response status is 201 Created
    assert response.status_code == status.HTTP_201_CREATED

    # Check that the bookmark was created in the database
    assert Bookmark.objects.count() == 1
    assert Bookmark.objects.get().title == 'New Bookmark'
