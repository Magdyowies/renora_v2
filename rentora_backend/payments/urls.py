from django.urls import path
from .views import (
    WalletView, WalletTransactionsView, WalletTopUpView,
    PaymentCreateView, PaymentHistoryView,
    PromoCodeListView, PromoCodeValidateView, PromoCodeDetailView,
    StripeWebhookView, PaymentVerifyView, CreatePaymentIntentView,
    StripePaymentVerifyView
)

urlpatterns = [
    path('', PaymentHistoryView.as_view(), name='payment_list'), # Added for root access
    path('create/', PaymentCreateView.as_view(), name='payment_create'),
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create_payment_intent'),
    path('verify-payment/', StripePaymentVerifyView.as_view(), name='verify_payment'),
    path('history/', PaymentHistoryView.as_view(), name='payment_history'),
    path('wallet/', WalletView.as_view(), name='wallet'),
    path('wallet/transactions/', WalletTransactionsView.as_view(), name='wallet_transactions'),
    path('wallet/topup/', WalletTopUpView.as_view(), name='wallet_topup'),
    path('promo-codes/', PromoCodeListView.as_view(), name='promo_code_list'),
    path('promo-codes/<int:pk>/', PromoCodeDetailView.as_view(), name='promo_code_detail'),
    path('promo-codes/validate/', PromoCodeValidateView.as_view(), name='promo_code_validate'),
    path('webhook/stripe/', StripeWebhookView.as_view(), name='stripe_webhook'),
    path('verify/<str:transactionId>/', PaymentVerifyView.as_view(), name='payment_verify'),
]