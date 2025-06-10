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
        <i class="fas fa-tachometer-alt"></i>
        <span class="menu-text">Actividades</span>
      </div>
      
      <!-- <div class="menu-item" 
           :class="{ active: activeItem === 'tables' }"
           @click="changeSection('tables')">
        <i class="fas fa-table"></i>
        <span class="menu-text">Tables</span>
      </div> -->

      <div class="menu-item" 
           :class="{ active: activeItem === 'actividades_lugar_estrategia' }"
           @click="changeSection('actividades_lugar_estrategia')">
        <i class="fas fa-project-diagram"></i>
        <span class="menu-text">Actividades por lugares y estrategias</span>
      </div>

      <div class="menu-item" 
           :class="{ active: activeItem === 'planes' }"
           @click="changeSection('planes')">
        <i class="fas fa-project-diagram"></i>
        <span class="menu-text">Planes</span>
      </div>



      <!-- <div class="menu-item" 
           :class="{ active: activeItem === 'pruebas' }"
           @click="changeSection('pruebas')">
        <i class="fas fa-vial"></i>
        <span class="menu-text">Prueba</span>
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
      </div> -->
      
      <!-- <div class="section-title">ACCOUNT PAGES</div>

      <div class="menu-item" 
           :class="{ active: activeItem === 'profile' }"
           @click="changeSection('profile')">
        <i class="fas fa-user"></i>
        <span class="menu-text">Profile</span>
      </div>
      
      <router-link to="/login" class="menu-item" :class="{ active: activeItem === 'signin' }">
        <i class="fas fa-sign-in-alt"></i>
        <span class="menu-text">Sign In</span>
      </router-link>
      
      <router-link to="/register" class="menu-item" :class="{ active: activeItem === 'signup' }">
        <i class="fas fa-user-plus"></i>
        <span class="menu-text">Sign Up</span>
      </router-link> -->
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
  background-color: #2a1b3d;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background-color: #5e2c8a;
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
  color: white;
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  cursor: pointer;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-left: 3px solid #5e2c8a;
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  border-left: 3px solid #5e2c8a;
}

.menu-item i {
  margin-right: 10px;
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.menu-text {
  font-weight: 500;
}

.section-title {
  padding: 20px 20px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.help-section {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.help-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}

.support-btn {
  background-color: transparent;
  color: white;
  border: 1px solid #5e2c8a;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #5e2c8a;
  font-weight: 600;
}

.support-btn:hover {
  background-color: #4a2370;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(94, 44, 138, 0.3);
}
</style>