from django.urls import path
from .views import UserStatsView

urlpatterns = [
    path('<int:id>/stats/', UserStatsView.as_view(), name='user_stats'),
]
