import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/asistencia-frontend/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    // Generate sourcemaps only for development
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'ui': ['sweetalert2', 'v-calendar'],
          'charts': ['chart.js', 'vue-chartjs'],
          'icons': ['@heroicons/vue', 'lucide-vue-next']
        }
      }
    },
    // Use esbuild for minification (default in Vite 7.x)
    minify: 'esbuild'
  }
})