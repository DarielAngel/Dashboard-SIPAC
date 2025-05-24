<template>
  <div class="grafana-panel">
    <div class="panel-header">
      <div>
        <h3>{{ title }}</h3>
        <p class="panel-subtitle">{{ subtitle }}</p>
      </div>
      <!-- <div class="panel-controls">
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
      </div> -->
    </div>
    <div class="panel-container">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Cargando panel...</p>
      </div>
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="refreshPanel" class="retry-btn">Reintentar</button>
      </div>
      <iframe 
        v-if="visible && !error"
        :key="localTimestamp" 
        :src="panelUrl" 
        width="100%" 
        height=400 
        frameborder="0"
        ref="panelFrame"
        @load="handleIframeLoad"
        @error="handleIframeError"
        allow="fullscreen"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Panel de Grafana'
  },
  subtitle: {
    type: String,
    default: 'Datos en tiempo real'
  },
  apiParams: {
    type: Object,
    default: () => ({})
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
  },
  authToken: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update', 'refresh', 'iframe-load', 'error']);

// Variables reactivas
const panelFrame = ref(null);
const localTimeRange = ref(props.initialTimeRange);
const loading = ref(true);
const error = ref(null);
const refreshInterval = ref(null);
const localTimestamp = ref(Date.now());
const visible = ref(true);

// URL computada para el iframe
const panelUrl = computed(() => {
  try {
    // URL base de Grafana
    let url = `/grafana/d-solo/${props.dashboardId}?`;
    
    // Parámetros básicos
    url += `panelId=${props.panelId}&orgId=1`;
    
    // Rango de tiempo
    if (localTimeRange.value.includes('/')) {
      // Rango personalizado
      const [from, to] = localTimeRange.value.split('/');
      url += `&from=${from}&to=${to || 'now'}`;
    } else {
      // Rango relativo
      url += `&from=${localTimeRange.value}&to=now`;
    }
    
    // Añadir token como variable - IMPORTANTE: usar el nombre exacto que coincida con la variable en Grafana
    if (props.authToken) {
      // Usar el nombre exacto de la variable definida en Grafana (token)
      url += `&var-token=${encodeURIComponent(props.authToken)}`;
      
      // También almacenar el token para que esté disponible para todas las solicitudes
      localStorage.setItem('grafana_auth_token', props.authToken);
      document.cookie = `grafana_auth_token=${props.authToken}; path=/`;
      
      console.log('Token añadido a URL:', props.authToken.substring(0, 5) + '...');
    }
    
    // Añadir otras variables
    if (props.apiParams) {
      Object.entries(props.apiParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url += `&var-${key}=${encodeURIComponent(value)}`;
        }
      });
    }
    
    // Parámetros adicionales
    url += `&theme=light&kiosk&refresh=5s&_t=${localTimestamp.value}`;
    
    console.log('URL del panel:', url);
    return url;
  } catch (e) {
    console.error('Error al generar URL del panel:', e);
    error.value = 'Error al generar URL del panel';
    return '';
  }
});

// Funciones para actualizar el panel
const updatePanel = () => {
  loading.value = true;
  error.value = null;
  localTimestamp.value = Date.now();
  emit('update', localTimeRange.value);
  
  console.log('Actualizando panel con timeRange:', localTimeRange.value);
};

const handleIframeLoad = () => {
  loading.value = false;
  error.value = null;
  emit('iframe-load');
  console.log('Panel cargado correctamente');
};

// En el método handleIframeError, cambia Bearer por Token
const handleIframeError = (e) => {
  loading.value = false;
  error.value = 'Error al cargar el panel. Verifique la conexión a Grafana y que el dashboard exista.';
  emit('error', error.value);
  console.error('Error al cargar el iframe:', e);
  
  // Intentar verificar si el dashboard existe
  fetch(`/grafana/api/dashboards/uid/${props.dashboardId}`, {
    headers: {
      'Authorization': `Token ${props.authToken}`
    }
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 404) {
        error.value = `Dashboard "${props.dashboardId}" no encontrado. Verifique el ID del dashboard.`;
      } else {
        error.value = `Error al acceder a Grafana: ${response.status}`;
      }
      emit('error', error.value);
    }
  })
  .catch(err => {
    error.value = `Error de conexión con Grafana: ${err.message}`;
    emit('error', error.value);
  });
};

// En el método onMounted, cambia Bearer por Token
onMounted(() => {
  console.log('GrafanaPanel montado');
  console.log('Dashboard ID:', props.dashboardId);
  console.log('Panel ID:', props.panelId);
  
  // Verificar que Grafana está accesible
  fetch('/grafana/api/health')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Grafana no está disponible: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Grafana está disponible:', data);
      
      // Verificar que el dashboard existe
      return fetch(`/grafana/api/dashboards/uid/${props.dashboardId}`, {
        headers: {
          'Authorization': `Token ${props.authToken}`
        }
      });
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Dashboard "${props.dashboardId}" no encontrado`);
        }
        throw new Error(`Error al acceder al dashboard: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Dashboard encontrado:', data);
    })
    .catch(err => {
      console.error('Error al verificar Grafana:', err);
      error.value = err.message;
    });
  
  updatePanel();
});

