# from rest_framework import serializers
# from .models import CustomUser
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ['id','first_name', 'last_name', 'email', 'password', 'gender', 'age', 'height', 'weight','join_date']
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         user = CustomUser(**validated_data)
#         user.set_password(validated_data['password']) 
#         user.save()
#         return user


# class LoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField()

# class UserUpdateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ['height', 'weight', 'age']
from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'password', 'gender', 'age', 
                 'height', 'weight', 'join_date', 'mobile_number', 'is_verified']
        extra_kwargs = {'password': {'write_only': True}, 'otp': {'write_only': True}}

    def create(self, validated_data):
        # Don't save the user yet, just create an instance
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        # We will save the user after OTP verification
        return user

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['height', 'weight', 'age']