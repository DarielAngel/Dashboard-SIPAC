<template>
  <div class="dashboard-container">
    <!-- Sidebar Component -->
    <Sidebar :initialActiveItem="currentSection" :showHelp="true" @section-change="handleSectionChange" />

    

    <div class="container-paneles">
      <div v-if="currentSection === 'dashboard'">
        <Actividades :currentSection="currentSection" @update:timeRange="handleTimeRangeUpdate"
          @applyFilters="handleApplyFilters" @resetFilters="handleResetFilters" />
      </div>

      <div v-if="currentSection === 'planes'">
        <Planes :currentSection="currentSection" @update:timeRange="handleTimeRangeUpdate"
          @applyFilters="handleApplyFilters" @resetFilters="handleResetFilters" />
      </div>

      <div v-if="currentSection === 'pruebas'">
        <h2>Pruebas</h2>
        <MainContent :currentSection="currentSection" @update:timeRange="handleTimeRangeUpdate"
          @applyFilters="handleApplyFilters" @resetFilters="handleResetFilters" />
      </div>

      <div v-if="currentSection === 'profile'">
        <Profile :currentSection="currentSection" @update:timeRange="handleTimeRangeUpdate"
          @applyFilters="handleApplyFilters" @resetFilters="handleResetFilters" />
      </div>


    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '../services/auth.service';
import dashboardStore from '../store/dashboard.store';

// Import components
import Sidebar from '../components/dashboard/sidebar.vue';
import MainContent from '../components/paneles/MainContent.vue';
import Actividades from '../components/paneles/Actividades.vue';
import Planes from '../components/paneles/Planes.vue';
import Profile from '../views/Profile.vue';

const router = useRouter();
const route = useRoute();
const refreshInterval = ref(null);
const currentSection = ref('dashboard');

// Función para manejar el cambio de sección desde el sidebar
const handleSectionChange = (section) => {
  currentSection.value = section;
  // Opcionalmente, actualizar la URL sin recargar la página
  updateUrlWithoutReload(section);
};

// Función para actualizar la URL sin recargar la página
const updateUrlWithoutReload = (section) => {
  const url = section === 'dashboard' ? '/dashboard' : `/dashboard/${section}`;
  window.history.pushState({}, '', url);
};

// Handlers for events from MainContent component
const handleTimeRangeUpdate = (newTimeRange) => {
  dashboardStore.updateTimeRange(newTimeRange);
};

const handleApplyFilters = (filters) => {
  console.log('Filters applied:', filters);
  // Additional logic if needed
};

const handleResetFilters = () => {
  console.log('Filters reset');
  // Additional logic if needed
};

// Configurar actualización periódica de datos
const setupAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }

  // Actualizar datos cada 5 minutos
  refreshInterval.value = setInterval(() => {
    dashboardStore.fetchDashboardData();
  }, 300000);
};

// Limpiar intervalos al desmontar
const cleanupAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
};

// Verificar autenticación y cargar datos al montar el componente
onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login');
    return;
  }

  // Determinar la sección inicial basada en la URL
  const path = route.path;
  if (path.includes('/tables')) currentSection.value = 'tables';
  else if (path.includes('/planes')) currentSection.value = 'planes';
  else if (path.includes('/pruebas')) currentSection.value = 'pruebas';
  else if (path.includes('/billing')) currentSection.value = 'billing';
  else if (path.includes('/virtual-reality')) currentSection.value = 'virtual-reality';
  else if (path.includes('/rtl')) currentSection.value = 'rtl';
  else if (path.includes('/paneles')) currentSection.value = 'paneles';
  else currentSection.value = 'dashboard';

  // Cargar datos iniciales
  dashboardStore.fetchDashboardData();

  // Configurar actualización periódica
  setupAutoRefresh();
});

onUnmounted(() => {
  cleanupAutoRefresh();
});
</script>

<style scoped>


.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Open Sans', Arial, sans-serif;
}

.container-paneles{
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
}
</style>