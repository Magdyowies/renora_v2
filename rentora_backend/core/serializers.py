from rest_framework import serializers
from .models import AdminReport


class AdminReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminReport
        fields = ['id', 'report_type', 'title', 'data', 'date_from', 'date_to', 'created_at']
        read_only_fields = ['id', 'created_at']
