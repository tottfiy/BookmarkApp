from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from .serializers import UserSerializer
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    print(f"Username: {username}, Password: {password}")

    user = authenticate(username=username, password=password)

    if user is not None:
        # Generate access and refresh tokens using SimpleJWT
        refresh = RefreshToken.for_user(user)
        print(f"Token for {user.username}: {refresh.access_token}")  # Log the token
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        })

    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # Create the user instance, but do not save it yet
        user = User(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email']
        )
        # Set the password using the set_password method to hash it
        user.set_password(serializer.validated_data['password'])
        # Save the user instance to the database
        user.save()
        return Response({'user': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([])  # No authentication required
@permission_classes([IsAuthenticated])
def test_token(request):
    print(f"Authenticated user: {request.user.username}, Email: {request.user.email}")
    return Response("Passed for {}".format(request.user.email))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Extract the refresh token from the request data
        refresh_token = request.data.get('refresh')
        if refresh_token is None:
            return Response({"detail": "Refresh token is required for logout."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Blacklist the refresh token
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
