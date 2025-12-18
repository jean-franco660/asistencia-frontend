<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="close"
  >
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/80 transition-opacity"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-xl"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Foto de Asistencia
            </h3>
            <p v-if="asistencia" class="text-sm text-gray-600 dark:text-gray-400">
              {{ asistencia.usuario?.nombre_completo }} - {{ formatDateTime(asistencia.fecha_hora) }}
            </p>
          </div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Loading -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Cargando foto...</p>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
            <svg class="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
            <button
              @click="loadPhoto"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>

          <!-- Photo -->
          <div v-else-if="photoUrl" class="relative">
            <img
              :src="photoUrl"
              :alt="`Foto de ${asistencia?.usuario?.nombre_completo}`"
              class="w-full h-auto rounded-lg"
              :class="{ 'cursor-zoom-in': !zoomed, 'cursor-zoom-out': zoomed }"
              :style="zoomed ? 'transform: scale(1.5); transform-origin: center;' : ''"
              @click="toggleZoom"
            />
            
            <!-- Zoom controls -->
            <div class="absolute bottom-4 right-4 flex space-x-2">
              <button
                @click="toggleZoom"
                class="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                :title="zoomed ? 'Alejar' : 'Acercar'"
              >
                <svg v-if="!zoomed" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- No photo -->
          <div v-else class="flex flex-col items-center justify-center py-12">
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-600 dark:text-gray-400">No hay foto disponible</p>
          </div>
        </div>

        <!-- Footer with info -->
        <div v-if="asistencia && !loading && !error" class="px-6 pb-6">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500 dark:text-gray-400">Tipo</p>
                <p class="font-medium text-gray-900 dark:text-white capitalize">
                  {{ asistencia.tipo }}
                </p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400">Estado</p>
                <span :class="getEstadoBadgeClass(asistencia.estado)" class="inline-block px-2 py-1 text-xs font-medium rounded">
                  {{ getEstadoLabel(asistencia.estado) }}
                </span>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400">Ubicación</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ asistencia.dentro_rango ? '✓ Dentro del rango' : '✗ Fuera del rango' }}
                </p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400">Institución</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ asistencia.institucion?.nombre }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Close button -->
        <div class="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="close"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
import { useAsistencias } from '@/composables/useAsistencias'
import { formatDateTime } from '@/utils/formatters'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  asistenciaId: {
    type: Number,
    default: null
  },
  asistencia: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const { getFoto } = useAsistencias()
const photoUrl = ref(null)
const loading = ref(false)
const error = ref(null)
const zoomed = ref(false)

// Watch for asistenciaId changes
watch(() => props.asistenciaId, async (newId) => {
  if (newId && props.isOpen) {
    await loadPhoto()
  }
}, { immediate: true })

// Watch for modal close to reset zoom
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    zoomed.value = false
  }
})

// Load photo
const loadPhoto = async () => {
  if (!props.asistenciaId) return

  loading.value = true
  error.value = null
  photoUrl.value = null

  try {
    const url = await getFoto(props.asistenciaId)
    photoUrl.value = url
  } catch (err) {
    error.value = err.message || 'Error al cargar la foto'
    console.error('Error loading photo:', err)
  } finally {
    loading.value = false
  }
}

// Toggle zoom
const toggleZoom = () => {
  zoomed.value = !zoomed.value
}

// Close modal
const close = () => {
  emit('close')
}

// Helpers
const getEstadoBadgeClass = (estado) => {
  const classes = {
    a_tiempo: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    tarde: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    falta: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    justificado: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    salida_antes: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
  }
  return classes[estado] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const getEstadoLabel = (estado) => {
  const labels = {
    a_tiempo: 'A tiempo',
    tarde: 'Tarde',
    falta: 'Falta',
    justificado: 'Justificado',
    salida_antes: 'Salida anticipada'
  }
  return labels[estado] || estado
}
</script>
