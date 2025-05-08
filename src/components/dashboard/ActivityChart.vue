<template>
  <div class="activity-chart">
    <div class="chart-header">
      <h3>{{ title }}</h3>
      <div class="chart-controls">
        <select v-model="selectedPeriod" @change="updateChart">
          <option v-for="option in periodOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
    <div class="chart-content">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
      </div>
      <div v-else-if="!hasData" class="no-data">
        <i class="fas fa-chart-bar no-data-icon"></i>
        <p>No data</p>
      </div>
      <div v-else class="chart-container" ref="chartContainer">
        <!-- Chart will be rendered here -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  title: {
    type: String,
    default: 'Actividades'
  },
  data: {
    type: Array,
    default: () => []
  },
  periodOptions: {
    type: Array,
    default: () => [
      { value: 'day', label: 'Hoy' },
      { value: 'week', label: 'Esta semana' },
      { value: 'month', label: 'Este mes' },
      { value: 'year', label: 'Este año' }
    ]
  },
  chartType: {
    type: String,
    default: 'bar'
  },
  chartColors: {
    type: Array,
    default: () => ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']
  }
});

const emit = defineEmits(['period-change']);

// Variables reactivas
const chartContainer = ref(null);
const chartInstance = ref(null);
const selectedPeriod = ref(props.periodOptions[0].value);
const loading = ref(true);
const hasData = ref(false);

// Actualizar el gráfico cuando cambian los datos
watch(() => props.data, updateChart, { deep: true });

// Función para actualizar el gráfico
function updateChart() {
  loading.value = true;
  emit('period-change', selectedPeriod.value);
  
  // Simular carga de datos (reemplazar con llamada real a API)
  setTimeout(() => {
    hasData.value = props.data && props.data.length > 0;
    loading.value = false;
    
    if (hasData.value) {
      nextTick(() => {
        renderChart();
      });
    }
  }, 500);
}

// Función para renderizar el gráfico
function renderChart() {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  
  if (!chartContainer.value) return;
  
  const ctx = chartContainer.value.getContext('2d');
  
  // Preparar datos para el gráfico
  const labels = props.data.map(item => item.label);
  const values = props.data.map(item => item.value);
  
  // Configuración del gráfico
  chartInstance.value = new Chart(ctx, {
    type: props.chartType,
    data: {
      labels: labels,
      datasets: [{
        label: props.title,
        data: values,
        backgroundColor: props.chartColors,
        borderColor: props.chartColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: props.chartType === 'pie' || props.chartType === 'doughnut'
        }
      }
    }
  });
}

onMounted(() => {
  updateChart();
});
</script>

<style scoped>
.activity-chart {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e3e6f0;
}

.chart-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #5a5c69;
}

.chart-controls select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #d1d3e2;
  font-size: 0.8rem;
}

.chart-content {
  position: relative;
  min-height: 300px;
  padding: 20px;
}

.chart-container {
  height: 300px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4e73df;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #858796;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 10px;
  opacity: 0.3;
}
</style>