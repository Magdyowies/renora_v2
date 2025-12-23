import { useEffect, useState } from 'react';
import { CreditCard, Search, Filter, Download, TrendingUp } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/history/');
      setPayments(response.data);
      
      // Calculate stats
      const total = response.data.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      const completed = response.data.filter(p => p.status === 'completed').length;
      const pending = response.data.filter(p => p.status === 'pending').length;
      const failed = response.data.filter(p => p.status === 'failed').length;
      
      setStats({ total, completed, pending, failed });
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getMethodBadge = (method) => {
    const methodStyles = {
      'credit_card': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'debit_card': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'paypal': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
      'cash': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${methodStyles[method] || 'bg-gray-100 text-gray-800'}`}>
        {method?.replace('_', ' ')}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const columns = [
    { 
      Header: 'Payment ID', 
      accessor: 'id',
      Cell: ({ value }) => (
        <span className="font-semibold text-gray-900 dark:text-white">#{value}</span>
      )
    },
    { 
      Header: 'Booking ID', 
      accessor: 'booking',
      Cell: ({ value }) => (
        <span className="text-blue-600 dark:text-blue-400 font-medium">#{value}</span>
      )
    },
    { 
      Header: 'Amount', 
      accessor: 'amount',
      Cell: ({ value }) => (
        <span className="font-semibold text-gray-900 dark:text-white text-lg">
          {formatCurrency(value)}
        </span>
      )
    },
    { 
      Header: 'Method', 
      accessor: 'method',
      Cell: ({ value }) => getMethodBadge(value)
    },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }) => getStatusBadge(value)
    },
    { 
      Header: 'Date', 
      accessor: 'created_at', 
      Cell: ({ value }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue-500" />
              Payments Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage all transactions</p>
          </div>
          <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <CreditCard className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm text-white/80 mb-1 font-medium">Total Revenue</p>
            <p className="text-3xl font-bold">{formatCurrency(stats.total)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">✓</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Completed</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">⏱</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Pending</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">✕</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Failed</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.failed}</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No payments found</p>
              <p className="text-gray-500 dark:text-gray-400">Payment transactions will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table columns={columns} data={payments} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;