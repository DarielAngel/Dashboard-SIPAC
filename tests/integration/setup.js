import { vi } from 'vitest';
import { createApp } from 'vue';
import axios from 'axios';

// Mock para localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn(key => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    getAll: () => store
  };
})();

// Asignar el mock a window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Configurar interceptores de axios para pruebas
axios.interceptors.request.use(
  config => {
    // Añadir token de autenticación si existe
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.access) {
        config.headers.Authorization = `Bearer ${user.access}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Función para crear una aplicación Vue para pruebas
export function createTestApp(component, options = {}) {
  return createApp(component, options);
}