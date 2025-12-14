import { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';
import { Wallet as WalletIcon, Plus, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        paymentAPI.getWallet(),
        paymentAPI.getHistory(),
      ]);
      setWallet(walletRes.data);
      setTransactions(transactionsRes.data || []);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return;
    
    setProcessing(true);
    try {
      await paymentAPI.topUpWallet(parseFloat(topUpAmount));
      setShowTopUp(false);
      setTopUpAmount('');
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to top up wallet');
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'credit':
        return <ArrowDown className="h-5 w-5 text-green-500" />;
      case 'debit':
        return <ArrowUp className="h-5 w-5 text-red-500" />;
      case 'refund':
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
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
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-200 mb-1">Available Balance</p>
              <p className="text-4xl font-bold">${wallet?.balance || 0}</p>
            </div>
            <WalletIcon className="h-16 w-16 text-primary-300" />
          </div>
          <button
            onClick={() => setShowTopUp(true)}
            className="mt-6 flex items-center bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Money
          </button>
        </div>

        {showTopUp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Top Up Wallet</h2>
              <form onSubmit={handleTopUp}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTopUpAmount(amount.toString())}
                      className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowTopUp(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing || !topUpAmount}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {processing ? 'Processing...' : 'Top Up'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center">
                    {getTransactionIcon(transaction.transaction_type || transaction.status)}
                    <div className="ml-3">
                      <p className="font-medium">
                        {transaction.description || `Payment #${transaction.id}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.transaction_type === 'credit' || transaction.transaction_type === 'refund'
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.transaction_type === 'credit' || transaction.transaction_type === 'refund' ? '+' : '-'}
                    ${transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
