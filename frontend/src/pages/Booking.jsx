import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI, paymentAPI } from '../services/api';
import { Car, Calendar, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, pickupDate, returnDate, totalDays, totalPrice } = location.state || {};
  
  const [formData, setFormData] = useState({
    pickup_location: vehicle?.location || '',
    return_location: vehicle?.location || '',
    promo_code: '',
    notes: '',
  });
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(totalPrice);
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!vehicle) {
    navigate('/vehicles');
    return null;
  }

  const validatePromoCode = async () => {
    if (!formData.promo_code) return;
    setPromoError('');
    try {
      const response = await paymentAPI.validatePromoCode(formData.promo_code, totalPrice);
      setDiscount(response.data.discount);
      setFinalPrice(response.data.final_amount);
    } catch (error) {
      setPromoError(error.response?.data?.error || 'Invalid promo code');
      setDiscount(0);
      setFinalPrice(totalPrice);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await bookingAPI.create({
        vehicle: vehicle.id,
        pickup_date: pickupDate,
        return_date: returnDate,
        pickup_location: formData.pickup_location,
        return_location: formData.return_location,
        promo_code: formData.promo_code,
        notes: formData.notes,
      });

      navigate(`/payment/${response.data.id}`);
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Pickup & Return</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pickup_location}
                      onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Return Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.return_location}
                      onChange={(e) => setFormData({ ...formData, return_location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Any special requirements..."
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  <Tag className="inline h-5 w-5 mr-2" />
                  Promo Code
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.promo_code}
                    onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter promo code"
                  />
                  <button
                    type="button"
                    onClick={validatePromoCode}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
                {discount > 0 && <p className="text-green-600 text-sm mt-2">Discount applied: -${discount}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Car className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-gray-500 text-sm">{vehicle.year}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center"><Calendar className="h-4 w-4 mr-2" /> Pickup</span>
                  <span>{format(new Date(pickupDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center"><Calendar className="h-4 w-4 mr-2" /> Return</span>
                  <span>{format(new Date(returnDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Duration</span>
                  <span>{totalDays} day(s)</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>${vehicle.price_per_day} x {totalDays} days</span>
                  <span>${totalPrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-bold text-xl pt-4 border-t">
                <span>Total</span>
                <span className="text-primary-600">${finalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
