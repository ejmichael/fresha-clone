import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5011/api',
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('saas_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically handle expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('saas_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Public booking routes (no token needed)
export const getBusinessInfo = (slug) => api.get(`/business/${slug}`);
export const getAvailability = (params) => api.get('/availability', { params });
export const createBooking = (data) => api.post('/bookings', data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);

// Auth
export const loginBusiness = (email, password) => api.post('/auth/login', { email, password });
export const registerBusiness = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Dashboard
export const getAppointments = (startDate, endDate) => api.get('/dashboard/appointments', { params: { startDate, endDate } });
export const getAppointmentById = (id) => api.get(`/dashboard/appointments/${id}`);
export const updateAppointmentStatus = (id, status) => api.patch(`/dashboard/appointments/${id}/status`, { status });
export const getTodayStats = () => api.get('/dashboard/stats/today');

// Settings - Profile & Hours
export const getProfile = () => api.get('/settings/profile');
export const updateProfile = (data) => api.put('/settings/profile', data);
export const updateHours = (operatingHours) => api.put('/settings/hours', { operatingHours });
export const updatePassword = (currentPassword, newPassword) => api.put('/settings/password', { currentPassword, newPassword });

// Settings - Services
export const getServices = () => api.get('/settings/services');
export const createService = (data) => api.post('/settings/services', data);
export const updateService = (id, data) => api.put(`/settings/services/${id}`, data);
export const toggleServiceActive = (id) => api.patch(`/settings/services/${id}/toggle`, {});
export const deleteService = (id) => api.delete(`/settings/services/${id}`);

// Settings - Staff
export const getStaff = () => api.get('/settings/staff');
export const createStaff = (data) => api.post('/settings/staff', data);
export const updateStaff = (id, data) => api.put(`/settings/staff/${id}`, data);
export const deleteStaff = (id) => api.delete(`/settings/staff/${id}`);

export default api;