import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ===== AUTH API =====
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ===== TICKET API =====
export const ticketApi = {
  create: (data) => api.post('/tickets', data),
  getAll: () => api.get('/tickets'),
  getMy: () => api.get('/tickets/my'),
  getByUser: (userId) => api.get(`/tickets/user/${userId}`),
  getByDepartment: (category) => api.get(`/tickets/department/${category}`),
  getUnassigned: (category) => api.get(`/tickets/department/${category}/unassigned`),
  getById: (id) => api.get(`/tickets/${id}`),
  assign: (id, data) => api.put(`/tickets/${id}/assign`, data),
  updateStatus: (id, data) => api.put(`/tickets/${id}/status`, data),
  resolve: (id, data) => api.put(`/tickets/${id}/resolve`, data),
};

// ===== DEPARTMENT API =====
export const departmentApi = {
  getAll: () => api.get('/departments'),
  getScores: () => api.get('/departments/scores'),
  getStats: (id) => api.get(`/departments/${id}/stats`),
  getMembers: (id) => api.get(`/departments/${id}/members`),
};

// ===== ADMIN API =====
export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  getStats: () => api.get('/admin/stats'),
};

export default api;
