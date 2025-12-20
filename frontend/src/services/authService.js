import api from './api';

/* ---------------- LOGIN ---------------- */
const login = async (email, password) => {
  const response = await api.post('/auth/login/', {
    email,
    password,
  });

  if (response.data.tokens) {
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
  }

  return response.data;
};

/* ---------------- REGISTER ---------------- */
const register = async (payload) => {
  const response = await api.post('/auth/register/', payload);
  return response.data;
};

/* ---------------- LOGOUT ---------------- */
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('tokens');
};

/* ---------------- VERIFY TOKEN ---------------- */
const verifyToken = () => {
  const tokens = JSON.parse(localStorage.getItem('tokens'));
  if (!tokens) return Promise.reject('No token found');

  return api.get('/auth/verify-token/');
};

const authService = {
  login,
  register,
  logout,
  verifyToken,
};

export default authService;
