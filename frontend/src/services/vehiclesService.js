import api from './api';

const getVehicles = async () => {
  try {
    const response = await api.get('/vehicles/');
    // Expected response: array of vehicle objects
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

const vehiclesService = {
  getVehicles,
};

export default vehiclesService;