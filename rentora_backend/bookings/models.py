from django.db import models
from django.conf import settings
from vehicles.models import Vehicle
from django.core.exceptions import ValidationError

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='bookings')
    pickup_date = models.DateTimeField()
    return_date = models.DateTimeField()
    pickup_location = models.CharField(max_length=255)
    return_location = models.CharField(max_length=255)
    total_days = models.IntegerField(default=0)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    promo_code = models.ForeignKey('payments.PromoCode', null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking {self.id} by {self.customer.username} for {self.vehicle.name}"

    def clean(self):
        if self.pickup_date and self.return_date and self.pickup_date >= self.return_date:
            raise ValidationError('Return date must be after pickup date.')
    
    def save(self, *args, **kwargs):
        # Ensure total_days is calculated before saving if dates are present
        if self.pickup_date and self.return_date:
            self.total_days = (self.return_date - self.pickup_date).days
            if self.total_days < 1:  # Minimum one day booking
                self.total_days = 1
        
        # Ensure base_price and total_price are calculated if not set, or re-calculated if vehicle/dates change
        if self.vehicle and self.total_days:
            calculated_base_price = self.vehicle.price_per_day * self.total_days
            if self.base_price != calculated_base_price:
                self.base_price = calculated_base_price
            
            # Recalculate total_price considering discount
            self.total_price = self.base_price - self.discount_amount

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
