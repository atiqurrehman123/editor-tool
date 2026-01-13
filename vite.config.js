import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    // Removed react-svg-anchor plugin as it may cause build issues on Vercel
    // If needed, re-enable with proper error handling
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    host: 'localhost',
    port: 3000,
    open: true,
  },

  build: {
    outDir: 'build',
    sourcemap: false, // Disable sourcemaps for production to reduce build size
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'fabric-vendor': ['fabric'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'fabric'],
  },
})
