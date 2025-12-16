from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    vehicle_name = serializers.CharField(source='vehicle.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'booking', 'user_name', 'vehicle_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user_name', 'vehicle_name', 'created_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['booking', 'rating', 'comment']

    def validate_booking(self, value):
        user = self.context['request'].user
        if value.customer != user:
            raise serializers.ValidationError("You can only review your own bookings")
        if value.status != 'completed':
            raise serializers.ValidationError("You can only review completed bookings")
        if hasattr(value, 'review'):
            raise serializers.ValidationError("You have already reviewed this booking")
        return value

    def create(self, validated_data):
        booking = validated_data['booking']
        review = Review.objects.create(
            booking=booking,
            user=self.context['request'].user,
            vehicle=booking.vehicle,
            rating=validated_data['rating'],
            comment=validated_data.get('comment', '')
        )

        vehicle = booking.vehicle
        reviews = Review.objects.filter(vehicle=vehicle)
        vehicle.total_reviews = reviews.count()
        vehicle.rating = sum(r.rating for r in reviews) / vehicle.total_reviews
        vehicle.save()

        return review
