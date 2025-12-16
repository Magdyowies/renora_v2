import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI, paymentAPI } from '../services/api';
import { Car, Calendar, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


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

  useEffect(() => {
    if (!vehicle) {
      navigate('/vehicles');
    }
  }, [vehicle, navigate]);

  if (!vehicle) return null;

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
      const bookingData = {
        vehicle: vehicle.id,
        pickup_date: new Date(pickupDate).toISOString(),
        return_date: new Date(returnDate).toISOString(),
        pickup_location: formData.pickup_location,
        return_location: formData.return_location,
        promo_code: formData.promo_code,
        notes: formData.notes,
      };
      
      const response = await bookingAPI.create(bookingData);
      navigate(`/payment/${response.data.id}`);
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };
  
  const labelClasses = "block text-sm font-medium text-neutral-900 mb-1";
  const datePickerInputClasses = "w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow text-sm text-neutral-900";


  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Complete Your Booking</h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Side: Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-neutral-900 border-b border-neutral-200 pb-3">Pickup & Return Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pickup_location" className={labelClasses}>Pickup Location</label>
                    <Input type="text" id="pickup_location" name="pickup_location" required value={formData.pickup_location} onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })} icon={MapPin} />
                  </div>
                  <div>
                    <label htmlFor="return_location" className={labelClasses}>Return Location</label>
                    <Input type="text" id="return_location" name="return_location" required value={formData.return_location} onChange={(e) => setFormData({ ...formData, return_location: e.target.value })} icon={MapPin} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className={labelClasses}>Special Requests (Optional)</label>
                    <textarea id="notes" name="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows="3" className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow text-sm text-neutral-900" placeholder="Any special requirements..." />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-neutral-900 border-b border-neutral-200 pb-3">Promo Code</h2>
                <div className="flex gap-2 items-center">
                  <Input type="text" name="promo_code" value={formData.promo_code} onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })} className="flex-grow" placeholder="Enter promo code" icon={Tag} />
                  <Button type="button" onClick={validatePromoCode} variant="secondary" className="px-5 py-2.5">
                    Apply
                  </Button>
                </div>
                {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
                {discount > 0 && <p className="text-green-600 text-sm mt-2">Discount applied: -${discount.toFixed(2)}</p>}
              </Card>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </form>
          </div>

          {/* Right Side: Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-neutral-200 text-neutral-900">Booking Summary</h2>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-24 h-16 bg-neutral-100 rounded-md flex items-center justify-center overflow-hidden">
                  {vehicle.primary_image ? <img src={vehicle.primary_image.image} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-full object-cover" /> : <Car className="h-8 w-8 text-neutral-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-neutral-600 text-sm">{vehicle.year}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm border-b border-neutral-200 pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-700 flex items-center"><Calendar className="h-4 w-4 mr-2 text-neutral-500" /> Pickup</span>
                  <span className="text-neutral-900 font-semibold">{format(new Date(pickupDate), 'MMM dd, yyyy, p')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-700 flex items-center"><Calendar className="h-4 w-4 mr-2 text-neutral-500" /> Return</span>
                  <span className="text-neutral-900 font-semibold">{format(new Date(returnDate), 'MMM dd, yyyy, p')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-700">Duration</span>
                  <span className="text-neutral-900 font-semibold">{totalDays} Day(s)</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2 text-sm">
                <div className="flex justify-between text-neutral-700">
                  <span>Daily rate (${vehicle.price_per_day}) x {totalDays} days</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-bold text-xl text-neutral-900">
                <span>Total</span>
                <span className="text-primary">${finalPrice.toFixed(2)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
