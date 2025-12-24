from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from accounts.permissions import IsAdminRole, IsAdminOrVendorRole # Import custom permission


class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class VehicleReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        vehicle_id = self.kwargs.get('vehicle_id')
        return Review.objects.filter(vehicle_id=vehicle_id)


class MyReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)


class AdminReviewListView(generics.ListAPIView):
    queryset = Review.objects.all().select_related('user', 'vehicle')
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminOrVendorRole]


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminRole]
