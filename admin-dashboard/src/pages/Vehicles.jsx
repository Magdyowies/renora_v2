import { useEffect, useState } from 'react';
import { Car, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import api from '../services/api';
import Table from '../components/Table';
import Modal from 'react-modal';
import AddVehicleModal from '../components/AddVehicleModal';
import EditVehicleModal from '../components/EditVehicleModal';
import { getVehiclePrimaryImage } from '../utils/imageUtils'; // Import the utility

Modal.setAppElement('#root');

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles/my/');
      setVehicles(response.data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setIsAddModalOpen(true);
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
      Header: 'Image',
      accessor: 'primary_image', // can be any key, we use the whole row
      Cell: ({ row }) => (
        <img
          src={getVehiclePrimaryImage(row.original)}
          alt={row.original.name}
          className="w-16 h-10 rounded-md object-cover"
          loading="lazy"
        />
      )
    },
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
            {row.original.brand} {row.original.model}
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
            onClick={handleAddVehicle}
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

      <AddVehicleModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
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

export default VehiclesPage;
