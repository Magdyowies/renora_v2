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
  try {
    const response = await api.post('/bookings/', bookingData);
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
