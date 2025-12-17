import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('/payments/history/'); // Assuming this is the admin endpoint
        setPayments(response.data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Booking ID', accessor: 'booking' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Method', accessor: 'method' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Date', accessor: 'created_at', Cell: ({ value }) => new Date(value).toLocaleString() },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">Payments Overview</h1>
      <Table columns={columns} data={payments} />
    </Card>
  );
};

export default PaymentsPage;
