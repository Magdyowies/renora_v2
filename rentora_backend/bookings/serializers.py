from rest_framework import serializers
from django.utils import timezone
from .models import Booking
from vehicles.serializers import VehicleListSerializer


class BookingSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleListSerializer(source='vehicle', read_only=True)
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'vehicle', 'vehicle_details', 'customer_name', 'pickup_date', 'return_date',
            'pickup_location', 'return_location', 'total_days', 'base_price',
            'discount_amount', 'total_price', 'promo_code', 'status', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'customer_name', 'total_days', 'base_price', 'total_price', 'created_at']


class BookingCreateSerializer(serializers.ModelSerializer):
    promo_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Booking
        fields = ['vehicle', 'pickup_date', 'return_date', 'pickup_location', 'return_location', 'promo_code', 'notes']

    def validate(self, attrs):
        pickup_date = attrs.get('pickup_date')
        return_date = attrs.get('return_date')

        if pickup_date >= return_date:
            raise serializers.ValidationError("Return date must be after pickup date")

        if pickup_date < timezone.now():
            raise serializers.ValidationError("Pickup date cannot be in the past")

        vehicle = attrs.get('vehicle')
        overlapping = Booking.objects.filter(
            vehicle=vehicle,
            status__in=['pending', 'confirmed', 'active'],
            pickup_date__lt=return_date,
            return_date__gt=pickup_date
        ).exists()

        if overlapping:
            raise serializers.ValidationError("Vehicle is not available for selected dates")

        return attrs

    def create(self, validated_data):
        promo_code_str = validated_data.pop('promo_code', None)
        vehicle = validated_data['vehicle']
        pickup_date = validated_data['pickup_date']
        return_date = validated_data['return_date']

        total_days = (return_date - pickup_date).days
        if total_days < 1:
            total_days = 1

        base_price = vehicle.price_per_day * total_days
        discount_amount = 0
        promo = None

        if promo_code_str:
            from payments.models import PromoCode
            try:
                promo = PromoCode.objects.get(
                    code=promo_code_str,
                    is_active=True,
                    valid_from__lte=timezone.now(),
                    valid_until__gte=timezone.now()
                )
                if promo.min_booking_amount <= base_price:
                    if promo.discount_type == 'percentage':
                        discount_amount = base_price * (promo.discount_value / 100)
                        if promo.max_discount and discount_amount > promo.max_discount:
                            discount_amount = promo.max_discount
                    else:
                        discount_amount = promo.discount_value
            except PromoCode.DoesNotExist:
                pass

        total_price = base_price - discount_amount

        booking = Booking.objects.create(
            customer=self.context['request'].user,
            vehicle=vehicle,
            pickup_date=pickup_date,
            return_date=return_date,
            pickup_location=validated_data['pickup_location'],
            return_location=validated_data['return_location'],
            total_days=total_days,
            base_price=base_price,
            discount_amount=discount_amount,
            total_price=total_price,
            promo_code=promo,
            notes=validated_data.get('notes', '')
        )

        return booking
