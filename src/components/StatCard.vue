<template>
  <div class="card mb-3">
    <div class="card-body d-flex justify-content-between align-items-start">
      <div>
        <h6 class="text-muted text-uppercase small">{{ title }}</h6>
        <p class="h3 fw-bold mb-1">{{ value }}</p>
        <p :class="[
          'small mb-0',
          Number(trend) > 0 ? 'text-success' : 'text-danger'
        ]">
          {{ Number(trend) > 0 ? '+' : '' }}{{ trend }}% {{ trendPeriod }}
        </p>
      </div>
      <div :class="['rounded-circle d-flex align-items-center justify-content-center', iconBgClass]" 
           style="width: 40px; height: 40px; min-width: 40px; position: relative; z-index: 1;">
        <!-- Iconos simplificados con fill para mejor visibilidad -->
        <svg v-if="iconType === 'money'" class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>
        
        <svg v-else-if="iconType === 'users'" class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
        
        <svg v-else-if="iconType === 'clients'" class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        
        <svg v-else-if="iconType === 'sales'" class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        
        <svg v-else class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  trend: {
    type: [Number, String],
    default: 0
  },
  trendPeriod: {
    type: String,
    default: 'since last period'
  },
  iconType: {
    type: String,
    default: 'default'
  },
  iconBgColor: {
    type: String,
    default: 'bg-primary'
  }
});

// Convertir colores de Tailwind a Bootstrap
const iconBgClass = computed(() => {
  const colorMap = {
    'bg-purple-500': 'bg-purple text-white',
    'bg-red-500': 'bg-danger text-white',
    'bg-green-500': 'bg-success text-white',
    'bg-orange-500': 'bg-warning text-white',
    'bg-blue-500': 'bg-primary text-white'
  };
  
  return colorMap[props.iconBgColor] || 'bg-primary text-white';
});
</script>

<style scoped>
.icon {
  width: 20px;
  height: 20px;
  color: white;
}

.card {
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.rounded-circle {
  transition: transform 0.3s ease;
}

.rounded-circle:hover {
  transform: scale(1.1);
}

/* Definir colores personalizados que no están en Bootstrap por defecto */
.bg-purple {
  background-color: #6f42c1;
}
</style>