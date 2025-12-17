import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchVehicles();
  }, []);

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Brand', accessor: 'brand' },
    { Header: 'Model', accessor: 'model' },
    { Header: 'Year', accessor: 'year' },
    { Header: 'Price/Day', accessor: 'price_per_day' },
    { Header: 'Status', accessor: 'status' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">Vehicles Management</h1>
      <Table columns={columns} data={vehicles} />
    </Card>
  );
};

export default VehiclesPage;
