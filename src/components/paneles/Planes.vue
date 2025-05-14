<template>
  <div class="main-content">
    <!-- TopBar Component -->
    <TopBar :user="currentUser" />

    <h2>Planes</h2>

    <!-- Stats Cards Section -->
    <div class="stats-cards">
      <StatCard title="TODAY'S MONEY" :value="`$${formatNumber(dashboardStore.state.stats.money.value)}`"
        :change="`${dashboardStore.state.stats.money.change}% since ${dashboardStore.state.stats.money.period}`"
        :period="`since ${dashboardStore.state.stats.money.period}`" icon="fas fa-dollar-sign" iconColor="#4e73df"
        :isPositive="dashboardStore.state.stats.money.isPositive" />

      <!-- Resto de las StatCards... -->
    </div>

    <div class="dashboard-panels">
      <!-- Panel principal (Grafana) -->
      <div class="main-panel">
        <GrafanaPanel :title="dashboardStore.state.grafana.panels[1].title"
          :subtitle="dashboardStore.state.grafana.panels[1].subtitle" :baseUrl="dashboardStore.state.grafana.baseUrl"
          :dashboardId="dashboardStore.state.grafana.dashboardId" :panelId="dashboardStore.state.grafana.panels[1].id"
          :initialTimeRange="dashboardStore.state.grafana.timeRange" @update="handleTimeRangeUpdate" />
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


      </div>
    </div>



  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import authService from '../../services/auth.service';
import dashboardStore from '../../store/dashboard.store';
import { formatNumber } from '../../utils/dashboard.utils';

// Import components
import TopBar from '../dashboard/TopBar.vue';
import StatCard from '../dashboard/StatCard.vue';
import GrafanaPanel from '../dashboard/GrafanaPanel.vue';
import ActivityChart from '../dashboard/ActivityChart.vue';

// Props
const props = defineProps({
  currentSection: {
    type: String,
    required: true
  }
});

// Emits
const emit = defineEmits(['update:timeRange', 'applyFilters', 'resetFilters']);

const currentUser = ref(authService.getCurrentUser());

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

// Funciones para manejar cambios en los componentes
const handleTimeRangeUpdate = (newTimeRange) => {
  selectedTimeRange.value = newTimeRange;
  dashboardStore.updateTimeRange(newTimeRange);
  emit('update:timeRange', newTimeRange);
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
  emit('update:timeRange', selectedTimeRange.value);
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
  emit('applyFilters', {
    timeRange: selectedTimeRange.value,
    activities: activityFilters.value,
    tasks: taskFilters.value
  });
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
  emit('resetFilters');
};
</script>

<style scoped>
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
  min-width: 0;
  /* Evita que el panel se desborde */
}

.filter-panel {
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-card,
.activity-card {
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

.apply-btn,
.reset-btn {
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

.loading-indicator,
.empty-state {
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
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>