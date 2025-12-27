import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from './Modal';

const AddBookingModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer: '',
    vehicle: '',
    pickup_date: '',
    return_date: '',
    pickup_location: '',
    return_location: '',
    promo_code: '',
    notes: '',
  });
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          const [usersRes, vehiclesRes] = await Promise.all([
            api.get('/users/list/'),
            api.get('/vehicles/my/'),
          ]);
          
          setCustomers(usersRes.data.results || usersRes.data);
          setVehicles(vehiclesRes.data.results || vehiclesRes.data);

        } catch (err) {
          const status = err.response?.status;
          const url = err.config?.url;
          const message = `Failed to fetch data from ${url} (Status: ${status || 'N/A'}). Check the browser console for more details.`;
          setError(message);
          console.error({
            message: 'Data fetching failed',
            url: url,
            status: status,
            responseData: err.response?.data,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/bookings/vendor/create/', formData);
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : 'An unexpected error occurred.';
      setError(`Failed to create booking: ${errorMessage}`);
      console.error(err);
    }
  };

  const inputClass = "bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Booking">
      <form onSubmit={handleSubmit}>
        {error && <div className="bg-red-900 border border-red-400 text-red-100 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        {loading ? (
          <div className="text-center p-8">Loading form data...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customer" className="block mb-2 text-sm font-medium text-gray-300">Customer</label>
                <select id="customer" name="customer" value={formData.customer} onChange={handleChange} className={inputClass} required>
                  <option value="">Select a Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name || c.username || `User ID: ${c.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="vehicle" className="block mb-2 text-sm font-medium text-gray-300">Vehicle</label>
                <select id="vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} className={inputClass} required>
                  <option value="">Select a Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name || `Vehicle ID: ${v.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pickup_date" className="block mb-2 text-sm font-medium text-gray-300">Pickup Date</label>
                <input type="datetime-local" id="pickup_date" name="pickup_date" value={formData.pickup_date} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="return_date" className="block mb-2 text-sm font-medium text-gray-300">Return Date</label>
                <input type="datetime-local" id="return_date" name="return_date" value={formData.return_date} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="pickup_location" className="block mb-2 text-sm font-medium text-gray-300">Pickup Location</label>
                <input type="text" id="pickup_location" name="pickup_location" value={formData.pickup_location} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="return_location" className="block mb-2 text-sm font-medium text-gray-300">Return Location</label>
                <input type="text" id="return_location" name="return_location" value={formData.return_location} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="promo_code" className="block mb-2 text-sm font-medium text-gray-300">Promo Code (Optional)</label>
                <input type="text" id="promo_code" name="promo_code" value={formData.promo_code} onChange={handleChange} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-300">Notes</label>
                <textarea id="notes" name="notes" rows="3" value={formData.notes} onChange={handleChange} className={inputClass}></textarea>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2 transition-colors">Cancel</button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">Create Booking</button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default AddBookingModal;