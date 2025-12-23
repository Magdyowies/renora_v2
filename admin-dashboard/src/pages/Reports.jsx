import { useEffect, useState } from 'react';
import { FileText, Plus, Download, Calendar } from 'lucide-react';
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

  const getTypeBadge = (type) => {
    const typeStyles = {
      booking: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      revenue: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      user: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      vehicle: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${typeStyles[type] || 'bg-gray-100 text-gray-800'}`}>
        {type} Report
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
      Header: 'Title', 
      accessor: 'title',
      Cell: ({ value }) => (
        <span className="font-medium text-gray-900 dark:text-white">{value}</span>
      )
    },
    { 
      Header: 'Type', 
      accessor: 'report_type',
      Cell: ({ value }) => getTypeBadge(value)
    },
    { 
      Header: 'Date Range', 
      accessor: 'date_from', 
      Cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(row.original.date_from).toLocaleDateString()} - {new Date(row.original.date_to).toLocaleDateString()}
        </span>
      )
    },
    { 
      Header: 'Created', 
      accessor: 'created_at', 
      Cell: ({ value }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      )
    },
    {
      Header: 'Actions',
      Cell: () => (
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm font-medium">
          <Download className="w-4 h-4" />
          Download
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading reports...</p>
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
              <FileText className="w-8 h-8 text-blue-500" />
              Admin Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and download business reports</p>
          </div>
        </div>

        {/* Report Generation Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generate New Report</h2>
          </div>
          <ReportForm onSave={fetchReports} />
        </div>

        {/* Reports History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reports History</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {reports.length} report{reports.length !== 1 ? 's' : ''} generated
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No reports generated yet</p>
              <p className="text-gray-500 dark:text-gray-400">Create your first report using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table columns={columns} data={reports} />
            </div>
          )}
        </div>
      </div>
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/admin/reports/', formData);
      onSave();
      setFormData({
        report_type: 'booking',
        title: '',
        date_from: '',
        date_to: '',
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Report Title <span className="text-red-500">*</span>
          </label>
          <Input 
            name="title" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            placeholder="Q4 2024 Performance Report" 
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Report Type <span className="text-red-500">*</span>
          </label>
          <select 
            name="report_type" 
            value={formData.report_type} 
            onChange={(e) => setFormData({...formData, report_type: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="booking">Booking Report</option>
            <option value="revenue">Revenue Report</option>
            <option value="user">User Report</option>
            <option value="vehicle">Vehicle Report</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              name="date_from" 
              type="date" 
              value={formData.date_from} 
              onChange={(e) => setFormData({...formData, date_from: e.target.value})} 
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              name="date_to" 
              type="date" 
              value={formData.date_to} 
              onChange={(e) => setFormData({...formData, date_to: e.target.value})} 
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </form>
  );
};

export default ReportsPage;