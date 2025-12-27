from django.urls import path
from .views import VendorDashboardView

urlpatterns = [
    path("vendor/", VendorDashboardView.as_view(), name="vendor-dashboard"),
]
