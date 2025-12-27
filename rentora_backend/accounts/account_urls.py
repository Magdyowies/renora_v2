from django.urls import path
from .views import UserAccountView, UserChangePasswordView

urlpatterns = [
    path('me/', UserAccountView.as_view(), name='user-account-me'),
    path('change-password/', UserChangePasswordView.as_view(), name='user-account-change-password'),
]
