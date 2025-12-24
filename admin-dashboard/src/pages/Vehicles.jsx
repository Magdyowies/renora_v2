import { useEffect, useState } from 'react';
import { Car, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/admin/vehicles/');
      setVehicles(response.data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehicle = () => {
    setSelectedVehicle(null);
    setIsCreateModalOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.delete(`/admin/vehicles/${vehicleId}/`);
        fetchVehicles();
      } catch (error) {
        console.error("Failed to delete vehicle:", error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      available: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      rented: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      maintenance: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
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
      Header: 'Vehicle', 
      accessor: 'name',
      Cell: ({ value, row }) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
<<<<<<< HEAD
            {/* {row.original.brand} {row.original.model} */}
=======
            {row.original.brand} {row.original.model}
>>>>>>> dev
          </div>
        </div>
      )
    },
    { 
      Header: 'Year', 
      accessor: 'year',
      Cell: ({ value }) => (
        <span className="text-gray-700 dark:text-gray-300">{value}</span>
      )
    },
    { 
      Header: 'Price/Day', 
      accessor: 'price_per_day',
      Cell: ({ value }) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          ${parseFloat(value).toFixed(2)}
        </span>
      )
    },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }) => getStatusBadge(value)
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEditVehicle(row.original)}
            className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
            title="Edit Vehicle"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteVehicle(row.original.id)}
            className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
            title="Delete Vehicle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading vehicles...</p>
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
              <Car className="w-8 h-8 text-blue-500" />
              Vehicles Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your rental fleet</p>
          </div>
          <button
            onClick={handleCreateVehicle}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New Vehicle
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search vehicles..."
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

          <div className="overflow-x-auto">
            <Table columns={columns} data={vehicles} />
          </div>
        </div>
      </div>

      <CreateVehicleModal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        onVehicleCreated={fetchVehicles}
      />

      <EditVehicleModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        vehicle={selectedVehicle}
        onVehicleUpdated={fetchVehicles}
      />
    </div>
  );
};

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
};

const CreateVehicleModal = ({ isOpen, onRequestClose, onVehicleCreated }) => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Convert category to integer for backend
      const dataToSend = {
        ...formData,
        year: parseInt(formData.year),
        category: parseInt(formData.category),
        seats: parseInt(formData.seats),
        doors: parseInt(formData.doors),
        price_per_day: parseFloat(formData.price_per_day),
      };

      await api.post('/admin/vehicles/', dataToSend); // Note: this should be /api/vehicles/create/ for vendors, but the frontend uses /admin/vehicles/
      onVehicleCreated();
      onRequestClose();
<<<<<<< HEAD
      setFormData({ name: '', brand: '', model: '', year: '', price_per_day: '', status: 'available' });
=======
      setFormData({ 
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
>>>>>>> dev
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create vehicle');
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
<<<<<<< HEAD
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
=======
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category ID</label>
            <Input 
              name="category" 
              type="number" 
              value={formData.category} 
              onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
              required 
              placeholder="e.g., 1 (for Sedan)"
            />
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
            as="textarea" // Use textarea for multi-line input
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
>>>>>>> dev
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            onClick={onRequestClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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

const EditVehicleModal = ({ isOpen, onRequestClose, vehicle, onVehicleUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    price_per_day: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        price_per_day: vehicle.price_per_day,
        status: vehicle.status,
      });
    }
  }, [vehicle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.patch(`/admin/vehicles/${vehicle.id}/`, formData);
      onVehicleUpdated();
      onRequestClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customModalStyles}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Vehicle</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Name</label>
          <Input 
            name="name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
            <Input 
              name="model" 
              value={formData.model} 
              onChange={(e) => setFormData({ ...formData, model: e.target.value })} 
              required 
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
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            onClick={onRequestClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VehiclesPage;