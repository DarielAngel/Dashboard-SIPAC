import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import axios from 'axios';
import authService from '@/services/auth.service';

// Mock de axios
vi.mock('axios');

// Crear una función de navegación simulada para las pruebas
const mockNavigationGuard = vi.fn((to, from, next) => {
  if (to.meta?.requiresAuth && !authService.isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

describe('Flujo de Autenticación', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debería redirigir a la página de dashboard después de iniciar sesión exitosamente', async () => {
    // Mock de respuesta exitosa de inicio de sesión
    const mockLoginResponse = {
      data: {
        access: 'test-token-123',
        username: 'testuser',
        refresh: 'refresh-token-123'
      }
    };
    
    axios.post.mockResolvedValueOnce(mockLoginResponse);
    
    // Iniciar sesión
    await authService.login('testuser', 'password123');
    
    // Verificar que el usuario está autenticado
    expect(authService.isAuthenticated()).toBe(true);
    
    // Verificar que el token se almacenó correctamente
    expect(authService.getToken()).toBe('test-token-123');
    
    // Simular navegación a una ruta protegida
    const to = { path: '/dashboard', meta: { requiresAuth: true } };
    const from = { path: '/login' };
    const next = vi.fn();
    
    // Ejecutar el guard de navegación directamente
    mockNavigationGuard(to, from, next);
    
    // Verificar que se permitió la navegación
    expect(next).toHaveBeenCalledWith();
  });

  it('debería redirigir a login cuando se intenta acceder a una ruta protegida sin autenticación', async () => {
    // Verificar que el usuario no está autenticado
    expect(authService.isAuthenticated()).toBe(false);
    
    // Simular navegación a una ruta protegida
    const to = { path: '/dashboard', meta: { requiresAuth: true } };
    const from = { path: '/' };
    const next = vi.fn();
    
    // Ejecutar el guard de navegación directamente
    mockNavigationGuard(to, from, next);
    
    // Verificar que se redirigió a login
    expect(next).toHaveBeenCalledWith('/login');
  });

  it('debería cerrar sesión correctamente', async () => {
    // Configurar un usuario autenticado
    localStorage.setItem('user', JSON.stringify({
      access: 'test-token-123',
      username: 'testuser'
    }));
    
    // Verificar que el usuario está autenticado
    expect(authService.isAuthenticated()).toBe(true);
    
    // Mock de respuesta de logout
    axios.post.mockResolvedValueOnce({});
    
    // Cerrar sesión
    await authService.logout();
    
    // Verificar que el usuario ya no está autenticado
    expect(authService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('user')).toBeNull();
  });
});