import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

// Add request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});