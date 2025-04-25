import axios from 'axios';

// URL de la API para autenticación
const API_URL = 'http://127.0.0.1:8001/v1/seguridad/api-token-auth/';

class AuthService {
  // Iniciar sesión con la API
  async login(username, password) {
    debugger

    try {
      // Codificar la contraseña en base64 como requiere la API
      password = btoa(password);
      
      console.log('Intentando autenticar usuario:', username);
      
      // Llamada real a la API de autenticación
      const response = await axios.post(API_URL, {
        username,
        password
      });
      
      console.log('Respuesta completa de autenticación:', response);
      console.log('Datos de respuesta:', response.data);
      
      // Verificar la estructura de la respuesta
      const token = response.data.access || response.data.token;
      console.log('Token encontrado:', token);
      
      if (token) {
        // Normalizar la respuesta para tener una estructura consistente
        const userData = {
          ...response.data,
          access: token // Asegurar que siempre exista la propiedad access
        };
        
        // Guardar los datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else {
        // Si no hay token pero hay respuesta
        console.warn('Respuesta sin token de acceso:', response.data);
        
        // Verificar si hay alguna otra propiedad que pueda contener el token
        const responseKeys = Object.keys(response.data);
        console.log('Propiedades disponibles en la respuesta:', responseKeys);
        
        // Si hay alguna propiedad que parece ser un token, usarla
        if (responseKeys.some(key => key.includes('token') || key.includes('access'))) {
          localStorage.setItem('user', JSON.stringify(response.data));
          return response.data;
        }
        
        throw new Error('No se encontró token en la respuesta');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      
      // Para desarrollo, permitir autenticación simulada si la API no está disponible
      if (error.message && (error.message.includes('Network Error') || error.message.includes('ECONNREFUSED'))) {
        console.log('API no disponible, usando autenticación simulada');
        const mockUser = {
          username: username,
          access: 'mock-token-for-development',
          is_test_user: true
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        return mockUser;
      }
      
      throw error;
    }
  }

  // Cerrar sesión
  async logout() {
    localStorage.removeItem('user');

    const response = await axios.post('http://127.0.0.1:8001/v1/seguridad/logout/', {});
  }

  // Registrar un nuevo usuario
  register(username, email, password) {
    return axios.post(API_URL + 'register/', {
      username,
      email,
      password
    });
  }

  // Obtener usuario actual desde localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error al parsear datos de usuario:', e);
      return null;
    }
  }

  // Obtener token de autenticación
  getToken() {
    const user = this.getCurrentUser();
    if (!user) return '';
    
    // Buscar el token en diferentes propiedades posibles
    return user.access || user.token || 
           (user.data && (user.data.access || user.data.token)) || '';
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.getToken();
  }
}



export default new AuthService();