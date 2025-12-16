from rest_framework import serializers
from .models import Payment, Wallet, WalletTransaction, PromoCode


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'balance', 'created_at', 'updated_at']


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['id', 'amount', 'transaction_type', 'description', 'reference_id', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'booking', 'amount', 'method', 'status', 'transaction_id', 'created_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['booking', 'method']


class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = [
            'id', 'code', 'discount_type', 'discount_value', 'min_booking_amount',
            'max_discount', 'usage_limit', 'used_count', 'valid_from', 'valid_until', 'is_active'
        ]


class PromoCodeValidateSerializer(serializers.Serializer):
    code = serializers.CharField()
    booking_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
