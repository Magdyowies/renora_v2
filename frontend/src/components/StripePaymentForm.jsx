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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (paymentError) {
      setError(paymentError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await paymentsService.verifyPayment(paymentIntent.id);
        toast.success('Payment successful! Your booking is confirmed.');
        navigate('/my-bookings');
      } catch (verificationError) {
        setError('Payment succeeded, but verification failed. Please contact support.');
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded">
        <CardElement options={{style: {base: {fontSize: '16px'}}}} />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {processing ? 'Processing...' : 'Pay'}
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};

export default StripePaymentForm;