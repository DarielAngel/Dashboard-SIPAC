<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">S</span>
        <span class="logo-text">Dashboard - SIPAC</span>
      </div>
    </div>
    
    <div class="sidebar-menu">
      <div class="menu-item" 
           :class="{ active: activeItem === 'dashboard' }"
           @click="changeSection('dashboard')">
        Dashboard
      </div>
      
      <div class="menu-item" 
           :class="{ active: activeItem === 'tables' }"
           @click="changeSection('tables')">
        Tables
      </div>

      <div class="menu-item" 
           :class="{ active: activeItem === 'planes' }"
           @click="changeSection('planes')">
        Planes
      </div>
      
      <div class="menu-item" 
           :class="{ active: activeItem === 'billing' }"
           @click="changeSection('billing')">
        Billing
      </div>
      
      <div class="menu-item" 
           :class="{ active: activeItem === 'virtual-reality' }"
           @click="changeSection('virtual-reality')">
        Virtual Reality
      </div>
      
      <div class="menu-item" 
           :class="{ active: activeItem === 'rtl' }"
           @click="changeSection('rtl')">
        RTL
      </div>
      
      <div class="section-title">ACCOUNT PAGES</div>

      <div class="menu-item" 
           :class="{ active: activeItem === 'profile' }"
           @click="changeSection('profile')">
        Profile
      </div>
      
      <!-- <router-link to="/profile" class="menu-item" :class="{ active: activeItem === 'profile' }">
        Profile
      </router-link> -->
      
      <router-link to="/login" class="menu-item" :class="{ active: activeItem === 'signin' }">
        Sign In
      </router-link>
      
      <router-link to="/register" class="menu-item" :class="{ active: activeItem === 'signup' }">
        Sign Up
      </router-link>
    </div>
    
    <div class="sidebar-footer" v-if="showHelp">
      <div class="help-section">
        <div class="help-title">Need Help?</div>
        <button class="support-btn" @click="contactSupport">Contact support</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  initialActiveItem: {
    type: String,
    default: 'dashboard'
  },
  showHelp: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['section-change']);

const route = useRoute();
const activeItem = ref(props.initialActiveItem);

const changeSection = (section) => {
  activeItem.value = section;
  emit('section-change', section);
};

const contactSupport = () => {
  // Implementar lógica para contactar soporte
  console.log('Contactando soporte...');
};

onMounted(() => {
  // Actualizar el ítem activo basado en la ruta actual
  const path = route.path;
  if (path.includes('/dashboard')) activeItem.value = 'dashboard';
  else if (path.includes('/tables')) activeItem.value = 'tables';
  else if (path.includes('/billing')) activeItem.value = 'billing';
  else if (path.includes('/virtual-reality')) activeItem.value = 'virtual-reality';
  else if (path.includes('/rtl')) activeItem.value = 'rtl';
  else if (path.includes('/profile')) activeItem.value = 'profile';
  else if (path.includes('/login')) activeItem.value = 'signin';
  else if (path.includes('/register')) activeItem.value = 'signup';
});
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: white;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background-color: #4CAF50;
  color: white;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.logo-text {
  margin-left: 10px;
  font-weight: 600;
  font-size: 1rem;
  color: #344767;
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.menu-item {
  display: block;
  padding: 12px 20px;
  color: #67748e;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border-radius: 0;
}

.menu-item:hover {
  background-color: #f8f9fa;
  color: #344767;
}

.menu-item.active {
  background-color: #f8f9fa;
  color: #344767;
  font-weight: 600;
}

.section-title {
  padding: 20px 20px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #a3a3a3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

.help-section {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.help-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #344767;
  margin-bottom: 10px;
}

.support-btn {
  background-color: transparent;
  color: #4CAF50;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.support-btn:hover {
  background-color: #4CAF50;
  color: white;
}
</style>