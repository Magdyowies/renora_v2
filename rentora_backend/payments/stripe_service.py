# rentora_backend/payments/stripe_service.py

import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_payment_intent(amount: float, booking_id: int, user_id: int):
    """
    Creates a Stripe Payment Intent for a given amount, booking, and user.

    Parameters
    ----------
    amount : float
        The amount in decimal dollars (e.g., 10.50).
    booking_id : int
        The ID of the booking associated with this payment.
    user_id : int
        The ID of the user making the payment.

    Returns
    -------
    stripe.PaymentIntent
        The created Stripe PaymentIntent object.
    """
    # Convert amount from dollars to cents, as Stripe expects the amount in the smallest currency unit.
    amount_cents = int(amount * 100)

    payment_intent = stripe.PaymentIntent.create(
    amount=amount_cents,
    currency='usd',
    payment_method_types=['card'],
    metadata={
        'booking_id': str(booking_id),
        'user_id': str(user_id),
    },
)
    return payment_intent
