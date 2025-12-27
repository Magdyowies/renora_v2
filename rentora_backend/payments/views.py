from rest_framework import generics, permissions, status
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db import transaction
from django.conf import settings
import stripe
import os
from .models import Payment, Wallet, WalletTransaction, PromoCode
from .serializers import (
    PaymentSerializer, PaymentCreateSerializer, WalletSerializer,
    WalletTransactionSerializer, PromoCodeSerializer, PromoCodeValidateSerializer
)


class WalletView(generics.RetrieveAPIView):
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        wallet, created = Wallet.objects.get_or_create(user=self.request.user)
        return wallet


class WalletTransactionsView(generics.ListAPIView):
    serializer_class = WalletTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        wallet, created = Wallet.objects.get_or_create(user=self.request.user)
        return WalletTransaction.objects.filter(wallet=wallet)


class WalletTopUpView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError()
        except (TypeError, ValueError):
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            wallet, created = Wallet.objects.get_or_create(user=request.user)
            wallet.balance += amount
            wallet.save()

            WalletTransaction.objects.create(
                wallet=wallet,
                amount=amount,
                transaction_type='credit',
                description='Wallet top-up'
            )

        return Response(WalletSerializer(wallet).data)


class PaymentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PaymentCreateSerializer(data=request.data)
        if not serializer.is_valid(raise_exception=False):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        booking = serializer.validated_data['booking_id']
        method = serializer.validated_data['method']

        if booking.customer != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        if booking.status != 'pending':
            return Response({'error': 'Booking is not pending for payment'}, status=status.HTTP_400_BAD_REQUEST)

        existing_payment = Payment.objects.filter(booking=booking, status='completed').exists()
        if existing_payment:
            return Response({'error': 'Booking has already been paid'}, status=status.HTTP_400_BAD_REQUEST)

        # Use the final_price from the booking as the source of truth
        amount_to_pay = booking.final_price

        with transaction.atomic():
            if method == 'wallet':
                wallet, _ = Wallet.objects.get_or_create(user=request.user)
                if wallet.balance < amount_to_pay:
                    return Response({'error': 'Insufficient wallet balance'}, status=status.HTTP_400_BAD_REQUEST)

                wallet.balance -= amount_to_pay
                wallet.save()

                WalletTransaction.objects.create(
                    wallet=wallet,
                    amount=amount_to_pay,
                    transaction_type='debit',
                    description=f'Payment for booking #{booking.id}'
                )

                payment = Payment.objects.create(
                    booking=booking,
                    user=request.user,
                    amount=amount_to_pay,
                    method='wallet',
                    status='completed',
                    transaction_id=f'WALLET-{booking.id}-{timezone.now().timestamp()}'
                )

                booking.status = 'confirmed'
                booking.save()
                return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)

            elif method == 'stripe':
                try:
                    payment = Payment.objects.create(
                        booking=booking,
                        user=request.user,
                        amount=amount_to_pay,
                        method='stripe',
                        status='pending'
                    )

                    checkout_session = stripe.checkout.Session.create(
                        payment_method_types=['card'],
                        line_items=[{
                            'price_data': {
                                'currency': 'usd',
                                'product_data': {
                                    'name': f"Booking for {booking.vehicle.name}",
                                },
                                'unit_amount': int(amount_to_pay * 100),
                            },
                            'quantity': 1,
                        }],
                        mode='payment',
                        success_url=f"{settings.FRONTEND_URL}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
                        cancel_url=f"{settings.FRONTEND_URL}/payment-cancelled",
                        metadata={'payment_id': payment.id}
                    )
                    payment.transaction_id = checkout_session.id
                    payment.save()

                    return Response({'checkout_url': checkout_session.url})
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({'error': f"Payment method '{method}' not supported."}, status=status.HTTP_400_BAD_REQUEST)



