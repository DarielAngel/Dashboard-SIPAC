<template>
  <div class="dashboard-container">
    <!-- Sidebar Component -->
    <Sidebar 
      :initialActiveItem="currentSection" 
      :showHelp="true"
      @section-change="handleSectionChange" 
    />
    
    <div class="main-content">
      <!-- TopBar Component -->
      <TopBar :user="currentUser" />
      
      <!-- Contenido dinámico basado en la sección seleccionada -->
      <div v-if="currentSection === 'dashboard'">
        <!-- Stats Cards Section -->
        <div class="stats-cards">
          <StatCard 
            title="TODAY'S MONEY" 
            :value="`$${formatNumber(dashboardStore.state.stats.money.value)}`" 
            :change="`${dashboardStore.state.stats.money.change}% since ${dashboardStore.state.stats.money.period}`" 
            :period="`since ${dashboardStore.state.stats.money.period}`" 
            icon="fas fa-dollar-sign" 
            iconColor="#4e73df" 
            :isPositive="dashboardStore.state.stats.money.isPositive" 
          />
          
          <!-- Resto de las StatCards... -->
        </div>
        
        <div class="dashboard-panels">
          <!-- Panel principal (Grafana) -->
          <div class="main-panel">
            <GrafanaPanel 
              :title="dashboardStore.state.grafana.panels[0].title"
              :subtitle="dashboardStore.state.grafana.panels[0].subtitle"
              :baseUrl="dashboardStore.state.grafana.baseUrl" 
              :dashboardId="dashboardStore.state.grafana.dashboardId" 
              :panelId="dashboardStore.state.grafana.panels[0].id"
              :initialTimeRange="dashboardStore.state.grafana.timeRange"
              @update="handleTimeRangeUpdate"
            />
          </div>
          
          <!-- Panel de filtros -->
          <div class="filter-panel">
            <div class="filter-card">
              <h3>Filtros</h3>
              
              <div class="filter-section">
                <label>Período de tiempo</label>
                <select v-model="selectedTimeRange" @change="applyTimeRangeFilter">
                  <option value="now-1h">Última hora</option>
                  <option value="now-6h">Últimas 6 horas</option>
                  <option value="now-12h">Últimas 12 horas</option>
                  <option value="now-24h">Últimas 24 horas</option>
                  <option value="now-7d">Última semana</option>
                  <option value="now-30d">Último mes</option>
                </select>
              </div>
              
              <div class="filter-section">
                <label>Tipo de actividad</label>
                <div class="checkbox-group">
                  <div class="checkbox-item">
                    <input type="checkbox" id="activity-type-1" v-model="activityFilters.videoconference">
                    <label for="activity-type-1">Videoconferencia</label>
                  </div>
                  <div class="checkbox-item">
                    <input type="checkbox" id="activity-type-2" v-model="activityFilters.meetings">
                    <label for="activity-type-2">Reuniones</label>
                  </div>
                  <div class="checkbox-item">
                    <input type="checkbox" id="activity-type-3" v-model="activityFilters.tasks">
                    <label for="activity-type-3">Tareas</label>
                  </div>
                </div>
              </div>
              
              <div class="filter-section">
                <label>Estado de tareas</label>
                <div class="checkbox-group">
                  <div class="checkbox-item">
                    <input type="checkbox" id="task-status-1" v-model="taskFilters.completed">
                    <label for="task-status-1">Completadas</label>
                  </div>
                  <div class="checkbox-item">
                    <input type="checkbox" id="task-status-2" v-model="taskFilters.inProgress">
                    <label for="task-status-2">En progreso</label>
                  </div>
                  <div class="checkbox-item">
                    <input type="checkbox" id="task-status-3" v-model="taskFilters.pending">
                    <label for="task-status-3">Pendientes</label>
                  </div>
                </div>
              </div>
              
              <div class="filter-actions">
                <button class="apply-btn" @click="applyFilters">Aplicar filtros</button>
                <button class="reset-btn" @click="resetFilters">Restablecer</button>
              </div>
            </div>
            
            <!-- Panel de actividades recientes -->
            <div class="activity-card">
              <h3>Actividades recientes</h3>
              <div class="activity-list">
                <div v-if="dashboardStore.state.loading.activities" class="loading-indicator">
                  Cargando actividades...
                </div>
                <div v-else-if="dashboardStore.state.activities.length === 0" class="empty-state">
                  No hay actividades recientes
                </div>
                <div v-else class="activity-item" v-for="(activity, index) in recentActivities" :key="index">
                  <div class="activity-icon" :style="{ backgroundColor: getActivityColor(activity) }">
                    <i class="fas fa-check"></i>
                  </div>
                  <div class="activity-details">
                    <div class="activity-title">{{ activity.label }}</div>
                    <div class="activity-value">{{ activity.value }} actividades</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Activity Charts Section -->
        <div class="charts-section">
          <ActivityChart 
            title="Actividades Mensuales" 
            :data="dashboardStore.state.activities" 
            :loading="dashboardStore.state.loading.activities"
            @period-change="handleActivityPeriodChange"
          />
          
          <ActivityChart 
            title="Distribución de Tareas" 
            :data="dashboardStore.state.tasks" 
            :loading="dashboardStore.state.loading.tasks"
            chartType="pie"
            @period-change="handleTaskPeriodChange"
          />
        </div>
      </div>
      
      <div v-else-if="currentSection === 'tables'">
        <div class="section-content">
          <h2>Tables Section</h2>
          <p>This is the tables section content.</p>
          <!-- Aquí irían los componentes específicos de la sección Tables -->
        </div>
      </div>
      
      <div v-else-if="currentSection === 'billing'">
        <div class="section-content">
          <h2>Billing Section</h2>
          <p>This is the billing section content.</p>
          <!-- Aquí irían los componentes específicos de la sección Billing -->
        </div>
      </div>
      
      <div v-else-if="currentSection === 'virtual-reality'">
        <div class="section-content">
          <h2>Virtual Reality Section</h2>
          <p>This is the virtual reality section content.</p>
          <!-- Aquí irían los componentes específicos de la sección Virtual Reality -->
        </div>
      </div>
      
      <div v-else-if="currentSection === 'rtl'">
        <div class="section-content">
          <h2>RTL Section</h2>
          <p>This is the RTL section content.</p>
          <!-- Aquí irían los componentes específicos de la sección RTL -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '../services/auth.service';
