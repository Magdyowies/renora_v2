from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from .serializers import (
    RegisterSerializer, LoginSerializer, UserProfileSerializer,
    ChangePasswordSerializer, UserSerializer, AdminUserSerializer, UserListSerializer,
    AccountSerializer, UserAccountSerializer, UserChangePasswordSerializer
)
from .models import User
from accounts.models import UserProfile # Import UserProfile for ProfileView
from django.shortcuts import get_object_or_404
from .permissions import IsAdminRole, IsAdminOrVendorRole


class AuthApiRoot(APIView):
    """
    Root endpoint for the Authentication API.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({
            "message": "Welcome to the Rentora Authentication API.",
            "endpoints": {
                "register": "/api/auth/register/",
                "login": "/api/auth/login/",
                "token_refresh": "/api/auth/refresh/",
                "profile": "/api/auth/profile/",
                "profile_update": "/api/auth/profile/update/",
                "change_password": "/api/auth/change-password/",
                "account_me": "/api/account/me/",
                "account_change_password": "/api/account/change-password/",
            }
        })

# =============================================================================
# NEW ACCOUNT MANAGEMENT VIEWS
# =============================================================================
class UserAccountView(generics.RetrieveUpdateAPIView):
    """
    get:
    Retrieve the authenticated user's account details.

    patch:
    Update the authenticated user's account details.
    'company_name' is only available for vendors.
    """
    serializer_class = UserAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserChangePasswordView(generics.GenericAPIView):
    """
    An endpoint for changing the authenticated user's password.
    """
    serializer_class = UserChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password has been changed successfully."}, status=status.HTTP_200_OK)


# =============================================================================
# EXISTING AUTHENTICATION AND USER VIEWS
# =============================================================================


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User Created Successfully. Now perform Login to get your token",
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data # This is now the authenticated user object
        
        token = RefreshToken.for_user(user)

        # Add custom claims to the token
        token['role'] = user.role
        token['username'] = user.username

        user_serializer = UserSerializer(user, context={'request': request}) # Pass context for profile serialization
        data = user_serializer.data
        data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}
        return Response(data, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_profile = get_object_or_404(UserProfile, user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)


class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(UserProfile, user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password automatically
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountView(generics.RetrieveUpdateAPIView):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAdminOrVendorRole]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return User.objects.all()
        elif getattr(user, 'role', None) == 'vendor':
            return User.objects.filter(bookings__vehicle__vendor=user).distinct()
        return User.objects.none()


class AdminUserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminRole]


class AdminUserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminRole]
    lookup_field = 'id'


class LogoutView(APIView):


    permission_classes = [permissions.IsAuthenticated]





    def post(self, request):


        try:


            refresh_token = request.data["refresh"]


            token = RefreshToken(refresh_token)


            token.blacklist()


            return Response(status=status.HTTP_205_RESET_CONTENT)


        except Exception as e:


            return Response(status=status.HTTP_400_BAD_REQUEST)








from bookings.models import Booking


























class VerifyTokenView(APIView):








    permission_classes = [permissions.IsAuthenticated]

















    def get(self, request):








        return Response({'valid': True}, status=status.HTTP_200_OK)

class UserStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        # Admin يقدر يشوف أي حد
        if not request.user.role == 'admin' and request.user.id != id:
            return Response(
                {"detail": "You do not have permission to view this user's stats."},
                status=status.HTTP_403_FORBIDDEN
            )

        user = get_object_or_404(User, id=id)

        bookings = Booking.objects.filter(customer=user)

        stats = {
            "totalBookings": bookings.count(),
            "totalSpent": sum(
                b.total_price for b in bookings if b.total_price
            ),
            "activeRentals": bookings.filter(status="active").count(),
            "completedRentals": bookings.filter(status="completed").count(),
        }

        return Response(stats, status=status.HTTP_200_OK)
