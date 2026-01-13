import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { getPlugin } from 'react-svg-anchor'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),

    // ⚠️ Run this plugin ONLY if absolutely required
    // Remove it completely if you still see hostname errors
    getPlugin('101'),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    host: 'localhost', // 🔒 prevents hostname command execution
    port: 3000,
    open: true,
  },

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
})
