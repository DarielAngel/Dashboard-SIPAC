import { ref, computed } from 'vue';
import authService from '../services/auth.service';
import grafanaService from '../services/grafana.service';

export function useGrafana(options = {}) {
  const {
    baseUrl = 'http://localhost:3000',
    dashboard = 'dehxthutoxwqob',
    panel = '1',
    defaultTimeRange = 'now-6h',
    refreshRate = 3600000 // 1 hora
  } = options;

  const grafanaFrame = ref(null);
  const grafanaBaseUrl = ref(baseUrl);
  const dashboardId = ref(dashboard);
  const panelId = ref(panel);
  const timeRange = ref(defaultTimeRange);
  const isLoading = ref(true);
  const refreshInterval = ref(null);
  const timestamp = ref(Date.now());
  const iframeVisible = ref(true);

  // Inicializar los tokens en el servicio de Grafana
  const initializeTokens = () => {
    const token = authService.getToken();
    if (token) {
      grafanaService.setDjangoToken(token);
    }
    if (grafanaService.grafanaToken) {
      grafanaService.setGrafanaToken(grafanaService.grafanaToken);
    }
  };

  // URL computada para el iframe de Grafana
  const grafanaUrl = computed(() => {
    // Inicializar los tokens antes de generar la URL
    initializeTokens();
    // Asegurarse de usar d-solo para mostrar solo el panel
    const baseUrl = `/api/grafana-proxy/d-solo/${dashboardId.value}`;
    const params = new URLSearchParams();
    
    params.append('orgId', 1);
    params.append('from', timeRange.value);
    params.append('to', 'now');
    params.append('panelId', panelId.value);
    params.append('refresh', '1h');
    params.append('theme', 'light');
    params.append('_t', timestamp.value);
    params.append('kiosk', 'true'); // Asegurarse de que sea string
    
    const url = `${baseUrl}?${params.toString()}`;
    console.log(`URL de Grafana panel ${panel}:`, url);
    return url;
  });

  // Funciones para el panel - Mejoradas para refrescar solo el panel
  const updateGrafanaPanel = () => {
    // Mostrar indicador de carga solo dentro del panel
    isLoading.value = true;
    
    // Actualizar solo el timestamp para forzar la recarga del iframe
    timestamp.value = Date.now();
    
    // Crear una nueva URL con el timestamp actualizado
    const newSrc = grafanaUrl.value;
    
    // Usar un enfoque más suave para actualizar el iframe
    if (grafanaFrame.value) {
      // Crear un nuevo elemento de imagen para precargar
      const preloadImg = new Image();
      preloadImg.onload = () => {
        // Una vez precargada, actualizar el iframe
        grafanaFrame.value.src = newSrc;
        
        // Ocultar el indicador de carga después de un breve retraso
        setTimeout(() => {
          isLoading.value = false;
        }, 500);
      };
      
      preloadImg.onerror = () => {
        // En caso de error, actualizar de todos modos
        grafanaFrame.value.src = newSrc;
        setTimeout(() => {
          isLoading.value = false;
        }, 500);
      };
      
      // Iniciar la precarga con la URL del panel
      preloadImg.src = `${grafanaBaseUrl.value}/render/d-solo/${dashboardId.value}?orgId=1&panelId=${panelId.value}&width=800&height=300&_t=${timestamp.value}`;
      
      // Establecer un tiempo máximo para la carga
      setTimeout(() => {
        if (isLoading.value) {
          grafanaFrame.value.src = newSrc;
          isLoading.value = false;
        }
      }, 3000);
    }
  };

  const handleIframeLoad = () => {
    isLoading.value = false;
  };

  const refreshGrafana = () => {
    updateGrafanaPanel();
  };

  // Configurar actualización periódica
  const setupAutoRefresh = () => {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value);
    }
    refreshInterval.value = setInterval(() => {
      refreshGrafana();
    }, refreshRate);
  };

  // Limpiar intervalos
  const cleanupAutoRefresh = () => {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value);
    }
  };

  // Problema 4: Verificar CORS y acceso a Grafana
  
  // Asegúrate de que Grafana esté configurado para permitir embeber paneles en iframes. Puedes agregar esta verificación:
  
  // Verificar que Grafana esté accesible
  const checkGrafanaAccess = async () => {
    try {
      const token = authService.getToken();
      const headers = {
        'Django-Token': token
      };
      
      if (grafanaService.grafanaToken) {
        headers['Grafana-Token'] = grafanaService.grafanaToken;
      }
      
      const response = await fetch('/api/grafana-proxy/api/health', {
        headers: headers
      });
      if (response.ok) {
        console.log('Grafana está accesible');
        return true;
      } else {
        console.error('Grafana no está respondiendo correctamente');
        return false;
      }
    } catch (error) {
      console.error('Error al acceder a Grafana:', error);
      return false;
    }
  };
  
  // Añadir esta función al objeto retornado
  import { ref, computed } from 'vue';

  export function useGrafana() {
    const dashboardPreferences = ref({
      timeRange: 'now-6h',
      theme: 'light',
      refresh: '1h'
    });
  
    // Función para obtener las preferencias del dashboard
    const getDashboardPreferences = () => {
      return dashboardPreferences.value;
    };
  
    // Función para actualizar las preferencias del dashboard
    const updateDashboardPreferences = (preferences) => {
      dashboardPreferences.value = {
        ...dashboardPreferences.value,
        ...preferences
      };
    };
  
    const getTimeRangeParams = (timeRange) => {
      // Si es un rango personalizado con formato timestamp/timestamp
      if (timeRange.includes('/')) {
        const [from, to] = timeRange.split('/');
        return { from, to: to || 'now' };
      }
      
      // Si es un rango relativo (now-6h, etc.)
      return { from: timeRange, to: 'now' };
    };
  
    const getPanelUrl = (dashboardId, panelId, timeRange, options = {}) => {
      let url = `/grafana/d-solo/${dashboardId}?panelId=${panelId}&orgId=1`;
      
      // Añadir rango de tiempo
      const { from, to } = getTimeRangeParams(timeRange);
      url += `&from=${from}&to=${to}`;
      
      // Añadir opciones adicionales como variables
      Object.entries(options).forEach(([key, value]) => {
        if (key.startsWith('var-')) {
          // Si ya es una variable de Grafana, añadirla directamente
          url += `&${key}=${encodeURIComponent(value)}`;
        } else if (key !== '_t' && key !== 'theme' && key !== 'refresh' && key !== 'kiosk') {
          // Para otros parámetros, convertirlos en variables de Grafana
          url += `&var-${key}=${encodeURIComponent(value)}`;
        } else {
          // Para parámetros especiales, añadirlos directamente
          url += `&${key}=${encodeURIComponent(value)}`;
        }
      });
      
      return url;
    };
  
    return {
      getDashboardPreferences,
      updateDashboardPreferences,
      getTimeRangeParams,
      getPanelUrl
    };
  }

  return {
    grafanaFrame,
    grafanaUrl,
    timeRange,
    isLoading,
    iframeVisible,
    timestamp,
    updateGrafanaPanel,
    handleIframeLoad,
    refreshGrafana,
    setupAutoRefresh,
    cleanupAutoRefresh,
    checkGrafanaAccess,
    getPanelUrl
  };
}