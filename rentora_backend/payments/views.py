from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db import transaction
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
        serializer.is_valid(raise_exception=True)

        booking = serializer.validated_data['booking']
        method = serializer.validated_data['method']

        if booking.customer != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        if booking.status != 'pending':
            return Response({'error': 'Booking is not pending'}, status=status.HTTP_400_BAD_REQUEST)

        existing_payment = Payment.objects.filter(booking=booking, status='completed').exists()
        if existing_payment:
            return Response({'error': 'Booking already paid'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            if method == 'wallet':
                wallet, created = Wallet.objects.get_or_create(user=request.user)
                if wallet.balance < booking.total_price:
                    return Response({'error': 'Insufficient wallet balance'}, status=status.HTTP_400_BAD_REQUEST)

                wallet.balance -= booking.total_price
                wallet.save()

                WalletTransaction.objects.create(
                    wallet=wallet,
                    amount=booking.total_price,
                    transaction_type='debit',
                    description=f'Payment for booking #{booking.id}'
                )

                payment = Payment.objects.create(
                    booking=booking,
                    user=request.user,
                    amount=booking.total_price,
                    method='wallet',
                    status='completed',
                    transaction_id=f'WALLET-{booking.id}-{timezone.now().timestamp()}'
                )

                booking.status = 'confirmed'
                booking.save()

            else:
                payment = Payment.objects.create(
                    booking=booking,
                    user=request.user,
                    amount=booking.total_price,
                    method=method,
                    status='pending'
                )

        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)


class PaymentHistoryView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class PromoCodeListView(generics.ListCreateAPIView):
    queryset = PromoCode.objects.all()
    serializer_class = PromoCodeSerializer
    permission_classes = [permissions.IsAdminUser]


class PromoCodeValidateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PromoCodeValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

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
