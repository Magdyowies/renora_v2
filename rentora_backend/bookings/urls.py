from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookingCreateView, MyBookingsView, BookingDetailView,
    BookingCancelView, VendorBookingsView, BookingStatusUpdateView,
    AllBookingsView, BookingAdminViewSet
)

router = DefaultRouter()
router.register(r'admin-crud', BookingAdminViewSet, basename='booking-admin')

urlpatterns = [
    path('', include(router.urls)),
    path('create/', BookingCreateView.as_view(), name='booking_create'),
    path('my/', MyBookingsView.as_view(), name='my_bookings'),
    path('vendor/', VendorBookingsView.as_view(), name='vendor_bookings'),
    path('all/', AllBookingsView.as_view(), name='all_bookings'),
    path('<int:pk>/', BookingDetailView.as_view(), name='booking_detail'),
    path('<int:pk>/cancel/', BookingCancelView.as_view(), name='booking_cancel'),
    path('<int:pk>/status/', BookingStatusUpdateView.as_view(), name='booking_status_update'),
]
