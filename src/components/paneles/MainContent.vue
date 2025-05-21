<template>
  <div class="main-content">
    <!-- TopBar Component -->
    <TopBar :user="currentUser" />

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
        <GrafanaPanel 
          title="Panel de Grafana" 
          subtitle="Datos en tiempo real" 
          dashboardId="eelf40rurz9xcf" 
          panelId="1"
          :initialTimeRange="selectedTimeRange" 
          :authToken="apiToken" 
          :apiParams="getApiParams()"
          @update="handleTimeRangeUpdate" 
          class="grafana-panel-height"
        />
      </div>

      <!-- Panel de filtros -->
      <div class="filter-panel">
        <div class="filter-card">
          <h3>Filtros</h3>

          <!-- <div class="filter-section">
            <label>Período de tiempo</label>
            <select v-model="selectedTimeRange" @change="applyTimeRangeFilter">
              <option value="now-1h">Última hora</option>
              <option value="now-6h">Últimas 6 horas</option>
              <option value="now-12h">Últimas 12 horas</option>
              <option value="now-24h">Últimas 24 horas</option>
              <option value="now-7d">Última semana</option>
              <option value="now-30d">Último mes</option>
            </select>
          </div> -->

          <!-- Nuevos filtros para mes y año -->
          <div class="filter-section">
            <label>Mes</label>
            <select v-model="selectedMonth" @change="updateDateFilters">
              <option value="-1">Todos</option>
              <option v-for="(month, index) in months.slice(1)" :key="index" :value="index">
                {{ month }}
              </option>
            </select>
          </div>

          <div class="filter-section">
            <label>Año</label>
            <select v-model="selectedYear" @change="updateDateFilters">
              <option value="Todos">Todos</option>
              <option v-for="year in years.slice(1)" :key="year" :value="year">
                {{ year }}
              </option>
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
                <input type="checkbox" id="activity-type-3" v-model="activityFilters.controlActivities">
                <label for="activity-type-3">Actividades de control</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="activity-type-4" v-model="activityFilters.punctualActivities">
                <label for="activity-type-4">Actividades puntualizadas</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="activity-type-5" v-model="activityFilters.extraPlanActivities">
                <label for="activity-type-5">Actividades extra plan</label>
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
                <input type="checkbox" id="task-status-2" v-model="taskFilters.incomplete">
                <label for="task-status-2">Incompletas</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="task-status-3" v-model="taskFilters.inProgress">
                <label for="task-status-3">En progreso</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="task-status-4" v-model="taskFilters.postponed">
                <label for="task-status-4">Pospuestas</label>
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


  </div>
</template>

<script setup>
// Importar servicios necesarios
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

// En la sección de script, actualiza las variables de filtros:
// Variables para filtros
const selectedTimeRange = ref('now-6h');
const activityFilters = ref({
  videoconference: true,
  meetings: true,
  controlActivities: true,
  punctualActivities: true,
  extraPlanActivities: true
});
const taskFilters = ref({
  completed: true,
  incomplete: true,
  inProgress: true,
  postponed: true
});

// Nuevas variables para filtros de mes y año
const currentDate = new Date();

