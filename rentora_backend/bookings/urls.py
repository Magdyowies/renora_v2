from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    BookingCreateView,
    MyBookingsView,
    BookingCancelView,
    VendorBookingsView,
    BookingStatusUpdateView,
    AllBookingsView,
    BookingAdminViewSet,
    BookingUpdateView,
    VendorBookingCreateView,
    StripePaymentVerifyView,
)

router = DefaultRouter()
router.register(r'admin-crud', BookingAdminViewSet, basename='booking-admin')

urlpatterns = [
    # Admin CRUD
    path('', include(router.urls)),

    # Customer
    path('create/', BookingCreateView.as_view(), name='booking_create'),
    path('my/', MyBookingsView.as_view(), name='my_bookings'),
    path('<int:pk>/', BookingUpdateView.as_view(), name='booking_update'),
    path('<int:pk>/cancel/', BookingCancelView.as_view(), name='booking_cancel'),

    # Payments
    path('payments/verify/', StripePaymentVerifyView.as_view(), name='stripe_verify_payment'),

    # Vendor
    path('vendor/', VendorBookingsView.as_view(), name='vendor_bookings'),
    path('vendor/create/', VendorBookingCreateView.as_view(), name='vendor_booking_create'),
    path('<int:pk>/status/', BookingStatusUpdateView.as_view(), name='booking_status_update'),

    # Admin
    path('all/', AllBookingsView.as_view(), name='all_bookings'),
]
