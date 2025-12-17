import axios from "axios";

const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem("access_token", response.data.access);
          error.config.headers.Authorization = `Bearer ${response.data.access}`;
          return api.request(error.config);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register/", data),
  login: (data) => api.post("/auth/login/", data),
  getProfile: () => api.get("/auth/profile/"),
  updateProfile: (data) => api.patch("/auth/profile/", data),
  updateUserProfile: (data) => api.patch("/auth/profile/update/", data),
};

export const vehicleAPI = {
  getAll: (params) => api.get("/vehicles/", { params }),
  getById: (id) => api.get(`/vehicles/${id}/`),
  getCategories: () => api.get("/vehicles/categories/"),
  create: (data) => api.post("/vehicles/create/", data),
  update: (id, data) => api.patch(`/vehicles/${id}/`, data),
  delete: (id) => api.delete(`/vehicles/${id}/`),
  getMyVehicles: () => api.get("/vehicles/my/"),
};

export const bookingAPI = {
  create: (data) => api.post("/bookings/", data),
  getMyBookings: () => api.get("/bookings/my/"),
  getById: (id) => api.get(`/bookings/${id}/`),
  cancel: (id) => api.post(`/bookings/${id}/cancel/`),
  getVendorBookings: () => api.get("/bookings/vendor/"),
  updateStatus: (id, status) => api.post(`/bookings/${id}/status/`, { status }),
};

export const paymentAPI = {
  create: (data) => api.post("/payments/create/", data),
  getHistory: () => api.get("/payments/history/"),
  getWallet: () => api.get("/payments/wallet/"),
  topUpWallet: (amount) => api.post("/payments/wallet/topup/", { amount }),
  validatePromoCode: (code, amount) =>
    api.post("/payments/promo-codes/validate/", {
      code,
      booking_amount: amount,
    }),
};

export const reviewAPI = {
  create: (data) => api.post("/reviews/", data),
  getByVehicle: (vehicleId) => api.get(`/reviews/vehicle/${vehicleId}/`),
  getMyReviews: () => api.get("/reviews/my/"),
};

export const chatAPI = {
  getSessions: () => api.get("/chat/sessions/"),
  createSession: () => api.post("/chat/sessions/create/"),
  getSession: (id) => api.get(`/chat/sessions/${id}/`),
  sendMessage: (id, content) =>
    api.post(`/chat/sessions/${id}/send/`, { content }),
  closeSession: (id) => api.post(`/chat/sessions/${id}/close/`),
};

export const adminAPI = {
  getStats: () => api.get("/admin/stats/"),
  getRevenueChart: (days = 30) => api.get(`/admin/revenue-chart/?days=${days}`),
  getBookingChart: (days = 30) => api.get(`/admin/booking-chart/?days=${days}`),
  getUsers: () => api.get("/admin/users/"),
  getVehicles: () => api.get("/admin/vehicles/"),
};

export default api;
