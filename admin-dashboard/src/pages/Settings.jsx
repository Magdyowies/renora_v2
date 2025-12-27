import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { User, Key, Building } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateUser } = useAuth(); // Assuming useAuth provides a way to update local user state
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/account/me/');
        setProfileData({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          phone: response.data.phone || '',
          company_name: response.data.company_name || '',
        });
      } catch (err) {
        toast.error('Failed to fetch profile data.');
        console.error('Fetch profile error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileErrors({});
    try {
      const response = await api.patch('/account/me/', profileData);
      updateUser(response.data); // Update user context with the new data from the backend
      toast.success('Profile updated successfully!');
    } catch (err) {
      if (err.response?.data) {
        setProfileErrors(err.response.data);
      }
      toast.error('Failed to update profile.');
      console.error('Update profile error:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordErrors({});

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      const errorMsg = 'New passwords do not match.';
      setPasswordErrors({ new_password_confirm: [errorMsg] });
      toast.error(errorMsg);
      setPasswordLoading(false);
      return;
    }

    try {
      await api.post('/account/change-password/', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      toast.success('Password changed successfully!');
      setPasswordData({ old_password: '', new_password: '', new_password_confirm: '' });
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        if (errorData.detail) {
          toast.error(errorData.detail);
          setPasswordErrors({ non_field_errors: [errorData.detail] });
        } else {
          setPasswordErrors(errorData);
          // Show a generic message, but specific errors will be displayed by fields
          toast.error('Please correct the errors below.');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
      console.error('Change password error:', err);
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputClass = "bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";
  const errorClass = "text-red-400 text-xs mt-1";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <User className="w-8 h-8 text-blue-500" />
          Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your profile information and security settings.</p>

        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" /> Profile Information
          </h2>
          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email (Read-only)</label>
              <input type="email" id="email" name="email" value={user?.email || ''} className={`${inputClass} cursor-not-allowed`} readOnly disabled />
            </div>
            <div>
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-300">Role (Read-only)</label>
              <span className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {user?.role?.toUpperCase()}
              </span>
            </div>
            <div>
              <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-300">First Name</label>
              <input type="text" id="first_name" name="first_name" value={profileData.first_name} onChange={handleProfileChange} className={inputClass} />
              {profileErrors.first_name && <p className={errorClass}>{profileErrors.first_name}</p>}
            </div>
            <div>
              <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-300">Last Name</label>
              <input type="text" id="last_name" name="last_name" value={profileData.last_name} onChange={handleProfileChange} className={inputClass} />
              {profileErrors.last_name && <p className={errorClass}>{profileErrors.last_name}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-300">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={profileData.phone} onChange={handleProfileChange} className={inputClass} />
              {profileErrors.phone && <p className={errorClass}>{profileErrors.phone}</p>}
            </div>
            {user?.role === 'vendor' && (
              <div>
                <label htmlFor="company_name" className="block mb-2 text-sm font-medium text-gray-300">Company Name</label>
                <input type="text" id="company_name" name="company_name" value={profileData.company_name} onChange={handleProfileChange} className={inputClass} />
                {profileErrors.company_name && <p className={errorClass}>{profileErrors.company_name}</p>}
              </div>
            )}
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors" disabled={profileLoading}>
                {profileLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Key className="w-5 h-5" /> Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {passwordErrors.non_field_errors && <p className={`${errorClass} md:col-span-2`}>{passwordErrors.non_field_errors.join(' ')}</p>}
            <div>
              <label htmlFor="old_password" className="block mb-2 text-sm font-medium text-gray-300">Current Password</label>
              <input type="password" id="old_password" name="old_password" value={passwordData.old_password} onChange={handlePasswordChange} className={inputClass} required />
              {passwordErrors.old_password && <p className={errorClass}>{passwordErrors.old_password.join(' ')}</p>}
            </div>
            <div></div> {/* Placeholder for grid alignment */}
            <div>
              <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-300">New Password</label>
              <input type="password" id="new_password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} className={inputClass} required />
              {passwordErrors.new_password && <p className={errorClass}>{passwordErrors.new_password.join(' ')}</p>}
            </div>
            <div>
              <label htmlFor="new_password_confirm" className="block mb-2 text-sm font-medium text-gray-300">Confirm New Password</label>
              <input type="password" id="new_password_confirm" name="new_password_confirm" value={passwordData.new_password_confirm} onChange={handlePasswordChange} className={inputClass} required />
              {passwordErrors.new_password_confirm && <p className={errorClass}>{passwordErrors.new_password_confirm.join(' ')}</p>}
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors" disabled={passwordLoading}>
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
