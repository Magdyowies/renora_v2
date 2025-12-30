import api from './api';

const getWalletBalance = async () => {
  try {
    const response = await api.get('/payments/wallet/');
    // Expected response: { "balance": number, "currency": "EGP" }
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};

const getWalletTransactions = async () => {
  try {
    const response = await api.get('/payments/wallet/transactions/');
    // Expected response: array of transaction objects
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    throw error;
  }
};

const getPaymentHistory = async () => {
  try {
    const response = await api.get('/payments/history/');
    // Expected response: array of payment objects
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

const validatePromoCode = async (code, booking_amount) => {
  try {
    const response = await api.post('/payments/promo-codes/validate/', {
      code,
      booking_amount,
    });
    // Expected response: { "valid": boolean, "discount_amount": number, "final_amount": number, "message": string }
    return response.data;
  } catch (error) {
    console.error('Error validating promo code:', error);
    throw error;
  }
};

const createPayment = async (booking_id, method, promo_code = null) => {
  try {
    const response = await api.post('/payments/create/', {
      booking_id,
      method,
      promo_code,
    });
    // Expected response: { "payment_id": number, "status": "pending | completed", "redirect_url": string | null }
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    console.error('Payment creation error details:', error.response?.data || error.message);
    throw error;
  }
};

const createPaymentIntent = async (booking_id) => {
  try {
    const response = await api.post('/payments/create-payment-intent/', {
      booking_id,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

const verifyPayment = async (payment_intent_id) => {
  try {
    const response = await api.post('/bookings/payments/verify/', {
      payment_intent_id,
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

const paymentsService = {
  getWalletBalance,
  getWalletTransactions,
  getPaymentHistory,
  validatePromoCode,
  createPayment,
  createPaymentIntent,
  verifyPayment,
};

export default paymentsService;

