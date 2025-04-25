// Servicio de autenticación
class AuthService {
  constructor() {
    this.tokenKey = 'auth-token';
    this.userKey = 'auth-user';
  }

  // Iniciar sesión
  login(username, password) {
    // Aquí normalmente harías una llamada a la API
    // Simulamos una respuesta exitosa
    const token = 'sample-jwt-token';
    const user = {
      id: 1,
      username: username,
      email: `${username}@example.com`,
      roles: ['ROLE_USER']
    };

    // Guardar token y datos de usuario en localStorage
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));

    return user;
  }

  // Cerrar sesión
  logout() {
    // Eliminar token y datos de usuario del localStorage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    // También podríamos hacer una llamada a la API para invalidar el token en el servidor
    console.log('Usuario desautenticado correctamente');
  }

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem(this.tokenKey);
    return !!token; // Convertir a booleano
  }

  // Obtener token de autenticación
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
}

export default new AuthService();