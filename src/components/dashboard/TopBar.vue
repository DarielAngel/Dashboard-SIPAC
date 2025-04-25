<template>
  <div class="topbar">
    <div class="search-bar">
      <input type="text" placeholder="Type here..." />
    </div>
    <div class="user-menu">
      <span class="welcome-text">Bienvenido, {{ username }}</span>
      <button class="logout-btn" @click="logout">Cerrar sesión</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../../services/auth.service';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
});

const router = useRouter();

const username = computed(() => {
  return props.user?.username || 'admin';
});

const logout = () => {
  // Llamar al método de logout del servicio de autenticación
  authService.logout();
  
  // Redireccionar al usuario a la página de login
  router.push('/login');
};
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  border-bottom: 1px solid #e3e6f0;
  margin-bottom: 20px;
}

.search-bar input {
  padding: 8px 15px;
  border-radius: 20px;
  border: 1px solid #d1d3e2;
  width: 250px;
  font-size: 0.85rem;
}

.user-menu {
  display: flex;
  align-items: center;
}

.welcome-text {
  margin-right: 15px;
  font-size: 0.9rem;
  color: #5a5c69;
}

.logout-btn {
  padding: 6px 15px;
  background-color: #e74a3b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #d52a1a;
}

@media (max-width: 768px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-bar {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .search-bar input {
    width: 100%;
  }
  
  .user-menu {
    width: 100%;
    justify-content: space-between;
  }
}
</style>