import axios from 'axios';
const API_URL = 'http://localhost:5011/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getBusinessInfo = (slug) => api.get(`/business/${slug}`);
export const getAvailability = (params) => api.get('/availability', { params });
export const createBooking = (data) => api.post('/bookings', data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);

// Auth
export const loginBusiness = (email, password) => api.post('/auth/login', { email, password });
export const registerBusiness = (data) => api.post('/auth/register', data);
export const getMe = (token) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });

// Dashboard
export const getAppointments = (token, startDate, endDate) => api.get('/dashboard/appointments', { 
  headers: { Authorization: `Bearer ${token}` },
  params: { startDate, endDate } 
});
export const getAppointmentById = (token, id) => api.get(`/dashboard/appointments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const updateAppointmentStatus = (token, id, status) => api.patch(`/dashboard/appointments/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
export const getTodayStats = (token) => api.get('/dashboard/stats/today', { headers: { Authorization: `Bearer ${token}` } });

// Settings - Profile & Hours
export const getProfile = (token) => api.get('/settings/profile', { headers: { Authorization: `Bearer ${token}` } });
export const updateProfile = (token, data) => api.put('/settings/profile', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateHours = (token, operatingHours) => api.put('/settings/hours', { operatingHours }, { headers: { Authorization: `Bearer ${token}` } });
export const updatePassword = (token, currentPassword, newPassword) => api.put('/settings/password', { currentPassword, newPassword }, { headers: { Authorization: `Bearer ${token}` } });

// Settings - Services
export const getServices = (token) => api.get('/settings/services', { headers: { Authorization: `Bearer ${token}` } });
export const createService = (token, data) => api.post('/settings/services', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateService = (token, id, data) => api.put(`/settings/services/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const toggleServiceActive = (token, id) => api.patch(`/settings/services/${id}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` } });
export const deleteService = (token, id) => api.delete(`/settings/services/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Settings - Staff
export const getStaff = (token) => api.get('/settings/staff', { headers: { Authorization: `Bearer ${token}` } });
export const createStaff = (token, data) => api.post('/settings/staff', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateStaff = (token, id, data) => api.put(`/settings/staff/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteStaff = (token, id) => api.delete(`/settings/staff/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export default api;
