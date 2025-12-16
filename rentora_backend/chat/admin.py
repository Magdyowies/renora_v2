from django.contrib import admin
from .models import ChatSession, ChatMessage

class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ('sender_type', 'content', 'created_at')

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'created_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('user__username',)
    inlines = [ChatMessageInline]

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'sender_type', 'created_at')
    list_filter = ('sender_type',)
    search_fields = ('session__user__username', 'content')