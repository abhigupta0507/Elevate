from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import UserSerializer, LoginSerializer
from rest_framework.permissions import AllowAny

class UserSignupView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
   

# class CustomUserLoginView(generics.GenericAPIView):
    # permission_classes = [AllowAny]
    # serializer_class = LoginSerializer  # Use LoginSerializer for login

    # def post(self, request, *args, **kwargs):
    #     email = request.data.get("email")
    #     password = request.data.get("password")
    #     user = authenticate(request, username=email, password=password)

    #     if user is not None:
    #         # Return full user details upon successful login
    #         return Response({
    #             'id':user.id,
    #             'first_name': user.first_name,
    #             'last_name': user.last_name,
    #             'email': user.email,
    #             'age': user.age,
    #             'height': user.height,
    #             'weight': user.weight,
    #             'join_date':user.join_date,
    #             'message': 'Login successful'
    #         })
    #     return Response({'detail': 'Invalid credentials'}, status=400)

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, status,permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .serializers import LoginSerializer
from .models import CustomUser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes

class CustomUserLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, username=email, password=password)

        if user is not None:
            # Generate tokens for the user
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user':user_data #{
                    # 'id': user_data.id,
                    # 'first_name': user_data.first_name,
                    # 'last_name': user_data.last_name,
                    # 'email': user_data.email,
                    # 'age': user_data.age,
                    # 'height': user_data.height,
                    # 'weight': user_data.weight,
                    # 'join_date': user_data.join_date,
                #},
            ,
                'message': 'Login successful',
                
            }, status=status.HTTP_200_OK)
        
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Return data for the currently logged-in user
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    try:
        user.delete()
        return Response({"detail": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)