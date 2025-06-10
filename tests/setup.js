// Configuración global para pruebas
import { vi } from 'vitest';

// Mock de fetch global
global.fetch = vi.fn();

// Configuración para mocks de componentes Vue
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ 
    path: '/dashboard',
    params: {}
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn()
  }))
}));