import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor':  ['vue', 'vue-router', 'pinia'],
          'ui':      ['sweetalert2', 'v-calendar'],
          'charts':  ['chart.js', 'vue-chartjs'],
          'icons':   ['@heroicons/vue', 'lucide-vue-next']
        }
      }
    },
    minify: 'esbuild'
  }
})