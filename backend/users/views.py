from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import UserSerializer, LoginSerializer
from rest_framework.permissions import AllowAny

class UserSignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CustomUserLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer  # Use LoginSerializer for login

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, username=email, password=password)

        if user is not None:
            # Return full user details upon successful login
            return Response({
                'id':user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'age': user.age,
                'height': user.height,
                'weight': user.weight,
                'join_date':user.join_date,
                'message': 'Login successful'
            })
        return Response({'detail': 'Invalid credentials'}, status=400)