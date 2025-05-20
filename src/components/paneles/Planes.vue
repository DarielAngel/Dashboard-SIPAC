<template>
  <div class="main-content">
    <!-- TopBar Component -->
    <TopBar :user="currentUser" />

    <h2>Planes</h2>

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
          :title="dashboardStore.state.grafana.panels[1].title"
          :subtitle="dashboardStore.state.grafana.panels[1].subtitle"
          :baseUrl="dashboardStore.state.grafana.baseUrl" 
          :dashboardId="dashboardStore.state.grafana.dashboardId" 
          :panelId="dashboardStore.state.grafana.panels[1].id"
          :initialTimeRange="selectedTimeRange"
          :authToken="apiToken"
          :apiParams="getApiParams()"
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
          
          <!-- Filtros para mes y año -->
          <div class="filter-section">
            <label>Mes</label>
            <select v-model="selectedMonth" @change="updateDateFilters">
              <option v-for="(month, index) in months" :key="index" :value="index">
                {{ month }}
              </option>
            </select>
          </div>
          
          <div class="filter-section">
            <label>Año</label>
            <select v-model="selectedYear" @change="updateDateFilters">
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          
          <div class="filter-section">
            <label>Tipo de plan</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="plan-type-1" v-model="planFilters.strategic">
                <label for="plan-type-1">Estratégico</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="plan-type-2" v-model="planFilters.operational">
                <label for="plan-type-2">Operativo</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="plan-type-3" v-model="planFilters.project">
                <label for="plan-type-3">Proyecto</label>
              </div>
            </div>
          </div>
          
          <div class="filter-section">
            <label>Estado del plan</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="plan-status-1" v-model="statusFilters.completed">
                <label for="plan-status-1">Completado</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="plan-status-2" v-model="statusFilters.inProgress">
                <label for="plan-status-2">En progreso</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="plan-status-3" v-model="statusFilters.pending">
                <label for="plan-status-3">Pendiente</label>
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
import { ref, computed, onMounted } from 'vue';
import authService from '../../services/auth.service';
import dashboardStore from '../../store/dashboard.store';
import { formatNumber } from '../../utils/dashboard.utils';

// Import components
import TopBar from '../dashboard/TopBar.vue';
import StatCard from '../dashboard/StatCard.vue';
import GrafanaPanel from '../dashboard/GrafanaPanel.vue';

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
const planFilters = ref({
  strategic: true,
  operational: true,
  project: true
});
const statusFilters = ref({
  completed: true,
  inProgress: true,
  pending: true
});

// Variables para filtros de mes y año
const currentDate = new Date();
const selectedMonth = ref(currentDate.getMonth());
const selectedYear = ref(currentDate.getFullYear());

// Array de meses para el selector
const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Generar array de años (desde 5 años atrás hasta el actual)
const years = Array.from(
  { length: 6 }, 
  (_, i) => currentDate.getFullYear() - 5 + i
);

// Obtener token de autenticación del usuario actual
const apiToken = computed(() => {
  return authService.getToken();
});

// Función para obtener parámetros para la API
const getApiParams = () => {
  return {
    month: selectedMonth.value + 1,
    year: selectedYear.value,
    format: 'json',
    filters: JSON.stringify({
      plans: Object.entries(planFilters.value)
        .filter(([_, value]) => value)
        .map(([key]) => key),
      status: Object.entries(statusFilters.value)
        .filter(([_, value]) => value)
        .map(([key]) => key)
    })
  };
};

// Funciones para manejar cambios en los componentes
const handleTimeRangeUpdate = (newTimeRange) => {
  selectedTimeRange.value = newTimeRange;
  dashboardStore.updateTimeRange(newTimeRange);
  emit('update:timeRange', newTimeRange);
};

// Funciones para los filtros
const applyTimeRangeFilter = () => {
  dashboardStore.updateTimeRange(selectedTimeRange.value);
  emit('update:timeRange', selectedTimeRange.value);
};

// Función para manejar cambios en los filtros de fecha
const updateDateFilters = () => {
  // Crear una fecha con el mes y año seleccionados
  const startDate = new Date(selectedYear.value, selectedMonth.value, 1);
  const endDate = new Date(selectedYear.value, selectedMonth.value + 1, 0); // Último día del mes
  
  // Formatear fechas para Grafana (formato Unix timestamp en milisegundos)
  const fromTime = startDate.getTime();
  const toTime = endDate.getTime();
  
  // Actualizar el timeRange con un rango personalizado
  const customTimeRange = `${fromTime}/${toTime}`;
  selectedTimeRange.value = customTimeRange;
  
  // Aplicar el filtro
  dashboardStore.updateTimeRange(customTimeRange);
  emit('update:timeRange', customTimeRange);
  
  console.log(`Filtro aplicado: ${months[selectedMonth.value]} ${selectedYear.value}`);
};

const applyFilters = () => {
  // Aplicar todos los filtros seleccionados
  dashboardStore.updateTimeRange(selectedTimeRange.value);
  
  console.log('Aplicando filtros:', {
    timeRange: selectedTimeRange.value,
    plans: planFilters.value,
    status: statusFilters.value
  });
  
  // Recargar datos con los filtros aplicados
  dashboardStore.fetchDashboardData();
  emit('applyFilters', {
    timeRange: selectedTimeRange.value,
    plans: planFilters.value,
    status: statusFilters.value
  });
};

const resetFilters = () => {
  // Restablecer todos los filtros a sus valores predeterminados
  selectedTimeRange.value = 'now-6h';
  
  // Restablecer filtros de mes y año al mes y año actual
  selectedMonth.value = currentDate.getMonth();
  selectedYear.value = currentDate.getFullYear();
  
  planFilters.value = {
    strategic: true,
    operational: true,
    project: true
  };
  
  statusFilters.value = {
    completed: true,
    inProgress: true,
    pending: true
  };
  
  // Recargar datos con los filtros restablecidos
  dashboardStore.updateTimeRange(selectedTimeRange.value);
  dashboardStore.fetchDashboardData();
  emit('resetFilters');
};

onMounted(() => {
  console.log('Planes montado');
  console.log('Token API:', apiToken.value ? apiToken.value.substring(0, 5) + '...' : 'No disponible');
  
  // Verificar que el dashboard existe en Grafana
  if (apiToken.value) {
    fetch(`/grafana/api/dashboards/uid/${dashboardStore.state.grafana.dashboardId}`, {
      headers: {
        'Authorization': `Token ${apiToken.value}`
      }
    })
    .then(response => {
      if (!response.ok) {
        console.error('Error al verificar dashboard:', response.status);
        if (response.status === 404) {
          console.error('Dashboard no encontrado. Verifica el ID del dashboard.');
        }
      }
      return response.json();
    })
    .then(data => {
      console.log('Dashboard info:', data);
    })
    .catch(err => {
      console.error('Error al verificar dashboard:', err);
    });
  }
  
  // Inicializar datos del dashboard si es necesario
  if (!dashboardStore.state.initialized) {
    dashboardStore.fetchDashboardData();
  }
});
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