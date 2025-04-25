<template>
  <div class="card h-100">
    <div class="card-header pb-0 d-flex justify-content-between align-items-center">
      <div>
        <h6 class="mb-0 fw-bold">Sales Overview</h6>
        <p class="text-sm mb-0 text-success">
          <i class="fas fa-arrow-up me-1"></i>
          4% more in 2021
        </p>
      </div>
      <div class="dropdown">
        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          2023
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li><a class="dropdown-item" href="#">2023</a></li>
          <li><a class="dropdown-item" href="#">2022</a></li>
          <li><a class="dropdown-item" href="#">2021</a></li>
        </ul>
      </div>
    </div>
    <div class="card-body p-3">
      <div class="chart-container" style="height: 250px;">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartData = ref({
  labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Sales 2023',
      backgroundColor: 'rgba(46, 202, 106, 0.1)',
      borderColor: '#2eca6a',
      pointBackgroundColor: '#2eca6a',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#2eca6a',
      tension: 0.4,
      fill: true,
      data: [30000, 40000, 65000, 50000, 60000, 55000, 70000, 60000, 80000]
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
  },
  elements: {
    point: {
      radius: 3,
      hoverRadius: 5
    },
    line: {
      borderWidth: 2
    }
  },
  interaction: {
    mode: 'index',
    intersect: false
  }
});
</script>

<style scoped>
.card {
  border: none;
  border-radius: 1rem;
  background-color: white;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.25rem 1.5rem;
}

.card-body {
  padding: 1.5rem;
}

.text-success {
  color: #2eca6a !important;
}

.btn-outline-secondary {
  border-color: #e9ecef;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  color: #6c757d;
  border-color: #e9ecef;
}
</style>