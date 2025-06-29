import axios from 'axios';
import authService from './authService';    
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
    // Si el error es 401 (Unauthorized), el token ha expirado
    if (error.response && error.response.status === 401 && 
        !error.config.url.includes('/auth/login')) {
      // Solo redirigir si no es una solicitud de login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;