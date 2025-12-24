import { useEffect, useState } from 'react';
import { Users as UsersIcon, Plus, Edit, Trash2, Search, Filter, UserPlus } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from 'react-modal';
<<<<<<< HEAD
=======
import { useAuth } from '../context/AuthContext';
>>>>>>> dev

Modal.setAppElement('#root');

const UsersPage = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      vendor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      customer: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${roleStyles[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
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
      Header: 'Username', 
      accessor: 'username',
      Cell: ({ value }) => (
        <span className="font-medium text-gray-900 dark:text-white">{value}</span>
      )
    },
    { 
      Header: 'Email', 
      accessor: 'email',
      Cell: ({ value }) => (
        <span className="text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    { 
      Header: 'Role', 
      accessor: 'role',
      Cell: ({ value }) => getRoleBadge(value)
    },
    { 
      Header: 'Status', 
      accessor: 'is_active', 
      Cell: ({ value }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      Header: 'Staff', 
      accessor: 'is_staff', 
      Cell: ({ value }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${value ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      Header: 'Joined', 
      accessor: 'date_joined', 
      Cell: ({ value }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString()}
        </span>
      )
<<<<<<< HEAD
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEditUser(row.original)}
            className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteUser(row.original.id)}
            className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

=======
    },
  ];

  if (isAdmin) {
    columns.push({
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEditUser(row.original)}
            className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteUser(row.original.id)}
            className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    });
  }

>>>>>>> dev
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading users...</p>
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
              <UsersIcon className="w-8 h-8 text-blue-500" />
              Users Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage system users and permissions</p>
          </div>
<<<<<<< HEAD
          <button
            onClick={handleCreateUser}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <UserPlus className="w-5 h-5" />
            Create User
          </button>
=======
          {isAdmin && (
            <button
              onClick={handleCreateUser}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <UserPlus className="w-5 h-5" />
              Create User
            </button>
          )}
>>>>>>> dev
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
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
            <Table columns={columns} data={users} />
          </div>
        </div>
      </div>

      {isAdmin && (
        <>
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
        </>
      )}
    </div>
  );
};

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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
      setFormData({ username: '', email: '', role: 'customer', is_active: true, is_staff: false });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customModalStyles}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New User</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
          <Input 
            name="username" 
            value={formData.username} 
            onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
            required 
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <Input 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            required 
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="is_active_create" 
            checked={formData.is_active} 
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} 
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_active_create" className="text-sm text-gray-700 dark:text-gray-300">
            Active Account
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="is_staff_create" 
            checked={formData.is_staff} 
            onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })} 
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_staff_create" className="text-sm text-gray-700 dark:text-gray-300">
            Staff Member
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            onClick={onRequestClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
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
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit User: {user?.username}</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="is_active_edit" 
            checked={formData.is_active} 
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} 
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_active_edit" className="text-sm text-gray-700 dark:text-gray-300">
            Active Account
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="is_staff_edit" 
            checked={formData.is_staff} 
            onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })} 
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_staff_edit" className="text-sm text-gray-700 dark:text-gray-300">
            Staff Member
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            onClick={onRequestClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UsersPage;