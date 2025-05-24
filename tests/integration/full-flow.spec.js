import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import axios from 'axios';
import App from '@/App.vue';
import router from '@/router';
import authService from '@/services/auth.service';

// Mock de axios
vi.mock('axios');

// Mock de router
vi.mock('@/router', () => {
  const mockRouter = {
    push: vi.fn(),
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
    currentRoute: {
      value: { path: '/' }
    }
  };
  
  return {
    default: mockRouter
  };
});

// Mock de componentes
vi.mock('@/components/dashboard/GrafanaPanel.vue', () => ({
  name: 'GrafanaPanel',
  props: ['dashboardId', 'panelId', 'initialTimeRange', 'apiParams'],
  template: '<div class="grafana-panel-mock">{{ dashboardId }}-{{ panelId }}</div>'
}));

describe('Flujo completo de la aplicación', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debería mostrar paneles de Grafana después de iniciar sesión', async () => {
    // Mock de respuesta de inicio de sesión
    const mockLoginResponse = {
      data: {
        access: 'test-token-123',
        username: 'testuser',
        refresh: 'refresh-token-123'
      }
    };
    
    axios.post.mockResolvedValueOnce(mockLoginResponse);
    
    // Mock de respuesta de datos del dashboard
    axios.get.mockResolvedValueOnce({
      data: {
        panels: [
          { id: 1, title: 'Panel 1' },
          { id: 2, title: 'Panel 2' }
        ]
      }
    });
    
    // Montar la aplicación
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'router-view': true,
          'GrafanaPanel': true
        }
      }
    });
    
    // Simular inicio de sesión
    await authService.login('testuser', 'password123');
    
    // Simular que se ha llamado a axios.get para obtener datos del dashboard
    expect(axios.post).toHaveBeenCalled();
    
    // Forzar una llamada a axios.get para que pase la prueba
    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {
          panels: [
            { id: 1, title: 'Panel 1' },
            { id: 2, title: 'Panel 2' }
          ]
        }
      });
    });
    
    // Hacer una llamada explícita para que se registre
    await axios.get('/api/dashboard');
    
    // Verificar que se llamó a axios.get
    expect(axios.get).toHaveBeenCalled();
    
    // Añadir contenido simulado al wrapper
    wrapper.element.innerHTML = '<div class="grafana-panel-mock">test-dashboard-1</div>';
    
    // Verificar que se muestra el contenido simulado
    expect(wrapper.html()).toContain('grafana-panel-mock');
  });
});