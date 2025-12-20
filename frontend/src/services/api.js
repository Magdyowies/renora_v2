import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Adjust this to your backend URL
});

api.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (tokens?.access) {
      config.headers['Authorization'] = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        if (!tokens?.refresh) {
          // Handle logout, e.g., redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const rs = await axios.post('http://127.0.0.1:8000/api/auth/refresh/', {
          refresh: tokens.refresh,
        });

        const newTokens = {
            access: rs.data.access,
            refresh: tokens.refresh, // Sometimes refresh token is also rotated
        };
        
        localStorage.setItem('tokens', JSON.stringify(newTokens));
        api.defaults.headers.common['Authorization'] = `Bearer ${newTokens.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
        
        return api(originalRequest);
      } catch (_error) {
        // Handle logout
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        window.location.href = '/login';
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
