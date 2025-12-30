import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import StripePaymentForm from '../components/StripePaymentForm';
import paymentsService from '../services/paymentsService';
import bookingsService from '../services/bookingsService';
import LoadingSpinner from '../components/LoadingSpinner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePaymentPage = () => {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Booking = source of truth
        const bookingData = await bookingsService.getBookingDetails(bookingId);
        setBooking(bookingData);

        // 2️⃣ Stripe PaymentIntent
        const paymentData = await paymentsService.createPaymentIntent(bookingId);
        setClientSecret(paymentData.client_secret);
      } catch (err) {
        console.error(err);
        setError('Failed to load payment details.');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) loadData();
  }, [bookingId]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center text-red-600 font-medium mt-10">
        {error}
      </div>
    );
  }
return (
  <div className="bg-gray-50 min-h-screen py-12 px-4">
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Complete Your Payment
        </h1>
        <p className="text-gray-500 mt-1">
          Review your booking and securely complete payment
        </p>
      </div>

      {/* Booking Summary */}
<div className="card shadow-sm mb-4">
  <div className="card-body">
    <h5 className="card-title mb-4">Booking Summary</h5>

    <div className="row mb-2">
      <div className="col-6 text-muted">Vehicle</div>
      <div className="col-6 fw-semibold">
        {booking.vehicle_details.name}
      </div>
    </div>

    <div className="row mb-2">
      <div className="col-6 text-muted">Duration</div>
      <div className="col-6 fw-semibold">
        {booking.total_days} day(s)
      </div>
    </div>

    <div className="row mb-2">
      <div className="col-6 text-muted">Base price</div>
      <div className="col-6 fw-semibold">
        ${booking.base_price}
      </div>
    </div>

    {booking.discount_amount > 0 && (
      <div className="row mb-2">
        <div className="col-6 text-muted">Discount</div>
        <div className="col-6 fw-semibold text-success">
          -${booking.discount_amount}
        </div>
      </div>
    )}

    <hr />

    <div className="row">
      <div className="col-6 fw-bold fs-5">Total</div>
      <div className="col-6 fw-bold fs-5 text-primary text-end">
        ${booking.final_price}
      </div>
    </div>
  </div>
</div>

      {/* Promo Code */}
      {booking.promo_code_str && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-700">
            Promo code applied:
            <span className="ml-2 font-mono font-semibold">
              {booking.promo_code_str}
            </span>
          </p>
        </div>
      )}

      {/* Payment */}
      {clientSecret && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Payment Details
          </h2>

          <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: { theme: 'stripe' },
            }}
          >
            <StripePaymentForm
              clientSecret={clientSecret}
              amount={booking.final_price}
            />
          </Elements>

          <p className="text-sm text-gray-500 text-center mt-4">
            You will be charged <b>${booking.final_price}</b>
          </p>
        </div>
      )}
    </div>
  </div>
);

};

export default StripePaymentPage;
