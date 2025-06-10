import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/integration/**/*.spec.js'],
    setupFiles: ['./tests/setup.js']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});