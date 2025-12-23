import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Car, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorMap = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/20",
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-500 to-orange-600",
      shadow: "shadow-orange-500/20",
    },
  };

  return (
    <div className={`${colorMap[color].bg} ${colorMap[color].shadow} shadow-lg rounded-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center text-sm bg-white/20 px-2 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-white/80 mb-1 font-medium">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.total_users || 0} 
          icon={Users} 
          color="blue"
          trend="+12%"
        />
        <StatCard 
          title="Total Vehicles" 
          value={stats?.total_vehicles || 0} 
          icon={Car} 
          color="green"
          trend="+5%"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats?.total_bookings || 0} 
          icon={Calendar} 
          color="purple"
          trend="+18%"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${(stats?.total_revenue || 0).toFixed(2)}`} 
          icon={DollarSign} 
          color="orange"
          trend="+23%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Revenue</h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-500 font-semibold">+23%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Bookings</h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">+18%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar 
                dataKey="bookings" 
                fill="#10b981" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;