import { useState, useEffect } from "react";
import { paymentAPI } from "../services/api";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
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
      console.error("Error loading wallet data:", error);
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
      setTopUpAmount("");
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to top up wallet");
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "credit":
        return <ArrowDown className="h-5 w-5 text-green-500" />;
      case "debit":
        return <ArrowUp className="h-5 w-5 text-red-500" />;
      case "refund":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="mb-8 text-3xl font-bold">My Wallet</h1>

        <div className="from-primary-600 to-primary-800 mb-8 rounded-xl bg-gradient-to-r p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-200 mb-1">Available Balance</p>
              <p className="text-4xl font-bold">${wallet?.balance || 0}</p>
            </div>
            <WalletIcon className="text-primary-300 h-16 w-16" />
          </div>
          <button
            onClick={() => setShowTopUp(true)}
            className="mt-6 flex items-center rounded-lg bg-white/20 px-4 py-2 hover:bg-white/30"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Money
          </button>
        </div>

        {showTopUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold">Top Up Wallet</h2>
              <form onSubmit={handleTopUp}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="focus:ring-primary-500 w-full rounded-lg border border-gray-300 py-3 pr-4 pl-8 focus:ring-2"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="mb-4 flex gap-4">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTopUpAmount(amount.toString())}
                      className="flex-1 rounded-lg border border-gray-300 py-2 hover:bg-gray-50"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowTopUp(false)}
                    className="flex-1 rounded-lg border border-gray-300 py-3 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing || !topUpAmount}
                    className="bg-primary-600 hover:bg-primary-700 flex-1 rounded-lg py-3 text-white disabled:opacity-50"
                  >
                    {processing ? "Processing..." : "Top Up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Transaction History</h2>

          {transactions.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b py-3 last:border-0"
                >
                  <div className="flex items-center">
                    {getTransactionIcon(
                      transaction.transaction_type || transaction.status,
                    )}
                    <div className="ml-3">
                      <p className="font-medium">
                        {transaction.description ||
                          `Payment #${transaction.id}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(
                          new Date(transaction.created_at),
                          "MMM dd, yyyy HH:mm",
                        )}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      transaction.transaction_type === "credit" ||
                      transaction.transaction_type === "refund"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.transaction_type === "credit" ||
                    transaction.transaction_type === "refund"
                      ? "+"
                      : "-"}
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
