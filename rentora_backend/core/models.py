from django.db import models
from django.conf import settings

class AdminReport(models.Model):
    REPORT_TYPE_CHOICES = [
        ('booking', 'Booking Report'),
        ('revenue', 'Revenue Report'),
        ('user', 'User Report'),
        ('vehicle', 'Vehicle Report'),
    ]

    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    data = models.JSONField(default=dict)
    date_from = models.DateField()
    date_to = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'admin_reports'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.report_type} - {self.title}"
