import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Car, Star, MapPin, Users, Fuel, Settings, Calendar, ChevronLeft, ChevronRight, DoorClosed } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [vehicleRes, reviewsRes] = await Promise.all([
        vehicleAPI.getById(id),
        reviewAPI.getByVehicle(id),
      ]);
      setVehicle(vehicleRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error loading vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!pickupDate || !returnDate || !vehicle) return 0;
    const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * parseFloat(vehicle.price_per_day) : 0;
  };

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!pickupDate || !returnDate) {
      alert('Please select pickup and return dates');
      return;
    }
    navigate('/booking', {
      state: {
        vehicle,
        pickupDate: pickupDate.toISOString(),
        returnDate: returnDate.toISOString(),
        totalDays: Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)),
        totalPrice: calculateTotal(),
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900">Vehicle not found</h2>
        </div>
      </div>
    );
  }

  const images = vehicle.images || [];

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="mb-6 p-4">
              <div className="relative h-96 bg-neutral-100 rounded-lg overflow-hidden">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImage]?.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="h-6 w-6 text-neutral-700" />
                        </button>
                        <button
                          onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <ChevronRight className="h-6 w-6 text-neutral-700" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-24 w-24 text-neutral-300" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 p-2 overflow-x-auto mt-4">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImage(index)}
                      className={`w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                        currentImage === index ? 'border-primary' : 'border-neutral-200 hover:border-neutral-300'
                      } transition-colors`}
                    >
                      <img src={img.image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Vehicle Info */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-1">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-neutral-600 text-lg">{vehicle.year}</p>
                </div>
                {vehicle.rating > 0 && (
                  <div className="flex items-center bg-primary-light/10 px-3 py-1 rounded-full text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-semibold text-neutral-800">{vehicle.rating}</span>
                    <span className="text-neutral-500 ml-1">({vehicle.total_reviews} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center text-neutral-600 mb-6 text-base">
                <MapPin className="h-5 w-5 mr-2 text-neutral-400" />
                {vehicle.location}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-neutral-50 p-4 rounded-md text-center border border-neutral-200">
                  <Settings className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-neutral-600">Transmission</p>
                  <p className="font-semibold capitalize text-neutral-800">{vehicle.transmission}</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-md text-center border border-neutral-200">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-neutral-600">Seats</p>
                  <p className="font-semibold text-neutral-800">{vehicle.seats}</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-md text-center border border-neutral-200">
                  <Fuel className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-neutral-600">Fuel Type</p>
                  <p className="font-semibold capitalize text-neutral-800">{vehicle.fuel_type}</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-md text-center border border-neutral-200">
                  <DoorClosed className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-neutral-600">Doors</p>
                  <p className="font-semibold text-neutral-800">{vehicle.doors}</p>
                </div>
              </div>

              {vehicle.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">Description</h2>
                  <p className="text-neutral-700 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Reviews ({reviews.length})</h2>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-neutral-800">{review.user_name || 'Anonymous'}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-500 fill-current' : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{review.comment}</p>
                      <p className="text-xs text-neutral-500 mt-2">Reviewed on {new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Booking / Price Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-primary">${vehicle.price_per_day}</span>
                <span className="text-neutral-600">/day</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="pickupDate" className="block text-sm font-medium text-neutral-900 mb-1">
                    Pickup Date
                  </label>
                  <DatePicker
                    id="pickupDate"
                    selected={pickupDate}
                    onChange={setPickupDate}
                    selectsStart
                    startDate={pickupDate}
                    endDate={returnDate}
                    minDate={new Date()}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow text-sm"
                    placeholderText="Select pickup date"
                  />
                </div>
                <div>
                  <label htmlFor="returnDate" className="block text-sm font-medium text-neutral-900 mb-1">
                    Return Date
                  </label>
                  <DatePicker
                    id="returnDate"
                    selected={returnDate}
                    onChange={setReturnDate}
                    selectsEnd
                    startDate={pickupDate}
                    endDate={returnDate}
                    minDate={pickupDate || new Date()}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow text-sm"
                    placeholderText="Select return date"
                  />
                </div>
              </div>

              {pickupDate && returnDate && (
                <div className="border-t border-neutral-200 pt-4 mt-4">
                  <div className="flex justify-between text-neutral-700 mb-2">
                    <span>
                      ${vehicle.price_per_day} x {Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24))} days
                    </span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-neutral-900">
                    <span>Total</span>
                    <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button onClick={handleBooking} className="w-full mt-6">
                {user ? 'Book Now' : 'Sign in to Book'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
