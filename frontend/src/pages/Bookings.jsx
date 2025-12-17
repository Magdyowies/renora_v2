import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingAPI } from "../services/api";
import { Car, Calendar, MapPin, Star } from "lucide-react";
import { format } from "date-fns";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingAPI.cancel(id);
      loadBookings();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to cancel booking");
    }
  };

  const getStatusPill = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-neutral-200 text-neutral-700", // Adjusted to neutral
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase ${styles[status] || styles.completed}`}
      >
        {status}
      </span>
    );
  };

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">My Bookings</h1>
        </header>

        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-neutral-200 pb-2">
          {[
            "all",
            "pending",
            "confirmed",
            "active",
            "completed",
            "cancelled",
          ].map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? "primary" : "ghost"}
              className="px-4 py-2 text-sm whitespace-nowrap capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <Card className="p-12 text-center">
            <Car className="mx-auto mb-4 h-16 w-16 text-neutral-400" />
            <h3 className="mb-2 text-xl font-semibold text-neutral-900">
              No {filter !== "all" && filter} bookings found
            </h3>
            <p className="mb-6 text-neutral-600">
              Start exploring our vehicles to make your first booking.
            </p>
            <Button as={Link} to="/vehicles" variant="primary">
              Browse Vehicles
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="p-5">
                  <div className="mb-4 flex flex-col justify-between sm:flex-row sm:items-center">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-lg font-bold text-neutral-900">
                        {booking.vehicle_details?.brand}{" "}
                        {booking.vehicle_details?.model}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Booking #{booking.id}
                      </p>
                    </div>
                    {getStatusPill(booking.status)}
                  </div>

                  <div className="grid gap-4 border-t border-neutral-200 pt-4 text-sm sm:grid-cols-2 md:grid-cols-3">
                    <div className="flex items-start">
                      <Calendar className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-neutral-400" />
                      <div>
                        <p className="font-semibold text-neutral-700">Pickup</p>
                        <p className="text-neutral-800">
                          {format(
                            new Date(booking.pickup_date),
                            "MMM dd, yyyy, p",
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-neutral-400" />
                      <div>
                        <p className="font-semibold text-neutral-700">Return</p>
                        <p className="text-neutral-800">
                          {format(
                            new Date(booking.return_date),
                            "MMM dd, yyyy, p",
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-neutral-400" />
                      <div>
                        <p className="font-semibold text-neutral-700">
                          Pickup Location
                        </p>
                        <p className="text-neutral-800">
                          {booking.pickup_location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col items-center justify-between border-t border-neutral-200 pt-4 sm:flex-row">
                    <div>
                      <span className="text-neutral-600">Total Price:</span>
                      <span className="ml-2 text-xl font-bold text-neutral-900">
                        ${booking.total_price}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2 sm:mt-0">
                      {["pending", "confirmed"].includes(booking.status) && (
                        <Button
                          onClick={() => handleCancel(booking.id)}
                          variant="secondary"
                          className="px-4 py-2 text-sm"
                        >
                          Cancel
                        </Button>
                      )}
                      {booking.status === "pending" && (
                        <Button
                          as={Link}
                          to={`/payment/${booking.id}`}
                          variant="primary"
                          className="px-4 py-2 text-sm"
                        >
                          Pay Now
                        </Button>
                      )}
                      {booking.status === "completed" && !booking.review && (
                        <Button
                          as={Link}
                          to={`/review/${booking.id}`}
                          variant="primary"
                          className="inline-flex items-center px-4 py-2 text-sm"
                        >
                          <Star className="mr-1 h-4 w-4" />
                          Write a Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
