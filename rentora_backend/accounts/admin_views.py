
from rest_framework import generics
from django.contrib.auth import get_user_model
from accounts.permissions import IsAdminRole
from .serializers import UserListSerializer

User = get_user_model()

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAdminRole]
