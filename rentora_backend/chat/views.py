import os
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatSessionListSerializer, ChatMessageSerializer
from vehicles.models import Vehicle
from bookings.models import Booking

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class ChatSessionListView(generics.ListAPIView):
    serializer_class = ChatSessionListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)


class ChatSessionCreateView(generics.CreateAPIView):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        session = ChatSession.objects.create(user=self.request.user)
        ChatMessage.objects.create(
            session=session,
            sender_type='bot',
            content="Hello! I'm Rentora's AI assistant. How can I help you today? I can help you with:\n\n- Finding the perfect vehicle for your needs\n- Answering questions about our rental process\n- Providing information about pricing and availability\n- Helping with booking and payment questions"
        )
        return session

    def create(self, request, *args, **kwargs):
        session = self.perform_create(None)
        return Response(ChatSessionSerializer(session).data, status=status.HTTP_201_CREATED)


class ChatSessionDetailView(generics.RetrieveAPIView):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)


class SendMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            session = ChatSession.objects.get(pk=pk, user=request.user)
        except ChatSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        content = request.data.get('content', '').strip()
        if not content:
            return Response({'error': 'Message content is required'}, status=status.HTTP_400_BAD_REQUEST)

        user_message = ChatMessage.objects.create(
            session=session,
            sender_type='user',
            content=content
        )

        bot_response = self.get_ai_response(session, content, request.user)

        bot_message = ChatMessage.objects.create(
            session=session,
            sender_type='bot',
            content=bot_response
        )

        return Response({
            'user_message': ChatMessageSerializer(user_message).data,
            'bot_message': ChatMessageSerializer(bot_message).data
        })

    def get_ai_response(self, session, user_message, user):
        api_key = os.environ.get('OPENAI_API_KEY')
        
        if not OPENAI_AVAILABLE or not api_key:
            return self.get_fallback_response(user_message, user)

        try:
            client = OpenAI(api_key=api_key)
            
            available_vehicles = Vehicle.objects.filter(status='available')[:5]
            vehicles_info = "\n".join([
                f"- {v.brand} {v.model} ({v.year}): ${v.price_per_day}/day, {v.transmission}, {v.seats} seats"
                for v in available_vehicles
            ])

            user_bookings = Booking.objects.filter(customer=user).order_by('-created_at')[:3]
            bookings_info = "\n".join([
                f"- Booking #{b.id}: {b.vehicle.name}, {b.status}, {b.pickup_date.strftime('%Y-%m-%d')}"
                for b in user_bookings
            ]) if user_bookings else "No recent bookings"

            system_prompt = f"""You are Rentora's helpful AI assistant for a vehicle rental platform.
Your role is to help customers with:
- Finding and recommending vehicles
- Explaining the rental process
- Answering pricing questions
- Helping with bookings
- Providing general customer support

Available vehicles:
{vehicles_info}

Customer's recent bookings:
{bookings_info}

Be friendly, helpful, and concise. If asked about specific booking or payment issues, suggest contacting support.
Always encourage users to explore our vehicle selection and make bookings through the platform."""

            messages = [{"role": "system", "content": system_prompt}]
            
            recent_messages = session.messages.order_by('-created_at')[:10][::-1]
            for msg in recent_messages:
                role = "user" if msg.sender_type == "user" else "assistant"
                messages.append({"role": role, "content": msg.content})

            messages.append({"role": "user", "content": user_message})

            response = client.chat.completions.create(
                model="gpt-5",
                messages=messages,
                max_completion_tokens=500
            )

            return response.choices[0].message.content

        except Exception as e:
            return self.get_fallback_response(user_message, user)

    def get_fallback_response(self, user_message, user):
        message_lower = user_message.lower()
        
        if any(word in message_lower for word in ['book', 'rent', 'reserve']):
            return "To book a vehicle, browse our available vehicles, select one you like, choose your pickup and return dates, and proceed to payment. Would you like me to help you find a specific type of vehicle?"
        
        elif any(word in message_lower for word in ['price', 'cost', 'rate', 'how much']):
            return "Our prices vary by vehicle type and rental duration. You can see the daily rate on each vehicle listing. We also offer promo codes for discounts! Check the vehicles page to see current pricing."
        
        elif any(word in message_lower for word in ['cancel', 'refund']):
            return "You can cancel pending or confirmed bookings from your My Bookings page. Refunds for cancelled bookings are processed to your wallet within 24-48 hours."
        
        elif any(word in message_lower for word in ['payment', 'pay', 'wallet']):
            return "We accept wallet payments. You can top up your wallet and use it for bookings. Payment is required to confirm your booking."
        
        elif any(word in message_lower for word in ['vehicle', 'car', 'suv', 'sedan']):
            vehicles = Vehicle.objects.filter(status='available')[:3]
            if vehicles:
                vehicle_list = "\n".join([f"- {v.brand} {v.model}: ${v.price_per_day}/day" for v in vehicles])
                return f"Here are some available vehicles:\n{vehicle_list}\n\nVisit our Vehicles page to see all options and filter by your preferences!"
            return "Check out our Vehicles page to see all available options. You can filter by category, price, and features."
        
        elif any(word in message_lower for word in ['hello', 'hi', 'hey']):
            return f"Hello {user.first_name or user.username}! Welcome to Rentora. How can I help you today?"
        
        else:
            return "I'm here to help! You can ask me about:\n- Available vehicles and recommendations\n- Booking and rental process\n- Pricing and promotions\n- Payment options\n\nWhat would you like to know?"


class CloseSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            session = ChatSession.objects.get(pk=pk, user=request.user)
        except ChatSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        session.status = 'closed'
        session.save()
        return Response({'message': 'Session closed'})
