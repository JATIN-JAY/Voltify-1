import axios from 'axios';

// Determine API base URL
const apiUrl = import.meta.env.VITE_API_URL;
let baseURL;

if (apiUrl && apiUrl.includes('http')) {
  // Production: VITE_API_URL is a full domain (e.g., https://voltify-1-1.onrender.com)
  // Append /api if not already present
  baseURL = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
} else {
  // Development: Use /api (Vite proxies this to localhost:5004)
  baseURL = '/api';
}

const api = axios.create({
  baseURL: baseURL,
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
