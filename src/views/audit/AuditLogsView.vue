<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header Mejorado -->
    <div class="mb-8">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Historial de Actividades
          </h1>
          <p class="mt-1 text-gray-600 dark:text-gray-400">
            Registro de todas las acciones realizadas por los usuarios
          </p>
        </div>
      </div>
    </div>

    <!-- Estadísticas Mejoradas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl shadow-md p-6 border-2 border-blue-200 dark:border-blue-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Total Actividades</p>
            <p class="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
              {{ stats.total_logs || 0 }}
            </p>
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">registros totales</p>
          </div>
          <div class="p-4 bg-blue-500 dark:bg-blue-600 rounded-xl shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl shadow-md p-6 border-2 border-red-200 dark:border-red-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">Acciones Importantes</p>
            <p class="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">
              {{ stats.acciones_criticas_periodo || 0 }}
            </p>
            <p class="text-xs text-red-600 dark:text-red-400 mt-1">requieren atención</p>
          </div>
          <div class="p-4 bg-red-500 dark:bg-red-600 rounded-xl shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl shadow-md p-6 border-2 border-green-200 dark:border-green-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Período Actual</p>
            <p class="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
              {{ periodo }}
            </p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1">días mostrados</p>
          </div>
          <div class="p-4 bg-green-500 dark:bg-green-600 rounded-xl shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl shadow-md p-6 border-2 border-purple-200 dark:border-purple-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Este Período</p>
            <p class="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
              {{ stats.logs_periodo || 0 }}
            </p>
            <p class="text-xs text-purple-600 dark:text-purple-400 mt-1">actividades recientes</p>
          </div>
          <div class="p-4 bg-purple-500 dark:bg-purple-600 rounded-xl shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros Simplificados y Amigables -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border-2 border-gray-100 dark:border-gray-700">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Filtrar Actividades</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ver últimos
          </label>
          <select
            v-model="periodo"
            @change="loadStats; loadLogs()"
            class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
          >
            <option :value="7">7 días</option>
            <option :value="30">30 días</option>
            <option :value="90">90 días</option>
          </select>
        </div>

        <div>
          <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Tipo de acción
          </label>
          <select
            v-model="filters.accion"
            @change="loadLogs"
            class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
          >
            <option value="">Todas las acciones</option>
            <option value="created">Creó algo nuevo</option>
            <option value="updated">Modificó información</option>
            <option value="deleted">Eliminó algo</option>
            <option value="autorizado">Autorizó</option>
            <option value="rechazado">Rechazó</option>
            <option value="importado">Importó datos</option>
            <option value="exportado">Exportó datos</option>
            <option value="aprobado">Aprobó</option>
          </select>
        </div>

        <div>
          <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Categoría
          </label>
          <select
            v-model="filters.modelo"
            @change="loadLogs"
            class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
          >
            <option value="">Todas las categorías</option>
            <option value="Institucion">Instituciones</option>
            <option value="UsuarioApp">Docentes</option>
            <option value="UsuarioWeb">Usuarios Web</option>
            <option value="Justificacion">Justificaciones</option>
            <option value="Asistencia">Asistencias</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Timeline de Actividades Mejorado -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-700">
      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 font-medium">Cargando actividades...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p class="text-red-600 dark:text-red-400 font-medium mb-4">{{ error }}</p>
        <button
          @click="loadLogs"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Logs List -->
      <div v-else-if="logs.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="log in logs"
          :key="log.id"
          class="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-blue-900/20 transition-all cursor-pointer group"
          @click="viewDetail(log)"
        >
          <div class="flex items-start space-x-4">
            <!-- Icon Mejorado -->
            <div :class="getActionColor(log.accion)" class="p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getActionIcon(log.accion)" />
              </svg>
            </div>

            <!-- Content Mejorado -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <p class="text-base font-bold text-gray-900 dark:text-white">
                    {{ log.actor.nombre }}
                  </p>
                  <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {{ getRolAmigable(log.actor.rol) }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatRelativeTime(log.created_at) }}
                </div>
              </div>

              <!-- Descripción más prominente -->
              <p class="text-sm text-gray-700 dark:text-gray-200 font-medium mb-2">
                {{ getDescripcionAmigable(log.accion) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ log.descripcion }}
              </p>

              <!-- Detalles técnicos minimalistas (colapsados por defecto) -->
              <div class="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  {{ log.contexto.ip_address }}
                </span>
              </div>
            </div>

            <!-- Indicador de clic -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State Mejorado -->
      <div v-else class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">No hay actividades registradas</h3>
        <p class="text-gray-600 dark:text-gray-400">
          No se encontraron actividades con los filtros seleccionados
        </p>
      </div>

      <!-- Pagination Mejorado -->
      <div v-if="pagination.total > 0" class="px-6 py-5 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Mostrando 
            <span class="font-bold text-gray-900 dark:text-white">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span> - 
            <span class="font-bold text-gray-900 dark:text-white">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span> 
            de 
            <span class="font-bold text-gray-900 dark:text-white">{{ pagination.total }}</span> 
            actividades
          </p>
          <div class="flex space-x-2">
            <button
              @click="prevPage"
              :disabled="pagination.current_page === 1"
              class="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 transition-all font-medium flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="pagination.current_page >= Math.ceil(pagination.total / pagination.per_page)"
              class="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 transition-all font-medium flex items-center gap-2"
            >
              Siguiente
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
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
    error.value = err.response?.data?.message || 'Error al cargar el historial de actividades'
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

// Helper: Descripción amigable de la acción
const getDescripcionAmigable = (accion) => {
  const descripciones = {
    created: '➕ Creó un nuevo registro',
    updated: '✏️ Modificó información existente',
    deleted: '🗑️ Eliminó un registro',
    autorizado: '✅ Autorizó una acción',
    rechazado: '❌ Rechazó una solicitud',
    importado: '📥 Importó datos al sistema',
    exportado: '📤 Exportó información',
    aprobado: '👍 Aprobó una solicitud'
  }
  return descripciones[accion] || '📋 Realizó una acción'
}

// Helper: Rol amigable
const getRolAmigable = (rol) => {
  const roles = {
    'SUPER_ADMIN': 'Super Admin',
    'ADMIN': 'Administrador',
    'SUPERVISOR': 'Supervisor',
    'DOCENTE': 'Docente'
  }
  return roles[rol] || rol
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
