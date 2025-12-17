from django.urls import path
from accounts.views import AdminUserListCreateView, AdminUserRetrieveUpdateDestroyView

urlpatterns = [
    path('', AdminUserListCreateView.as_view(), name='admin_user_list_create'),
    path('<int:id>/', AdminUserRetrieveUpdateDestroyView.as_view(), name='admin_user_detail'),
]
