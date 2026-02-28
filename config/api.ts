// config/api.js
import axios from "axios";

const getToken = () => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.token;
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

const api = axios.create({
  baseURL: "http://localhost:5000", // Base URL without /api
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor to add token dynamically
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;