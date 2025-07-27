import { defineConfig } from 'vite';
import react      from '@vitejs/plugin-react';

console.log('🔧 Vite config loaded!');  // DEBUG LINE

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth':    { target: 'http://localhost:3001', changeOrigin: true },
      '/users':   { target: 'http://localhost:3001', changeOrigin: true },
      '/streams': { target: 'http://localhost:3001', changeOrigin: true },
    }
  }
});