import dashboardStore from '../store/dashboard.store';
import { formatNumber } from '../utils/dashboard.utils';

// Import components
import Sidebar from '../components/dashboard/sidebar.vue';
import TopBar from '../components/dashboard/TopBar.vue';
import StatCard from '../components/dashboard/StatCard.vue';
import GrafanaPanel from '../components/dashboard/GrafanaPanel.vue';
import ActivityChart from '../components/dashboard/ActivityChart.vue';

const router = useRouter();
const route = useRoute();
const currentUser = ref(authService.getCurrentUser());
const refreshInterval = ref(null);
const currentSection = ref('dashboard');

// Variables para filtros
const selectedTimeRange = ref('now-6h');
const activityFilters = ref({
  videoconference: true,
  meetings: true,
  tasks: true
});
const taskFilters = ref({
  completed: true,
  inProgress: true,
  pending: true
});

// Actividades recientes computadas
const recentActivities = computed(() => {
  // Aquí podrías filtrar las actividades según los filtros seleccionados
  return dashboardStore.state.activities.slice(0, 5); // Mostrar solo las 5 primeras
});

// Función para obtener color según tipo de actividad
const getActivityColor = (activity) => {
  // Asignar colores según el tipo o valor de la actividad
  if (activity.value > 70) return '#4CAF50'; // Verde para valores altos
  if (activity.value > 40) return '#FFC107'; // Amarillo para valores medios
  return '#F44336'; // Rojo para valores bajos
};

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

// Funciones para manejar cambios en los componentes
const handleTimeRangeUpdate = (newTimeRange) => {
  selectedTimeRange.value = newTimeRange;
  dashboardStore.updateTimeRange(newTimeRange);
};

const handleActivityPeriodChange = (period) => {
  dashboardStore.fetchActivities(period);
};

const handleTaskPeriodChange = (period) => {
  dashboardStore.fetchTasks(period);
};

// Funciones para los filtros
const applyTimeRangeFilter = () => {
  dashboardStore.updateTimeRange(selectedTimeRange.value);
};

const applyFilters = () => {
  // Aplicar todos los filtros seleccionados
  dashboardStore.updateTimeRange(selectedTimeRange.value);
  
  // Aquí podrías implementar la lógica para filtrar por tipo de actividad y estado de tareas
  console.log('Aplicando filtros:', {
    timeRange: selectedTimeRange.value,
    activities: activityFilters.value,
    tasks: taskFilters.value
  });
  
  // Recargar datos con los filtros aplicados
  dashboardStore.fetchDashboardData();
};

const resetFilters = () => {
  // Restablecer todos los filtros a sus valores predeterminados
  selectedTimeRange.value = 'now-6h';
  
  activityFilters.value = {
    videoconference: true,
    meetings: true,
    tasks: true
  };
  
  taskFilters.value = {
    completed: true,
    inProgress: true,
    pending: true
  };
  
  // Recargar datos con los filtros restablecidos
  dashboardStore.updateTimeRange(selectedTimeRange.value);
  dashboardStore.fetchDashboardData();
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
  else if (path.includes('/billing')) currentSection.value = 'billing';
  else if (path.includes('/virtual-reality')) currentSection.value = 'virtual-reality';
  else if (path.includes('/rtl')) currentSection.value = 'rtl';
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

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

/* Nueva estructura de paneles */
.dashboard-panels {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.main-panel {
  flex: 2;
  min-width: 0; /* Evita que el panel se desborde */
}

.filter-panel {
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-card, .activity-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.filter-section {
  margin-bottom: 15px;
}

.filter-section label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #344767;
  font-size: 0.9rem;
}

.filter-section select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #d1d3e2;
  font-size: 0.9rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 8px;
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.apply-btn, .reset-btn {
  padding: 8px 15px;
  border-radius: 4px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-btn {
  background-color: #4e73df;
  color: white;
}

.apply-btn:hover {
  background-color: #3a5fc8;
}

.reset-btn {
  background-color: #f8f9fa;
  border: 1px solid #d1d3e2;
  color: #5a5c69;
}

.reset-btn:hover {
  background-color: #eaecf4;
}

/* Estilos para la lista de actividades */
.activity-list {
  margin-top: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
}

.activity-details {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: #344767;
  font-size: 0.9rem;
}

.activity-value {
  color: #67748e;
  font-size: 0.8rem;
}

.loading-indicator, .empty-state {
  padding: 15px 0;
  text-align: center;
  color: #67748e;
  font-size: 0.9rem;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 992px) {
  .dashboard-panels {
    flex-direction: column;
  }
  
  .filter-panel {
    max-width: none;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>