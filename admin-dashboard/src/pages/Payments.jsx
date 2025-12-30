import { useEffect, useState } from 'react';
import { Search, Filter, Download, TrendingUp } from 'lucide-react';
import api from '../services/api';
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
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [walletRes, txRes] = await Promise.all([
        api.get('/payments/wallet/'),
        api.get('/payments/wallet/transactions/')
      ]);

      setPayments(txRes.data);

      const totalCredits = txRes.data
        .filter(t => t.transaction_type === 'credit')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalDebits = txRes.data
        .filter(t => t.transaction_type === 'debit')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setStats({
        total: walletRes.data.balance,
        completed: totalCredits,
        pending: 0,
        failed: totalDebits
      });
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const columns = [
    {
      Header: 'Date',
      accessor: 'created_at',
      Cell: ({ value }) => new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    {
      Header: 'Type',
      accessor: 'transaction_type',
      Cell: ({ value }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
          value === 'credit'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {value}
        </span>
      )
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ({ value, row }) => (
        <span className={`font-semibold ${
          row.original.transaction_type === 'credit'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}>
          {row.original.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(value)}
        </span>
      )
    },
    {
      Header: 'Description',
      accessor: 'description',
      Cell: ({ value }) => (
        <span className="text-gray-700 dark:text-gray-300">{value}</span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading wallet data...</p>
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
              <TrendingUp className="w-8 h-8 text-emerald-500" />
              Wallet & Earnings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track your earnings and refunds</p>
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
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-white/80 mb-1 font-medium">Current Balance</p>
            <p className="text-3xl font-bold">{formatCurrency(stats.total)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">↑</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Total Credits</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.completed)}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">↓</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Total Debits</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.failed)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">{payments.length}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{payments.length}</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
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
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No transactions found</p>
              <p className="text-gray-500 dark:text-gray-400">Your wallet transactions will appear here</p>
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