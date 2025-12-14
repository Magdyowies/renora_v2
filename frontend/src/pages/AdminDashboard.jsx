import { useState, useEffect } from 'react';
import { Users, Car, Calendar, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { adminAPI } from '../services/api';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.total_users || 0, icon: Users, color: 'blue' },
    { title: 'Total Vehicles', value: stats?.total_vehicles || 0, icon: Car, color: 'green' },
    { title: 'Total Bookings', value: stats?.total_bookings || 0, icon: Calendar, color: 'purple' },
    { title: 'Total Revenue', value: `$${(stats?.total_revenue || 0).toFixed(2)}`, icon: DollarSign, color: 'yellow' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[card.color]}`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium ${activeTab === 'overview' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 font-medium ${activeTab === 'users' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`px-6 py-4 font-medium ${activeTab === 'vehicles' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Vehicles
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="font-semibold">Recent Activity</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bookings Today</span>
                        <span className="font-medium">{stats?.bookings_today || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Revenue Today</span>
                        <span className="font-medium">${(stats?.revenue_today || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">New Users This Week</span>
                        <span className="font-medium">{stats?.new_users_week || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="font-semibold">Booking Status</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pending</span>
                        <span className="font-medium text-yellow-600">{stats?.pending_bookings || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active</span>
                        <span className="font-medium text-blue-600">{stats?.active_bookings || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-medium text-green-600">{stats?.completed_bookings || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Users className="h-5 w-5 text-primary-600 mr-2" />
                    <h3 className="font-semibold">User Distribution</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-primary-600">{stats?.customers || 0}</p>
                      <p className="text-sm text-gray-600">Customers</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats?.vendors || 0}</p>
                      <p className="text-sm text-gray-600">Vendors</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{stats?.admins || 0}</p>
                      <p className="text-sm text-gray-600">Admins</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-primary-600 font-medium">
                                    {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">{user.first_name} {user.last_name}</p>
                                  <p className="text-sm text-gray-500">@{user.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-600">{user.email}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'vendor' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-gray-600">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div>
                {vehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No vehicles found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vehicle</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Owner</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price/Day</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
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
                            <td className="px-4 py-4 text-gray-600">
                              {vehicle.owner?.username || 'Unknown'}
                            </td>
                            <td className="px-4 py-4">${vehicle.price_per_day}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${vehicle.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {vehicle.is_available ? 'Available' : 'Unavailable'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
