<template>
    <div class="main-content">
      <TopBar :title="'Actividades'" />
  
      <!-- Nueva estructura de visualización de actividades -->
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
            <div class="activity-type">Actividades Puntualizadas</div>
            <div class="activity-count">{{ activityCounts.punctualActivities }}</div>
          </div>
          <div class="activity-type-row">
            <div class="activity-type">Actividades Extra plan</div>
            <div class="activity-count">{{ activityCounts.extraPlanActivities }}</div>
          </div>
          <div class="activity-type-row">
            <div class="activity-type">Actividades de Control</div>
            <div class="activity-count">{{ activityCounts.controlActivities }}</div>
          </div>
        </div>
      </div>
  
      <!-- Mantener las tarjetas de estadísticas existentes si se necesitan -->
      <!-- <div class="stats-cards">
        <StatCard 
          title="Actividades en el mes" 
          :value="totalActivities" 
          change="" 
          period="" 
          icon="fas fa-calendar" 
          color="blue"
          class="stat-card-enhanced"
        />
        ... resto de las tarjetas ...
      </div> -->
  
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
            <div class="filter-header">
              <h3>Filtros</h3>
              <button class="help-btn" @click="toggleHelpModal" title="Ayuda">
                <i class="fas fa-question-circle"></i>
              </button>
            </div>
  
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
                  <label for="activity-type-1">Videoconferencias</label>
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
  
            <!-- Filtros de estado de tareas -->
            <!-- <div class="filter-section">
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
            </div> -->
  
            <!-- Botones de acción -->
            <div class="filter-actions">
              <button class="apply-btn" @click="applyFilters">Aplicar filtros</button>
              <button class="reset-btn" @click="resetFilters">Restablecer</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal de ayuda - Modificado para asegurar visibilidad -->
      <div class="help-modal" v-if="showHelpModal" style="z-index: 10000;">
        <div class="help-modal-content">
          <div class="help-modal-header">
            <h3>Ayuda - Cómo usar el panel de Actividades</h3>
            <button class="close-btn" @click="toggleHelpModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="help-modal-body">
            <h4>Filtros de fecha</h4>
            <p>Puede filtrar las actividades por fecha de dos maneras:</p>
            <ul>
              <li><strong>Rango de fechas específico:</strong> Seleccione fechas de inicio y fin para ver actividades en ese período.</li>
              <li><strong>Mes y año:</strong> Seleccione un mes y año específicos del menú desplegable.</li>
            </ul>
  
            <h4>Tipos de actividades</h4>
            <p>Marque o desmarque las casillas para filtrar por tipo de actividad:</p>
            <ul>
              <li><strong>Videoconferencia:</strong> Reuniones virtuales realizadas por videoconferencia.</li>
              <li><strong>Reuniones:</strong> Encuentros presenciales programados.</li>
              <li><strong>Actividades de control:</strong> Tareas relacionadas con supervisión y control.</li>
              <li><strong>Actividades puntualizadas:</strong> Actividades con horario específico.</li>
              <li><strong>Actividades extra plan:</strong> Actividades no planificadas inicialmente.</li>
            </ul>
  
            <h4>Aplicar filtros</h4>
            <p>Después de seleccionar sus filtros, haga clic en <strong>"Aplicar filtros"</strong> para actualizar los datos mostrados.</p>
            
            <h4>Restablecer filtros</h4>
            <p>Para volver a los valores predeterminados, haga clic en <strong>"Restablecer"</strong>.</p>
            
            <h4>Estadísticas</h4>
            <p>En la parte superior se muestran tarjetas con el conteo de actividades según su tipo. Estos valores se actualizan al aplicar los filtros.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref, computed, onMounted } from 'vue';
    import TopBar from '../dashboard/TopBar.vue';
    import StatCard from '../dashboard/StatCard.vue';
    import GrafanaPanel from '../dashboard/GrafanaPanel.vue';
    import authService from '../../services/auth.service';
    import dashboardStore from '../../store/dashboard.store';
    import axios from 'axios';
    
    // Emits
    const emit = defineEmits(['update:timeRange', 'applyFilters', 'resetFilters']);
    
    // Variables para filtros
    const selectedTimeRange = ref('now-6h');
    const activityFilters = ref({
      videoconference: true,
      meetings: true,
      controlActivities: true,
      punctualActivities: true,
      extraPlanActivities: true
    });
    
    // Variable para controlar la visibilidad del modal de ayuda
    const showHelpModal = ref(false);
    
    // Función para mostrar/ocultar el modal de ayuda
    const toggleHelpModal = () => {
      showHelpModal.value = !showHelpModal.value;
      console.log('Estado del modal de ayuda:', showHelpModal.value);
      
      // Forzar actualización del DOM y prevenir scroll cuando el modal está abierto
      if (showHelpModal.value) {
        document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
        // Forzar repintado del DOM
        setTimeout(() => {
          const modal = document.querySelector('.help-modal');
          if (modal) {
            modal.style.display = 'flex';
          }
        }, 0);
      } else {
        document.body.style.overflow = ''; // Restaurar scroll
      }
    };
    
    // Nuevas variables para contar actividades
    const totalActivities = ref(0);
    const activityCounts = ref({
      videoconference: 0,
      meetings: 0,
      controlActivities: 0,
      punctualActivities: 0,
      extraPlanActivities: 0
    });
    
    // Función para obtener conteos de actividades
    const fetchActivityCounts = async () => {
      console.log('Iniciando fetchActivityCounts');
      
      try {
        const params = getApiParams();
        const token = apiToken.value;
        
        // URL base de la API
        const baseUrl = 'http://127.0.0.1:8001/v1/dashboard/cantidad_actividades/';
        
        console.log('Realizando petición a:', baseUrl);
        const response = await axios.get(baseUrl, {
          params: params,
          headers: {
            'Authorization': `Token ${token}`
          }
        });
    
        console.log('Respuesta completa:', response.data);
        
        // Actualizar conteos con los datos de la respuesta
        if (response.data) {
          // La respuesta parece ser un array con índices numéricos
          // Según los logs, los datos están en formato [0: {extra_plan: 33}, 1: {videoconferencias: 440}, ...]
          
          // Inicializar valores
          let totalCount = 0;
          let videoconferenceCount = 0;
          let meetingsCount = 0;
          let controlActivitiesCount = 0;
          let punctualActivitiesCount = 0;
          let extraPlanCount = 0;
          
          // Verificar si es un array
          if (Array.isArray(response.data)) {
            // Buscar el valor "total" en el índice 5
            if (response.data[5] && response.data[5].total) {
              totalCount = response.data[5].total;
            }
            
            // Buscar los valores específicos en sus respectivos índices
            response.data.forEach(item => {
              if (item.extra_plan !== undefined) extraPlanCount = item.extra_plan;
              if (item.videoconferencias !== undefined) videoconferenceCount = item.videoconferencias;
              if (item.puntualizadas !== undefined) punctualActivitiesCount = item.puntualizadas;
              if (item.actividades_control !== undefined) controlActivitiesCount = item.actividades_control;
              if (item.reuniones !== undefined) meetingsCount = item.reuniones;
            });
          } else {
            // Si no es un array, intentar acceder directamente
            totalCount = response.data.total || 0;
            videoconferenceCount = response.data.videoconferencias || 0;
            meetingsCount = response.data.reuniones || 0;
            controlActivitiesCount = response.data.actividades_control || 0;
            punctualActivitiesCount = response.data.puntualizadas || 0;
            extraPlanCount = response.data.extra_plan || 0;
          }
          
          // Actualizar los valores
          totalActivities.value = totalCount;
          activityCounts.value = {
            videoconference: videoconferenceCount,
            meetings: meetingsCount,
            controlActivities: controlActivitiesCount,
            punctualActivities: punctualActivitiesCount,
            extraPlanActivities: extraPlanCount
          };
          
          console.log('Conteos de actividades actualizados:', activityCounts.value);
          console.log('Total de actividades:', totalActivities.value);
        }
      } catch (error) {
        console.error('Error al obtener conteos de actividades:', error);
        console.error('Detalles del error:', error.response ? error.response.data : error.message);
        
        // En caso de error, mostrar valores simulados para desarrollo
        totalActivities.value = 45;
        activityCounts.value = {
          videoconference: 12,
          meetings: 15,
          controlActivities: 8,
          punctualActivities: 6,
          extraPlanActivities: 4
        };
      }
    };
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
    
    // Nuevas variables para filtros de mes y año
    const currentDate = new Date();
    
    // Array de meses para el selector
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
    
    // Token de autenticación para la API
    const apiToken = computed(() => {
      const user = authService.getCurrentUser();
      return user && user.token ? user.token : '';
    });
    
    // Función para actualizar el rango de fechas personalizado
    const updateCustomDateRange = () => {
      if (dateRange.value.from && dateRange.value.to) {
        const fromDate = new Date(dateRange.value.from);
        const toDate = new Date(dateRange.value.to);
        
        // Formatear fechas para Grafana (formato Unix timestamp en milisegundos)
        const fromTime = fromDate.getTime();
        const toTime = toDate.getTime() + (24 * 60 * 60 * 1000 - 1); // Añadir 23:59:59 para incluir todo el día final
        
        // Actualizar el timeRange con un rango personalizado
        const customTimeRange = `${fromTime}/${toTime}`;
        selectedTimeRange.value = customTimeRange;
        
        // Aplicar el filtro
        dashboardStore.updateTimeRange(customTimeRange);
        
        // Crear parámetros de API con las fechas seleccionadas
        const params = {
          ...getApiParams(),
          finicio: fromDate.toISOString().split('T')[0],
          ffin: toDate.toISOString().split('T')[0]
        };
        
        // Actualizar los parámetros de la API
        dashboardStore.updateApiParams(params);
        
        emit('update:timeRange', customTimeRange);
        
        console.log(`Rango de fechas actualizado: ${params.finicio} a ${params.ffin}`);
      }
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
      console.log('Aplicando filtros...');
    
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
        
        // Formatear fechas para la API en formato YYYY-MM-DD
        params.ffinicio = fromDate.toISOString().split('T')[0];
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
    
      // Recargar datos con los filtros aplicados
      dashboardStore.fetchDashboardData();
      
      console.log('Llamando a fetchActivityCounts desde applyFilters');
      // Obtener conteos de actividades con los filtros aplicados
      fetchActivityCounts();
      
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
    
    onMounted(() => {
      console.log('Actividades montado');
    
      // Verificar que tenemos un token válido
      if (apiToken.value) {
        console.log('Token API disponible:', apiToken.value.substring(0, 5) + '...');
        
        // Aplicar filtros iniciales al cargar el componente
        applyFilters();
        
        console.log('Llamando a fetchActivityCounts desde onMounted');
        // Obtener conteos de actividades iniciales
        fetchActivityCounts();
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
    font-size: 1.2rem;
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
  
  /* Estilos mejorados para las tarjetas de estadísticas */
  .stat-card-enhanced {
    transition: all 0.3s ease;
    border-left: 4px solid;
    overflow: hidden;
    position: relative;
  }
  
  .stat-card-enhanced:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .stat-card-enhanced::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1));
    transform: skewX(-15deg) translateX(45px);
    transition: all 0.5s ease;
  }
  
  .stat-card-enhanced:hover::before {
    transform: skewX(-15deg) translateX(200px);
  }
  
  /* Colores específicos para cada tipo de tarjeta */
  .stats-cards .stat-card-enhanced:nth-child(1) {
    border-left-color: #4e73df;
  }
  
  .stats-cards .stat-card-enhanced:nth-child(2) {
    border-left-color: #1cc88a;
  }
  
  .stats-cards .stat-card-enhanced:nth-child(3) {
    border-left-color: #f6c23e;
  }
  
  .stats-cards .stat-card-enhanced:nth-child(4) {
    border-left-color: #9c27b0;
  }
  
  .stats-cards .stat-card-enhanced:nth-child(5) {
    border-left-color: #e74a3b;
  }
  
  .stats-cards .stat-card-enhanced:nth-child(6) {
    border-left-color: #20c997;
  }
  
  /* Estilos para el botón de ayuda y el encabezado de filtros */
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .help-btn {
    background: none;
    border: none;
    color: #4e73df;
    font-size: 1.2rem;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .help-btn:hover {
    color: #2e59d9;
  }
  
  /* Estilos para el modal de ayuda */
  .help-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000; /* Aumentado para asegurar que esté por encima de todo */
  }
  
  .help-modal-content {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    width: 80%;
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    z-index: 10001; /* Asegurar que el contenido esté por encima del fondo */
  }
  
  .help-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e3e6f0;
    background-color: #f8f9fc;
  }
  
  .help-modal-header h3 {
    margin: 0;
    color: #4e73df;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #5a5c69;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .close-btn:hover {
    color: #e74a3b;
  }
  
  .help-modal-body {
    padding: 20px;
  }
  
  .help-modal-body h4 {
    color: #4e73df;
    margin-top: 15px;
    margin-bottom: 10px;
  }
  
  .help-modal-body ul {
    padding-left: 20px;
  }
  
  .help-modal-body li {
    margin-bottom: 5px;
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
  
  