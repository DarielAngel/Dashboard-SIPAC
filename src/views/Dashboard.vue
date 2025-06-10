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

      <div v-if="currentSection === 'actividades_lugar_estrategia'">
        <Actividades_lugar_estrategia :currentSection="currentSection" @update:timeRange="handleTimeRangeUpdate"
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
import Actividades_lugar_estrategia from '../components/paneles/Actividades_lugar_estrategia.vue'

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
  min-height: 100vh;
  background-color: #f8f9fe;
  padding-left: 250px; /* Ajustar según el ancho del sidebar */
  background-image: linear-gradient(rgba(245, 245, 249, 0.9), rgba(245, 245, 249, 0.9)), url('@/assets/img/xedro.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.container-paneles {
  padding: 25px;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  background-color: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.dashboard-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2a1b3d;
  background: linear-gradient(45deg, #2a1b3d, #5e2c8a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-name {
  font-weight: 600;
  color: #5e2c8a;
}

.dashboard-panels {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 25px;
  margin-bottom: 25px;
}

.main-panel {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
}

.main-panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.filter-panel {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
}

.filter-panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.stats-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  border-left: 4px solid #5e2c8a;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2a1b3d;
  margin-bottom: 20px;
  font-weight: 700;
  position: relative;
  padding-bottom: 10px;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(45deg, #2a1b3d, #5e2c8a);
  border-radius: 3px;
}

/* Estilos para los componentes hijos */
div[v-if] {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 25px;
  transition: all 0.3s ease;
}

/* Responsive */
@media (max-width: 1200px) {
  .dashboard-panels {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .dashboard-container {
    padding-left: 0;
  }
  
  .stats-cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .container-paneles {
    padding: 15px;
  }
}
</style>