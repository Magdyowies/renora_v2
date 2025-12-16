import { useState, useEffect } from 'react';
import { Users, Car, Calendar, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { adminAPI } from '../services/api';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, vehiclesRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getVehicles()
      ]);
      setStats(statsRes.data);
      const usersData = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.results || []);
      const vehiclesData = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : (vehiclesRes.data?.results || []);
      setUsers(usersData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
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
  
  const getRolePill = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      vendor: 'bg-blue-100 text-blue-800',
      customer: 'bg-neutral-100 text-neutral-800',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${styles[role] || styles.customer}`}>{role}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats?.total_users || 0} icon={Users} colorClass="text-blue-600" />
          <StatCard title="Total Vehicles" value={stats?.total_vehicles || 0} icon={Car} colorClass="text-green-600" />
          <StatCard title="Total Bookings" value={stats?.total_bookings || 0} icon={Calendar} colorClass="text-purple-600" />
          <StatCard title="Total Revenue" value={`$${(stats?.total_revenue || 0).toFixed(2)}`} icon={DollarSign} colorClass="text-primary" />
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-6 px-6">
              <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>Overview</button>
              <button onClick={() => setActiveTab('users')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>Users</button>
              <button onClick={() => setActiveTab('vehicles')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'vehicles' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>Vehicles</button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-neutral-200 rounded-lg p-5">
                  <h3 className="font-semibold text-neutral-800 mb-4 flex items-center"><TrendingUp className="h-5 w-5 mr-2" />Recent Activity</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-neutral-600">Bookings Today</span><span className="font-medium">{stats?.bookings_today || 0}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-600">Revenue Today</span><span className="font-medium">${(stats?.revenue_today || 0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-600">New Users This Week</span><span className="font-medium">{stats?.new_users_week || 0}</span></div>
                  </div>
                </div>
                <div className="border border-neutral-200 rounded-lg p-5">
                  <h3 className="font-semibold text-neutral-800 mb-4 flex items-center"><BarChart3 className="h-5 w-5 mr-2" />Booking Status</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-neutral-600">Pending</span><span className="font-medium text-yellow-600">{stats?.pending_bookings || 0}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-600">Active</span><span className="font-medium text-blue-600">{stats?.active_bookings || 0}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-600">Completed</span><span className="font-medium text-green-600">{stats?.completed_bookings || 0}</span></div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">User</th>
                      <th scope="col" className="px-6 py-3">Email</th>
                      <th scope="col" className="px-6 py-3">Role</th>
                      <th scope="col" className="px-6 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 font-medium text-neutral-900">{user.first_name} {user.last_name || user.username}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{getRolePill(user.role)}</td>
                        <td className="px-6 py-4">{format(new Date(user.created_at), 'MMM dd, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Vehicle</th>
                      <th scope="col" className="px-6 py-3">Owner</th>
                      <th scope="col" className="px-6 py-3">Price/Day</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 font-medium text-neutral-900">{vehicle.brand} {vehicle.model}</td>
                        <td className="px-6 py-4">{vehicle.vendor_name}</td>
                        <td className="px-6 py-4">${vehicle.price_per_day}</td>
                        <td className="px-6 py-4">{getStatusPill(vehicle.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
