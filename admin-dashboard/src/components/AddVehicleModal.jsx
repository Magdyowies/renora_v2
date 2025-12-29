import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Input from './Input';
import api from '../services/api';
import ImageUpload from './ImageUpload';
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    padding: '2rem',
    width: '90%',
    maxWidth: '600px', // Slightly wider often looks better for 2-column grids
    maxHeight: '90vh', // Limits height to 90% of the viewport
    overflowY: 'auto', // Enables vertical scrolling
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
};

const AddVehicleModal = ({ isOpen, onRequestClose, onVehicleCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    category: '',
    transmission: '',
    fuel_type: '',
    seats: '',
    doors: '',
    price_per_day: '',
    location: '',
    description: '',
    features: '',
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/vehicles/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.model.trim()) {
      setError("Model is a required field.");
      return;
    }
    if (!formData.category) {
      setError("Please select a category.");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    if (primaryImage === null) {
      setError("Please select a primary image.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create the vehicle
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        category: parseInt(formData.category),
        seats: parseInt(formData.seats),
        doors: parseInt(formData.doors),
        price_per_day: parseFloat(formData.price_per_day),
        features: formData.features.split(',').map(item => item.trim()),
      };
      
      const vehicleResponse = await api.post('/vehicles/create/', vehicleData);
      console.log('Vehicle creation response:', vehicleResponse);
      console.log('Vehicle creation response data:', vehicleResponse.data);
      const vehicleId = vehicleResponse.data.id;

      // Step 2: Upload images
      const imageUploadPromises = images.map((image, index) => {
        const imageFormData = new FormData();
        imageFormData.append('images', image);
        imageFormData.append('is_primary', index === primaryImage);
        return api.post(`/vehicles/${vehicleId}/images/`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      await Promise.all(imageUploadPromises);

      onVehicleCreated();
      onRequestClose();
      // Reset form state
      setFormData({
        name: '', brand: '', model: '', year: '', category: '',
        transmission: '', fuel_type: '', seats: '', doors: '',
        price_per_day: '', location: '', description: '', features: '',
      });
      setImages([]);
      setPrimaryImage(null);

    } catch (err) {
      const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to create vehicle';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customModalStyles}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Vehicle</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields... */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Name</label>
          <Input 
            name="name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
            placeholder="e.g., Tesla Model S"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand</label>
            <Input 
              name="brand" 
              value={formData.brand} 
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })} 
              required 
              placeholder="e.g., Tesla"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
            <Input 
              name="model" 
              value={formData.model} 
              onChange={(e) => setFormData({ ...formData, model: e.target.value })} 
              required 
              placeholder="e.g., Model S"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
            <Input 
              name="year" 
              type="number" 
              value={formData.year} 
              onChange={(e) => setFormData({ ...formData, year: e.target.value })} 
              required 
              placeholder="2024"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Per Day</label>
            <Input 
              name="price_per_day" 
              type="number" 
              step="0.01"
              value={formData.price_per_day} 
              onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })} 
              required 
              placeholder="99.99"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Transmission</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fuel Type</label>
            <select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Fuel Type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seats</label>
            <Input 
              name="seats" 
              type="number" 
              value={formData.seats} 
              onChange={(e) => setFormData({ ...formData, seats: e.target.value })} 
              required 
              placeholder="e.g., 5"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Doors</label>
            <Input 
              name="doors" 
              type="number" 
              value={formData.doors} 
              onChange={(e) => setFormData({ ...formData, doors: e.target.value })} 
              required 
              placeholder="e.g., 4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
            <Input 
              name="location" 
              value={formData.location} 
              onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
              required 
              placeholder="e.g., Downtown Cairo"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <Input 
            name="description" 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            required 
            placeholder="A detailed description of the vehicle."
            as="textarea"
            rows="3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features (comma-separated)</label>
          <Input 
            name="features" 
            value={formData.features} 
            onChange={(e) => setFormData({ ...formData, features: e.target.value })} 
            required 
            placeholder="e.g., AC, Bluetooth, GPS"
          />
        </div>

        <ImageUpload onImagesChange={setImages} onPrimaryChange={setPrimaryImage} />

        <div className="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            onClick={onRequestClose}
            className="px-4 py-2 border border-ray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddVehicleModal;