from rest_framework import serializers
from .models import ChatSession, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender_type', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = ['id', 'status', 'created_at', 'updated_at', 'messages', 'last_message']

    def get_last_message(self, obj):
        last = obj.messages.last()
        if last:
            return ChatMessageSerializer(last).data
        return None


class ChatSessionListSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = ['id', 'status', 'created_at', 'last_message']

    def get_last_message(self, obj):
        last = obj.messages.last()
        if last:
            return ChatMessageSerializer(last).data
        return None
