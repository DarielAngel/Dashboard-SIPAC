import axios from 'axios';
import authService from './auth.service';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8001/v1/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token de autenticación a todas las solicitudes
apiClient.interceptors.request.use(
  config => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta (como token expirado)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;