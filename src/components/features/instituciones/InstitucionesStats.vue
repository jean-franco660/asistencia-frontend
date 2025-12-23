<template>
  <div class="space-y-4">
    <!-- Banner de importación en progreso -->
    <div
      v-if="isPollingStats"
      class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4 animate-fadeIn"
    >
      <div class="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
        <div class="flex items-center gap-3 flex-1">
          <Loader2
            :size="20"
            class="text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p
              class="font-semibold text-blue-900 dark:text-blue-100 text-sm sm:text-base"
            >
              Importación en progreso
            </p>
            <p class="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              Actualización automática cada 3 segundos
            </p>
          </div>
        </div>
        <button
          @click="$emit('stopPolling')"
          class="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap"
        >
          Detener
        </button>
      </div>
    </div>

    <!-- Estadísticas de Importación -->
    <div v-if="estadisticasImportacion" class="space-y-3 sm:space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <!-- Total Instituciones -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p
                class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Total Instituciones
              </p>
              <p
                class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2"
              >
                {{ estadisticasImportacion.total || 0 }}
              </p>
            </div>
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 ml-2"
            >
              <Building2
                :size="20"
                class="text-blue-600 dark:text-blue-400 sm:w-6 sm:h-6"
              />
            </div>
          </div>
        </div>

        <!-- Última Importación -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p
                class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Última Importación
              </p>
              <p
                class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 truncate"
              >
                {{ estadisticasImportacion.ultima_importacion?.fecha || "N/A" }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ estadisticasImportacion.ultima_importacion?.hora || "" }}
              </p>
            </div>
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 ml-2"
            >
              <Upload
                :size="20"
                class="text-purple-600 dark:text-purple-400 sm:w-6 sm:h-6"
              />
            </div>
          </div>
        </div>

        <!-- Importados -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p
                class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Importados
              </p>
              <p
                class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mt-1 sm:mt-2"
              >
                {{ estadisticasImportacion.ultima_importacion?.exitosos || 0 }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                de
                {{ estadisticasImportacion.ultima_importacion?.total || 0 }} registros
              </p>
            </div>
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 ml-2"
            >
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Errores -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p
                class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Errores
              </p>
              <p
                class="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mt-1 sm:mt-2"
              >
                {{ estadisticasImportacion.ultima_importacion?.errores_count || 0 }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                última importación
              </p>
            </div>
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0 ml-2"
            >
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Banner de Errores con Botón de Descarga -->
      <div
        v-if="
          estadisticasImportacion.ultima_importacion?.errores_count > 0 &&
          estadisticasImportacion.ultima_importacion?.id
        "
        class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4 animate-fadeIn"
      >
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-yellow-900 dark:text-yellow-100">
                La última importación tuvo
                {{ estadisticasImportacion.ultima_importacion.errores_count }} error(es)
              </p>
              <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Descarga el reporte para revisar los detalles de los errores y
                corregirlos
              </p>
            </div>
          </div>

          <button
            @click="$emit('descargarReporte')"
            :disabled="descargandoErrores"
            class="flex items-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Loader2 v-if="descargandoErrores" :size="18" class="animate-spin" />
            <Download v-else :size="18" />
            <span>{{
              descargandoErrores ? "Descargando..." : "Descargar Errores"
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Building2, Upload, Loader2, Download } from 'lucide-vue-next';

defineProps({
  estadisticasImportacion: {
    type: Object,
    default: null
  },
  isPollingStats: {
    type: Boolean,
    default: false
  },
  descargandoErrores: {
    type: Boolean,
    default: false
  }
});

defineEmits(['stopPolling', 'descargarReporte']);
</script>
