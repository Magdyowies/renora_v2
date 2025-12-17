from django.urls import path
from .views import (
    DashboardStatsView, RevenueChartView, BookingChartView,
    AdminUserListView, AdminVehicleListView, AdminReportListView,
    HealthCheckView
)

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health_check'),
    path('admin/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('admin/revenue-chart/', RevenueChartView.as_view(), name='revenue_chart'),
    path('admin/booking-chart/', BookingChartView.as_view(), name='booking_chart'),
    # path('admin/users/', AdminUserListView.as_view(), name='admin_users'), # Removed due to conflict
    path('admin/vehicles/', AdminVehicleListView.as_view(), name='admin_vehicles'),
    path('admin/reports/', AdminReportListView.as_view(), name='admin_reports'),
]
