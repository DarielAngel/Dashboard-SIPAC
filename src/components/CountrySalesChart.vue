<template>
  <div class="card h-100">
    <div class="card-header pb-0 d-flex justify-content-between align-items-center">
      <h6 class="mb-0">Ventas por País</h6>
      <div>
        <button class="btn btn-link text-secondary p-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li><a class="dropdown-item" href="#">Exportar datos</a></li>
          <li><a class="dropdown-item" href="#">Ver detalles</a></li>
          <li><a class="dropdown-item" href="#">Actualizar</a></li>
        </ul>
      </div>
    </div>
    <div class="card-body p-3">
      <div class="chart-container" style="height: 220px;">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
      <div class="mt-3 pt-2 border-top">
        <div class="d-flex flex-wrap justify-content-between">
          <div v-for="(country, index) in chartData.labels" :key="index" class="legend-item mb-2">
            <div class="d-flex align-items-center">
              <span class="legend-color me-2" :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"></span>
              <span class="legend-label">{{ country }}: <strong>${(chartData.datasets[0].data[index]).toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartData = ref({
  labels: ['España', 'México', 'Argentina', 'Colombia', 'Chile'],
  datasets: [
    {
      label: 'Ventas por País',
      backgroundColor: [
        'rgba(66, 135, 245, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 99, 132, 0.7)'
      ],
      borderColor: [
        'rgb(66, 135, 245)',
        'rgb(75, 192, 192)',
        'rgb(255, 159, 64)',
        'rgb(153, 102, 255)',
        'rgb(255, 99, 132)'
      ],
      borderWidth: 1,
      borderRadius: 4,
      data: [25000, 20000, 15000, 18000, 12000]
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#e9e9e9',
      borderWidth: 1,
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      displayColors: true,
      boxWidth: 10,
      boxHeight: 10,
      boxPadding: 3,
      usePointStyle: true,
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        callback: function(value) {
          return '$' + value.toLocaleString();
        },
        font: {
          size: 11
        },
        color: '#666'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#666'
      }
    }
  }
});
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  background-color: white;
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.card-header {
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.25rem 1.5rem;
}

.card-body {
  padding: 1.5rem;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  font-size: 0.875rem;
  color: #525f7f;
}

.legend-item {
  flex-basis: 48%;
}

@media (max-width: 768px) {
  .legend-item {
    flex-basis: 100%;
  }
}
</style>