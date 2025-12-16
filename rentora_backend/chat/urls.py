from django.urls import path
from .views import (
    ChatApiRoot, ChatSessionListCreateView, ChatSessionDetailView,
    SendMessageView, CloseSessionView
)

urlpatterns = [
    path('', ChatApiRoot.as_view(), name='chat_api_root'),
    path('sessions/', ChatSessionListCreateView.as_view(), name='chat_session_list_create'),
    path('sessions/<int:pk>/', ChatSessionDetailView.as_view(), name='chat_session_detail'),
    path('sessions/<int:pk>/send/', SendMessageView.as_view(), name='send_message'),
    path('sessions/<int:pk>/close/', CloseSessionView.as_view(), name='close_session'),
]