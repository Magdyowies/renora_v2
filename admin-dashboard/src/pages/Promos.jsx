import { useEffect, useState } from 'react';
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

  const columns = [
    { Header: 'Code', accessor: 'code' },
    { Header: 'Type', accessor: 'discount_type' },
    { Header: 'Value', accessor: 'discount_value' },
    { Header: 'Active', accessor: 'is_active', Cell: ({ value }) => (value ? 'Yes' : 'No') },
    { Header: 'Expires', accessor: 'valid_until', Cell: ({ value }) => new Date(value).toLocaleDateString() },
    { Header: 'Actions', accessor: 'id', Cell: ({ value }) => (
      <div className="flex space-x-2">
        <Button onClick={() => handleEdit(promos.find(p => p.id === value))} variant="secondary" className="px-2 py-1 text-xs">Edit</Button>
        <Button onClick={() => handleDelete(value)} variant="secondary" className="px-2 py-1 text-xs bg-red-500 text-white hover:bg-red-600">Delete</Button>
      </div>
    )},
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4">{editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}</h2>
        <PromoForm promo={editingPromo} onSave={() => { setEditingPromo(null); fetchPromos(); }} />
      </Card>
      <Card>
        <h1 className="text-2xl font-bold mb-4">Promo Codes</h1>
        <Table columns={columns} data={promos} />
      </Card>
    </div>
  );
};

const PromoForm = ({ promo, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_booking_amount: '',
    valid_until: '',
    is_active: true,
  });

  useEffect(() => {
    if (promo) {
      setFormData({
        code: promo.code,
        discount_type: promo.discount_type,
        discount_value: promo.discount_value,
        min_booking_amount: promo.min_booking_amount,
        valid_until: promo.valid_until.split('T')[0], // Format for date input
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
    const apiCall = promo ? api.put(`/payments/promo-codes/${promo.id}/`, formData) : api.post('/payments/promo-codes/', formData);
    try {
      await apiCall;
      onSave();
    } catch (error) {
      console.error("Failed to save promo code:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="Promo Code" />
        <select name="discount_type" value={formData.discount_type} onChange={(e) => setFormData({...formData, discount_type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
        <Input name="discount_value" type="number" value={formData.discount_value} onChange={(e) => setFormData({...formData, discount_value: e.target.value})} placeholder="Discount Value" />
        <Input name="min_booking_amount" type="number" value={formData.min_booking_amount} onChange={(e) => setFormData({...formData, min_booking_amount: e.target.value})} placeholder="Min. Booking Amount" />
        <Input name="valid_until" type="date" value={formData.valid_until} onChange={(e) => setFormData({...formData, valid_until: e.target.value})} />
        <div className="flex items-center">
          <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label>
        </div>
      </div>
      <Button type="submit">Save Promo Code</Button>
    </form>
  );
};

export default PromosPage;
