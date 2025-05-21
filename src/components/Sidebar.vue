<template>
  <div class="sidebar bg-white" :class="{ 'collapsed': collapsed }">
    <div class="logo-container p-4 d-flex align-items-center">
      <div class="logo-icon me-2 bg-success rounded p-2">
        <i class="fas fa-chart-pie text-white"></i>
      </div>
      <span v-if="!collapsed" class="logo-text fw-bold">Argon Dashboard 2</span>
      <button class="btn btn-sm btn-light ms-auto d-md-none" @click="toggleSidebar">
        <i class="fas" :class="collapsed ? 'fa-bars' : 'fa-times'"></i>
      </button>
    </div>
    
    <div class="menu-container mt-3">
      <ul class="nav flex-column">
        <li class="nav-item" v-for="(item, index) in menuItems" :key="index">
          <a :href="item.link" class="nav-link d-flex align-items-center" :class="{ 'active': item.active }">
            <i :class="['me-2', item.icon]"></i>
            <span v-if="!collapsed">{{ item.title }}</span>
          </a>
        </li>
      </ul>
      
      <div class="mt-4 px-4">
        <h6 class="text-uppercase text-muted fw-bold small mb-3" v-if="!collapsed">ACCOUNT PAGES</h6>
        <ul class="nav flex-column">
          <li class="nav-item" v-for="(item, index) in accountItems" :key="index">
            <a :href="item.link" class="nav-link d-flex align-items-center">
              <i :class="['me-2', item.icon]"></i>
              <span v-if="!collapsed">{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="mt-auto p-4" v-if="!collapsed">
      <div class="help-box bg-light p-3 rounded text-center">
        <p class="small mb-2">Need Help?</p>
        <button class="btn btn-sm btn-success w-100">Contact support</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle']);

const toggleSidebar = () => {
  emit('toggle');
};

const menuItems = ref([
  { title: 'Dashboard', icon: 'fas fa-home', link: '#', active: true },
  { title: 'Tables', icon: 'fas fa-table', link: '#', active: false },
  { title: 'Planes', icon: 'fas fa-table', link: '#', active: false },
  { title: 'Prueba', icon: 'fas fa-table', link: '#', active: false },
  { title: 'Billing', icon: 'fas fa-credit-card', link: '#', active: false },
  { title: 'Virtual Reality', icon: 'fas fa-vr-cardboard', link: '#', active: false },
  { title: 'RTL', icon: 'fas fa-globe', link: '#', active: false },
]);

const accountItems = ref([
  { title: 'Profile', icon: 'fas fa-user', link: '#' },
  // { title: 'Sign In', icon: 'fas fa-sign-in-alt', link: '#' },
  { title: 'Sign Up', icon: 'fas fa-user-plus', link: '#' },
]);
</script>

<style scoped>
.sidebar {
  background-color: #2a1b3d;
  color: #fff;
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
}

.sidebar-menu {
  padding: 20px 0;
}

.menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.menu-item:hover, .menu-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-left: 3px solid #5e2c8a;
}

.menu-item i {
  margin-right: 10px;
  font-size: 1.1rem;
}

.menu-label {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Estilos para submenús si los tienes */
.submenu {
  padding-left: 15px;
}

/* Estilos para el botón de colapsar sidebar si lo tienes */
.collapse-btn {
  position: absolute;
  right: -12px;
  top: 20px;
  background: #5e2c8a;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

/* Estilos para el footer del sidebar */
.sidebar-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}
</style>

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar:not(.collapsed) {
    transform: translateX(0);
    width: 250px;
  }
  
  .sidebar.collapsed {
    transform: translateX(-100%);
  }
}