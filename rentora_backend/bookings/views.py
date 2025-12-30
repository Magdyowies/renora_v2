from django.db import transaction
from django.shortcuts import get_object_or_404
import stripe

from rest_framework import generics, permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from bookings.models import Booking
from bookings.serializers import (
    BookingSerializer,
    BookingCreateSerializer,
    AdminBookingSerializer,
)

from payments.models import Payment, Wallet, WalletTransaction
from payments.serializers import StripePaymentVerifySerializer

from accounts.permissions import IsAdminOrVendorRole
from django.conf import settings


# ==============================
# STRIPE CONFIG
# ==============================
stripe.api_key = settings.STRIPE_SECRET_KEY


# ==============================
# STRIPE PAYMENT VERIFICATION
# ==============================
class StripePaymentVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = StripePaymentVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment_intent_id = serializer.validated_data['payment_intent_id']

        # 1️⃣ Stripe = source of truth
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        except stripe.error.StripeError:
            return Response(
                {'error': 'Unable to verify payment'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if intent.status != 'succeeded':
            return Response(
                {'error': 'Payment not completed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking_id = intent.metadata.get('booking_id')
        if not booking_id:
            return Response(
                {'error': 'Invalid payment metadata'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔒 Atomic section (LOCK booking row correctly)
        with transaction.atomic():
            booking = get_object_or_404(
                Booking.objects.select_for_update(),
                id=booking_id
            )

            if booking.customer != request.user:
                return Response(
                    {'error': 'Unauthorized'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # 2️⃣ Idempotency (NO double payments)
            if Payment.objects.filter(transaction_id=payment_intent_id).exists():
                return Response(
                    {'success': True, 'status': 'already_processed'},
                    status=status.HTTP_200_OK
                )

            # 3️⃣ Create payment record
            Payment.objects.create(
                booking=booking,
                user=request.user,
                amount=booking.final_price,
                method='stripe',
                status='completed',
                transaction_id=payment_intent_id
            )

            # 4️⃣ Confirm booking
            booking.status = 'confirmed'
            booking.save()

            # 5️⃣ Credit vendor wallet
            vendor = booking.vehicle.vendor
            wallet, _ = Wallet.objects.get_or_create(user=vendor)
            wallet.balance += booking.final_price
            wallet.save()

            WalletTransaction.objects.create(
                wallet=wallet,
                amount=booking.final_price,
                transaction_type='credit',
                description=f'Booking #{booking.id}'
            )

        return Response(
            {'success': True, 'booking_status': 'confirmed'},
            status=status.HTTP_200_OK
        )


# ==============================
# ADMIN BOOKINGS
# ==============================
class BookingAdminViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related('vehicle', 'customer').order_by('-created_at')
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AdminBookingSerializer
        return BookingSerializer


# ==============================
# CREATE BOOKING (CUSTOMER)
# ==============================
class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save(customer=request.user)
        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED
        )


# ==============================
# MY BOOKINGS (CUSTOMER)
# ==============================
class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.select_related('vehicle', 'customer').filter(
            customer=self.request.user
        )


# ==============================
# CANCEL BOOKING + REFUND
# ==============================
class BookingCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk, customer=request.user)

        if booking.status not in ['pending', 'confirmed']:
            return Response(
                {'error': 'Cannot cancel this booking'},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment = Payment.objects.filter(
            booking=booking,
            status='completed',
            method='stripe'
        ).first()

        with transaction.atomic():
            if payment:
                stripe.Refund.create(
                    payment_intent=payment.transaction_id
                )

                payment.status = 'refunded'
                payment.save()

                wallet = Wallet.objects.get(user=booking.vehicle.vendor)
                wallet.balance -= payment.amount
                wallet.save()

                WalletTransaction.objects.create(
                    wallet=wallet,
                    amount=payment.amount,
                    transaction_type='debit',
                    description=f'Refund booking #{booking.id}'
                )

            booking.status = 'cancelled'
            booking.save()

        return Response(
            {'message': 'Booking cancelled and refunded'},
            status=status.HTTP_200_OK
        )


# ==============================
# VENDOR BOOKINGS
# ==============================
class VendorBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Booking.objects.select_related('vehicle', 'customer').all()
        return Booking.objects.select_related('vehicle', 'customer').filter(
            vehicle__vendor=user
        )


# ==============================
# UPDATE BOOKING STATUS (VENDOR)
# ==============================
class BookingStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        booking = get_object_or_404(
            Booking,
            pk=pk,
            vehicle__vendor=request.user
        )

        new_status = request.data.get('status')

        valid_transitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['completed', 'cancelled'],
        }

        if new_status not in valid_transitions.get(booking.status, []):
            return Response(
                {'error': f'Invalid status transition from {booking.status} to {new_status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = new_status
        booking.save()

        return Response(BookingSerializer(booking).data)


# ==============================
# ALL BOOKINGS (ADMIN)
# ==============================
class AllBookingsView(generics.ListAPIView):
    queryset = Booking.objects.select_related('vehicle', 'customer').all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAdminUser]


# ==============================
# UPDATE BOOKING (ADMIN / OWNER)
# ==============================
class BookingUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Booking.objects.select_related('vehicle', 'customer').all()
        return Booking.objects.select_related('vehicle', 'customer').filter(customer=user)


# ==============================
# VENDOR CREATE BOOKING
# ==============================
class VendorBookingCreateView(generics.CreateAPIView):
    serializer_class = AdminBookingSerializer
    permission_classes = [IsAdminOrVendorRole]

    def perform_create(self, serializer):
        vehicle = serializer.validated_data['vehicle']
        user = self.request.user

        if not user.is_superuser and vehicle.vendor != user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only create bookings for your own vehicles."
            )

        serializer.save()
