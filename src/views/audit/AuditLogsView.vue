<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Auditoría del Sistema
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Registro completo de acciones realizadas en el sistema
      </p>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Logs</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.total_logs || 0 }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Acciones Críticas</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">
              {{ stats.acciones_criticas_periodo || 0 }}
            </p>
          </div>
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-full">
            <svg class="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Período</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ periodo }} días
            </p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Logs Período</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.logs_periodo || 0 }}
            </p>
          </div>
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Período
          </label>
          <select
            v-model="periodo"
            @change="loadStats"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option :value="7">Últimos 7 días</option>
            <option :value="30">Últimos 30 días</option>
            <option :value="90">Últimos 90 días</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Acción
          </label>
          <select
            v-model="filters.accion"
            @change="loadLogs"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas</option>
            <option value="created">Creado</option>
            <option value="updated">Actualizado</option>
            <option value="deleted">Eliminado</option>
            <option value="autorizado">Autorizado</option>
            <option value="rechazado">Rechazado</option>
            <option value="importado">Importado</option>
            <option value="exportado">Exportado</option>
            <option value="aprobado">Aprobado</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modelo
          </label>
          <select
            v-model="filters.modelo"
            @change="loadLogs"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos</option>
            <option value="Institucion">Institución</option>
            <option value="UsuarioApp">Docente</option>
            <option value="UsuarioWeb">Usuario Web</option>
            <option value="Justificacion">Justificación</option>
            <option value="Asistencia">Asistencia</option>
          </select>
        </div>

        <div class="flex items-end">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              v-model="filters.solo_criticas"
              @change="loadLogs"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Solo críticas
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- Timeline de Logs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <!-- Loading -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Cargando logs...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-8 text-center">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        <button
          @click="loadLogs"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>

      <!-- Logs List -->
      <div v-else-if="logs.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="log in logs"
          :key="log.id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          @click="viewDetail(log)"
        >
          <div class="flex items-start space-x-4">
            <!-- Icon -->
            <div :class="getActionColor(log.accion)" class="p-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getActionIcon(log.accion)" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ log.actor.nombre }}
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({{ log.actor.rol }})
                  </span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatRelativeTime(log.created_at) }}
                </p>
              </div>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {{ log.descripcion }}
              </p>
              <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <span>IP: {{ log.contexto.ip_address }}</span>
                <span>{{ log.contexto.metodo_http }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-2 text-gray-600 dark:text-gray-400">No hay logs de auditoría</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {{ (pagination.current_page - 1) * pagination.per_page + 1 }} - 
            {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} 
            de {{ pagination.total }} logs
          </p>
          <div class="flex space-x-2">
            <button
              @click="prevPage"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="pagination.current_page >= Math.ceil(pagination.total / pagination.per_page)"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <AuditLogDetail
      :is-open="detailModalOpen"
      :log-id="selectedLogId"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auditLogsService } from '@/services/api'
import { formatRelativeTime } from '@/utils/formatters'
import AuditLogDetail from '@/components/audit/AuditLogDetail.vue'

// Estado
const logs = ref([])
const stats = ref({})
const loading = ref(false)
const error = ref(null)
const periodo = ref(7)

// Modal state
const detailModalOpen = ref(false)
const selectedLogId = ref(null)

const filters = ref({
  accion: '',
  modelo: '',
  solo_criticas: false
})

const pagination = ref({
  current_page: 1,
  per_page: 20,
  total: 0
})

// Cargar estadísticas
const loadStats = async () => {
  try {
    const { data } = await auditLogsService.getStats({ periodo: periodo.value })
    stats.value = data
  } catch (err) {
    console.error('Error cargando estadísticas:', err)
  }
}

// Cargar logs
const loadLogs = async () => {
  loading.value = true
  error.value = null

  try {
    const params = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      ...filters.value
    }

    const { data } = await auditLogsService.getAll(params)
    logs.value = data.data || []
    pagination.value = {
      current_page: data.current_page,
      per_page: data.per_page,
      total: data.total
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cargar logs de auditoría'
    console.error('Error cargando logs:', err)
  } finally {
    loading.value = false
  }
}

// Paginación
const nextPage = () => {
  pagination.value.current_page++
  loadLogs()
}

const prevPage = () => {
  pagination.value.current_page--
  loadLogs()
}

// Ver detalle
const viewDetail = (log) => {
  selectedLogId.value = log.id
  detailModalOpen.value = true
}

const closeDetailModal = () => {
  detailModalOpen.value = false
  selectedLogId.value = null
}

// Helpers de UI
const getActionColor = (accion) => {
  const colors = {
    created: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
    updated: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
    deleted: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
    autorizado: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    rechazado: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
    importado: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    exportado: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300',
    aprobado: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
  }
  return colors[accion] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
}

const getActionIcon = (accion) => {
  const icons = {
    created: 'M12 4v16m8-8H4',
    updated: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    deleted: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    autorizado: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    rechazado: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    importado: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    exportado: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10',
    aprobado: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[accion] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
}

// Lifecycle
onMounted(() => {
  loadStats()
  loadLogs()
})
</script>
