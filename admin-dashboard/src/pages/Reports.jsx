import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/admin/reports/');
      setReports(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Title', accessor: 'title' },
    { Header: 'Type', accessor: 'report_type' },
    { Header: 'Date Range', accessor: 'date_from', Cell: ({ row }) => `${new Date(row.original.date_from).toLocaleDateString()} - ${new Date(row.original.date_to).toLocaleDateString()}`},
    { Header: 'Created At', accessor: 'created_at', Cell: ({ value }) => new Date(value).toLocaleString() },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4">Generate Report</h2>
        <ReportForm onSave={fetchReports} />
      </Card>
      <Card>
        <h1 className="text-2xl font-bold mb-4">Admin Reports</h1>
        <Table columns={columns} data={reports} />
      </Card>
    </div>
  );
};

const ReportForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    report_type: 'booking',
    title: '',
    date_from: '',
    date_to: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/reports/', formData);
      onSave();
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Report Title" />
        <select name="report_type" value={formData.report_type} onChange={(e) => setFormData({...formData, report_type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="booking">Booking Report</option>
          <option value="revenue">Revenue Report</option>
          <option value="user">User Report</option>
          <option value="vehicle">Vehicle Report</option>
        </select>
        <Input name="date_from" type="date" value={formData.date_from} onChange={(e) => setFormData({...formData, date_from: e.target.value})} />
        <Input name="date_to" type="date" value={formData.date_to} onChange={(e) => setFormData({...formData, date_to: e.target.value})} />
      </div>
      <Button type="submit">Generate Report</Button>
    </form>
  );
};

export default ReportsPage;
