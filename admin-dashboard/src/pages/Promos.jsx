import { useEffect, useState } from 'react';
import { Tag, Plus, Edit, Trash2, Percent, DollarSign } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';

const PromosPage = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPromo, setEditingPromo] = useState(null);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const response = await api.get('/payments/promo-codes/');
      setPromos(response.data);
    } catch (error) {
      console.error("Failed to fetch promo codes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      try {
        await api.delete(`/payments/promo-codes/${id}/`);
        fetchPromos();
      } catch (error) {
        console.error("Failed to delete promo code:", error);
      }
    }
  };

  const getTypeBadge = (type) => {
    return type === 'percentage' ? (
      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
        <Percent className="w-3 h-3" />
        Percentage
      </span>
    ) : (
      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
        <DollarSign className="w-3 h-3" />
        Fixed Amount
      </span>
    );
  };

  const columns = [
    { 
      Header: 'Code', 
      accessor: 'code',
      Cell: ({ value }) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded">
          {value}
        </span>
      )
    },
    { 
      Header: 'Type', 
      accessor: 'discount_type',
      Cell: ({ value }) => getTypeBadge(value)
    },
    { 
      Header: 'Value', 
      accessor: 'discount_value',
      Cell: ({ value, row }) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.original.discount_type === 'percentage' ? `${value}%` : `$${value}`}
        </span>
      )
    },
    { 
      Header: 'Min. Amount', 
      accessor: 'min_booking_amount',
      Cell: ({ value }) => (
        <span className="text-gray-600 dark:text-gray-400">
          ${parseFloat(value || 0).toFixed(2)}
        </span>
      )
    },
    { 
      Header: 'Status', 
      accessor: 'is_active', 
      Cell: ({ value }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${value ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      Header: 'Expires', 
      accessor: 'valid_until', 
      Cell: ({ value }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      )
    },
    { 
      Header: 'Actions', 
      accessor: 'id', 
      Cell: ({ value, row }) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(promos.find(p => p.id === value))}
            className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(value)}
            className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading promo codes...</p>
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
              <Tag className="w-8 h-8 text-blue-500" />
              Promo Codes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage discount codes</p>
          </div>
        </div>

        {/* Promo Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {editingPromo ? 'Edit Promo Code' : 'Create New Promo Code'}
            </h2>
          </div>
          <PromoForm 
            promo={editingPromo} 
            onSave={() => { 
              setEditingPromo(null); 
              fetchPromos(); 
            }} 
            onCancel={() => setEditingPromo(null)}
          />
        </div>

        {/* Promos Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Active Promo Codes</h2>
          {promos.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No promo codes yet</p>
              <p className="text-gray-500 dark:text-gray-400">Create your first promo code above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table columns={columns} data={promos} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PromoForm = ({ promo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_booking_amount: '',
    valid_until: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (promo) {
      setFormData({
        code: promo.code,
        discount_type: promo.discount_type,
        discount_value: promo.discount_value,
        min_booking_amount: promo.min_booking_amount,
        valid_until: promo.valid_until.split('T')[0],
        is_active: promo.is_active,
      });
    } else {
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_booking_amount: '',
        valid_until: '',
        is_active: true,
      });
    }
  }, [promo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const apiCall = promo 
      ? api.put(`/payments/promo-codes/${promo.id}/`, formData) 
      : api.post('/payments/promo-codes/', formData);
    
    try {
      await apiCall;
      onSave();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save promo code');
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
            Promo Code <span className="text-red-500">*</span>
          </label>
          <Input 
            name="code" 
            value={formData.code} 
            onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} 
            placeholder="SUMMER2024" 
            className="font-mono"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discount Type <span className="text-red-500">*</span>
          </label>
          <select 
            name="discount_type" 
            value={formData.discount_type} 
            onChange={(e) => setFormData({...formData, discount_type: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discount Value <span className="text-red-500">*</span>
          </label>
          <Input 
            name="discount_value" 
            type="number" 
            step="0.01"
            value={formData.discount_value} 
            onChange={(e) => setFormData({...formData, discount_value: e.target.value})} 
            placeholder={formData.discount_type === 'percentage' ? '20' : '50.00'} 
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Min. Booking Amount
          </label>
          <Input 
            name="min_booking_amount" 
            type="number" 
            step="0.01"
            value={formData.min_booking_amount} 
            onChange={(e) => setFormData({...formData, min_booking_amount: e.target.value})} 
            placeholder="100.00" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valid Until <span className="text-red-500">*</span>
          </label>
          <Input 
            name="valid_until" 
            type="date" 
            value={formData.valid_until} 
            onChange={(e) => setFormData({...formData, valid_until: e.target.value})} 
            required
          />
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="is_active" 
            name="is_active" 
            checked={formData.is_active} 
            onChange={(e) => setFormData({...formData, is_active: e.target.checked})} 
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
            Active
          </label>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {promo && (
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Saving...' : promo ? 'Update Promo Code' : 'Create Promo Code'}
        </button>
      </div>
    </form>
  );
};

export default PromosPage;