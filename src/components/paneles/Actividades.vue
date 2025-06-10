<template>
  <div class="main-content">
    <TopBar :title="'Actividades'" />

    <!-- Nueva estructura de estadísticas de actividades -->
    <div class="activity-stats-container">
      <div class="activity-stats-card total-card">
        <div class="stats-content">
          <h3>Cantidad total de actividades</h3>
          <div class="total-count">{{ totalActivities }}</div>
        </div>
      </div>
      
      <div class="activity-stats-details">
        <div class="activity-type-row">
          <div class="activity-type">Videoconferencias</div>
          <div class="activity-count">{{ activityCounts.videoconference }}</div>
        </div>
        <div class="activity-type-row">
          <div class="activity-type">Reuniones</div>
          <div class="activity-count">{{ activityCounts.meetings }}</div>
        </div>
        <div class="activity-type-row">
          <div class="activity-type">Puntualizadas</div>
          <div class="activity-count">{{ activityCounts.punctualActivities }}</div>
        </div>
        <div class="activity-type-row">
          <div class="activity-type">Extra plan</div>
          <div class="activity-count">{{ activityCounts.extraPlanActivities }}</div>
        </div>
        <div class="activity-type-row">
          <div class="activity-type">Control</div>
          <div class="activity-count">{{ activityCounts.controlActivities }}</div>
        </div>
      </div>
    </div>

    <!-- Panel principal y filtros -->
    <div class="dashboard-panels">
      <div class="main-panel">
        <GrafanaPanel 
          title="Actividades cumplidas" 
          subtitle="Actividades cumplidas por año" 
          dashboardId="eelf40rurz9xcf" 
          panelId="1"
          :initialTimeRange="selectedTimeRange" 
          :authToken="apiToken" 
          :apiParams="getApiParams()"
          :key="JSON.stringify(getApiParams())"
          @update="handleTimeRangeUpdate" 
          class="grafana-panel-height"
        />
      </div>

      <!-- Panel de filtros -->
      <div class="filter-panel">
        <div class="filter-card">
          <h3>Filtros</h3>

          <!-- Filtros de rango de fechas -->
          <div class="filter-section">
            <label>Rango de fechas</label>
            <div class="date-range">
              <div class="date-input">
                <label>Desde:</label>
                <input type="date" v-model="dateRange.from" @change="updateCustomDateRange" />
              </div>
              <div class="date-input">
                <label>Hasta:</label>
                <input type="date" v-model="dateRange.to" @change="updateCustomDateRange" />
              </div>
            </div>
          </div>

          <!-- Removing the predefined period filter section -->

          <!-- Filtros para mes y año -->
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

          <!-- Filtros de tipo de actividad -->
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

          <!-- Botones de acción -->
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
// Inside the script setup section
import { ref, computed, onMounted } from 'vue';
import TopBar from '../dashboard/TopBar.vue';
import StatCard from '../dashboard/StatCard.vue';
import GrafanaPanel from '../dashboard/GrafanaPanel.vue';
import authService from '../../services/auth.service';
import dashboardStore from '../../store/dashboard.store';
import axios from 'axios';

// Emits
const emit = defineEmits(['update:timeRange', 'applyFilters', 'resetFilters']);

// Token de API para autenticación
const apiToken = ref(authService.getToken());

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

// Variables para rango de fechas personalizado
const dateRange = ref({
  from: '',
  to: ''
});

// Nuevas variables para contar actividades
const totalActivities = ref(0);
const activityCounts = ref({
  videoconference: 0,
  meetings: 0,
  controlActivities: 0,
  punctualActivities: 0,
  extraPlanActivities: 0
});

// Variables para mes y año
const currentDate = new Date();
const selectedMonth = ref(-1); // -1 significa "Todos"
const selectedYear = ref('Todos');

// Datos para los selectores de mes y año
const months = [
  'Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Generar años desde 2020 hasta el año actual
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const yearList = ['Todos'];
  for (let year = 2020; year <= currentYear; year++) {
    yearList.push(year);
  }
  return yearList;
});

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

