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

const authService = {
  login,
  register,
  logout,
};

export default authService;
