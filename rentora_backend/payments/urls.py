from django.urls import path
from .views import (
    WalletView, WalletTransactionsView, WalletTopUpView,
    PaymentCreateView, PaymentHistoryView,
    PromoCodeListView, PromoCodeValidateView
)

urlpatterns = [
    path('create/', PaymentCreateView.as_view(), name='payment_create'),
    path('history/', PaymentHistoryView.as_view(), name='payment_history'),
    path('wallet/', WalletView.as_view(), name='wallet'),
    path('wallet/transactions/', WalletTransactionsView.as_view(), name='wallet_transactions'),
    path('wallet/topup/', WalletTopUpView.as_view(), name='wallet_topup'),
    path('promo-codes/', PromoCodeListView.as_view(), name='promo_code_list'),
    path('promo-codes/validate/', PromoCodeValidateView.as_view(), name='promo_code_validate'),
]
