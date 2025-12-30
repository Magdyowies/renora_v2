import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import paymentsService from '../services/paymentsService';
import toast from 'react-hot-toast';

const StripePaymentForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || processing) return;

    setProcessing(true);
    setError(null);

    const card = elements.getElement(CardElement);

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await paymentsService.verifyPayment(paymentIntent.id);
        toast.success('Payment successful!');
        navigate('/my-bookings');
      } catch {
        setError('Payment verified failed. Contact support.');
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Card input */}
      <div className="mb-3 p-3 border rounded bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#212529',
                '::placeholder': { color: '#6c757d' },
              },
            },
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger py-2 text-center">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-success w-100 fw-bold"
      >
        {processing ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  );
};

export default StripePaymentForm;
  