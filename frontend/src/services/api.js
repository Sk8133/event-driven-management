import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const normalizeApiUrl = (url) => {
  if (!url) return 'http://localhost:5000/api';
  const trimmed = url.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiUrl(rawApiUrl);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;