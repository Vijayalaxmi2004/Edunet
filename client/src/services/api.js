import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  getUsers: () => api.get('/auth/users'),
};

// Project endpoints
export const projectAPI = {
  create: (data) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (projectId, data) => api.post(`/projects/${projectId}/members`, data),
  removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
};

// Task endpoints
export const taskAPI = {
  create: (projectId, data) => api.post(`/tasks/projects/${projectId}/tasks`, data),
  getProjectTasks: (projectId) => api.get(`/tasks/projects/${projectId}/tasks`),
  getById: (taskId) => api.get(`/tasks/tasks/${taskId}`),
  update: (taskId, data) => api.put(`/tasks/tasks/${taskId}`, data),
  delete: (taskId) => api.delete(`/tasks/tasks/${taskId}`),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getDashboard: () => api.get('/tasks/dashboard'),
};

export default api;
