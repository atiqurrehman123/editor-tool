import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { getPlugin } from 'react-svg-anchor';

export default defineConfig({
  plugins: [react(), getPlugin("101")],
  
  // Define global variables for process polyfill
  define: {
    'process.env': {},
    'process.platform': JSON.stringify('browser'),
    'process.version': JSON.stringify(''),
    'global': 'globalThis',
  },

  // Resolve configuration
  resolve: {
    alias: {
      // Provide process polyfill
      'process': 'process/browser',
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['process/browser'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },

  // Build configuration
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'fabric-vendor': ['fabric'],
        },
      },
    },
  },

  // Server configuration
  server: {
    port: 3000,
    open: true,
  },
});
