<template>
  <div class="login-container">
    <div class="navbar">
      <div class="brand">
        <span>Argon Dashboard 2</span>
      </div>
      
      <div class="nav-links">
        <router-link to="/dashboard" class="nav-link">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </router-link>
        <router-link to="/profile" class="nav-link">
          <i class="fas fa-user"></i> Profile
        </router-link>
        <router-link to="/register" class="nav-link">
          <i class="fas fa-user-plus"></i> Sign Up
        </router-link>
        <router-link to="/login" class="nav-link active">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </router-link>
      </div>
      
      <div class="download-btn">
        <button class="btn-download">Free download</button>
      </div>
    </div>
    
    <div class="content">
      <div class="login-section">
        <div class="login-form-wrapper">
          <h2 class="login-title">Sign In</h2>
          <p class="login-subtitle">Enter your username and password to sign in</p>
          
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
                placeholder="Username" 
                required
              />
            </div>
            
            <div class="form-group">
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                class="form-control" 
                placeholder="Password" 
                required
              />
            </div>
            
            <div class="form-check">
              <input type="checkbox" id="remember" v-model="rememberMe" class="form-check-input" />
              <label for="remember" class="form-check-label">Remember me</label>
            </div>
            
            <button type="submit" class="btn-signin" :disabled="loading">
              {{ loading ? 'Iniciando sesión...' : 'Sign In' }}
            </button>
          </form>
          
          <p class="signup-text">
            Don't have an account? <router-link to="/register" class="signup-link">Sign up</router-link>
          </p>
        </div>
      </div>
      
      <div class="quote-section">
        <div class="quote-content">
          <h3 class="quote-title">"Attention is the new currency"</h3>
          <p class="quote-text">The more effortless the writing looks, the more effort the writer actually put into the process.</p>
        </div>
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
const rememberMe = ref(false);
const error = ref('');
const loading = ref(false);

// Usuario de prueba para acceso de emergencia
const testUser = {
  username: 'admin',
  password: 'admin123'
};

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  
  // Verificar si son las credenciales del usuario de prueba
  if (username.value === testUser.username && password.value === testUser.password) {
    // Crear un usuario simulado para el almacenamiento local
    const mockUserData = {
      access: 'mock-jwt-token',
      refresh: 'mock-refresh-token',
      username: testUser.username,
      is_test_user: true
    };
    
    // Guardar en localStorage como lo haría el servicio de autenticación
    localStorage.setItem('user', JSON.stringify(mockUserData));
    
    // Redirigir al dashboard
    setTimeout(() => {
      loading.value = false;
      router.push('/dashboard');
    }, 800); // Pequeño retraso para simular la autenticación
    
    return;
  }
  
  try {
    // Intento normal de inicio de sesión con la API
    await authService.login(username.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    console.error('Error de inicio de sesión:', err);
    error.value = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
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
  background-color: #f8f9fa;
  font-family: 'Open Sans', sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
}

.brand {
  font-weight: 700;
  font-size: 1.1rem;
  color: #344767;
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
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link.active, .nav-link:hover {
  color: #344767;
  font-weight: 600;
}

.btn-download {
  background-color: #35d1a0;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-download:hover {
  background-color: #2bb389;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(53, 209, 160, 0.3);
}

.content {
  display: flex;
  flex: 1;
}

.login-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #344767;
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
  padding: 12px 16px;
  border: 1px solid #d2d6da;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.form-control:focus {
  border-color: #35d1a0;
  outline: none;
  box-shadow: 0 0 0 3px rgba(53, 209, 160, 0.15);
}

.form-check {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.form-check-input {
  margin-right: 10px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.form-check-label {
  color: #67748e;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-signin {
  background-color: #35d1a0;
  color: white;
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-signin:hover {
  background-color: #2bb389;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(53, 209, 160, 0.3);
}

.signup-text {
  margin-top: 25px;
  color: #67748e;
  font-size: 0.9rem;
  text-align: center;
}

.signup-link {
  color: #35d1a0;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.signup-link:hover {
  color: #2bb389;
  text-decoration: underline;
}

.quote-section {
  flex: 1;
  background-color: #35d1a0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.quote-content {
  color: white;
  text-align: center;
  max-width: 80%;
  padding: 2rem;
}

.quote-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.quote-text {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
}

@media (max-width: 992px) {
  .content {
    flex-direction: column;
  }
  
  .quote-section {
    display: none;
  }
  
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
    padding: 20px;
  }
}
</style>