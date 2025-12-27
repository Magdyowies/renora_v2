from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from vehicles.models import Vehicle
from bookings.models import Booking
from payments.models import Payment

User = get_user_model()


class VendorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Super admin sees everything
        if user.is_superuser:
            vehicles = Vehicle.objects.all()
            bookings = Booking.objects.all()
            payments = Payment.objects.filter(status="completed")
        else:
            vehicles = Vehicle.objects.filter(vendor=user)
            bookings = Booking.objects.filter(vehicle__vendor=user)
            payments = Payment.objects.filter(
                booking__vehicle__vendor=user,
                status="completed"
            )

        monthly_revenue = (
            payments
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )

        monthly_bookings = (
            bookings
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )

        data = {
            "total_users": None if not user.is_superuser else User.objects.count(),
            "total_vehicles": vehicles.count(),
            "total_bookings": bookings.count(),
            "total_revenue": payments.aggregate(
                total=Sum("amount")
            )["total"] or 0,
            "monthly_revenue": monthly_revenue,
            "monthly_bookings": monthly_bookings,
        }

        return Response(data)