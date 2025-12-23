const loadInstituciones = async () => { try { const response = await
institucionesService.getAll() instituciones.value = response.data?.data || [] } catch
(error) { console.error('Error cargando instituciones:', error) } } const loadUsuarios =
async () => { try { const response = await usuariosService.getAll() usuarios.value =
response.data?.data || [] } catch (error) { console.error('Error cargando usuarios:',
error) } }
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6"
  >
    <div class="max-w-7xl mx-auto spacing-responsive">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          >
            Gestión de Justificaciones
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            Revisa y gestiona las justificaciones de faltas de asistencia
          </p>
        </div>
        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>

      <!-- Estadísticas Rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border-l-4 border-yellow-500"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.pendientes }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center"
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border-l-4 border-green-500"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Aprobadas</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.aprobadas }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-green-600 dark:text-green-400"
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

        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border-l-4 border-red-500"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Rechazadas</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.rechazadas }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Estado -->
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              Estado
            </label>
            <select
              v-model="filters.estado"
              @change="loadJustificaciones"
              class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="APROBADO">Aprobados</option>
              <option value="RECHAZADO">Rechazados</option>
            </select>
          </div>

          <!-- Tipo -->
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-2 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Tipo
            </label>
            <select
              v-model="filters.tipo"
              @change="loadJustificaciones"
              class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Todos los tipos</option>
              <option value="ENFERMEDAD">Enfermedad</option>
              <option value="CAPACITACION">Capacitación</option>
              <option value="PERSONAL">Personal</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <!-- Institución -->
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Institución
            </label>
            <select
              v-model="filters.institucion_id"
              @change="loadJustificaciones"
              class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Todas las instituciones</option>
              <option v-for="inst in instituciones" :key="inst.id" :value="inst.id">
                {{ inst.nombre }}
              </option>
            </select>
          </div>

          <!-- Búsqueda por Docente -->
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-2 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Buscar Docente
            </label>
            <input
              v-model="filters.search"
              @input="loadJustificaciones"
              type="text"
              placeholder="Nombre del docente..."
              class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"
        ></div>
      </div>

      <!-- Lista de Justificaciones -->
      <div
        v-else-if="justificaciones.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="just in justificaciones"
          :key="just.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all cursor-pointer"
          @click="openDetailModal(just)"
        >
          <!-- Header de la tarjeta -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {{ just.usuario?.nombre || "Sin nombre" }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ just.institucion?.nombre || "Sin institución" }}
              </p>
            </div>
            <span
              :class="getEstadoClass(just.estado)"
              class="px-3 py-1 rounded-full text-xs font-bold"
            >
              {{ just.estado }}
            </span>
          </div>

          <!-- Tipo -->
          <div
            class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center gap-2"
          >
            <svg
              class="w-4 h-4 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <p class="text-sm font-semibold text-blue-700 dark:text-blue-300">
              {{ getTipoLabel(just.tipo) }}
            </p>
          </div>

          <!-- Fechas -->
          <div
            class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{{ formatDate(just.fecha_inicio) }}</span>
            <span>→</span>
            <span>{{ formatDate(just.fecha_fin) }}</span>
          </div>

          <!-- Días -->
          <div
            class="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{{ just.dias || 0 }} día(s)</span>
          </div>

          <!-- Motivo preview -->
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
            {{ just.motivo }}
          </p>

          <!-- Acciones rápidas (solo para PENDIENTES) -->
          <div v-if="just.estado === 'PENDIENTE'" class="flex gap-2">
            <button
              @click.stop="aprobarJustificacion(just)"
              class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Aprobar
            </button>
            <button
              @click.stop="rechazarJustificacion(just)"
              class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Rechazar
            </button>
          </div>

          <!-- Badge de estado para aprobadas/rechazadas -->
          <div
            v-else
            class="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            Revisada el {{ formatDate(just.fecha_revision) }}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center"
      >
        <div
          class="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
        >
          <svg
            class="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
          No se encontraron justificaciones
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    </div>

    <!-- Modal Detalle -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showDetailModal = false"
    >
      <div
        v-if="selectedJustificacion"
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white">Detalle de Justificación</h3>
            <span
              :class="getEstadoClass(selectedJustificacion.estado)"
              class="px-3 py-1 rounded-full text-xs font-bold"
            >
              {{ selectedJustificacion.estado }}
            </span>
          </div>
        </div>

        <!-- Contenido -->
        <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <!-- Docente -->
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Docente</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ selectedJustificacion.usuario?.nombre }}
            </p>
          </div>

          <!-- Institución -->
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Institución</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ selectedJustificacion.institucion?.nombre }}
            </p>
          </div>

          <!-- Tipo -->
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Tipo</p>
            <p class="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {{ getTipoLabel(selectedJustificacion.tipo) }}
            </p>
          </div>

          <!-- Período -->
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Período</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ formatDate(selectedJustificacion.fecha_inicio) }} -
              {{ formatDate(selectedJustificacion.fecha_fin) }}
              <span class="text-sm text-purple-600 dark:text-purple-400 ml-2">
                ({{ selectedJustificacion.dias }} días)
              </span>
            </p>
          </div>

          <!-- Motivo -->
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Motivo</p>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {{ selectedJustificacion.motivo }}
              </p>
            </div>
          </div>

          <!-- Información de revisión -->
          <div
            v-if="selectedJustificacion.estado !== 'PENDIENTE'"
            class="p-4 rounded-xl"
            :class="
              selectedJustificacion.estado === 'APROBADO'
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            "
          >
            <div class="flex items-center gap-2 mb-2">
              <svg
                v-if="selectedJustificacion.estado === 'APROBADO'"
                class="w-5 h-5 text-green-600 dark:text-green-400"
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
              <svg
                v-else
                class="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p
                class="text-sm font-semibold"
                :class="
                  selectedJustificacion.estado === 'APROBADO'
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                "
              >
                {{
                  selectedJustificacion.estado === "APROBADO"
                    ? "Aprobado por:"
                    : "Rechazado por:"
                }}
              </p>
            </div>
            <p class="text-gray-700 dark:text-gray-300">
              {{ selectedJustificacion.revisor?.nombre || "Sistema" }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ formatDate(selectedJustificacion.fecha_revision) }}
            </p>
            <p
              v-if="selectedJustificacion.observaciones"
              class="mt-3 text-sm text-gray-600 dark:text-gray-400 p-3 bg-white dark:bg-gray-800 rounded-lg"
            >
              <span class="font-semibold">Observaciones:</span><br />
              {{ selectedJustificacion.observaciones }}
            </p>
          </div>
        </div>

        <!-- Footer con acciones -->
        <div
          class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-600"
        >
          <button
            @click="showDetailModal = false"
            class="px-6 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
          >
            Cerrar
          </button>
          <button
            v-if="selectedJustificacion.estado === 'PENDIENTE'"
            @click="aprobarJustificacion(selectedJustificacion)"
            class="px-6 py-2.5 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Aprobar
          </button>
          <button
            v-if="selectedJustificacion.estado === 'PENDIENTE'"
            @click="rechazarJustificacion(selectedJustificacion)"
            class="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Rechazar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import {
  justificacionesService,
  institucionesService,
  usuariosService,
} from "@/services/api";
import { useAlert } from "@/utils/sweetalert";

