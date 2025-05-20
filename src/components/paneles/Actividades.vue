<template>
    <div class="main-content">
      <!-- TopBar Component -->
      <TopBar :user="currentUser" />

      <h2>Actividades</h2>
      
      <!-- Contenido dinámico basado en la sección seleccionada -->
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
              
              <!-- Filtro de rango de fechas con calendarios -->
              <div class="filter-section">
                <label>Rango de fechas</label>
                <div class="date-range-picker">
                  <div class="date-picker">
                    <label>Desde:</label>
                    <input 
                      type="date" 
                      v-model="startDate" 
                      @change="updateCustomDateRange"
                      :max="endDate || undefined"
                    />
                  </div>
                  <div class="date-picker">
                    <label>Hasta:</label>
                    <input 
                      type="date" 
                      v-model="endDate" 
                      @change="updateCustomDateRange"
                      :min="startDate || undefined"
                    />
                  </div>
                </div>
              </div>
              
              <div class="filter-section">
                <label>Período predefinido</label>
                <select v-model="selectedTimeRange" @change="applyTimeRangeFilter">
                  <option value="custom">Personalizado</option>
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
  import { ref, computed, onMounted, watch } from 'vue';
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
  
  // Variables para filtros de mes y año
  const currentDate = new Date();
  const selectedMonth = ref(currentDate.getMonth());
  const selectedYear = ref(currentDate.getFullYear());
  
  // Variables para el rango de fechas personalizado
  const startDate = ref('');
  const endDate = ref('');
  
  // Formatear fecha actual para los inputs de tipo date
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Inicializar fechas con valores por defecto (últimos 7 días)
  const initializeDateRange = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    startDate.value = formatDateForInput(sevenDaysAgo);
    endDate.value = formatDateForInput(today);
  };
  
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
  
  // Función para actualizar el rango de fechas personalizado
  const updateCustomDateRange = () => {
    if (startDate.value && endDate.value) {
      // Convertir las fechas a timestamps para Grafana
      const fromTime = new Date(startDate.value).getTime();
      const toTime = new Date(endDate.value + 'T23:59:59').getTime(); // Incluir todo el día final
      
      // Actualizar el timeRange con un rango personalizado
      const customTimeRange = `${fromTime}/${toTime}`;
      selectedTimeRange.value = 'custom';
      
      // Aplicar el filtro
      dashboardStore.updateTimeRange(customTimeRange);
      emit('update:timeRange', customTimeRange);
      
      console.log(`Filtro de fechas aplicado: ${startDate.value} a ${endDate.value}`);
    }
  };
  
  // Función para obtener parámetros para la API
  const getApiParams = () => {
  // Parámetros base
  const params = {
    format: 'json'
  };
  
  // Añadir parámetros de año y mes
  params.anno = selectedYear.value;
  params.mes = selectedMonth.value + 1;
  
  // Añadir parámetros de fecha si se ha seleccionado un rango personalizado
  if (selectedTimeRange.value === 'custom' && startDate.value && endDate.value) {
    params.finicio = startDate.value;
    params.ffin = endDate.value;
  }
  
  // Añadir filtros de tipo de actividad usando valores numéricos
  // Asumiendo que los tipos de actividad tienen IDs numéricos en la base de datos
  if (activityFilters.value.videoconference && !activityFilters.value.meetings && !activityFilters.value.tasks) {
    params.tipoactividad = 1; // ID para videoconferencia
  } else if (!activityFilters.value.videoconference && activityFilters.value.meetings && !activityFilters.value.tasks) {
    params.tipoactividad = 2; // ID para reuniones
  } else if (!activityFilters.value.videoconference && !activityFilters.value.meetings && activityFilters.value.tasks) {
    params.tipoactividad = 3; // ID para tareas
  }
  
  // Añadir filtros de estado de tareas
  if (taskFilters.value.completed && !taskFilters.value.inProgress && !taskFilters.value.pending) {
    params.status = 'Completado';
  } else if (!taskFilters.value.completed && taskFilters.value.inProgress && !taskFilters.value.pending) {
    params.status = 'Pendiente';
  } else if (!taskFilters.value.completed && !taskFilters.value.inProgress && taskFilters.value.pending) {
    params.status = 'Pendiente';
  }
  
  // Si el usuario actual tiene un ID, añadirlo como filtro
  if (currentUser.value && currentUser.value.id) {
    params.id_user = currentUser.value.id;
  }
  
  console.log('Parámetros enviados a la API:', params);
  return params;
};
  
  // Funciones para manejar cambios en los componentes
  const handleTimeRangeUpdate = (newTimeRange) => {
    // Si el nuevo rango no es personalizado, actualizar selectedTimeRange
    if (newTimeRange !== 'custom') {
      selectedTimeRange.value = newTimeRange;
      
      // Limpiar fechas personalizadas si se selecciona un rango predefinido
      if (newTimeRange !== 'custom') {
        startDate.value = '';
        endDate.value = '';
      }
    }
    
    dashboardStore.updateTimeRange(newTimeRange);
    emit('update:timeRange', newTimeRange);
  };
  
  // Funciones para los filtros
  const applyTimeRangeFilter = () => {
    // Si se selecciona un rango predefinido, limpiar fechas personalizadas
    if (selectedTimeRange.value !== 'custom') {
      startDate.value = '';
      endDate.value = '';
      dashboardStore.updateTimeRange(selectedTimeRange.value);
      emit('update:timeRange', selectedTimeRange.value);
    } else {
      // Si se selecciona "Personalizado", asegurarse de que hay fechas seleccionadas
      if (startDate.value && endDate.value) {
        updateCustomDateRange();
      } else {
        // Si no hay fechas seleccionadas, inicializar con valores por defecto
        initializeDateRange();
        updateCustomDateRange();
      }
    }
  };
  
  // Función para manejar cambios en los filtros de fecha
  const updateDateFilters = () => {
    // Crear una fecha con el mes y año seleccionados
    const startOfMonth = new Date(selectedYear.value, selectedMonth.value, 1);
    const endOfMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0); // Último día del mes
    
    // Actualizar los inputs de fecha
    startDate.value = formatDateForInput(startOfMonth);
    endDate.value = formatDateForInput(endOfMonth);
    
    // Actualizar el rango personalizado
    updateCustomDateRange();
    
    console.log(`Filtro aplicado: ${months[selectedMonth.value]} ${selectedYear.value}`);
  };
  
  const applyFilters = () => {
    // Aplicar todos los filtros seleccionados
    if (selectedTimeRange.value === 'custom') {
      updateCustomDateRange();
    } else {
      dashboardStore.updateTimeRange(selectedTimeRange.value);
    }
    
    console.log('Aplicando filtros:', {
      timeRange: selectedTimeRange.value,
      startDate: startDate.value,
      endDate: endDate.value,
      activities: activityFilters.value,
      tasks: taskFilters.value
    });
    
    // Recargar datos con los filtros aplicados
    dashboardStore.fetchDashboardData();
    emit('applyFilters', {
      timeRange: selectedTimeRange.value,
      startDate: startDate.value,
      endDate: endDate.value,
      activities: activityFilters.value,
      tasks: taskFilters.value
    });
  };
  
  const resetFilters = () => {
    // Restablecer todos los filtros a sus valores predeterminados
    selectedTimeRange.value = 'now-6h';
    
    // Limpiar fechas personalizadas
    startDate.value = '';
    endDate.value = '';
    
    // Restablecer filtros de mes y año al mes y año actual
    selectedMonth.value = currentDate.getMonth();
    selectedYear.value = currentDate.getFullYear();
    
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
  
  // Observar cambios en selectedTimeRange
  watch(selectedTimeRange, (newValue) => {
    if (newValue !== 'custom') {
      // Limpiar fechas personalizadas si se selecciona un rango predefinido
      startDate.value = '';
      endDate.value = '';
    }
  });
  
  onMounted(() => {
    console.log('Actividades montado');
    console.log('Token API:', apiToken.value ? apiToken.value.substring(0, 5) + '...' : 'No disponible');
    
    // Inicializar el rango de fechas
    initializeDateRange();
    
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
    .charts-section {
      grid-template-columns: 1fr;
    }
  }
  </style>