const refreshPanel = () => {
  updatePanel();
  emit('refresh');
};

// Observar cambios en las props
watch(() => props.initialTimeRange, (newValue) => {
  localTimeRange.value = newValue;
  updatePanel();
});

watch(() => props.authToken, () => {
  updatePanel();
});

// Configurar actualización periódica
onMounted(() => {
  console.log('GrafanaPanel montado');
  
  // Configurar interceptor para añadir token a todas las solicitudes de Grafana
  if (props.authToken) {
    // Crear un elemento script para inyectar código que configure el token en el iframe
    const script = document.createElement('script');
    script.innerHTML = `
      // Configurar token para Infinity
      window.grafanaAuthToken = "${props.authToken}";
      
      // Definir la variable global para que esté disponible en todo el contexto de Grafana
      window.grafanaVariables = window.grafanaVariables || {};
      window.grafanaVariables.token = "${props.authToken}";
      
      // Interceptar solicitudes fetch para añadir el token
      const originalFetch = window.fetch;
      window.fetch = function(url, options) {
        options = options || {};
        options.headers = options.headers || {};
        
        // Añadir token a solicitudes de Infinity
        if (url.includes('yesoreyeram-infinity-datasource') || url.includes('api/ds/query')) {
          options.headers['Authorization'] = 'Token ${props.authToken}';
          options.headers['X-Auth-Token'] = '${props.authToken}';
          
          // Modificar el cuerpo de la solicitud si es necesario para incluir el token
          if (options.body) {
            try {
              const body = JSON.parse(options.body);
              if (body.headers) {
                body.headers['Authorization'] = 'Token ${props.authToken}';
              }
              options.body = JSON.stringify(body);
            } catch(e) {
              console.error('Error al modificar el cuerpo de la solicitud:', e);
            }
          }
        }
        
        return originalFetch(url, options);
      };
    `;
    
    // Intentar inyectar el script cuando el iframe esté cargado
    const injectScript = () => {
      try {
        if (panelFrame.value && panelFrame.value.contentWindow) {
          panelFrame.value.contentWindow.document.head.appendChild(script);
          console.log('Script de token inyectado en iframe');
        }
      } catch (e) {
        console.error('Error al inyectar script:', e);
      }
    };
    
    // Añadir listener para cuando el iframe esté cargado
    if (panelFrame.value) {
      panelFrame.value.addEventListener('load', injectScript);
    }
  }
  
  updatePanel();
  
  // Verificar si Grafana está disponible
  fetch('/grafana/api/health')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Grafana no está disponible: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Grafana está disponible:', data);
    })
    .catch(err => {
      console.error('Error al verificar disponibilidad de Grafana:', err);
      error.value = 'No se puede conectar a Grafana. Verifique que el servidor esté en ejecución.';
    });
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});

// Observar cambios en los parámetros de la API
watch(
  () => props.apiParams,
  (newParams) => {
    console.log('Nuevos parámetros recibidos en GrafanaPanel:', newParams);
    // Recargar el panel con los nuevos parámetros
    updatePanel();
  },
  { deep: true }
);

// Busca la función que construye la URL del iframe y asegúrate de que incluya todos los parámetros
// Ejemplo de cómo podría verse:

const buildPanelUrl = () => {
  const baseUrl = '/grafana'; // o la URL base que estés usando
  const dashboardId = props.dashboardId;
  const panelId = props.panelId;
  
  // Construir la URL base - añadir kiosk=false para mostrar los controles
  let url = `${baseUrl}/d-solo/${dashboardId}?panelId=${panelId}&refresh=10s&orgId=1&kiosk=false`;
  
  // Añadir rango de tiempo
  if (props.initialTimeRange) {
    if (props.initialTimeRange.includes('/')) {
      // Es un rango personalizado (timestamp/timestamp)
      const [from, to] = props.initialTimeRange.split('/');
      url += `&from=${from}&to=${to}`;
    } else {
      // Es un rango relativo (now-6h, etc.)
      url += `&from=${props.initialTimeRange}&to=now`;
    }
  }
  
  // Añadir parámetros de API como variables de Grafana
  if (props.apiParams) {
    Object.entries(props.apiParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Usar el prefijo var- para las variables de Grafana
        url += `&var-${key}=${encodeURIComponent(value)}`;
      }
    });
  }
  
  return url;
};
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

.error-message {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  padding: 20px;
  text-align: center;
}

.error-message p {
  color: #e74a3b;
  margin-bottom: 15px;
}

.retry-btn {
  background-color: #4e73df;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
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