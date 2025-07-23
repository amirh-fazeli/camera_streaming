// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // any request to /auth or /users will be forwarded:
      '/auth':   { target: 'http://localhost:3001', changeOrigin: true },
      '/users':  { target: 'http://localhost:3001', changeOrigin: true },
      '/streams':{ target: 'http://localhost:3001', changeOrigin: true },
    }
  }
});
