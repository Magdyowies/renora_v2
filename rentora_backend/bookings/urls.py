from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookingCreateView, MyBookingsView,
    BookingCancelView, VendorBookingsView, BookingStatusUpdateView,
    AllBookingsView, BookingAdminViewSet, BookingUpdateView, VendorBookingDetailView, VendorBookingCreateView
)

router = DefaultRouter()
router.register(r'admin-crud', BookingAdminViewSet, basename='booking-admin')

urlpatterns = [
    path('', include(router.urls)),
    path('create/', BookingCreateView.as_view(), name='booking_create'),
    path('my/', MyBookingsView.as_view(), name='my_bookings'),
    path('vendor/', VendorBookingsView.as_view(), name='vendor_bookings'),
    path('vendor/<int:pk>/', VendorBookingDetailView.as_view(), name='vendor_booking_detail'),
    path('vendor/create/', VendorBookingCreateView.as_view(), name='vendor_booking_create'),
    path('all/', AllBookingsView.as_view(), name='all_bookings'),
    path('<int:pk>/', BookingUpdateView.as_view(), name='booking_update'),
    path('<int:pk>/cancel/', BookingCancelView.as_view(), name='booking_cancel'),
    path('<int:pk>/status/', BookingStatusUpdateView.as_view(), name='booking_status_update'),
]
