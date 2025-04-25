<template>
  <div class="grafana-panel">
    <div class="panel-header">
      <div>
        <h3>{{ title }}</h3>
        <p class="panel-subtitle">{{ subtitle }}</p>
      </div>
      <div class="panel-controls">
        <select v-model="localTimeRange" @change="updatePanel">
          <option value="now-1h">Última hora</option>
          <option value="now-6h">Últimas 6 horas</option>
          <option value="now-24h">Últimas 24 horas</option>
          <option value="now-7d">Última semana</option>
          <option value="now-30d">Último mes</option>
        </select>
        <button @click="refreshPanel" class="refresh-btn" title="Refrescar panel">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>
    <div class="panel-container">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Cargando panel...</p>
      </div>
      <iframe 
        v-if="visible"
        :key="localTimestamp" 
        :src="panelUrl" 
        width="100%" 
        height="300" 
        frameborder="0"
        ref="panelFrame"
        @load="handleIframeLoad"
        allow="fullscreen"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Panel de Grafana'
  },
  subtitle: {
    type: String,
    default: 'Datos en tiempo real'
  },
  baseUrl: {
    type: String,
    default: 'http://localhost:3000'
  },
  dashboardId: {
    type: String,
    required: true
  },
  panelId: {
    type: String,
    required: true
  },
  initialTimeRange: {
    type: String,
    default: 'now-6h'
  }
});

const emit = defineEmits(['update', 'refresh', 'iframe-load']);

// Variables reactivas
const panelFrame = ref(null);
const localTimeRange = ref(props.initialTimeRange);
const loading = ref(true);
const refreshInterval = ref(null);
const localTimestamp = ref(Date.now());
const visible = ref(true);

// URL computada para el iframe
const panelUrl = computed(() => {
  const baseUrl = `${props.baseUrl}/d-solo/${props.dashboardId}`;
  const params = new URLSearchParams();
  
  params.append('orgId', 1);
  params.append('from', localTimeRange.value);
  params.append('to', 'now');
  params.append('panelId', props.panelId);
  params.append('refresh', '1h');
  params.append('theme', 'light');
  params.append('_t', localTimestamp.value);
  params.append('kiosk', true);
  
  return `${baseUrl}?${params.toString()}`;
});

// Funciones para actualizar el panel
const updatePanel = () => {
  loading.value = true;
  localTimestamp.value = Date.now();
  emit('update', localTimeRange.value);
  
  if (panelFrame.value) {
    panelFrame.value.src = panelUrl.value;
    
    // Timeout de seguridad para quitar el loading si no se dispara el evento load
    setTimeout(() => {
      if (loading.value) {
        loading.value = false;
      }
    }, 3000);
  }
};

const handleIframeLoad = () => {
  loading.value = false;
  emit('iframe-load');
};

const refreshPanel = () => {
  updatePanel();
  emit('refresh');
};

// Configurar actualización periódica
const setupAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
  refreshInterval.value = setInterval(() => {
    refreshPanel();
  }, 3600000); // 1 hora
};

// Limpiar intervalos al desmontar
const cleanupAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
};

// Métodos expuestos para el componente padre
defineExpose({
  refreshPanel,
  updatePanel
});

onMounted(() => {
  updatePanel();
  setupAutoRefresh();
});

onUnmounted(() => {
  cleanupAutoRefresh();
});
</script>

<style scoped>
.grafana-panel {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e3e6f0;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #5a5c69;
}

.panel-subtitle {
  margin: 5px 0 0;
  font-size: 0.8rem;
  color: #858796;
}

.panel-controls {
  display: flex;
  align-items: center;
}

.panel-controls select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #d1d3e2;
  margin-right: 10px;
  font-size: 0.8rem;
}

.refresh-btn {
  background: none;
  border: none;
  color: #4e73df;
  cursor: pointer;
  font-size: 0.9rem;
}

.panel-container {
  position: relative;
  min-height: 300px;
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
</style>