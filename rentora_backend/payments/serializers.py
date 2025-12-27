from rest_framework import serializers
from .models import Payment, Wallet, WalletTransaction, PromoCode
from bookings.models import Booking


class WalletSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()

    class Meta:
        model = Wallet
        fields = ['id', 'balance', 'created_at', 'updated_at']

    def get_balance(self, obj):
        return float(obj.balance)


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['id', 'amount', 'transaction_type', 'description', 'reference_id', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'booking', 'amount', 'method', 'status', 'transaction_id', 'created_at']


from bookings.models import Booking
class PaymentCreateSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    method = serializers.CharField()

    def validate_booking_id(self, value):
        try:
            booking = Booking.objects.get(id=value)
            return booking
        except Booking.DoesNotExist:
            raise serializers.ValidationError("Booking not found.")


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
