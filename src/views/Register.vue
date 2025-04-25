<template>
  <div class="register-container">
    <div class="register-content">
      <div class="register-header">
        <h1 class="welcome-title">Welcome!</h1>
        <p class="welcome-subtitle">Use these awesome forms to login or create new account in your project for free.</p>
      </div>
      
      <div class="register-card">
        <h4 class="text-center mb-4">Register with</h4>
        
        <div class="social-buttons mb-4">
          <button class="btn-social facebook">
            <i class="fab fa-facebook-f"></i>
          </button>
          <button class="btn-social apple">
            <i class="fab fa-apple"></i>
          </button>
          <button class="btn-social google">
            <i class="fab fa-google"></i>
          </button>
        </div>
        
        <div class="divider">
          <span>or</span>
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleRegister" class="mt-4 form-container">
          <div class="form-group mb-4">
            <input 
              type="text" 
              v-model="name" 
              class="form-control" 
              placeholder="Name" 
              required
            />
          </div>
          
          <div class="form-group mb-4">
            <input 
              type="email" 
              v-model="email" 
              class="form-control" 
              placeholder="Email" 
              required
            />
          </div>
          
          <div class="form-group mb-4">
            <input 
              type="password" 
              v-model="password" 
              class="form-control" 
              placeholder="Password" 
              required
            />
          </div>
          
          <div class="form-check mb-4">
            <input type="checkbox" id="terms" v-model="agreeTerms" class="form-check-input" required />
            <label for="terms" class="form-check-label">
              I agree the <a href="#" class="terms-link">Terms and Conditions</a>
            </label>
          </div>
          
          <button type="submit" class="btn btn-dark w-100 py-3" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Sign up' }}
          </button>
        </form>
        
        <p class="mt-4 text-center">
          Already have an account? <router-link to="/login" class="login-link">Sign in</router-link>
        </p>
      </div>
      
      <div class="footer-links">
        <a href="#" class="footer-link">Company</a>
        <a href="#" class="footer-link">About Us</a>
        <a href="#" class="footer-link">Team</a>
        <a href="#" class="footer-link">Products</a>
        <a href="#" class="footer-link">Blog</a>
        <a href="#" class="footer-link">Pricing</a>
      </div>
      
      <div class="social-links">
        <a href="#" class="social-link"><i class="fab fa-dribbble"></i></a>
        <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
        <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
        <a href="#" class="social-link"><i class="fab fa-pinterest"></i></a>
        <a href="#" class="social-link"><i class="fab fa-github"></i></a>
      </div>
      
      <div class="copyright">
        <p>Copyright © 2023 Soft by Creative Tim.</p>
      </div>
    </div>
    
    <div class="free-download">
      <button class="btn btn-light btn-sm">Free download</button>
    </div>
    
    <div class="brand">
      <span>Argon Dashboard 2</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/auth.service';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const agreeTerms = ref(false);
const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  if (!agreeTerms.value) {
    error.value = 'Por favor, acepta los términos y condiciones';
    return;
  }
  
  error.value = '';
  loading.value = true;
  
  try {
    await authService.register(name.value, email.value, password.value);
    router.push('/login?registered=true');
  } catch (err) {
    console.error('Error de registro:', err);
    error.value = 'Error al registrar. Por favor, inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.error-message {
  background-color: #ffebee;
  color: #f44336;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.register-container {
  min-height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: white;
}

.register-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 0;
}

.register-content {
  position: relative;
  z-index: 1;
  max-width: 550px;
  width: 100%;
  text-align: center;
  margin: 0 auto;
}

.register-header {
  margin-bottom: 3rem;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.welcome-subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
  max-width: 90%;
  margin: 0 auto;
  line-height: 1.7;
  font-weight: 300;
  letter-spacing: 0.3px;
}

.register-card {
  background: white;
  border-radius: 1.2rem;
  padding: 3rem;
  color: #344767;
  box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto 3rem;
  max-width: 90%;
}

/* Nuevo estilo para el contenedor del formulario */
.form-container {
  width: 90%;
  margin: 0 auto;
}

.register-card h4 {
  font-weight: 600;
  margin-bottom: 1.8rem;
  color: #344767;
  font-size: 1.3rem;
  letter-spacing: 0.3px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.btn-social {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-social:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.15);
}

.facebook {
  background-color: #3b5998;
  color: white;
}

.apple {
  background-color: #000;
  color: white;
}

.google {
  background-color: #db4437;
  color: white;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 2.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e9ecef;
}

.divider span {
  padding: 0 2rem;
  color: #8392ab;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.form-group {
  margin-bottom: 2rem;
}

.form-control {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 1px solid #d2d6da;
  border-radius: 0.7rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.2px;
}

.form-control:focus {
  border-color: #35d1a0;
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(53, 209, 160, 0.25);
}

.form-control::placeholder {
  color: #adb5bd;
  font-weight: 300;
}

.form-check {
  display: flex;
  align-items: center;
  margin: 2rem 0;
}

.form-check-input {
  margin-right: 0.8rem;
  width: 20px;
  height: 20px;
}

.form-check-label {
  font-size: 1rem;
  color: #67748e;
  letter-spacing: 0.2px;
}

.terms-link {
  color: #344767;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.terms-link:hover {
  color: #35d1a0;
}

.btn {
  padding: 1rem 1.5rem;
  border-radius: 0.7rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
}

.btn-dark {
  background-color: #344767;
  color: white;
}

.btn-dark:hover {
  background-color: #283652;
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.15);
}

.login-link {
  color: #35d1a0;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  letter-spacing: 0.2px;
}

.login-link:hover {
  text-decoration: underline;
}

.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 3rem;
}

.footer-link {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.footer-link:hover {
  opacity: 1;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.social-link {
  color: white;
  font-size: 1.25rem;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.social-link:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.copyright {
  margin-top: 2rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.free-download {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 2;
}

.free-download .btn {
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  border-radius: 0.5rem;
}

.brand {
  position: absolute;
  bottom: 2.5rem;
  left: 2.5rem;
  z-index: 2;
  font-weight: 700;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .register-container {
    padding: 1.5rem;
  }
  
  .register-card {
    padding: 2rem;
    max-width: 100%;
  }
  
  .welcome-title {
    font-size: 2.2rem;
  }
  
  .welcome-subtitle {
    font-size: 1.1rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }
  
  .brand {
    display: none;
  }
}
</style>