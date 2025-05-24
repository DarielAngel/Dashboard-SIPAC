import { describe, it, expect, beforeEach, vi } from 'vitest';
import authService from '@/services/auth.service';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('AuthService - login method', () => {
  // Limpiar mocks y localStorage antes de cada prueba
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Restaurar el objeto window.btoa si fue mockeado
    if (global.btoa.mockRestore) {
      global.btoa.mockRestore();
    }
  });

  it('should login successfully with valid credentials', async () => {
    // Mock para btoa
    global.btoa = vi.fn(str => `encoded_${str}`);
    
    // Mock de respuesta exitosa de axios
    const mockResponse = {
      data: {
        access: 'test-token-123',
        username: 'testuser',
        refresh: 'refresh-token-123'
      }
    };
    
    axios.post.mockResolvedValue(mockResponse);

    // Ejecutar el método login
    const result = await authService.login('testuser', 'password123');

    // Verificar que axios.post fue llamado con los parámetros correctos
    expect(axios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8001/v1/seguridad/api-token-auth/',
      {
        username: 'testuser',
        password: 'encoded_password123'
      }
    );

    // Verificar que btoa fue llamado para codificar la contraseña
    expect(global.btoa).toHaveBeenCalledWith('password123');

    // Verificar que el resultado contiene los datos esperados
    expect(result).toEqual({
      access: 'test-token-123',
      username: 'testuser',
      refresh: 'refresh-token-123'
    });

    // Verificar que los datos del usuario se guardaron en localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser).toEqual({
      access: 'test-token-123',
      username: 'testuser',
      refresh: 'refresh-token-123'
    });
  });

  it('should handle API response with token instead of access', async () => {
    // Mock para btoa
    global.btoa = vi.fn(str => `encoded_${str}`);
    
    // Mock de respuesta con token en lugar de access
    const mockResponse = {
      data: {
        token: 'alternative-token-format',
        username: 'testuser'
      }
    };
    
    axios.post.mockResolvedValue(mockResponse);

    // Ejecutar el método login
    const result = await authService.login('testuser', 'password123');

    // Verificar que el resultado normaliza la respuesta con access
    expect(result).toEqual({
      token: 'alternative-token-format',
      username: 'testuser',
      access: 'alternative-token-format'
    });

    // Verificar que los datos del usuario se guardaron en localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser).toEqual({
      token: 'alternative-token-format',
      username: 'testuser',
      access: 'alternative-token-format'
    });
  });

  it('should use mock authentication when API is not available', async () => {
    // Mock para btoa
    global.btoa = vi.fn(str => `encoded_${str}`);
    
    // Mock de error de red
    const networkError = new Error('Network Error');
    axios.post.mockRejectedValue(networkError);

    // Ejecutar el método login
    const result = await authService.login('testuser', 'password123');

    // Verificar que se creó un usuario simulado
    expect(result).toEqual({
      username: 'testuser',
      access: 'mock-token-for-development',
      is_test_user: true
    });

    // Verificar que los datos del usuario simulado se guardaron en localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser).toEqual({
      username: 'testuser',
      access: 'mock-token-for-development',
      is_test_user: true
    });
  });

  it('should throw error when API returns error response', async () => {
    // Mock para btoa
    global.btoa = vi.fn(str => `encoded_${str}`);
    
    // Mock de error de autenticación (no de red)
    const authError = {
      response: {
        data: {
          detail: 'Invalid credentials'
        },
        status: 401
      }
    };
    axios.post.mockRejectedValue(authError);

    // Verificar que el método login lanza el error
    await expect(authService.login('testuser', 'wrongpassword'))
      .rejects.toEqual(authError);

    // Verificar que no se guardó nada en localStorage
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should throw error when response has no token', async () => {
    // Mock para btoa
    global.btoa = vi.fn(str => `encoded_${str}`);
    
    // Mock de respuesta sin token
    const mockResponse = {
      data: {
        username: 'testuser',
        // Sin token ni access
      }
    };
    
    axios.post.mockResolvedValue(mockResponse);

    // Verificar que el método login lanza un error
    await expect(authService.login('testuser', 'password123'))
      .rejects.toThrow('No se encontró token en la respuesta');

    // Verificar que no se guardó nada en localStorage
    expect(localStorage.getItem('user')).toBeNull();
  });
});