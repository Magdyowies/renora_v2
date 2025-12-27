from rest_framework import serializers
from .models import Vehicle, VehicleCategory, VehicleImage


class AdminVehicleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'name']


class VehicleImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = VehicleImage
        fields = ("id", "image_url", "is_primary")

    def get_image_url(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return obj.image.url
        return obj.image_url


class VehicleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleCategory
        fields = ['id', 'name', 'description', 'icon']


class VehicleListSerializer(serializers.ModelSerializer):
    category = VehicleCategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    vendor_name = serializers.CharField(source='vendor.get_full_name', read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'brand', 'model', 'year', 'category', 'transmission',
            'fuel_type', 'seats', 'doors', 'price_per_day', 'location',
            'latitude', 'longitude', 'status', 'rating', 'total_reviews', 'primary_image', 'vendor_name'
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return VehicleImageSerializer(primary).data
        first_image = obj.images.first()
        if first_image:
            return VehicleImageSerializer(first_image).data
        return None


class VehicleDetailSerializer(serializers.ModelSerializer):
    category = VehicleCategorySerializer(read_only=True)
    images = VehicleImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    vendor_name = serializers.CharField(source='vendor.get_full_name', read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'brand', 'model', 'year', 'category', 'transmission',
            'fuel_type', 'seats', 'doors', 'price_per_day', 'location',
            'latitude', 'longitude', 'description', 'features', 'status', 'rating', 'total_reviews',
            'images', 'primary_image', 'vendor_name', 'created_at'
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return VehicleImageSerializer(primary).data
        first_image = obj.images.first()
        if first_image:
            return VehicleImageSerializer(first_image).data
        return None


class VehicleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'brand', 'model', 'year', 'category', 'transmission',
            'fuel_type', 'seats', 'doors', 'price_per_day', 'location',
            'latitude', 'longitude', 'description', 'features'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        validated_data['vendor'] = self.context['request'].user
        return super().create(validated_data)


class AdminVehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'brand', 'model', 'year', 'price_per_day',
            'latitude', 'longitude', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_year(self, value):
        if not (1900 <= value <= 2100): # Reasonable range for vehicle years
            raise serializers.ValidationError("Year must be between 1900 and 2100.")
        return value

    def validate_price_per_day(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price per day must be a positive number.")
        return value
