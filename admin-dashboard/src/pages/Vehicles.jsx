import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from 'react-modal'; // Import react-modal
import { PlusCircle, Edit, Trash2 } from 'lucide-react'; // Icons

// Ensure that the app element is set for react-modal
Modal.setAppElement('#root');

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Brand', accessor: 'brand' },
    { Header: 'Model', accessor: 'model' },
    { Header: 'Year', accessor: 'year' },
    { Header: 'Price/Day', accessor: 'price_per_day' },
    { Header: 'Status', accessor: 'status' },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEditVehicle(row.original)}>
            <Edit size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteVehicle(row.original.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vehicles Management</h1>
        <Button onClick={handleCreateVehicle} startIcon={<PlusCircle size={20} />}>
          Create Vehicle
        </Button>
      </div>
      
      <Card>
        <Table columns={columns} data={vehicles} />
      </Card>

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

// Reusable Modal Style
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff', // Card background
    borderRadius: '8px',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
    price_per_day: '',
    status: 'available',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/admin/vehicles/', formData);
      onVehicleCreated();
      onRequestClose();
      setFormData({ name: '', brand: '', model: '', year: '', price_per_day: '', status: 'available' }); // Reset form
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customModalStyles}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create New Vehicle</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <Input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
          <Input name="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
          <Input name="model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
          <Input name="year" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Per Day</label>
          <Input name="price_per_day" type="number" value={formData.price_per_day} onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onRequestClose}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Vehicle'}
          </Button>
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
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Vehicle: {vehicle?.name}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <Input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
          <Input name="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
          <Input name="model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
          <Input name="year" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Per Day</label>
          <Input name="price_per_day" type="number" value={formData.price_per_day} onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onRequestClose}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default VehiclesPage;
