from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'vehicle', 'status', 'pickup_date', 'return_date', 'final_price')
    list_filter = ('status', 'pickup_date', 'return_date')
    search_fields = ('id', 'customer__username', 'vehicle__name')
    raw_id_fields = ('customer', 'vehicle', 'promo_code')