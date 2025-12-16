import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, DollarSign, Eye, CheckCircle, XCircle } from 'lucide-react';
import { vehicleAPI, bookingAPI } from '../services/api';
import { format } from 'date-fns';

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
      
      setStats({ totalVehicles: vehiclesData.length, activeBookings, totalEarnings });
    } catch (error) {
      console.error('Failed to load vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) return;
    try {
      await bookingAPI.updateStatus(id, status);
      loadData();
    } catch (error) {
      alert('Failed to update booking status');
    }
  };
  
  const getStatusPill = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-neutral-100 text-neutral-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${styles[status] || styles.completed}`}>{status}</span>;
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Vendor Dashboard</h1>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Vehicles" value={stats.totalVehicles} icon={Car} colorClass="text-primary" />
          <StatCard title="Active Bookings" value={stats.activeBookings} icon={Calendar} colorClass="text-blue-600" />
          <StatCard title="Total Earnings" value={`$${stats.totalEarnings.toFixed(2)}`} icon={DollarSign} colorClass="text-green-600" />
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-6 px-6">
              <button onClick={() => setActiveTab('vehicles')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'vehicles' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
                My Vehicles
              </button>
              <button onClick={() => setActiveTab('bookings')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
                Manage Bookings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'vehicles' && (
              vehicles.length === 0 ? (
                <div className="text-center py-12"><Car className="h-16 w-16 text-neutral-300 mx-auto mb-4" /><p className="text-neutral-600">No vehicles listed yet.</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">Vehicle</th>
                        <th scope="col" className="px-6 py-3">Price/Day</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {vehicles.map((v) => (
                        <tr key={v.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 font-medium text-neutral-900">{v.brand} {v.model} ({v.year})</td>
                          <td className="px-6 py-4">${v.price_per_day}</td>
                          <td className="px-6 py-4">{getStatusPill(v.status)}</td>
                          <td className="px-6 py-4 text-right">
                            <Link to={`/vehicles/${v.id}`} className="p-2 text-neutral-500 hover:text-primary rounded-md"><Eye className="h-5 w-5" /></Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {activeTab === 'bookings' && (
              bookings.length === 0 ? (
                <div className="text-center py-12"><Calendar className="h-16 w-16 text-neutral-300 mx-auto mb-4" /><p className="text-neutral-600">No bookings to manage.</p></div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start">
                        <div>
                          <p className="font-bold text-neutral-800">{b.vehicle_details?.brand} {b.vehicle_details?.model}</p>
                          <p className="text-sm text-neutral-500">Customer: {b.customer_name} | {format(new Date(b.pickup_date), 'MMM dd')} - {format(new Date(b.return_date), 'MMM dd')}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          {getStatusPill(b.status)}
                          <p className="mt-1 font-bold text-lg text-neutral-800">${b.total_price}</p>
                        </div>
                      </div>
                      {['pending', 'confirmed'].includes(b.status) && (
                        <div className="mt-4 pt-4 border-t flex gap-2">
                          <button onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')} className="flex items-center px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-md hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />Confirm
                          </button>
                          <button onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')} className="flex items-center px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-md hover:bg-red-700">
                            <XCircle className="h-4 w-4 mr-1" />Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
