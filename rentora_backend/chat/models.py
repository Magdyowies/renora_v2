from django.db import models
from django.conf import settings

class ChatSession(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('closed', 'Closed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_sessions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chat_sessions'
        ordering = ['-created_at']

    def __str__(self):
        return f"Chat Session {self.id} - {self.user.username}"


class ChatMessage(models.Model):
    SENDER_TYPE_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
        ('agent', 'Agent'),
    ]

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender_type = models.CharField(max_length=20, choices=SENDER_TYPE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender_type} in Session {self.session.id}"
