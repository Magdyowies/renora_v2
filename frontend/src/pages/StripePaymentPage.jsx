import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm';
import paymentsService from '../services/paymentsService';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const StripePaymentPage = () => {
  const { bookingId } = useParams(); 
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        setLoading(true);
        const data = await paymentsService.createPaymentIntent(bookingId); 
        setClientSecret(data.client_secret);
      } catch (err) {
        console.error(err);
        setError('Failed to create payment intent.');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchPaymentIntent();
    }
  }, [bookingId]); 

  if (loading) {
    return <div>Loading payment details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Complete Your Payment</h1>

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: { theme: 'stripe' } }}
        >
          <StripePaymentForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
};

export default StripePaymentPage;
