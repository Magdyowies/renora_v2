from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, ProfileView, ProfileUpdateView,
    ChangePasswordView, UserListView, AuthApiRoot, LogoutView, VerifyTokenView,
    AccountView
)

urlpatterns = [
    path('', AuthApiRoot.as_view(), name='auth_api_root'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile_update'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('me/', AccountView.as_view(), name='account_me'),
    path('list/', UserListView.as_view(), name='user_list_admin'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify/', VerifyTokenView.as_view(), name='verify_token'),
]