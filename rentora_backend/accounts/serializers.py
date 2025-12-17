from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['avatar', 'address', 'city', 'country', 'driver_license', 'driver_license_expiry']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'profile', 'created_at']
        read_only_fields = ['id', 'created_at']


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_active', 'is_staff', 'date_joined']
        read_only_fields = ['id', 'date_joined'] # id and date_joined should not be editable

    def create(self, validated_data):
        # Admin can create a new user without a password initially,
        # password will be set via Django Admin or reset flow.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            role=validated_data.get('role', 'customer'),
            is_active=validated_data.get('is_active', True),
            is_staff=validated_data.get('is_staff', False),
            password=None # Password will be set later
        )
        UserProfile.objects.create(user=user)
        return user

    def update(self, instance, validated_data):
        # Allow updating role, is_active, is_staff
        instance.role = validated_data.get('role', instance.role)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username and not email:
            raise serializers.ValidationError("Must include either 'username' or 'email'.")

        user = None
        if email:
            # Try to authenticate with email
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    if user.is_active:
                        return user
            except User.DoesNotExist:
                pass # Continue to try username or raise error later
        
        if not user and username:
            # Try to authenticate with username
            user = authenticate(username=username, password=password)

        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
