// src/api/index.js
import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: '/api', // In production, this would point to your API Gateway URL
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle auth errors (401, 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Redirect to login or refresh token
      console.log('Authentication error');
    }
    return Promise.reject(error);
  }
);

export default apiClient;