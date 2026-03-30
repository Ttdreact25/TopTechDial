import axios from 'axios';

const isProduction = window.location.hostname === 'toptechdial.com';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
           (isProduction ? 'https://toptechdial.com/api' : 'http://localhost/TopTechDial_php/TopTechDial/api'),
});

// Add Interceptor to attach JWT token if available in LocalStorage
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
