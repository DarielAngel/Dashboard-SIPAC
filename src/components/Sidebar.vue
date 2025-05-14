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
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.3s;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 80px;
}

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
</style>