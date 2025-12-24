from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets # Import viewsets
from rest_framework import generics, permissions,filters
from rest_framework.views import APIView

from .models import Vehicle, VehicleCategory, VehicleImage
from .serializers import (
    VehicleListSerializer, VehicleDetailSerializer, VehicleCreateSerializer,
    VehicleCategorySerializer, VehicleImageSerializer, AdminVehicleSerializer,
    AdminVehicleListSerializer
)
from accounts.permissions import IsAdminRole


class AdminVehicleListView(generics.ListAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = AdminVehicleListSerializer
    permission_classes = [IsAdminRole]


class IsVendorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ['vendor', 'admin']

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.vendor == request.user or request.user.role == 'admin'


class VehicleCategoryListView(generics.ListCreateAPIView):
    queryset = VehicleCategory.objects.all()
    serializer_class = VehicleCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class VehicleListView(generics.ListAPIView):
    queryset = Vehicle.objects.filter(status='available')
    serializer_class = VehicleListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'brand', 'model', 'location']
    ordering_fields = ['price_per_day', 'rating', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        transmission = self.request.query_params.get('transmission')
        fuel_type = self.request.query_params.get('fuel_type')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        location = self.request.query_params.get('location')
        seats = self.request.query_params.get('seats')

        if category:
            queryset = queryset.filter(category_id=category)
        if transmission:
            queryset = queryset.filter(transmission=transmission)
        if fuel_type:
            queryset = queryset.filter(fuel_type=fuel_type)
        if min_price:
            queryset = queryset.filter(price_per_day__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_day__lte=max_price)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if seats:
            queryset = queryset.filter(seats__gte=seats)

        return queryset


class VehicleSearchView(VehicleListView):
    def post(self, request, *args, **kwargs):
        # This is a bit of a hack to reuse the filtering logic from VehicleListView
        # We're taking the POST body and putting it into the query_params
        # so that get_queryset works as expected.
        self.request.query_params = request.data
        return self.list(request, *args, **kwargs)


class VehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    permission_classes = [IsVendorOrAdmin]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return VehicleCreateSerializer
        return VehicleDetailSerializer


class VehicleCreateView(generics.CreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleCreateSerializer
    permission_classes = [IsVendorOrAdmin]


class VendorVehiclesView(generics.ListAPIView):
    serializer_class = VehicleListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(vendor=self.request.user)


class VehicleImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsVendorOrAdmin]

    def post(self, request, pk):
        try:
            vehicle = Vehicle.objects.get(pk=pk)
        except Vehicle.DoesNotExist:
            return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)

        if vehicle.vendor != request.user and request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        images = request.FILES.getlist('images')
        is_primary = request.data.get('is_primary', 'false').lower() == 'true'

        created_images = []
        for i, image in enumerate(images):
            img = VehicleImage.objects.create(
                vehicle=vehicle,
                image=image,
                is_primary=is_primary and i == 0
            )
            created_images.append(img)

        return Response(VehicleImageSerializer(created_images, many=True).data, status=status.HTTP_201_CREATED)


class VehicleImageDeleteView(generics.DestroyAPIView):
    queryset = VehicleImage.objects.all()
    permission_classes = [IsVendorOrAdmin]

    def get_object(self):
        return VehicleImage.objects.get(pk=self.kwargs['image_pk'], vehicle_id=self.kwargs['pk'])


from bookings.models import Booking
from datetime import datetime
import os
from django.conf import settings
from django.http import JsonResponse


class AdminVehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all().order_by('id')
    serializer_class = AdminVehicleSerializer
    permission_classes = [IsAdminRole]

    def perform_create(self, serializer):
        # When creating a vehicle from the admin dashboard,
        # the vendor should be the admin user creating it.
        # This can be changed if vehicles can be created for other vendors directly by admin.
        serializer.save(vendor=self.request.user)


class VehicleAvailabilityView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        try:
            vehicle = Vehicle.objects.get(pk=pk)
        except Vehicle.DoesNotExist:
            return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)

        start_date_str = request.data.get('startDate')
        end_date_str = request.data.get('endDate')

        if not start_date_str or not end_date_str:
            return Response({'error': 'Start date and end date are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start_date = datetime.fromisoformat(start_date_str).date()
            end_date = datetime.fromisoformat(end_date_str).date()
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)

        overlapping_bookings = Booking.objects.filter(
            vehicle=vehicle,
            start_date__lte=end_date,
            end_date__gte=start_date
        ).exclude(status='cancelled')

        if overlapping_bookings.exists():
            return Response({'available': False}, status=status.HTTP_200_OK)

        return Response({'available': True}, status=status.HTTP_200_OK)

