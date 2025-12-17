import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/all/'); // Assuming this is the admin endpoint
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Customer', accessor: 'customer_name' },
    { Header: 'Vehicle', accessor: 'vehicle_details.name' },
    { Header: 'Total Price', accessor: 'total_price' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Pickup Date', accessor: 'pickup_date', Cell: ({ value }) => new Date(value).toLocaleString() },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">Bookings Management</h1>
      <Table columns={columns} data={bookings} />
    </Card>
  );
};

export default BookingsPage;
