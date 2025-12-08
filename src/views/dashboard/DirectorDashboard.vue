<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-6">
    
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Header con animación -->
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-10 blur-3xl"></div>
        <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Dashboard del Director
                  </h1>
                  <p class="text-gray-600 dark:text-gray-400 mt-1">
                    {{ currentDate }}
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              @click="loadStats"
              :disabled="loading"
              class="group relative p-3 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg 
                class="w-5 h-5 text-white transition-transform duration-500"
                :class="{ 'animate-spin': loading }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="absolute -top-8 right-0 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Actualizar
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <transition name="slide-down">
        <div 
          v-if="error" 
          class="relative bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-red-900/30 dark:to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 border border-red-200/50 dark:border-red-800/50 shadow-xl"
        >
          <div class="flex items-start gap-4">
            <div class="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
                Error al cargar los datos
              </h3>
              <p class="text-red-700 dark:text-red-300">{{ error }}</p>
            </div>
            <button 
              @click="loadStats"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg"
            >
              Reintentar
            </button>
          </div>
        </div>
      </transition>

      <!-- Stats Cards con animación escalonada -->
      <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        
        <!-- Institución Card -->
        <div 
          class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          :class="{ 'animate-pulse': loading }"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-600/20 dark:to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          
          <div class="relative p-8">
            <div class="flex items-start justify-between mb-6">
              <div class="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                Principal
              </span>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Institución Educativa
              </p>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {{ loading ? '...' : (stats.institucion || 'No asignada') }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Docentes Card -->
        <div 
          class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          :class="{ 'animate-pulse': loading }"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-600/20 dark:to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          
          <div class="relative p-8">
            <div class="flex items-start justify-between mb-6">
              <div class="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                Personal
              </span>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Docentes Registrados
              </p>
              <div class="flex items-end gap-3">
                <h3 class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {{ loading ? '—' : stats.docentes }}
                </h3>
                <span class="text-gray-500 dark:text-gray-400 mb-2">
                  profesores
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Asistencias Card -->
        <div 
          class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          :class="{ 'animate-pulse': loading }"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-600/20 dark:to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
          
          <div class="relative p-8">
            <div class="flex items-start justify-between mb-6">
              <div class="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
                Hoy
              </span>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Asistencias del Día
              </p>
              <div class="flex items-end gap-3 mb-4">
                <h3 class="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  {{ loading ? '—' : stats.asistencias_hoy }}
                </h3>
                <span class="text-gray-500 dark:text-gray-400 mb-2">
                  / {{ loading ? '—' : stats.docentes }}
                </span>
              </div>
              
              <!-- Barra de progreso -->
              <div v-if="!loading && stats.docentes > 0" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Porcentaje</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400">
                    {{ attendancePercentage }}%
                  </span>
                </div>
                <div class="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    :style="{ width: `${attendancePercentage}%` }"
                  >
                    <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Loading State -->
      <transition name="fade">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-4">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p class="text-gray-600 dark:text-gray-400 font-medium">
              Cargando información...
            </p>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const stats = ref({
  institucion: '',
  docentes: 0,
  asistencias_hoy: 0
})

const loading = ref(true)
const error = ref(null)

const currentDate = computed(() => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Date().toLocaleDateString('es-ES', options)
})

const attendancePercentage = computed(() => {
  if (stats.value.docentes === 0) return 0
  return Math.round((stats.value.asistencias_hoy / stats.value.docentes) * 100)
})

const loadStats = async () => {
  loading.value = true
  error.value = null
  
  try {
    const { data } = await api.get('/director/dashboard')
    stats.value = data
  } catch (e) {
    console.error('Error cargando dashboard director:', e)
    error.value = e.response?.data?.message || 'No se pudo cargar la información del servidor'
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>