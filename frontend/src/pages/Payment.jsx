import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI, paymentAPI } from '../services/api';
import { Wallet, CreditCard, CheckCircle } from 'lucide-react';

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [bookingId]);

  const loadData = async () => {
    try {
      const [bookingRes, walletRes] = await Promise.all([
        bookingAPI.getById(bookingId),
        paymentAPI.getWallet(),
      ]);
      setBooking(bookingRes.data);
      setWallet(walletRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await paymentAPI.create({
        booking: bookingId,
        method: paymentMethod,
      });
      setSuccess(true);
      setTimeout(() => navigate('/bookings'), 3000);
    } catch (error) {
      alert(error.response?.data?.error || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
          <p className="text-sm text-gray-500">Redirecting to bookings...</p>
        </div>
      </div>
    );
  }

  if (!booking || booking.status !== 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Booking</h2>
          <p className="text-gray-600">This booking cannot be paid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Payment</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle</span>
              <span>{booking.vehicle_details?.brand} {booking.vehicle_details?.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span>{booking.total_days} day(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price</span>
              <span>${booking.base_price}</span>
            </div>
            {booking.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${booking.discount_amount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-primary-600">${booking.total_price}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          
          <div className="space-y-3">
            <label
              className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                paymentMethod === 'wallet' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={() => setPaymentMethod('wallet')}
                className="sr-only"
              />
              <Wallet className="h-6 w-6 mr-3 text-primary-600" />
              <div className="flex-1">
                <p className="font-medium">Wallet</p>
                <p className="text-sm text-gray-500">Balance: ${wallet?.balance || 0}</p>
              </div>
              {paymentMethod === 'wallet' && <CheckCircle className="h-5 w-5 text-primary-600" />}
            </label>

            <label
              className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                paymentMethod === 'stripe' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={() => setPaymentMethod('stripe')}
                className="sr-only"
              />
              <CreditCard className="h-6 w-6 mr-3 text-primary-600" />
              <div className="flex-1">
                <p className="font-medium">Credit/Debit Card</p>
                <p className="text-sm text-gray-500">Pay securely with Stripe</p>
              </div>
              {paymentMethod === 'stripe' && <CheckCircle className="h-5 w-5 text-primary-600" />}
            </label>
          </div>

          {paymentMethod === 'wallet' && wallet?.balance < parseFloat(booking.total_price) && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Insufficient wallet balance. Please top up your wallet or choose another payment method.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handlePayment}
          disabled={processing || (paymentMethod === 'wallet' && wallet?.balance < parseFloat(booking.total_price))}
          className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay $${booking.total_price}`}
        </button>
      </div>
    </div>
  );
}