const alert = useAlert();

const justificaciones = ref([]);
const instituciones = ref([]);
const usuarios = ref([]);
const loading = ref(false);
const showDetailModal = ref(false);
const selectedJustificacion = ref(null);

const filters = reactive({
  estado: "",
  tipo: "",
  institucion_id: "",
  usuario_id: "",
});

// Estadísticas computadas
const stats = computed(() => ({
  pendientes: justificaciones.value.filter((j) => j.estado === "PENDIENTE").length,
  aprobadas: justificaciones.value.filter((j) => j.estado === "APROBADO").length,
  rechazadas: justificaciones.value.filter((j) => j.estado === "RECHAZADO").length,
}));

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC", // ✅ FIX: Interpretar como UTC para evitar shift de timezone
  });
};

const getTipoLabel = (tipo) => {
  const labels = {
    ENFERMEDAD: "Enfermedad",
    CAPACITACION: "Capacitación",
    PERSONAL: "Personal",
    OTRO: "Otro",
  };
  return labels[tipo] || tipo;
};

const getEstadoClass = (estado) => {
  const classes = {
    PENDIENTE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    APROBADO: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    RECHAZADO: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return classes[estado] || "bg-gray-100 text-gray-800";
};

const loadJustificaciones = async () => {
  loading.value = true;
  try {
    const params = {};
    if (filters.estado) params.estado = filters.estado;
    if (filters.tipo) params.tipo = filters.tipo;
    if (filters.institucion_id) params.institucion_id = filters.institucion_id;
    if (filters.usuario_id) params.usuario_id = filters.usuario_id;

    const response = await justificacionesService.getAll(params);
    justificaciones.value = response.data?.data || [];
  } catch (error) {
    console.error("Error al cargar justificaciones:", error);
    alert.error("Error", "No se pudieron cargar las justificaciones");
    justificaciones.value = [];
  } finally {
    loading.value = false;
  }
};

const openDetailModal = (just) => {
  selectedJustificacion.value = just;
  showDetailModal.value = true;
};

const aprobarJustificacion = async (just) => {
  try {
    const result = await alert.confirm(
      "¿Aprobar justificación?",
      `Se aprobará la justificación de ${just.usuario?.nombre}`
    );
    if (!result.isConfirmed) return;

    await justificacionesService.aprobar(just.id, {
      observaciones: "Aprobado",
    });

    alert.toastSuccess("Justificación aprobada correctamente");

    showDetailModal.value = false;
    loadJustificaciones();
  } catch (error) {
    console.error("Error al aprobar:", error);
    alert.error(
      "Error",
      error.response?.data?.error || "No se pudo aprobar la justificación"
    );
  }
};

const rechazarJustificacion = async (just) => {
  try {
    const result = await alert.prompt(
      "¿Rechazar justificación?",
      "Ingrese el motivo del rechazo",
      "textarea"
    );
    if (!result.isConfirmed || !result.value) return;

    console.log("📤 Intentando rechazar justificación:", just.id, "Motivo:", result.value);
    
    await justificacionesService.rechazar(just.id, {
      observaciones: result.value,
    });

    console.log("✅ Justificación rechazada con éxito");
    alert.toastSuccess("Justificación rechazada");

    showDetailModal.value = false;
    loadJustificaciones();
  } catch (error) {
    console.error("❌ Error al rechazar (catch):", error);
    console.error("❌ Response data:", error.response?.data);
    
    alert.error(
      "Error",
      error.response?.data?.error || "No se pudo rechazar la justificación"
    );
  }
};

onMounted(() => {
  loadJustificaciones();
  // loadInstituciones() // Descomentar cuando tengas el servicio
});
</script>
