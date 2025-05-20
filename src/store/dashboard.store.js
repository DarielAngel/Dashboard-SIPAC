import { reactive, readonly } from 'vue';
import grafanaService from '../services/grafana.service';
import { groupDataByPeriod } from '../utils/dashboard.utils';

// Initial state
const state = reactive({
  stats: {
    money: { value: 53000, change: 55, period: 'yesterday', isPositive: true },
    users: { value: 2300, change: 3, period: 'last week', isPositive: true },
    clients: { value: 3462, change: 2, period: 'last quarter', isPositive: false },
    sales: { value: 103430, change: 5, period: 'last month', isPositive: true }
  },
  grafana: {
    baseUrl: 'http://localhost:3000',
    dashboardId: 'eelf40rurz9xcf',
    panels: [
      { id: '1', title: 'Actividades cumplidas', subtitle: 'Actividades cumplidas por año' },
      { id: '2', title: 'Actividades en el mes', subtitle: 'Distribución actividades en el mes' }
    ],
    timeRange: 'now-6h'
  },
  activities: [],
  tasks: [],
  loading: {
    activities: false,
    tasks: false,
    stats: false
  },
  // Añadir un objeto para almacenar los parámetros de la API
  apiParams: {
    anno: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    format: 'json'
  }
});

// Actions
const actions = {
  // Update Grafana time range
  updateTimeRange(timeRange) {
    state.grafana.timeRange = timeRange;
  },
  
  // Método para actualizar los parámetros de la API
  updateApiParams(params) {
    // Actualizar los parámetros de la API
    state.apiParams = { ...state.apiParams, ...params };
    console.log('API params updated:', state.apiParams);
  },
  
  // Fetch activities data
  async fetchActivities(period = 'year') {
    state.loading.activities = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock data based on period
      let mockData;
      
      switch (period) {
        case 'day':
          mockData = [
            { label: '8:00', value: 10 },
            { label: '10:00', value: 15 },
            { label: '12:00', value: 20 },
            { label: '14:00', value: 25 },
            { label: '16:00', value: 15 },
            { label: '18:00', value: 5 }
          ];
          break;
        case 'week':
          mockData = [
            { label: 'Lunes', value: 25 },
            { label: 'Martes', value: 30 },
            { label: 'Miércoles', value: 45 },
            { label: 'Jueves', value: 35 },
            { label: 'Viernes', value: 50 },
            { label: 'Sábado', value: 20 },
            { label: 'Domingo', value: 15 }
          ];
          break;
        case 'month':
          mockData = [
            { label: 'Semana 1', value: 120 },
            { label: 'Semana 2', value: 150 },
            { label: 'Semana 3', value: 180 },
            { label: 'Semana 4', value: 140 }
          ];
          break;
        default: // year
          mockData = [
            { label: 'Enero', value: 65 },
            { label: 'Febrero', value: 59 },
            { label: 'Marzo', value: 80 },
            { label: 'Abril', value: 81 },
            { label: 'Mayo', value: 56 },
            { label: 'Junio', value: 55 }
          ];
      }
      
      state.activities = mockData;
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      state.loading.activities = false;
    }
  },
  
  // Fetch tasks data
  async fetchTasks(period = 'year') {
    state.loading.tasks = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock data based on period
      let mockData;
      
      switch (period) {
        case 'day':
          mockData = [
            { label: 'Completadas', value: 30 },
            { label: 'En progreso', value: 50 },
            { label: 'Pendientes', value: 20 }
          ];
          break;
        case 'week':
          mockData = [
            { label: 'Completadas', value: 45 },
            { label: 'En progreso', value: 40 },
            { label: 'Pendientes', value: 15 }
          ];
          break;
        case 'month':
          mockData = [
            { label: 'Completadas', value: 60 },
            { label: 'En progreso', value: 30 },
            { label: 'Pendientes', value: 10 }
          ];
          break;
        default: // year
          mockData = [
            { label: 'Completadas', value: 75 },
            { label: 'En progreso', value: 15 },
            { label: 'Pendientes', value: 10 }
          ];
      }
      
      state.tasks = mockData;
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      state.loading.tasks = false;
    }
  },
  
  // Fetch all dashboard data
  async fetchDashboardData() {
    state.loading.stats = true;
    
    try {
      // Fetch all data in parallel
      await Promise.all([
        this.fetchActivities(),
        this.fetchTasks()
      ]);
      
      // Simulate fetching stats
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update stats with random variations
      const randomVariation = (base, max = 10) => {
        const variation = Math.floor(Math.random() * max) - max/2;
        return base + variation;
      };
      
      state.stats.money.value = randomVariation(53000, 5000);
      state.stats.money.change = randomVariation(55, 10);
      
      state.stats.users.value = randomVariation(2300, 200);
      state.stats.users.change = randomVariation(3, 5);
      
      state.stats.clients.value = randomVariation(3462, 300);
      state.stats.clients.change = randomVariation(2, 5);
      
      state.stats.sales.value = randomVariation(103430, 10000);
      state.stats.sales.change = randomVariation(5, 8);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      state.loading.stats = false;
    }
  }
};

// Create and export the store
export default {
  state: readonly(state),
  ...actions
};