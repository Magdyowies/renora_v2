from django.contrib import admin
from .models import VehicleCategory, Vehicle, VehicleImage

@admin.register(VehicleCategory)
class VehicleCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

class VehicleImageInline(admin.TabularInline):
    model = VehicleImage
    extra = 1

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('name', 'vendor', 'category', 'status', 'price_per_day', 'rating')
    list_filter = ('status', 'category', 'transmission', 'fuel_type')
    search_fields = ('name', 'brand', 'model', 'vendor__username')
    inlines = [VehicleImageInline]

@admin.register(VehicleImage)
class VehicleImageAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'is_primary', 'created_at')
    list_filter = ('is_primary',)
    search_fields = ('vehicle__name',)