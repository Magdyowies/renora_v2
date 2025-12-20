import api from './api';

const getBookingDetails = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking details for booking ID ${bookingId}:`, error);
    throw error;
  }
};

const createBooking = async (bookingData) => {
  // The backend requires: vehicle, pickup_date, return_date, pickup_location, return_location
  // promo_code and notes are optional
  const payload = {
    vehicle: bookingData.vehicle,
    pickup_date: bookingData.pickup_date, // Corrected from start_date
    return_date: bookingData.return_date,   // Corrected from end_date
    pickup_location: bookingData.pickup_location,
    return_location: bookingData.return_location,
    notes: bookingData.notes || ''
  };

  // Only include promo_code if it's a non-empty string
  if (bookingData.promo_code) {
    payload.promo_code = bookingData.promo_code;
  }

  try {
    const response = await api.post('/bookings/create/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

const getUserBookings = async () => {
  try {
    const response = await api.get('/bookings/');
    // Expected response: array of booking objects
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

const bookingsService = {
  getBookingDetails,
  createBooking,
  getUserBookings,
};

export default bookingsService;
