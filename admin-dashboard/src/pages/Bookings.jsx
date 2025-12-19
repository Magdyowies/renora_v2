import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import AddBookingModal from '../components/AddBookingModal';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/admin-crud/'); 
      console.log('Bookings data:', response.data); // Debug: check actual data structure
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
    console.log('🚨 DELETE BUTTON CLICK DEBUG 🚨');
    console.log('1. Button clicked for booking ID:', id);
    console.log('2. window.confirm will execute');
    
    // TEST: First check if function is even being called
    alert(`DEBUG: Delete function called for ID: ${id}. Click OK to proceed to confirm dialog.`);
    
    const confirmed = window.confirm(`Are you SURE you want to delete booking #${id}? This cannot be undone.`);
    console.log('3. User confirmed?', confirmed);
    
    if (!confirmed) {
      console.log('❌ User cancelled deletion');
      return;
    }
    
    console.log('✅ User confirmed deletion');
    console.log('4. Attempting API DELETE call...');
    
    try {
      console.log(`📡 Calling: DELETE /bookings/admin-crud/${id}/`);
      
      // TEST with minimal API call
      const response = await api.delete(`/bookings/admin-crud/${id}/`);
      
      console.log('✅ DELETE API SUCCESS');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      alert(`✅ Booking #${id} deleted successfully!`);
      
      console.log('5. Refreshing bookings data...');
      await fetchBookings();
      
      console.log('✅ Data refreshed, delete process COMPLETE');
      
    } catch (error) {
      console.error('❌ DELETE API FAILED');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Specific error messages for common issues
      if (error.response?.status === 403) {
        alert(`❌ Permission Denied! You cannot delete booking #${id}. Check admin permissions.`);
      } else if (error.response?.status === 404) {
        alert(`❌ Booking #${id} not found. It may have been already deleted.`);
      } else if (error.response?.status === 401) {
        alert(`❌ Authentication required. Please log in again.`);
      } else {
        alert(`❌ Failed to delete booking #${id}. Error: ${error.message}`);
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
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Updated columns with better handling for missing data
  const columns = [
    { Header: 'ID', accessor: 'id' },
    { 
      Header: 'Customer', 
      accessor: 'customer_name', 
      Cell: ({ value }) => value || 'N/A' // Simpler fallback for now
    },
    { 
      Header: 'Vehicle', 
      accessor: 'vehicle_details', 
      Cell: ({ value }) => value?.name || 'N/A' // Safely access name from the object, simplified fallback
    },
    { 
      Header: 'Total Price', 
      accessor: 'total_price',
      Cell: ({ value }) => formatCurrency(value || 0)
    },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          value === 'confirmed' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'unknown'}
        </span>
      )
    },
    { 
      Header: 'Pickup Date', 
      accessor: 'pickup_date',
      Cell: ({ value }) => formatDate(value)
    },
    {
      Header: 'Actions',
      // accessor: 'actions', // Removed accessor as it's a display-only column
      Cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
              title="Delete Booking"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent mb-2"></div>
          <div className="text-white">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Bookings Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Booking
          </button>
        </div>
        
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg mb-2">No bookings found</p>
            <p>Click "Add Booking" to create your first booking</p>
          </div>
        ) : (
          <Table columns={columns} data={bookings} />
        )}
      </Card>
      
      <AddBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          alert('Booking created successfully!');
          fetchBookings();
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default BookingsPage;