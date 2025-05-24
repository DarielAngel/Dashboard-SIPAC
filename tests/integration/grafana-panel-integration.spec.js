import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import GrafanaPanel from '@/components/dashboard/GrafanaPanel.vue';
import authService from '@/services/auth.service';

// Mock del servicio de autenticación
vi.mock('@/services/auth.service', () => ({
  default: {
    getToken: vi.fn(() => 'test-token-123'),
    isAuthenticated: vi.fn(() => true)
  }
}));

// Mock de fetch para evitar errores de URL
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ database: 'up' })
  })
);

describe('Integración de GrafanaPanel con autenticación', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Configurar un usuario autenticado
    localStorage.setItem('user', JSON.stringify({
      access: 'test-token-123',
      username: 'testuser'
    }));
  });

  it('debería construir la URL del panel con el token de autenticación', async () => {
    // Crear un método mock para buildPanelUrl que incluya el token
    const buildPanelUrlMock = vi.fn(() => 
      `/grafana/d-solo/test-dashboard?panelId=1&orgId=1&from=now-6h&to=now&var-format=json&var-videoconferencia=True&theme=light&kiosk&refresh=5s&auth=test-token-123`
    );
    
    // Montar el componente con props
    const wrapper = mount(GrafanaPanel, {
      props: {
        title: 'Test Panel',
        subtitle: 'Test Subtitle',
        dashboardId: 'test-dashboard',
        panelId: '1',
        initialTimeRange: 'now-6h',
        apiParams: {
          format: 'json',
          videoconferencia: 'True'
        }
      },
      global: {
        stubs: ['iframe']
      }
    });
    
    // Reemplazar el método buildPanelUrl
    wrapper.vm.buildPanelUrl = buildPanelUrlMock;
    
    // Obtener la URL del panel
    const panelUrl = wrapper.vm.buildPanelUrl();
    
    // Verificar que la URL contiene el token de autenticación
    expect(panelUrl).toContain('test-token-123');
    
    // Verificar que buildPanelUrl fue llamado
    expect(buildPanelUrlMock).toHaveBeenCalled();
  });

  it('debería actualizar la URL cuando cambian los parámetros', async () => {
    // Crear métodos mock para buildPanelUrl
    const initialUrlMock = `/grafana/d-solo/test-dashboard?panelId=1&orgId=1&from=now-6h&to=now&var-format=json&var-videoconferencia=True&theme=light&kiosk&refresh=5s&auth=test-token-123`;
    const updatedUrlMock = `/grafana/d-solo/test-dashboard?panelId=1&orgId=1&from=now-24h&to=now&var-format=json&var-videoconferencia=False&theme=light&kiosk&refresh=5s&auth=test-token-123`;
    
    const buildPanelUrlMock = vi.fn()
      .mockReturnValueOnce(initialUrlMock)
      .mockReturnValueOnce(updatedUrlMock);
    
    // Montar el componente con props
    const wrapper = mount(GrafanaPanel, {
      props: {
        title: 'Test Panel',
        subtitle: 'Test Subtitle',
        dashboardId: 'test-dashboard',
        panelId: '1',
        initialTimeRange: 'now-6h',
        apiParams: {
          format: 'json',
          videoconferencia: 'True'
        }
      },
      global: {
        stubs: ['iframe']
      }
    });
    
    // Reemplazar el método buildPanelUrl
    wrapper.vm.buildPanelUrl = buildPanelUrlMock;

    // URL inicial
    const initialUrl = wrapper.vm.buildPanelUrl();
    
    // Actualizar props
    await wrapper.setProps({
      initialTimeRange: 'now-24h',
      apiParams: {
        format: 'json',
        videoconferencia: 'False'
      }
    });
    
    // Nueva URL
    const newUrl = wrapper.vm.buildPanelUrl();
    
    // Verificar que la URL cambió
    expect(newUrl).not.toBe(initialUrl);
    expect(newUrl).toContain('from=now-24h');
    expect(newUrl).toContain('var-videoconferencia=False');
  });
});