<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="close"
  >
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 transition-opacity"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Detalle de Auditoría
            </h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Log #{{ log?.id }}
            </p>
          </div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Cargando detalles...</p>
          </div>

          <div v-else-if="error" class="text-center py-8">
            <p class="text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <div v-else-if="log" class="space-y-6">
            <!-- Actor Info -->
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Actor
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Nombre</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ log.actor.nombre }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Rol</p>
                  <span :class="getRoleBadgeClass(log.actor.rol)" class="inline-block px-2 py-1 text-xs font-medium rounded">
                    {{ log.actor.rol }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Info -->
            <div>
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Acción
              </h4>
              <div class="flex items-center space-x-3">
                <span :class="getActionBadgeClass(log.accion)" class="px-3 py-1 text-sm font-medium rounded-full">
                  {{ getActionLabel(log.accion) }}
                </span>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {{ log.descripcion }}
                </p>
              </div>
            </div>

            <!-- Model Info -->
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Modelo Afectado
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Tipo</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ log.modelo.type_simple }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">ID</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ log.modelo.id || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Changes (for updates) -->
            <div v-if="log.accion === 'updated' && log.cambios && Object.keys(log.cambios).length > 0">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Cambios Realizados
              </h4>
              <div class="space-y-3">
                <div
                  v-for="(cambio, campo) in log.cambios"
                  :key="campo"
                  class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {{ formatFieldName(campo) }}
                  </p>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Anterior</p>
                      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
                        <p class="text-sm text-red-800 dark:text-red-300 font-mono break-all">
                          {{ formatValue(cambio.anterior) }}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Nuevo</p>
                      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2">
                        <p class="text-sm text-green-800 dark:text-green-300 font-mono break-all">
                          {{ formatValue(cambio.nuevo) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data for created -->
            <div v-if="log.accion === 'created' && log.datos_nuevos">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Datos Creados
              </h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <pre class="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">{{ JSON.stringify(log.datos_nuevos, null, 2) }}</pre>
              </div>
            </div>

            <!-- Data for deleted -->
            <div v-if="log.accion === 'deleted' && log.datos_anteriores">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Datos Eliminados
              </h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <pre class="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">{{ JSON.stringify(log.datos_anteriores, null, 2) }}</pre>
              </div>
            </div>

            <!-- Context -->
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Contexto
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">IP Address</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white font-mono">
                    {{ log.contexto.ip_address }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Método HTTP</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ log.contexto.metodo_http }}
                  </p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400">User Agent</p>
                  <p class="text-xs text-gray-700 dark:text-gray-300 break-all">
                    {{ log.contexto.user_agent }}
                  </p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400">URL</p>
                  <p class="text-xs text-gray-700 dark:text-gray-300 break-all font-mono">
                    {{ log.contexto.url }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Metadata (if exists) -->
            <div v-if="log.metadata" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Metadata
              </h4>
              <pre class="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">{{ JSON.stringify(log.metadata, null, 2) }}</pre>
            </div>

            <!-- Timestamp -->
            <div class="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Registrado el {{ formatDateTime(log.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="close"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { auditLogsService } from '@/services/api'
import { formatDateTime } from '@/utils/formatters'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  logId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close'])

const log = ref(null)
const loading = ref(false)
const error = ref(null)

// Watch for logId changes
watch(() => props.logId, async (newId) => {
  if (newId && props.isOpen) {
    await loadLogDetail(newId)
  }
}, { immediate: true })

// Load log detail
const loadLogDetail = async (id) => {
  loading.value = true
  error.value = null

  try {
    const { data } = await auditLogsService.getById(id)
    log.value = data.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cargar detalle del log'
    console.error('Error loading log detail:', err)
  } finally {
    loading.value = false
  }
}

// Close modal
const close = () => {
  emit('close')
}

// Helpers
const getRoleBadgeClass = (rol) => {
  const classes = {
    super_admin: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    administrador: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    supervisor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
  }
  return classes[rol] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const getActionBadgeClass = (accion) => {
  const classes = {
    created: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    updated: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    deleted: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    autorizado: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    rechazado: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    importado: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    exportado: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
    aprobado: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  }
  return classes[accion] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const getActionLabel = (accion) => {
  const labels = {
    created: 'Creado',
    updated: 'Actualizado',
    deleted: 'Eliminado',
    autorizado: 'Autorizado',
    rechazado: 'Rechazado',
    importado: 'Importado',
    exportado: 'Exportado',
    aprobado: 'Aprobado'
  }
  return labels[accion] || accion
}

const formatFieldName = (field) => {
  // Convert snake_case to Title Case
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatValue = (value) => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}
</script>