class PaymentHistoryView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class PromoCodeListView(generics.ListCreateAPIView):
    serializer_class = PromoCodeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return PromoCode.objects.all()
        elif getattr(user, 'role', None) == 'vendor':
            return PromoCode.objects.filter(vendor=user)
        return PromoCode.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user, 'role', None) == 'vendor':
            serializer.save(vendor=user)
        elif user.is_superuser:
            serializer.save()
        else:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You do not have permission to create promo codes.")


class PromoCodeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PromoCodeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return PromoCode.objects.all()
        elif getattr(user, 'role', None) == 'vendor':
            return PromoCode.objects.filter(vendor=user)
        return PromoCode.objects.none()


class PromoCodeValidateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PromoCodeValidateSerializer(data=request.data)
        if not serializer.is_valid(raise_exception=False):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        code = serializer.validated_data['code']
        booking_amount = serializer.validated_data['booking_amount']

        try:
            promo = PromoCode.objects.get(
                code=code,
                is_active=True,
                valid_from__lte=timezone.now(),
                valid_until__gte=timezone.now()
            )
        except PromoCode.DoesNotExist:
            return Response({'error': 'Invalid or expired promo code'}, status=status.HTTP_400_BAD_REQUEST)

        if promo.usage_limit and promo.used_count >= promo.usage_limit:
            return Response({'error': 'Promo code usage limit reached'}, status=status.HTTP_400_BAD_REQUEST)

        if booking_amount < promo.min_booking_amount:
            return Response({'error': f'Minimum booking amount is ${promo.min_booking_amount}'}, status=status.HTTP_400_BAD_REQUEST)

        if promo.discount_type == 'percentage':
            discount = booking_amount * (promo.discount_value / 100)
            if promo.max_discount and discount > promo.max_discount:
                discount = promo.max_discount
        else:
            discount = promo.discount_value

        return Response({
            'valid': True,
            'discount': float(discount),
            'final_amount': float(booking_amount - discount)
        })


stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', settings.STRIPE_SECRET_KEY)
WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', settings.STRIPE_WEBHOOK_SECRET)


class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, WEBHOOK_SECRET
            )
        except ValueError as e:
            # Invalid payload
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Handle the event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            # Fulfill the purchase...
            print(f"Checkout session completed: {session['id']}")
            # Retrieve booking_id from metadata or client_reference_id
            booking_id = session.get('metadata', {}).get('booking_id')
            payment_intent_id = session.get('payment_intent')

            if booking_id:
                try:
                    with transaction.atomic():
                        payment = Payment.objects.get(booking_id=booking_id, status='pending')
                        payment.status = 'completed'
                        payment.transaction_id = payment_intent_id if payment_intent_id else session['id']
                        payment.method = 'stripe' # Ensure method is set to stripe
                        payment.save()

                        booking = payment.booking
                        booking.status = 'confirmed'
                        booking.save()
                        print(f"Updated Payment {payment.id} and Booking {booking.id} to completed/confirmed.")
                except Payment.DoesNotExist:
                    print(f"Payment for booking ID {booking_id} not found or not pending.")
                    # Potentially log this for manual review, but return 200 to Stripe
                except Exception as e:
                    print(f"Error processing webhook for booking ID {booking_id}: {e}")
                    return Response({'error': 'Webhook processing failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            print(f"PaymentIntent was successful: {payment_intent['id']}")
            # Can also handle this, but checkout.session.completed is often sufficient for initial payments

        elif event['type'] == 'charge.succeeded':
            charge = event['data']['object']
            print(f"Charge succeeded: {charge['id']}")
            # If using Charges API directly

        else:
            # Unexpected event type
            print('Unhandled event type {}'.format(event['type']))

        return Response({'success': True}, status=status.HTTP_200_OK)


class PaymentVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, transactionId):
        try:
            payment = Payment.objects.get(transaction_id=transactionId, user=request.user)
            return Response(PaymentSerializer(payment).data)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
