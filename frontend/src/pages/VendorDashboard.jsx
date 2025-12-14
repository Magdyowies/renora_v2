import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, DollarSign, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { vehicleAPI, bookingAPI } from '../services/api';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalVehicles: 0, activeBookings: 0, totalEarnings: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([
        vehicleAPI.getMyVehicles(),
        bookingAPI.getVendorBookings()
      ]);
      
      const vehiclesData = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : (vehiclesRes.data?.results || []);
      const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : (bookingsRes.data?.results || []);
      
      setVehicles(vehiclesData);
      setBookings(bookingsData);
      
      const activeBookings = bookingsData.filter(b => ['confirmed', 'active'].includes(b.status)).length;
      const totalEarnings = bookingsData
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);
      
      setStats({
        totalVehicles: vehiclesData.length,
        activeBookings,
        totalEarnings
      });
    } catch (error) {
      console.error('Failed to load vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status);
      loadData();
    } catch (error) {
      alert('Failed to update booking status');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Vehicles</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalVehicles}</p>
              </div>
              <Car className="h-12 w-12 text-primary-200" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Active Bookings</p>
                <p className="text-3xl font-bold text-blue-600">{stats.activeBookings}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">${stats.totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-200" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`px-6 py-4 font-medium ${activeTab === 'vehicles' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                My Vehicles
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-4 font-medium ${activeTab === 'bookings' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Bookings
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'vehicles' && (
              <div>
                {vehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No vehicles listed yet</p>
                    <p className="text-sm text-gray-500">Contact support to add vehicles to your listing</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vehicle</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price/Day</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {vehicles.map((vehicle) => (
                          <tr key={vehicle.id}>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="h-12 w-16 bg-gray-200 rounded overflow-hidden mr-3">
                                  {vehicle.primary_image ? (
                                    <img src={vehicle.primary_image.image} alt="" className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <Car className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                                  <p className="text-sm text-gray-500">{vehicle.year}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">${vehicle.price_per_day}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${vehicle.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {vehicle.is_available ? 'Available' : 'Unavailable'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <Link to={`/vehicles/${vehicle.id}`} className="p-2 text-gray-600 hover:text-primary-600 inline-flex">
                                <Eye className="h-5 w-5" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {booking.vehicle?.brand} {booking.vehicle?.model}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Customer: {booking.user?.username || 'Unknown'}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(booking.status)}
                            <p className="mt-2 font-semibold">${booking.total_price}</p>
                          </div>
                        </div>
                        {booking.status === 'pending' && (
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <div className="mt-4">
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'active')}
                              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Mark Active
                            </button>
                          </div>
                        )}
                        {booking.status === 'active' && (
                          <div className="mt-4">
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                              className="flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
