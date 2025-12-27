from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer, AdminBookingSerializer
from accounts.permissions import IsAdminOrVendorRole

class BookingAdminViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related('vehicle', 'customer').all().order_by('-created_at')
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AdminBookingSerializer
        return BookingSerializer

class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save(customer=request.user)
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.select_related('vehicle', 'customer').filter(customer=self.request.user)

class BookingCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, customer=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status not in ['pending', 'confirmed']:
            return Response({'error': 'Cannot cancel this booking'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = 'cancelled'
        booking.save()
        return Response({'message': 'Booking cancelled successfully'})

class VendorBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Booking.objects.select_related('vehicle', 'customer').all()
        return Booking.objects.select_related('vehicle', 'customer').filter(vehicle__vendor=self.request.user)

class BookingStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, vehicle__vendor=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        valid_transitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['active', 'cancelled'],
            'active': ['completed'],
        }

        if new_status not in valid_transitions.get(booking.status, []):
            return Response({'error': f'Invalid status transition from {booking.status} to {new_status}'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = new_status
        booking.save()
        return Response(BookingSerializer(booking).data)

class AllBookingsView(generics.ListAPIView):
    queryset = Booking.objects.select_related('vehicle', 'customer').all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAdminUser]

class BookingUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Booking.objects.select_related('vehicle', 'customer').all()
        return Booking.objects.select_related('vehicle', 'customer').filter(customer=user)

class VendorBookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Booking.objects.all()
        return Booking.objects.filter(vehicle__vendor=user)

class VendorBookingCreateView(generics.CreateAPIView):
    serializer_class = AdminBookingSerializer
    permission_classes = [IsAdminOrVendorRole]

    def perform_create(self, serializer):
        vehicle = serializer.validated_data['vehicle']
        user = self.request.user
        if not user.is_superuser and vehicle.vendor != user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only create bookings for your own vehicles.")
        serializer.save()