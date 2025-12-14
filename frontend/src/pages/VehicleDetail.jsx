import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Car, Star, MapPin, Users, Fuel, Settings, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Vehicle not found</h2>
        </div>
      </div>
    );
  }

  const images = vehicle.images || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-200">
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
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImage(index)}
                      className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
                        currentImage === index ? 'ring-2 ring-primary-600' : ''
                      }`}
                    >
                      <img src={img.image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-gray-500">{vehicle.year}</p>
                </div>
                {vehicle.rating > 0 && (
                  <div className="flex items-center bg-primary-50 px-3 py-2 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{vehicle.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({vehicle.total_reviews} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                {vehicle.location}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Settings className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-semibold capitalize">{vehicle.transmission}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-semibold">{vehicle.seats}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Fuel className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-semibold capitalize">{vehicle.fuel_type}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Car className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <p className="text-sm text-gray-500">Doors</p>
                  <p className="font-semibold">{vehicle.doors}</p>
                </div>
              </div>

              {vehicle.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>
              )}

              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {reviews.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{review.user_name || 'Anonymous'}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-primary-600">${vehicle.price_per_day}</span>
                <span className="text-gray-500">/day</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Pickup Date
                  </label>
                  <DatePicker
                    selected={pickupDate}
                    onChange={setPickupDate}
                    selectsStart
                    startDate={pickupDate}
                    endDate={returnDate}
                    minDate={new Date()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholderText="Select pickup date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Return Date
                  </label>
                  <DatePicker
                    selected={returnDate}
                    onChange={setReturnDate}
                    selectsEnd
                    startDate={pickupDate}
                    endDate={returnDate}
                    minDate={pickupDate || new Date()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholderText="Select return date"
                  />
                </div>
              </div>

              {pickupDate && returnDate && (
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>
                      ${vehicle.price_per_day} x {Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24))} days
                    </span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary-600">${calculateTotal()}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                {user ? 'Book Now' : 'Sign in to Book'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
