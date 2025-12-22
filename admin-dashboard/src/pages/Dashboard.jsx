import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Car, Calendar, DollarSign } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-500/20",
      text: "text-blue-500",
    },
    green: {
      bg: "bg-green-500/20",
      text: "text-green-500",
    },
    purple: {
      bg: "bg-purple-500/20",
      text: "text-purple-500",
    },
    yellow: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-500",
    },
  };

  return (
    <Card>
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorMap[color].bg}`}>
          <Icon className={`w-6 h-6 ${colorMap[color].text}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revenueRes, bookingRes] = await Promise.all([
          api.get('/admin/stats/'),
          api.get('/admin/revenue-chart/'),
          api.get('/admin/booking-chart/'),
        ]);
        setStats(statsRes.data);
        setRevenueData(revenueRes.data);
        setBookingData(bookingRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.total_users || 0} icon={Users} color="blue" />
        <StatCard title="Total Vehicles" value={stats?.total_vehicles || 0} icon={Car} color="green" />
        <StatCard title="Total Bookings" value={stats?.total_bookings || 0} icon={Calendar} color="purple" />
        <StatCard title="Total Revenue" value={`$${(stats?.total_revenue || 0).toFixed(2)}`} icon={DollarSign} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Monthly Bookings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;