from rest_framework import serializers
from .models import Payment, Wallet, WalletTransaction, PromoCode
from bookings.models import Booking
from accounts.serializers import UserListSerializer # Assuming UserListSerializer exists and is suitable
from vehicles.serializers import VehicleListSerializer # Assuming VehicleListSerializer exists and is suitable


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
    customer_name = serializers.SerializerMethodField()
    vehicle_name = serializers.SerializerMethodField()
    base_booking_price = serializers.DecimalField(source='booking.base_price', max_digits=10, decimal_places=2, read_only=True)
    discount_on_booking = serializers.DecimalField(source='booking.discount_amount', max_digits=10, decimal_places=2, read_only=True)
    promo_code_used = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'customer_name', 'vehicle_name', 'base_booking_price', 
            'discount_on_booking', 'promo_code_used', 'amount', 'method', 
            'status', 'transaction_id', 'created_at', 'payment_details' # Include payment_details from model
        ]

    def get_customer_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_vehicle_name(self, obj):
        return obj.booking.vehicle.name

    def get_promo_code_used(self, obj):
        if obj.booking.promo_code:
            return obj.booking.promo_code.code
        return None


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
