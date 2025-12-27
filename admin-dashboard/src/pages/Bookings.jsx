import { useEffect, useState, useCallback } from 'react';
import { Calendar, Plus, Trash2, Search, Filter } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import AddBookingModal from '../components/AddBookingModal';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/vendor/'); 
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      alert('Failed to load bookings data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(`Are you sure you want to delete booking #${id}?`);
    
    if (!confirmed) return;
    
    try {
      await api.delete(`/bookings/vendor/${id}/`);
      alert(`✅ Booking #${id} deleted successfully!`);
      await fetchBookings();
    } catch (error) {
      console.error('Delete failed:', error);
      if (error.response?.status === 403) {
        alert(`❌ Permission Denied! You cannot delete booking #${id}.`);
      } else if (error.response?.status === 404) {
        alert(`❌ Booking #${id} not found.`);
      } else {
        alert(`❌ Failed to delete booking #${id}.`);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date',error;
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}`}>
        {status || 'unknown'}
      </span>
    );
  };

  const columns = [
    { 
      Header: 'ID', 
      accessor: 'id',
      Cell: ({ value }) => (
        <span className="font-semibold text-gray-900 dark:text-white">#{value}</span>
      )
    },
    { 
      Header: 'Customer', 
      accessor: 'customer_name', 
      Cell: ({ value }) => (
        <span className="text-gray-700 dark:text-gray-300">{value || 'N/A'}</span>
      )
    },
    { 
      Header: 'Vehicle', 
      accessor: 'vehicle_details', 
      Cell: ({ value }) => (
        <span className="text-gray-700 dark:text-gray-300">{value?.name || 'N/A'}</span>
      )
    },
    { 
      Header: 'Total Price', 
      accessor: 'total_price',
      Cell: ({ value }) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {formatCurrency(value || 0)}
        </span>
      )
    },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }) => getStatusBadge(value)
    },
    { 
      Header: 'Pickup Date', 
      accessor: 'pickup_date',
      Cell: ({ value }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(value)}</span>
      )
    },
    { 
      Header: 'Return Date', 
      accessor: 'return_date',
      Cell: ({ value }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(value)}</span>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions_bookings',
      Cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original.id)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          title="Delete Booking"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading bookings...</p>
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
              <Calendar className="w-8 h-8 text-blue-500" />
              Bookings Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all rental bookings</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New Booking
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
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
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No bookings found</p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first booking</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Booking
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table columns={columns} data={bookings} />
            </div>
          )}
        </div>
      </div>
      
      <AddBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          alert('Booking created successfully!');
          fetchBookings();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default BookingsPage;