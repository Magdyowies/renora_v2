from rest_framework import serializers
from django.utils import timezone
from .models import Booking
from vehicles.models import Vehicle
from vehicles.serializers import VehicleListSerializer
from django.contrib.auth import get_user_model


class BookingSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleListSerializer(source='vehicle', read_only=True)
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'vehicle_details', 'customer_name', 'pickup_date', 'return_date',
            'pickup_location', 'return_location', 'total_days', 'base_price',
            'discount_amount', 'total_price', 'promo_code', 'status', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'customer_name', 'total_days', 'base_price', 'total_price', 'created_at']

    def get_customer_name(self, obj):
        # Fallback to username if full_name is empty
        full_name = obj.customer.get_full_name().strip()
        return full_name if full_name else obj.customer.username


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

        # Ensure comparison is between two date objects
        if pickup_date.date() < timezone.now().date():
            raise serializers.ValidationError("Pickup date cannot be in the past")

        vehicle = attrs.get('vehicle')
        overlapping = Booking.objects.filter(
            vehicle=vehicle,
            status__in=['pending', 'confirmed', 'active'],
            pickup_date__lt=return_date,
            return_date__gt=pickup_date
        )
        
        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)

        if overlapping.exists():
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
                    valid_from__lte=timezone.now().date(),
                    valid_until__gte=timezone.now().date()
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


class AdminBookingSerializer(serializers.ModelSerializer):
    promo_code = serializers.CharField(required=False, allow_blank=True, write_only=True)
    customer = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    
    vehicle_details = VehicleListSerializer(source='vehicle', read_only=True)
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'customer_name', 'vehicle_details',
            'pickup_date', 'return_date', 'pickup_location', 'return_location', 
            'total_days', 'base_price', 'discount_amount', 'total_price', 
            'promo_code', 'status', 'notes', 'created_at'
        ]
        read_only_fields = [
            'id', 'customer_name', 'vehicle_details', 'total_days', 'base_price',
            'discount_amount', 'total_price', 'created_.at'
        ]

    def validate(self, attrs):
        pickup_date = attrs.get('pickup_date', getattr(self.instance, 'pickup_date', None))
        return_date = attrs.get('return_date', getattr(self.instance, 'return_date', None))

        if pickup_date and return_date:
            if pickup_date >= return_date:
                raise serializers.ValidationError("Return date must be after pickup date.")

            # On creation, pickup date cannot be in the past.
            if not self.instance and pickup_date.date() < timezone.now().date():
                raise serializers.ValidationError("Pickup date cannot be in the past.")

            vehicle = attrs.get('vehicle', getattr(self.instance, 'vehicle', None))
            
            query = Booking.objects.filter(
                vehicle=vehicle,
                status__in=['pending', 'confirmed', 'active'],
                pickup_date__lt=return_date,
                return_date__gt=pickup_date
            )

            if self.instance:
                query = query.exclude(pk=self.instance.pk)

            if query.exists():
                raise serializers.ValidationError("Vehicle is not available for the selected dates.")
        
        return attrs

    def _calculate_price(self, validated_data, instance=None):
        """Helper to calculate pricing, usable by create and update."""
        vehicle = validated_data.get('vehicle', getattr(instance, 'vehicle', None))
        pickup_date = validated_data.get('pickup_date', getattr(instance, 'pickup_date', None))
        return_date = validated_data.get('return_date', getattr(instance, 'return_date', None))
        promo_code_str = validated_data.get('promo_code', None)

        if not all([vehicle, pickup_date, return_date]):
            return {}

        total_days = (return_date - pickup_date).days
        total_days = max(1, total_days)

        base_price = vehicle.price_per_day * total_days
        discount_amount = 0
        promo = None
        
        if promo_code_str:
            from payments.models import PromoCode
            try:
                promo = PromoCode.objects.get(code=promo_code_str, is_active=True, valid_from__lte=timezone.now(), valid_until__gte=timezone.now())
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
        
        return {
            'total_days': total_days,
            'base_price': base_price,
            'discount_amount': discount_amount,
            'total_price': total_price,
            'promo_code': promo,
        }

    def create(self, validated_data):
        pricing_details = self._calculate_price(validated_data)
        validated_data.update(pricing_details)
        
        booking = Booking.objects.create(**validated_data)
        return booking

    def update(self, instance, validated_data):
        # Recalculate price if relevant fields have changed
        if 'pickup_date' in validated_data or 'return_date' in validated_data or 'promo_code' in validated_data or 'vehicle' in validated_data:
            pricing_details = self._calculate_price(validated_data, instance=instance)
            validated_data.update(pricing_details)

        return super().update(instance, validated_data)
