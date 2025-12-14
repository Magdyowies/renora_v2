from django.urls import path
from .views import (
    ChatSessionListView, ChatSessionCreateView, ChatSessionDetailView,
    SendMessageView, CloseSessionView
)

urlpatterns = [
    path('sessions/', ChatSessionListView.as_view(), name='chat_sessions'),
    path('sessions/create/', ChatSessionCreateView.as_view(), name='chat_session_create'),
    path('sessions/<int:pk>/', ChatSessionDetailView.as_view(), name='chat_session_detail'),
    path('sessions/<int:pk>/send/', SendMessageView.as_view(), name='send_message'),
    path('sessions/<int:pk>/close/', CloseSessionView.as_view(), name='close_session'),
]