// Función para actualizar el rango de fechas personalizado
const updateCustomDateRange = () => {
  if (dateRange.value.from && dateRange.value.to) {
    const fromDate = new Date(dateRange.value.from);
    const toDate = new Date(dateRange.value.to);
    
    // Asegurarse de que la fecha de inicio es anterior a la fecha de fin
    if (fromDate > toDate) {
      console.error('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }
    
    // Formatear fechas para Grafana (formato Unix timestamp en milisegundos)
    const fromTime = fromDate.getTime();
    const toTime = toDate.getTime();
    
    // Actualizar el timeRange con un rango personalizado
    const customTimeRange = `${fromTime}/${toTime}`;
    selectedTimeRange.value = customTimeRange;
    
    // Aplicar el filtro
    dashboardStore.updateTimeRange(customTimeRange);
    emit('update:timeRange', customTimeRange);
    
    console.log(`Rango de fechas personalizado aplicado: ${fromDate.toLocaleDateString()} a ${toDate.toLocaleDateString()}`);
    
    // No llamar a fetchActivityCounts aquí, se hará cuando el usuario haga clic en "Aplicar filtros"
  }
};

// Función para manejar actualizaciones del rango de tiempo desde Grafana
const handleTimeRangeUpdate = (newTimeRange) => {
  selectedTimeRange.value = newTimeRange;
  emit('update:timeRange', newTimeRange);
};

// Función para obtener los parámetros de la API
const getApiParams = () => {
  // Crear un objeto con todos los parámetros necesarios para la API
  const params = {
    format: 'json'
  };

  // Añadir fechas de inicio y fin si están definidas en el rango de fechas
  if (dateRange.value.from && dateRange.value.to) {
    // Convertir las fechas a objetos Date
    const fromDate = new Date(dateRange.value.from);
    const toDate = new Date(dateRange.value.to);
    
    // Formatear fechas para la API en formato YYYY-MM-DD
    params.finicio = fromDate.toISOString().split('T')[0];
    params.ffin = toDate.toISOString().split('T')[0];
    
    console.log(`Usando fechas del calendario: ${params.finicio} a ${params.ffin}`);
  }

  // Añadir mes y año solo si no son "Todos" y no hay fechas específicas seleccionadas
  if (!dateRange.value.from && !dateRange.value.to) {
    if (selectedMonth.value !== -1) {
      params.mes = selectedMonth.value + 1;
    }

    if (selectedYear.value !== 'Todos') {
      params.anno = selectedYear.value;
    }
  }

  // Recopilar los tipos de actividad seleccionados - pasar valores booleanos explícitamente
  params.videoconferencia = activityFilters.value.videoconference ? "True" : "False";
  params.reunion = activityFilters.value.meetings ? "True" : "False";
  params.actividad_control = activityFilters.value.controlActivities ? "True" : "False";
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

// Función para aplicar los filtros
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
  
  // Asegurarse de que las fechas se pasen correctamente si están definidas
  if (dateRange.value.from && dateRange.value.to) {
    const fromDate = new Date(dateRange.value.from);
    const toDate = new Date(dateRange.value.to);
    
    // Corregir los nombres de los parámetros
    params.finicio = fromDate.toISOString().split('T')[0];
    params.ffin = toDate.toISOString().split('T')[0];
    
    console.log('Fechas explícitamente establecidas:', params.finicio, params.ffin);
  }
  
  dashboardStore.updateApiParams(params);

  console.log('Aplicando filtros:', {
    timeRange: selectedTimeRange.value,
    activities: activityFilters.value,
    tasks: taskFilters.value,
    apiParams: params
  });

  // Recargar datos con los filtros aplicados - una sola llamada
  dashboardStore.fetchDashboardData();
  
  // Obtener conteos de actividades con los filtros aplicados - una sola llamada
  fetchActivityCounts();
  
  // Emitir evento para que componentes padres puedan reaccionar
  emit('applyFilters', {
    timeRange: selectedTimeRange.value,
    activities: activityFilters.value,
    tasks: taskFilters.value,
    apiParams: params
  });
};

// Función para restablecer los filtros
const resetFilters = () => {
  // Restablecer todos los filtros a sus valores predeterminados
  selectedTimeRange.value = 'now-6h';

  // Restablecer filtros de mes y año a "Todos"
  selectedMonth.value = -1;
  selectedYear.value = 'Todos';

  // Restablecer rango de fechas personalizado
  dateRange.value = {
    from: '',
    to: ''
  };

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

// Función para obtener conteos de actividades
const fetchActivityCounts = async () => {
  console.log('Iniciando fetchActivityCounts');
  
  try {
    const params = getApiParams();
    const token = apiToken.value;
    
    // URL base de la API - eliminar la barra final para consistencia
    const baseUrl = 'http://localhost:8001/v1/dashboard/cantidad_actividades';
    
    console.log('Realizando petición a:', baseUrl);
    console.log('Parámetros enviados:', params);
    
    const response = await axios.get(baseUrl, {
      params: params,
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    console.log('Respuesta completa:', response.data);
    
    // Actualizar conteos con los datos de la respuesta
    if (response.data) {
      // Verificar si la respuesta es un array
      if (Array.isArray(response.data)) {
        // Inicializar valores
        let totalCount = 0;
        let videoconferenceCount = 0;
        let meetingsCount = 0;
        let controlActivitiesCount = 0;
        let punctualActivitiesCount = 0;
        let extraPlanCount = 0;
        
        // Recorrer el array para encontrar los valores específicos
        response.data.forEach((item, index) => {
          console.log(`Procesando elemento ${index}:`, item);
          
          // Buscar los valores por sus claves
          if (item.hasOwnProperty('total')) {
            totalCount = item.total;
          }
          if (item.hasOwnProperty('videoconferencias')) {
            videoconferenceCount = item.videoconferencias;
          }
          if (item.hasOwnProperty('reuniones')) {
            meetingsCount = item.reuniones;
          }
          if (item.hasOwnProperty('actividades_control')) {
            controlActivitiesCount = item.actividades_control;
          }
          if (item.hasOwnProperty('puntualizadas')) {
            punctualActivitiesCount = item.puntualizadas;
          }
          if (item.hasOwnProperty('extra_plan')) {
            extraPlanCount = item.extra_plan;
          }
        });
        
        // Actualizar los valores
        totalActivities.value = totalCount;
        activityCounts.value = {
          videoconference: videoconferenceCount,
          meetings: meetingsCount,
          controlActivities: controlActivitiesCount,
          punctualActivities: punctualActivitiesCount,
          extraPlanActivities: extraPlanCount
        };
        
        console.log('Valores extraídos del array:', {
          total: totalCount,
          videoconferencias: videoconferenceCount,
          reuniones: meetingsCount,
          actividades_control: controlActivitiesCount,
          puntualizadas: punctualActivitiesCount,
          extra_plan: extraPlanCount
        });
      } else {
        // Si no es un array, usar directamente como objeto
        console.log('Procesando datos como objeto:', response.data);
        totalActivities.value = response.data.total || 0;
        activityCounts.value = {
          videoconference: response.data.videoconferencias || 0,
          meetings: response.data.reuniones || 0,
          controlActivities: response.data.actividades_control || 0,
          punctualActivities: response.data.puntualizadas || 0,
          extraPlanActivities: response.data.extra_plan || 0
        };
      }
      
      console.log('Conteos de actividades actualizados:', activityCounts.value);
      console.log('Total de actividades:', totalActivities.value);
    }
  } catch (error) {
    console.error('Error al obtener conteos de actividades:', error);
    console.error('Detalles del error:', error.response ? error.response.data : error.message);
    
    // En caso de error, establecer valores predeterminados
    totalActivities.value = 0;
    activityCounts.value = {
      videoconference: 0,
      meetings: 0,
      controlActivities: 0,
      punctualActivities: 0,
      extraPlanActivities: 0
    };
  }
};

onMounted(() => {
  console.log('Actividades montado');

  // Verificar que tenemos un token válido
  if (apiToken.value) {
    console.log('Token API disponible:', apiToken.value.substring(0, 5) + '...');
    
    // Set current month in the month selector
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
    const currentYear = now.getFullYear();
    
    // Update month and year selectors if they exist
    if (selectedMonth) {
      selectedMonth.value = currentMonth.toString();
    }
    
    if (selectedYear) {
      selectedYear.value = currentYear.toString();
    }
    
    // Aplicar filtros iniciales al cargar el componente
    applyFilters();
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  min-height: 500px;
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
  margin-bottom: 5px;
  font-weight: 500;
  color: #4e73df;
}

.filter-section select,
.filter-section input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #d1d3e2;
  font-size: 0.9rem;
}

.date-range {
  display: flex;
  gap: 10px;
}

.date-input {
  flex: 1;
}

.date-input label {
  font-size: 0.8rem;
  color: #858796;
}

.checkbox-group {
  margin-top: 5px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 8px;
  width: auto;
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.apply-btn,
.reset-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-btn {
  background-color: #4e73df;
  color: white;
}

.apply-btn:hover {
  background-color: #2e59d9;
}

.reset-btn {
  background-color: #f8f9fc;
  color: #5a5c69;
  border: 1px solid #d1d3e2;
}

.reset-btn:hover {
  background-color: #eaecf4;
}

/* Estilos para la nueva estructura de estadísticas de actividades */
.activity-stats-container {
  display: flex;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.activity-stats-card {
  padding: 25px;
  flex: 1;
}

.total-card {
  background: linear-gradient(135deg, #2a1b3d, #5e2c8a);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 250px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-content {
  text-align: center;
}

.stats-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  opacity: 0.9;
}

.total-count {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 10px;
}

.activity-stats-details {
  flex: 2;
  padding: 20px 30px;
}

.activity-type-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-type-row:last-child {
  border-bottom: none;
}

.activity-type {
  font-weight: 500;
  color: #333;
  font-size: 1.05rem;
}

.activity-count {
  font-weight: 600;
  font-size: 1.2rem;
  color: #5e2c8a;
  background-color: rgba(94, 44, 138, 0.1);
  padding: 5px 15px;
  border-radius: 20px;
  min-width: 60px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .activity-stats-container {
    flex-direction: column;
  }
  
  .total-card {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>