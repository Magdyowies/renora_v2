from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from vehicles.models import Vehicle, VehicleCategory
from bookings.models import Booking
from payments.models import Payment
from .models import AdminReport
from .serializers import AdminReportSerializer

User = get_user_model()


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        month_start = today.replace(day=1)

        stats = {
            'total_users': User.objects.count(),
            'total_customers': User.objects.filter(role='customer').count(),
            'total_vendors': User.objects.filter(role='vendor').count(),
            'total_vehicles': Vehicle.objects.count(),
            'available_vehicles': Vehicle.objects.filter(status='available').count(),
            'total_bookings': Booking.objects.count(),
            'pending_bookings': Booking.objects.filter(status='pending').count(),
            'active_bookings': Booking.objects.filter(status='active').count(),
            'completed_bookings': Booking.objects.filter(status='completed').count(),
            'total_revenue': Payment.objects.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0,
            'monthly_revenue': Payment.objects.filter(
                status='completed',
                created_at__date__gte=month_start
            ).aggregate(Sum('amount'))['amount__sum'] or 0,
            'monthly_bookings': Booking.objects.filter(created_at__date__gte=month_start).count(),
        }

        return Response(stats)


class RevenueChartView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)

        data = []
        current_date = start_date
        while current_date <= end_date:
            daily_revenue = Payment.objects.filter(
                status='completed',
                created_at__date=current_date
            ).aggregate(Sum('amount'))['amount__sum'] or 0
            
            data.append({
                'date': current_date.isoformat(),
                'revenue': float(daily_revenue)
            })
            current_date += timedelta(days=1)

        return Response(data)


class BookingChartView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)

        data = []
        current_date = start_date
        while current_date <= end_date:
            daily_bookings = Booking.objects.filter(created_at__date=current_date).count()
            data.append({
                'date': current_date.isoformat(),
                'bookings': daily_bookings
            })
            current_date += timedelta(days=1)

        return Response(data)


class AdminUserListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.all().values(
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'is_active', 'date_joined'
        )
        return Response(list(users))


class AdminVehicleListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        vehicles = Vehicle.objects.select_related('vendor', 'category').values(
            'id', 'name', 'brand', 'model', 'year', 'price_per_day',
            'status', 'location', 'vendor__username', 'category__name',
            'rating', 'total_reviews'
        )
        return Response(list(vehicles))


class AdminReportListView(generics.ListCreateAPIView):
    queryset = AdminReport.objects.all()
    serializer_class = AdminReportSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)


class HealthCheckView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({'status': 'healthy', 'message': 'Rentora API is running'})
