import pytest
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken


# Assuming you have the necessary fixtures defined in your conftest.py

@pytest.mark.django_db
def test_login_success(api_client, user):
    # Prepare the data for a successful login
    data = {
        'username': user.username,
        'password': 'hElLo12341@'  # Correct password
    }

    # Call the login endpoint
    response = api_client.post(reverse('login'), data)

    # Check if the response is successful and tokens are returned
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data
    assert response.data['user']['username'] == user.username


@pytest.mark.django_db
def test_login_invalid_credentials(api_client):
    # Prepare the data for an unsuccessful login
    data = {
        'username': 'wronguser',
        'password': 'wrongpassword'
    }

    # Call the login endpoint
    response = api_client.post(reverse('login'), data)

    # Check if the response indicates invalid credentials
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data['detail'] == 'Invalid credentials'


@pytest.mark.django_db
def test_signup_success(api_client):
    # Prepare the data for a successful signup
    data = {
        'username': 'newuser',
        'password': 'NewUser123@',
        'email': 'newuser@gmail.com'
    }

    # Call the signup endpoint
    response = api_client.post(reverse('signup'), data)

    # Check if the response is successful
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['user']['username'] == data['username']


@pytest.mark.django_db
def test_signup_existing_user(api_client, user):
    # Prepare data with an existing username
    data = {
        'username': user.username,  # Use existing username
        'password': 'AnotherPassword123@',
        'email': 'anotheruser@gmail.com'
    }

    # Call the signup endpoint
    response = api_client.post(reverse('signup'), data)

    # Check if the response indicates that the username is already taken
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_test_token_unauthenticated(api_client):
    # Call the test token endpoint without authentication
    response = api_client.post(reverse('test_token'))

    # Check if the response indicates authentication is required
    assert response.status_code == status.HTTP_403_FORBIDDEN