// Array de meses para el selector
// Modificar el array de meses para incluir una opción "Todos"
const months = [
  'Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Generar array de años con opción "Todos"
const years = [
  'Todos',
  ...Array.from({ length: 6 }, (_, i) => currentDate.getFullYear() - 5 + i)
];

// Inicializar los selectores con valores actuales en lugar de "Todos"
const selectedMonth = ref(currentDate.getMonth());
const selectedYear = ref(currentDate.getFullYear());

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

// Nueva función para manejar cambios en los filtros de fecha
const updateDateFilters = () => {
  // Si ambos selectores están en "Todos", usar el rango predeterminado
  if (selectedMonth.value === -1 && selectedYear.value === 'Todos') {
    selectedTimeRange.value = 'now-6h';
    dashboardStore.updateTimeRange(selectedTimeRange.value);
    emit('update:timeRange', selectedTimeRange.value);
    return;
  }

  // Si solo uno está en "Todos", usar valores predeterminados para el otro
  const year = selectedYear.value === 'Todos' ? currentDate.getFullYear() : selectedYear.value;
  const month = selectedMonth.value === -1 ? currentDate.getMonth() : selectedMonth.value;

  // Crear una fecha con el mes y año seleccionados
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // Último día del mes

  // Formatear fechas para Grafana (formato Unix timestamp en milisegundos)
  const fromTime = startDate.getTime();
  const toTime = endDate.getTime();

  // Actualizar el timeRange con un rango personalizado
  const customTimeRange = `${fromTime}/${toTime}`;
  selectedTimeRange.value = customTimeRange;

  // Aplicar el filtro
  dashboardStore.updateTimeRange(customTimeRange);
  emit('update:timeRange', customTimeRange);

  console.log(`Filtro aplicado: ${selectedMonth.value === -1 ? 'Todos los meses' : months[selectedMonth.value + 1]} ${selectedYear.value}`);
};

// Modificar la función getApiParams para mapear correctamente los filtros
const getApiParams = () => {
  // Crear un objeto con todos los parámetros necesarios para la API
  const params = {
    format: 'json'
  };

  // Añadir mes y año solo si no son "Todos"
  if (selectedMonth.value !== -1) {
    params.mes = selectedMonth.value + 1;
  }

  if (selectedYear.value !== 'Todos') {
    params.anno = selectedYear.value;
  }

  // Recopilar los tipos de actividad seleccionados - pasar valores booleanos explícitamente
  // Asegurarse de que los nombres de parámetros coincidan exactamente con lo que espera la API
  params.videoconferencia = activityFilters.value.videoconference ? "True" : "False";
  params.reunion = activityFilters.value.meetings ? "True" : "False";
  params.actividad_control = activityFilters.value.controlActivities ? "True" : "False"; // Corregido el nombre del parámetro
  params.puntualizada = activityFilters.value.punctualActivities ? "True" : "False";
  params.extra_plan = activityFilters.value.extraPlanActivities ? "True" : "False";

  // Recopilar los estados de tareas seleccionados
  const estados = [];
  if (taskFilters.value.completed) estados.push('Completado');
  if (taskFilters.value.incomplete) estados.push('Incumplida');
  if (taskFilters.value.inProgress) estados.push('Pendiente');
  if (taskFilters.value.postponed) estados.push('Pospuesta');

  if (estados.length > 0) {
    params.status = estados.join(',');
  }

  console.log('Parámetros enviados a la API:', params);
  return params;
};

// Corregir la función applyFilters
const applyFilters = () => {
  // Aplicar todos los filtros seleccionados
  if (selectedTimeRange.value.includes('/')) {
    // Es un rango personalizado, mantenerlo
    dashboardStore.updateTimeRange(selectedTimeRange.value);
  } else {
    // Es un rango predefinido
    dashboardStore.updateTimeRange(selectedTimeRange.value);
  }

  // Forzar actualización del panel de Grafana
  const params = getApiParams();
  dashboardStore.updateApiParams(params);

  console.log('Aplicando filtros:', {
    timeRange: selectedTimeRange.value,
    activities: activityFilters.value,
    tasks: taskFilters.value,
    apiParams: params
  });

  // Recargar datos con los filtros aplicados
  dashboardStore.fetchDashboardData();
  
  // Forzar la actualización del componente GrafanaPanel
  // Añadir un pequeño retraso para asegurar que los datos se actualicen
  setTimeout(() => {
    // Esto puede ayudar a forzar una actualización si hay problemas de reactividad
    const refreshParams = {...params};
    dashboardStore.updateApiParams(refreshParams);
  }, 100);
  
  // Emitir evento para que componentes padres puedan reaccionar
  emit('applyFilters', {
    timeRange: selectedTimeRange.value,
    activities: activityFilters.value,
    tasks: taskFilters.value,
    apiParams: params
  });
};

// Actualiza la función resetFilters para restablecer los valores correctamente:
const resetFilters = () => {
  // Restablecer todos los filtros a sus valores predeterminados
  selectedTimeRange.value = 'now-6h';

  // Restablecer filtros de mes y año a "Todos"
  selectedMonth.value = -1;
  selectedYear.value = 'Todos';

  activityFilters.value = {
    videoconference: true,
    meetings: true,
    controlActivities: true,
    punctualActivities: true,
    extraPlanActivities: true
  };

  taskFilters.value = {
    completed: true,
    incomplete: true,
    inProgress: true,
    postponed: true
  };

  // Recargar datos con los filtros restablecidos
  dashboardStore.updateTimeRange(selectedTimeRange.value);
  dashboardStore.fetchDashboardData();
  emit('resetFilters');
};

// Token de autenticación para la API
const apiToken = computed(() => {
  const user = authService.getCurrentUser();
  return user && user.token ? user.token : '';
});

// Modificar esta función para incluir parámetros adicionales que podrían ser necesarios
// ELIMINAR ESTA SEGUNDA DEFINICIÓN DE getApiParams (líneas 377-390 aproximadamente)
// const getApiParams = () => {
//   // Crear un objeto con todos los parámetros necesarios para la API
//   return {
//     month: selectedMonth.value + 1,
//     year: selectedYear.value,
//     format: 'json',
//     filters: JSON.stringify({
//       activities: Object.entries(activityFilters.value)
//         .filter(([_, value]) => value)
//         .map(([key]) => key),
//       tasks: Object.entries(taskFilters.value)
//         .filter(([_, value]) => value)
//         .map(([key]) => key)
//     })
//   };
// };

onMounted(() => {
  console.log('MainContent montado');

  // Verificar que tenemos un token válido
  if (apiToken.value) {
    console.log('Token API disponible:', apiToken.value.substring(0, 5) + '...');
    
    // Aplicar filtros iniciales al cargar el componente
    applyFilters();

    // Verificar que el dashboard existe en Grafana
    fetch(`/grafana/api/dashboards/uid/eelf40rurz9xcf`, {
      headers: {
        'Authorization': `Bearer ${apiToken.value}`
      }
    })
      .then(response => {
        if (!response.ok) {
          console.error('Error al verificar dashboard:', response.status);
          // Si el dashboard no existe, mostrar un mensaje de error
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
  } else {
    console.error('No hay token de autenticación disponible');
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

/* Aumentar la altura del panel de Grafana */
.grafana-panel-height {
  min-height: 500px; /* Aumentar la altura del panel */
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