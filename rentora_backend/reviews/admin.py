from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'vehicle', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('user__username', 'vehicle__name')
    raw_id_fields = ('booking', 'user', 'vehicle')