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

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users/');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}/`);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Username', accessor: 'username' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Role', accessor: 'role' },
    { Header: 'Active', accessor: 'is_active', Cell: ({ value }) => (value ? 'Yes' : 'No') },
    { Header: 'Staff', accessor: 'is_staff', Cell: ({ value }) => (value ? 'Yes' : 'No') },
    { Header: 'Joined', accessor: 'date_joined', Cell: ({ value }) => new Date(value).toLocaleDateString() },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEditUser(row.original)}>
            <Edit size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteUser(row.original.id)}>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users Management</h1>
        <Button onClick={handleCreateUser} startIcon={<PlusCircle size={20} />}>
          Create User
        </Button>
      </div>
      
      <Card>
        <Table columns={columns} data={users} />
      </Card>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        onUserCreated={fetchUsers}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onUserUpdated={fetchUsers}
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

const CreateUserModal = ({ isOpen, onRequestClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'customer',
    is_active: true,
    is_staff: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/admin/users/', formData);
      onUserCreated();
      onRequestClose();
      setFormData({ username: '', email: '', role: 'customer', is_active: true, is_staff: false }); // Reset form
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customModalStyles}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create New User</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
          <Input name="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <Input name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
          <select name="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="is_active_create" name="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label htmlFor="is_active_create" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Is Active</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="is_staff_create" name="is_staff" checked={formData.is_staff} onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label htmlFor="is_staff_create" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Is Staff</label>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onRequestClose}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const EditUserModal = ({ isOpen, onRequestClose, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    is_active: false,
    is_staff: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        is_staff: user.is_staff,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.patch(`/admin/users/${user.id}/`, {
        role: formData.role,
        is_active: formData.is_active,
        is_staff: formData.is_staff,
      });
      onUserUpdated();
      onRequestClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customModalStyles}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit User: {user?.username}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
          <select name="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="is_active_edit" name="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label htmlFor="is_active_edit" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Is Active</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="is_staff_edit" name="is_staff" checked={formData.is_staff} onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label htmlFor="is_staff_edit" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Is Staff</label>
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

export default UsersPage;
