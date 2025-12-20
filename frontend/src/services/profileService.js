import api from './api';

const getProfile = async () => {
  const response = await api.get('/auth/profile/');
  return response.data;
};

const updateProfile = async (profileData) => {
  const isFormData = profileData instanceof FormData;

  const response = await api.put(
    '/auth/profile/update/',
    profileData,
    isFormData
      ? {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      : {}
  );

  return response.data;
};

const profileService = {
  getProfile,
  updateProfile,
};

export default profileService;
