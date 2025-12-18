import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vehicleAPI, reviewAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Car,
  Star,
  MapPin,
  Users,
  Fuel,
  Settings,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DoorClosed,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";

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
      console.error("Error loading vehicle:", error);
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
      navigate("/login");
      return;
    }
    if (!pickupDate || !returnDate) {
      alert("Please select pickup and return dates");
      return;
    }
    navigate("/booking", {
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Car className="mx-auto mb-4 h-16 w-16 text-neutral-400" />
          <h2 className="text-xl font-semibold text-neutral-900">
            Vehicle not found
          </h2>
        </div>
      </div>
    );
  }

  const images = vehicle.images || [];

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="mb-6 p-4">
              <div className="relative h-96 overflow-hidden rounded-lg bg-neutral-100">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImage]?.image}
                      alt={vehicle.name}
                      className="h-full w-full object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImage((prev) =>
                              prev > 0 ? prev - 1 : images.length - 1,
                            )
                          }
                          className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 transition-colors hover:bg-white"
                        >
                          <ChevronLeft className="h-6 w-6 text-neutral-700" />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImage((prev) =>
                              prev < images.length - 1 ? prev + 1 : 0,
                            )
                          }
                          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 transition-colors hover:bg-white"
                        >
                          <ChevronRight className="h-6 w-6 text-neutral-700" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Car className="h-24 w-24 text-neutral-300" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto p-2">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImage(index)}
                      className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                        currentImage === index
                          ? "border-primary"
                          : "border-neutral-200 hover:border-neutral-300"
                      } transition-colors`}
                    >
                      <img
                        src={img.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Vehicle Info */}
            <Card className="mb-6 p-6">
              <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
                <div>
                  <h1 className="mb-1 text-3xl font-bold text-neutral-900">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-lg text-neutral-600">{vehicle.year}</p>
                </div>
                {vehicle.rating > 0 && (
                  <div className="bg-primary-light/10 flex items-center rounded-full px-3 py-1 text-sm">
                    <Star className="mr-1 h-4 w-4 fill-current text-yellow-500" />
                    <span className="font-semibold text-neutral-800">
                      {vehicle.rating}
                    </span>
                    <span className="ml-1 text-neutral-500">
                      ({vehicle.total_reviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6 flex items-center text-base text-neutral-600">
                <MapPin className="mr-2 h-5 w-5 text-neutral-400" />
                {vehicle.location}
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-center">
                  <Settings className="text-primary mx-auto mb-2 h-6 w-6" />
                  <p className="text-sm text-neutral-600">Transmission</p>
                  <p className="font-semibold text-neutral-800 capitalize">
                    {vehicle.transmission}
                  </p>
                </div>
                <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-center">
                  <Users className="text-primary mx-auto mb-2 h-6 w-6" />
                  <p className="text-sm text-neutral-600">Seats</p>
                  <p className="font-semibold text-neutral-800">
                    {vehicle.seats}
                  </p>
                </div>
                <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-center">
                  <Fuel className="text-primary mx-auto mb-2 h-6 w-6" />
                  <p className="text-sm text-neutral-600">Fuel Type</p>
                  <p className="font-semibold text-neutral-800 capitalize">
                    {vehicle.fuel_type}
                  </p>
                </div>
                <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-center">
                  <DoorClosed className="text-primary mx-auto mb-2 h-6 w-6" />
                  <p className="text-sm text-neutral-600">Doors</p>
                  <p className="font-semibold text-neutral-800">
                    {vehicle.doors}
                  </p>
                </div>
              </div>

              {vehicle.description && (
                <div className="mb-6">
                  <h2 className="mb-3 text-xl font-semibold text-neutral-900">
                    Description
                  </h2>
                  <p className="leading-relaxed text-neutral-700">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h2 className="mb-3 text-xl font-semibold text-neutral-900">
                    Features
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700"
                      >
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
                <h2 className="mb-4 text-xl font-semibold text-neutral-900">
                  Reviews ({reviews.length})
                </h2>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <span className="font-semibold text-neutral-800">
                          {review.user_name || "Anonymous"}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-current text-yellow-500"
                                  : "text-neutral-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="leading-relaxed text-neutral-700">
                        {review.comment}
                      </p>
                      <p className="mt-2 text-xs text-neutral-500">
                        Reviewed on{" "}
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Booking / Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <div className="mb-6 text-center">
                <span className="text-primary text-4xl font-bold">
                  ${vehicle.price_per_day}
                </span>
                <span className="text-neutral-600">/day</span>
              </div>

              <div className="mb-6 space-y-4">
                <div>
                  <label
                    htmlFor="pickupDate"
                    className="mb-1 block text-sm font-medium text-neutral-900"
                  >
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
                    className="focus:ring-primary-light focus:border-primary w-full rounded-md border border-neutral-300 px-4 py-3 text-sm transition-shadow focus:ring-2"
                    placeholderText="Select pickup date"
                  />
                </div>
                <div>
                  <label
                    htmlFor="returnDate"
                    className="mb-1 block text-sm font-medium text-neutral-900"
                  >
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
                    className="focus:ring-primary-light focus:border-primary w-full rounded-md border border-neutral-300 px-4 py-3 text-sm transition-shadow focus:ring-2"
                    placeholderText="Select return date"
                  />
                </div>
              </div>

              {pickupDate && returnDate && (
                <div className="mt-4 border-t border-neutral-200 pt-4">
                  <div className="mb-2 flex justify-between text-neutral-700">
                    <span>
                      ${vehicle.price_per_day} x{" "}
                      {Math.ceil(
                        (returnDate - pickupDate) / (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-neutral-900">
                    <span>Total</span>
                    <span className="text-primary">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <Button onClick={handleBooking} className="mt-6 w-full">
                {user ? "Book Now" : "Sign in to Book"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
