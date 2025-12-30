from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatSession, ChatMessage
from .serializers import (
    ChatSessionSerializer,
    ChatSessionListSerializer,
    ChatMessageSerializer,
)

from vehicles.models import Vehicle

# Optional OpenAI support
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


# ============================================================
# Chat API Root
# ============================================================

class ChatApiRoot(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            "message": "Welcome to the Rentora Chat API",
            "endpoints": {
                "list_create_sessions": "/api/chat/sessions/",
                "session_detail": "/api/chat/sessions/<id>/",
                "send_message": "/api/chat/sessions/<id>/send/",
                "close_session": "/api/chat/sessions/<id>/close/",
            }
        })


# ============================================================
# Chat Sessions
# ============================================================

class ChatSessionListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return (
            ChatSessionSerializer
            if self.request.method == "POST"
            else ChatSessionListSerializer
        )

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        session = ChatSession.objects.create(user=request.user)

        ChatMessage.objects.create(
            session=session,
            sender_type="bot",
            content=(
                "Hello! I'm Rentora's assistant 🤖\n\n"
                "I can help you with:\n"
                "- Finding vehicles 🚗\n"
                "- Pricing & availability 💰\n"
                "- Booking & payments 📅\n"
                "- General support ❓"
            )
        )

        return Response(
            ChatSessionSerializer(session).data,
            status=status.HTTP_201_CREATED
        )


class ChatSessionDetailView(generics.RetrieveAPIView):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)


# ============================================================
# Send Message
# ============================================================

class SendMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            session = ChatSession.objects.get(pk=pk, user=request.user)
        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        content = request.data.get("content", "").strip()
        if not content:
            return Response(
                {"error": "Message content is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_message = ChatMessage.objects.create(
            session=session,
            sender_type="user",
            content=content,
        )

        bot_reply = self.get_ai_or_fallback_response(
            session=session,
            user_message=content,
            user=request.user,
        )

        bot_message = ChatMessage.objects.create(
            session=session,
            sender_type="bot",
            content=bot_reply,
        )

        return Response(
            {
                "user_message": ChatMessageSerializer(user_message).data,
                "bot_message": ChatMessageSerializer(bot_message).data,
            },
            status=status.HTTP_200_OK,
        )

    # ==================================================
    # AI OR FALLBACK (INSIDE CLASS ✅)
    # ==================================================
    def get_ai_or_fallback_response(self, session, user_message, user):
        api_key = getattr(settings, "OPENAI_API_KEY", None)

        if not OPENAI_AVAILABLE or not api_key:
            return self.get_fallback_response(user_message, user)

        try:
            client = OpenAI(api_key=api_key)

            vehicles = Vehicle.objects.filter(status=True)[:3]
            vehicles_info = "\n".join([
                f"- {v.brand} {v.model} ({v.year}) — ${v.price_per_day}/day"
                for v in vehicles
            ]) or "No vehicles available."

            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are Rentora's intelligent assistant for a car rental platform. "
                        "Answer naturally and helpfully.\n\n"
                        f"Available vehicles:\n{vehicles_info}"
                    ),
                }
            ]

            history = session.messages.order_by("-created_at")[:6][::-1]
            for msg in history:
                role = "user" if msg.sender_type == "user" else "assistant"
                messages.append({"role": role, "content": msg.content})

            messages.append({"role": "user", "content": user_message})

            response = client.responses.create(
                model="gpt-4.1-mini",
                input=messages,
                max_output_tokens=300,
            )

            return response.output_text

        except Exception as e:
            print("AI ERROR:", e)
            return self.get_fallback_response(user_message, user)

    # ==================================================
    # SAFE FALLBACK
    # ==================================================
    def get_fallback_response(self, user_message, user):
        msg = "".join(c for c in user_message.lower() if c.isalnum() or c.isspace())

        if any(word in msg for word in ["book", "rent", "reserve"]):
            return (
                "To book a vehicle 🚗:\n"
                "1️⃣ Browse available vehicles\n"
                "2️⃣ Choose your dates\n"
                "3️⃣ Confirm & pay\n\n"
                "Would you like help finding a car?"
            )

        if any(word in msg for word in ["price", "cost", "rate"]):
            return (
                "Our prices depend on vehicle type and rental duration 💰.\n"
                "You can see the daily price on each vehicle card."
            )

        if any(word in msg for word in ["hello", "hi", "hey"]):
            return f"Hello {user.first_name or user.email}! 👋 How can I help you today?"

        return (
            "I'm here to help 😊\n\n"
            "You can ask me about:\n"
            "- Vehicles 🚗\n"
            "- Pricing 💰\n"
            "- Booking 📅\n"
            "- Payments 💳"
        )


# ============================================================
# Close Session
# ============================================================

class CloseSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            session = ChatSession.objects.get(pk=pk, user=request.user)
        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        session.status = "closed"
        session.save()
        return Response({"message": "Session closed successfully"})
