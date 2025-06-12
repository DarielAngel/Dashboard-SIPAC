<template>
  <div class="app-container">
    <Sidebar 
      v-if="!isAuthRoute" 
      :collapsed="sidebarCollapsed" 
      @toggle="toggleSidebar" 
      @openHelp="showHelpModal = true" 
    />
    <div class="content-container" :class="{ 'expanded': sidebarCollapsed }">
      <router-view />
    </div>
    
    <!-- Help Modal -->
    <HelpModal :show="showHelpModal" @close="showHelpModal = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import HelpModal from './components/HelpModal.vue';

const route = useRoute();
const sidebarCollapsed = ref(false);
const showHelpModal = ref(false);

const isAuthRoute = computed(() => {
  return route.path.includes('/login') || route.path.includes('/register');
});

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};
</script>

<style>
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.content-container {
  flex: 1;
  transition: margin-left 0.3s ease;
  padding: 0; /* Eliminar cualquier padding que pueda causar espacio */
}

.content-container.expanded {
  margin-left: 80px;
}

@media (max-width: 768px) {
  .content-container {
    margin-left: 0;
  }
}
</style>
