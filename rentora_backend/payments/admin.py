from django.contrib import admin
from .models import Wallet, WalletTransaction, Payment, PromoCode

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'updated_at')
    search_fields = ('user__username',)

@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ('wallet', 'transaction_type', 'amount', 'created_at')
    list_filter = ('transaction_type',)
    search_fields = ('wallet__user__username', 'reference_id')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'booking', 'method', 'status', 'amount', 'created_at')
    list_filter = ('method', 'status')
    search_fields = ('id', 'user__username', 'booking__id', 'transaction_id')
    raw_id_fields = ('user', 'booking')

@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'is_active', 'valid_until', 'usage_limit', 'used_count')
    list_filter = ('is_active', 'discount_type')
    search_fields = ('code',)