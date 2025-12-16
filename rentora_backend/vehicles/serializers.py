from rest_framework import serializers
from .models import Vehicle, VehicleCategory, VehicleImage


class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ['id', 'image', 'is_primary', 'created_at']


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
            'status', 'rating', 'total_reviews', 'primary_image', 'vendor_name'
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
    vendor_name = serializers.CharField(source='vendor.get_full_name', read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'brand', 'model', 'year', 'category', 'transmission',
            'fuel_type', 'seats', 'doors', 'price_per_day', 'location',
            'description', 'features', 'status', 'rating', 'total_reviews',
            'images', 'vendor_name', 'created_at'
        ]


class VehicleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            'name', 'brand', 'model', 'year', 'category', 'transmission',
            'fuel_type', 'seats', 'doors', 'price_per_day', 'location',
            'description', 'features'
        ]

    def create(self, validated_data):
        validated_data['vendor'] = self.context['request'].user
        return super().create(validated_data)
