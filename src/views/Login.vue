<template>
  <div class="login-container">
    <div class="navbar">
      <div class="brand">
        <span>SIPAC Dashboard</span>
      </div>
      
      <div class="nav-links">
        <router-link to="/dashboard" class="nav-link">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </router-link>
        <router-link to="/profile" class="nav-link">
          <i class="fas fa-user"></i> Perfil
        </router-link>
        <router-link to="/register" class="nav-link">
          <i class="fas fa-user-plus"></i> Registrarse
        </router-link>
        <router-link to="/login" class="nav-link active">
          <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
        </router-link>
      </div>
    </div>
    
    <div class="content">
      <div class="login-section">
        <div class="login-form-wrapper">
          <!-- Remove the logo container that's causing the error -->
          <!-- <div class="logo-container">
            <img src="@/assets/img/sipac-logo.png" alt="SIPAC Logo" class="sipac-logo" />
          </div> -->
          <h2 class="login-title">Iniciar Sesión</h2>
          <p class="login-subtitle">Introduzca sus credenciales para acceder</p>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                class="form-control" 
                placeholder="Usuario" 
                required
              />
            </div>
            
            <div class="form-group">
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                class="form-control" 
                placeholder="Contraseña" 
                required
              />
            </div>
            
            <div class="form-check">
              <input type="checkbox" id="remember" v-model="rememberMe" class="form-check-input" />
              <label for="remember" class="form-check-label">Recuérdame</label>
            </div>
            
            <button type="submit" class="btn-signin" :disabled="loading">
              {{ loading ? 'Iniciando sesión...' : 'Autenticar' }}
            </button>
          </form>
          
          <p class="signup-text">
            ¿No tiene una cuenta? <router-link to="/register" class="signup-link">Registrar</router-link>
          </p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="sipac-branding">
        <span>Sistema de Planificación de Actividades</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/auth.service';

const router = useRouter();
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const rememberMe = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  debugger
  
  try {
    const response = await authService.login(username.value, password.value);

    console.log('Respuesta completa:', response);
    
    // Verificar si hay token en cualquiera de las posibles ubicaciones
    const hasToken = response && (
      response.access || 
      response.token || 
      (response.data && (response.data.access || response.data.token))
    );
    
    if (hasToken) {
      console.log('Autenticación exitosa, redirigiendo al dashboard');
      // Forzar la redirección al dashboard después de la autenticación exitosa
      router.push('/dashboard');
    } else {
      console.warn('No se encontró token en la respuesta:', response);
      error.value = 'Credenciales inválidas o formato de respuesta inesperado';
    }
  } catch (err) {
    console.error('Error durante el inicio de sesión:', err);
    error.value = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Añade este estilo para el mensaje de error */
.error-message {
  background-color: #ffebee;
  color: #f44336;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/img/xedro.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-family: 'Open Sans', sans-serif;
  position: relative;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.brand {
  font-weight: 700;
  font-size: 1.2rem;
  color: #5e2c8a;
}

.nav-links {
  display: flex;
  gap: 25px;
}

.nav-link {
  color: #67748e;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 5px;
}

.nav-link.active, .nav-link:hover {
  color: #5e2c8a;
  background-color: rgba(94, 44, 138, 0.1);
  font-weight: 600;
}

.content {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-section {
  width: 100%;
  max-width: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form-wrapper {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.sipac-logo {
  height: 60px;
  margin-bottom: 10px;
}

.login-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #5e2c8a;
  margin-bottom: 10px;
}

.login-subtitle {
  color: #67748e;
  margin-bottom: 30px;
  font-size: 0.95rem;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d2d6da;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background-color: rgba(255, 255, 255, 0.8);
}

.form-control:focus {
  border-color: #5e2c8a;
  outline: none;
  box-shadow: 0 0 0 3px rgba(94, 44, 138, 0.15);
  background-color: white;
}

.form-check {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  justify-content: flex-start;
}

.form-check-input {
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #5e2c8a;
}

.form-check-label {
  color: #67748e;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-signin {
  background-color: #5e2c8a;
  color: white;
  border: none;
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-signin:hover {
  background-color: #4a2370;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(94, 44, 138, 0.3);
}

.btn-signin:disabled {
  background-color: #a78bc7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.signup-text {
  margin-top: 25px;
  color: #67748e;
  font-size: 0.95rem;
  text-align: center;
}

.signup-link {
  color: #5e2c8a;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.signup-link:hover {
  color: #4a2370;
  text-decoration: underline;
}

.footer {
  padding: 15px 30px;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.sipac-branding {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #5e2c8a;
  font-weight: 600;
}

.footer-logo {
  height: 30px;
}

@media (max-width: 992px) {
  .navbar {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .login-section {
    padding: 10px;
  }
  
  .login-form-wrapper {
    padding: 30px 20px;
  }
}
</style>