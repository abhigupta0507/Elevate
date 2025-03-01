from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import UserSerializer, LoginSerializer,UserUpdateSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, status,permissions
from rest_framework.decorators import api_view, permission_classes

#API to signup
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import UserSerializer, LoginSerializer, UserUpdateSerializer, OTPVerificationSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from .utils import generate_otp, send_otp_email, is_otp_valid
import environ
from pathlib import Path

env = environ.Env()
environ.Env.read_env()
# API to initiate signup with OTP
class UserSignupInitiateView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check if email already exists
            email = serializer.validated_data.get('email')
            if CustomUser.objects.filter(email=email, is_verified=True).exists():
                return Response({"detail": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate OTP
            otp = generate_otp()
            
            # Create or update user with unverified status
            user_instance, created = CustomUser.objects.update_or_create(
                email=email,
                defaults={
                    **serializer.validated_data,
                    'is_verified': False,
                    'otp': otp,
                    'otp_created_at': timezone.now()
                }
            )
            
            # Set password properly
            user_instance.set_password(serializer.validated_data['password'])
            user_instance.save()
            
            # Send OTP via email
            try:
                send_otp_email(email, otp)
                return Response({
                    "message": "OTP sent successfully to your email. Please verify to complete registration.",
                    "email": email
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"detail": f"Failed to send OTP: {str(e)}"}, 
                               status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API to verify OTP and complete registration
class VerifyOTPView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = OTPVerificationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            otp = serializer.validated_data.get('otp')
            
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
            if user.otp == otp and is_otp_valid(user):
                # Mark user as verified
                user.is_verified = True
                user.otp = None  # Clear OTP after verification
                user.save()
                
                # Generate tokens for the user
                refresh = RefreshToken.for_user(user)
                user_data = UserSerializer(user).data
                
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': user_data,
                    'message': 'Account verified successfully',
                }, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid or expired OTP"}, 
                               status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API to resend OTP
class ResendOTPView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Generate new OTP
        otp = generate_otp()
        user.otp = otp
        user.otp_created_at = timezone.now()
        user.save()
        
        # Send OTP via email
        try:
            send_otp_email(email, otp)
            return Response({
                "message": "OTP resent successfully"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"Failed to send OTP: {str(e)}"}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Other existing views remain the same
class CustomUserLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, username=email, password=password)

        if user is not None:
            # Check if user is verified
            if not user.is_verified:
                return Response({'detail': 'Account not verified. Please verify your email.'}, 
                               status=status.HTTP_401_UNAUTHORIZED)
                
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': user_data,
                'message': 'Login successful',      
            }, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
#API to retrieve all user details we have 
class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    

#API to delete a account
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    try:
        user.delete()
        return Response({"detail": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

#API to update details of user
class UpdateUserDetailsView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
        
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "User details updated successfully",
                "user": UserSerializer(instance).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)