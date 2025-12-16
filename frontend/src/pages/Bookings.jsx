import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { Car, Calendar, MapPin, Star } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      loadBookings();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const getStatusPill = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-neutral-200 text-neutral-700', // Adjusted to neutral
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${styles[status] || styles.completed}`}>
        {status}
      </span>
    );
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">My Bookings</h1>
        </header>

        <div className="flex gap-2 mb-8 border-b border-neutral-200 pb-2 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? 'primary' : 'ghost'}
              className="px-4 py-2 text-sm capitalize whitespace-nowrap"
            >
              {status}
            </Button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <Card className="p-12 text-center">
            <Car className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No {filter !== 'all' && filter} bookings found</h3>
            <p className="text-neutral-600 mb-6">Start exploring our vehicles to make your first booking.</p>
            <Button as={Link} to="/vehicles" variant="primary">
              Browse Vehicles
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-lg font-bold text-neutral-900">
                        {booking.vehicle_details?.brand} {booking.vehicle_details?.model}
                      </h3>
                      <p className="text-sm text-neutral-600">Booking #{booking.id}</p>
                    </div>
                    {getStatusPill(booking.status)}
                  </div>

                  <div className="border-t border-neutral-200 pt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-neutral-700">Pickup</p>
                        <p className="text-neutral-800">{format(new Date(booking.pickup_date), 'MMM dd, yyyy, p')}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-neutral-700">Return</p>
                        <p className="text-neutral-800">{format(new Date(booking.return_date), 'MMM dd, yyyy, p')}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-neutral-700">Pickup Location</p>
                        <p className="text-neutral-800">{booking.pickup_location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center">
                    <div>
                      <span className="text-neutral-600">Total Price:</span>
                      <span className="text-xl font-bold text-neutral-900 ml-2">${booking.total_price}</span>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      {['pending', 'confirmed'].includes(booking.status) && (
                        <Button onClick={() => handleCancel(booking.id)} variant="secondary" className="px-4 py-2 text-sm">
                          Cancel
                        </Button>
                      )}
                      {booking.status === 'pending' && (
                        <Button as={Link} to={`/payment/${booking.id}`} variant="primary" className="px-4 py-2 text-sm">
                          Pay Now
                        </Button>
                      )}
                      {booking.status === 'completed' && !booking.review && (
                        <Button as={Link} to={`/review/${booking.id}`} variant="primary" className="px-4 py-2 text-sm inline-flex items-center">
                          <Star className="h-4 w-4 mr-1" />
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
