<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
  >
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header Premium -->
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          >
            Gestión de Horarios
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            Administra los turnos y horarios de tu institución
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Selector de institución Premium -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
          </div>
          <label class="text-lg font-semibold text-gray-800 dark:text-gray-100"
            >Institución</label
          >
        </div>
        <template v-if="mostrarSelector">
          <select
            v-model="institucionId"
            @change="loadHorarios"
            class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            :disabled="loadingInstituciones"
          >
            <option value="">Seleccione institución</option>
            <option v-for="i in instituciones" :key="i.id" :value="i.id">
              {{ i.nombre }}
            </option>
          </select>
        </template>
        <template v-else>
          <div
            class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4"
          >
            <p class="font-semibold text-gray-800 dark:text-gray-100 text-lg">
              <span v-if="loadingInstituciones">Cargando...</span>
              <span v-else>{{
                instituciones.find((i) => i.id == institucionId)?.nombre
              }}</span>
            </p>
          </div>
        </template>
      </div>

      <!-- Botón crear Premium -->
      <div class="flex justify-end">
        <button
          class="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
          @click="openCreate"
          :disabled="!institucionId || loadingHorarios"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Registrar nuevo horario
        </button>
      </div>

      <!-- Tabla Premium -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600"
        >
          <h2
            class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3"
          >
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            Horarios Registrados
            <span v-if="loadingHorarios" class="animate-spin">⏳</span>
          </h2>
        </div>

        <div v-if="loadingHorarios" class="p-12 text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"
          ></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">Cargando horarios...</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700"
              >
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Turno
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Entrada
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Salida
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Días
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Tolerancia
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="h in horarios"
                :key="`horario-${h.institucion_id || institucionId}-${h.id}-${h.nombre_turno}`"
                class="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md"
                    >
                      <svg
                        class="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        ></path>
                      </svg>
                    </div>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{
                      h.nombre_turno
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <svg
                      class="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      ></path>
                    </svg>
                    <span class="font-medium">{{ formatearHora(h.hora_entrada) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <svg
                      class="w-4 h-4 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      ></path>
                    </svg>
                    <span class="font-medium">{{ formatearHora(h.hora_salida) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {{ formatearDias(h.dias_semana) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    {{ h.tolerancia_minutos }} min
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-3">
                    <button
                      @click="openEdit(h)"
                      class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all hover:scale-110"
                      title="Editar"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      @click="confirmDelete(h.id)"
                      class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all hover:scale-110"
                      title="Eliminar"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M7 7h10"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!horarios.length">
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div
                      class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <svg
                        class="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        ></path>
                      </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium">
                      No hay horarios registrados
                    </p>
                    <p class="text-gray-400 dark:text-gray-500 text-sm">
                      Comienza creando un nuevo horario
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Premium -->
    <transition name="modal">
      <div
        v-if="modalOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all"
        >
          <!-- Header del Modal -->
          <div
            class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-3xl"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                {{ editMode ? "Editar Horario" : "Registrar Horario" }}
              </h3>
              <button
                @click="closeModal"
                class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all"
                :disabled="saving"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido del Modal -->
          <div class="p-6 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <!-- Turno -->
              <div class="col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Turno
                </label>
                <select
                  v-model="form.nombre_turno"
                  class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Seleccione un turno</option>
                  <option value="Mañana">☀️ Mañana</option>
                  <option value="Tarde">🌤️ Tarde</option>
                  <option value="Noche">🌙 Noche</option>
                </select>
              </div>

              <!-- Hora Entrada -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Hora de Entrada
                </label>
                <div class="relative">
                  <input
                    type="time"
                    v-model="form.hora_entrada"
                    class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <!-- Hora Salida -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Hora de Salida
                </label>
                <div class="relative">
                  <input
                    type="time"
                    v-model="form.hora_salida"
                    class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <!-- Tolerancia -->
              <div class="col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tolerancia (minutos)
                </label>
                <input
                  type="number"
                  v-model.number="form.tolerancia_minutos"
                  min="0"
                  max="60"
                  class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ej: 15"
                />
              </div>
            </div>

            <!-- Días de la semana -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                Días de la semana
              </label>
              <div class="grid grid-cols-7 gap-2">
                <label
                  v-for="d in diasOpciones"
                  :key="d.valor"
                  class="relative cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    :value="d.valor"
                    v-model="form.dias_semana"
                    class="peer sr-only"
                  />
                  <div
                    class="flex flex-col items-center justify-center p-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 peer-checked:shadow-md transition-all hover:scale-105"
                  >
                    <span
                      class="text-xs font-bold text-gray-700 dark:text-gray-300 peer-checked:text-blue-600 dark:peer-checked:text-blue-400"
                    >
                      {{ d.valor }}
                    </span>
                    <span class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      {{ d.nombre.substring(0, 3) }}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer del Modal -->
          <div
            class="bg-gray-50 dark:bg-gray-750 px-6 py-4 rounded-b-3xl flex justify-end gap-3"
          >
            <button
              class="px-6 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
              @click="closeModal"
              :disabled="saving"
            >
              Cancelar
            </button>
            <button
              class="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              @click="saveHorario"
              :disabled="saving"
            >
              <svg
                v-if="saving"
                class="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span v-if="saving">Guardando...</span>
              <span v-else>{{ editMode ? "Actualizar" : "Guardar" }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api, { institucionesService } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import { useAlert } from "@/utils/sweetalert";

const auth = useAuthStore();
const alert = useAlert();

const instituciones = ref([]);
const horarios = ref([]);
const institucionId = ref("");
const loadingInstituciones = ref(false);
const loadingHorarios = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editMode = ref(false);

const form = ref({
  id: null,
  institucion_id: "",
  nombre_turno: "",
  hora_entrada: "",
  hora_salida: "",
  tolerancia_minutos: 5,
  dias_semana: [],
});

const diasOpciones = [
  { nombre: "Lunes", valor: "L" },
  { nombre: "Martes", valor: "M" },
  { nombre: "Miércoles", valor: "X" },
  { nombre: "Jueves", valor: "J" },
  { nombre: "Viernes", valor: "V" },
  { nombre: "Sábado", valor: "S" },
  { nombre: "Domingo", valor: "D" },
];

const mostrarSelector = computed(
  () => auth.user?.rol === "admin" || instituciones.value.length > 1
);

const formatearDias = (dias) => {
  if (!dias) return "Sin días";
  if (Array.isArray(dias)) return dias.join(", ");
  try {
    if (dias.startsWith("[")) return JSON.parse(dias).join(", ");
  } catch {}
  return dias.includes(",")
    ? dias
        .split(",")
        .map((d) => d.trim())
        .join(", ")
    : dias;
};

const formatearHora = (hora) => (hora && hora.length > 5 ? hora.substring(0, 5) : hora);

// Cargar instituciones
const loadInstituciones = async () => {
  loadingInstituciones.value = true;
  try {
    if (auth.user?.rol === "admin") {
      const r = await institucionesService.getAll();
      instituciones.value = r.data?.data ?? [];
    } else {
      // Para directores: obtener instituciones asignadas
      try {
        const r = await api.get("/instituciones/mias");
        const misInstituciones = r.data?.data || r.data || [];
        
        if (misInstituciones.length > 0) {
          instituciones.value = misInstituciones;
        } else {
          // Fallback: obtener desde dashboard
          const dashboardRes = await api.get("/director/dashboard");
          const nombreInstitucion = dashboardRes.data.institucion;
          
          const todasRes = await institucionesService.getAll();
          const todas = todasRes.data?.data || [];
          const institucionEncontrada = todas.find(i => i.nombre === nombreInstitucion);
          
          if (institucionEncontrada) {
            instituciones.value = [institucionEncontrada];
          } else {
            throw new Error("No se pudo determinar la institución del director");
          }
        }
      } catch (error) {
        console.error("❌ Error obteniendo instituciones del director:", error);
        alert.error(
          "Error de configuración", 
          "No se pudo obtener la institución asignada. Por favor contacta al administrador."
        );
        loadingInstituciones.value = false;
        return;
      }
    }

    if (instituciones.value.length >= 1) {
      institucionId.value = instituciones.value[0].id;
      await loadHorarios();
    }
  } catch (e) {
    console.error("❌ Error cargando instituciones:", e);
    alert.error("Error", "Error cargando instituciones");
  }
  loadingInstituciones.value = false;
};

// Cargar horarios según institución
const loadHorarios = async () => {
  horarios.value = [];
  
  if (!institucionId.value) {
    return;
  }

  loadingHorarios.value = true;

  try {
    const r = await api.get(`/horarios?institucion_id=${institucionId.value}`);
    const data = Array.isArray(r.data) ? r.data : r.data?.data ?? [];
    
    horarios.value = data.filter(
      (h) => String(h.institucion_id) === String(institucionId.value)
    );
  } catch (e) {
    alert.error("Error", "No se pudieron cargar los horarios");
    horarios.value = [];
  } finally {
    loadingHorarios.value = false;
  }
};

// Abrir modal para crear
const openCreate = () => {
  if (!institucionId.value) {
    alert.error("Error", "Debe seleccionar una institución primero");
    return;
  }
  
  editMode.value = false;
  form.value = {
    id: null,
    institucion_id: institucionId.value,
    nombre_turno: "",
    hora_entrada: "",
    hora_salida: "",
    tolerancia_minutos: 5,
    dias_semana: [],
  };
  modalOpen.value = true;
};

// Abrir modal para editar
const openEdit = (h) => {
  editMode.value = true;
  let diasArray = Array.isArray(h.dias_semana)
    ? h.dias_semana
    : typeof h.dias_semana === "string"
    ? h.dias_semana.split(",").map((d) => d.trim())
    : [];
  form.value = {
    id: h.id,
    institucion_id: h.institucion_id || institucionId.value,
    nombre_turno: h.nombre_turno,
    hora_entrada: h.hora_entrada,
    hora_salida: h.hora_salida,
    tolerancia_minutos: h.tolerancia_minutos,
    dias_semana: diasArray,
  };
  modalOpen.value = true;
};

// Guardar horario
const saveHorario = async () => {
  if (!form.value.nombre_turno) return alert.error("Validación", "Seleccione un turno");
  if (!form.value.hora_entrada || !form.value.hora_salida)
    return alert.error("Validación", "Complete la hora de entrada y salida");
  if (!form.value.dias_semana.length)
    return alert.error("Validación", "Seleccione al menos un día");

  saving.value = true;
  try {
    const sanitizar = (h) => (h.length > 5 ? h.substring(0, 5) : h);
    const payload = {
      institucion_id: form.value.institucion_id,
      nombre_turno: form.value.nombre_turno,
      hora_entrada: sanitizar(form.value.hora_entrada),
      hora_salida: sanitizar(form.value.hora_salida),
      tolerancia_minutos: form.value.tolerancia_minutos,
      dias_semana: form.value.dias_semana,
    };

    if (editMode.value) {
      await api.put(`/horarios/${form.value.id}`, payload);
      alert.toastSuccess("Horario actualizado");
    } else {
      await api.post(`/horarios`, payload);
      alert.toastSuccess("Horario registrado");
    }
    await loadHorarios();
    modalOpen.value = false;
  } catch (e) {
    if (e.response?.data?.errors) {
      const errores = Object.entries(e.response.data.errors)
        .map(([campo, msg]) => `${campo}: ${msg.join(", ")}`)
        .join("<br>");
      alert.error("Errores de validación", errores);
    } else {
      alert.error("Error", e.response?.data?.message || "Error guardando horario");
    }
  }
  saving.value = false;
};

// Cerrar modal
const closeModal = () => {
  if (!saving.value) modalOpen.value = false;
};

// Confirmar y eliminar
const confirmDelete = async (id) => {
  const r = await alert.confirmDelete(
    "¿Eliminar horario?",
    "Esta acción no se puede deshacer"
  );
  if (!r.isConfirmed) return;
  try {
    await api.delete(`/horarios/${id}`);
    await loadHorarios();
    alert.toastSuccess("Horario eliminado");
  } catch {
    alert.error("Error", "No se pudo eliminar el horario");
  }
};

// Montaje inicial
onMounted(loadInstituciones);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
