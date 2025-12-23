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
            Gestión de Supervisores
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            Administra los Supervisores registrados en el sistema
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Filtros y Búsqueda Premium -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm"
      >
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Búsqueda -->
          <div class="flex-1">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Buscar
            </label>
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Buscar por nombre o email..."
              class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Filtro por Estado -->
          <div ref="estadoFilterRef" class="relative w-full md:w-64">
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <i class="fas fa-filter text-purple-500 mr-2"></i> Estado
            </label>
            <button
              type="button"
              @click="showEstadoDropdown = !showEstadoDropdown"
              class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white text-left flex items-center justify-between"
            >
              <span>
                <i
                  v-if="filterEstado === 'pendiente'"
                  class="fas fa-hourglass-half text-yellow-500 mr-2"
                ></i>
                <i
                  v-else-if="filterEstado === 'autorizado'"
                  class="fas fa-check-circle text-green-500 mr-2"
                ></i>
                <i
                  v-else-if="filterEstado === 'rechazado'"
                  class="fas fa-times-circle text-red-500 mr-2"
                ></i>
                {{ filterEstado ? capitalizeEstado(filterEstado) : "Todos los estados" }}
              </span>
              <i class="fas fa-chevron-down"></i>
            </button>

            <div
              v-if="showEstadoDropdown"
              class="absolute z-10 mt-2 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg"
            >
              <ul class="divide-y divide-gray-100 dark:divide-gray-600">
                <li>
                  <button
                    type="button"
                    @click="setEstadoFilter('')"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <i class="fas fa-list mr-2 text-gray-400"></i> Todos los estados
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    @click="setEstadoFilter('pendiente')"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <i class="fas fa-hourglass-half text-yellow-500 mr-2"></i> Pendientes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    @click="setEstadoFilter('autorizado')"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <i class="fas fa-check-circle text-green-500 mr-2"></i> Autorizados
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    @click="setEstadoFilter('rechazado')"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <i class="fas fa-times-circle text-red-500 mr-2"></i> Rechazados
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Botón Nuevo Supervisor -->
          <div class="flex items-end">
            <button
              @click="openCreateModal"
              class="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Supervisor
            </button>
          </div>
        </div>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            Supervisores Registrados
            <span v-if="loading" class="animate-spin">⏳</span>
          </h2>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"
          ></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">Cargando Supervisores...</p>
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
                  Supervisor
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Institución
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Estado
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
                v-for="Supervisor in paginatedSupervisores"
                :key="Supervisor.id"
                @click="openDetailModal(Supervisor.id)"
                class="cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md"
                    >
                      <span class="text-white font-bold text-lg">{{
                        Supervisor.nombre.charAt(0).toUpperCase()
                      }}</span>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-gray-100">
                        {{ Supervisor.nombre }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ Supervisor.email }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-5 h-5 text-blue-500"
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
                    <span class="text-gray-700 dark:text-gray-300">
                      {{ formatInstituciones(Supervisor.instituciones) }}
                    </span>
                  </div>
                </td>

                <td class="px-6 py-4 text-center">
                  <span
                    :class="getEstadoClass(Supervisor.estado)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                  >
                    <span v-if="Supervisor.estado === 'pendiente'">⏳</span>
                    <span v-else-if="Supervisor.estado === 'autorizado'">✅</span>
                    <span v-else>❌</span>
                    {{ Supervisor.estado }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2" @click.stop>
                    <button
                      v-if="Supervisor.estado === 'pendiente'"
                      @click="autorizarSupervisor(Supervisor)"
                      class="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-all hover:scale-110"
                      title="Autorizar"
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>

                    <button
                      v-if="Supervisor.estado === 'pendiente'"
                      @click="rechazarSupervisor(Supervisor)"
                      class="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg transition-all hover:scale-110"
                      title="Rechazar"
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
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>

                    <button
                      @click="openEditModal(Supervisor)"
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
                          d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      @click="confirmDelete(Supervisor)"
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
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!paginatedSupervisores.length">
                <td colspan="4" class="px-6 py-12 text-center">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium">
                      No hay Supervisores registrados
                    </p>
                    <p class="text-gray-400 dark:text-gray-500 text-sm">
                      Comienza creando un nuevo Supervisor
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Unified Supervisor Modal -->
    <SupervisorModal 
        :open="showModal"
        :mode="modalMode"
        :supervisor="selectedSupervisor"
        @close="closeModal"
        @success="handleModalSuccess"
    />

    <!-- Detail Modal -->
    <SupervisorDetailModal
      :is-open="showDetailModal"
      :supervisor-id="selectedSupervisorId"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { usuariosWebService } from "@/services/api";
import { useAlert } from "@/utils/sweetalert";
import SupervisorModal from "@/components/usuarios/SupervisorModal.vue";
import SupervisorDetailModal from "@/components/usuarios/SupervisorDetailModal.vue";

const alert = useAlert();

const loading = ref(false);
const showModal = ref(false);
const modalMode = ref("create");
const selectedSupervisor = ref(null);
const showDetailModal = ref(false);
const selectedSupervisorId = ref(null);

const searchQuery = ref("");
const filterEstado = ref("");
const Supervisores = ref([]);
const showEstadoDropdown = ref(false);
const estadoFilterRef = ref(null);

const loadSupervisores = async () => {
  loading.value = true;
  const params = {
    rol: "supervisor",
    search: searchQuery.value.trim() || undefined,
    estado: filterEstado.value || undefined,
  };

  try {
    const r = await usuariosWebService.getAll(params);
    // Flatten not strictly needed if we access .instituciones array directly in new standard
    Supervisores.value = r.data?.data?.data || r.data?.data || [];
  } catch (error) {
    console.error("Error cargando supervisores:", error);
    Supervisores.value = [];
    alert.error("Error", "No se pudieron cargar los supervisores");
  } finally {
    loading.value = false;
  }
};

// Acciones Modal
const openCreateModal = () => {
    selectedSupervisor.value = null;
    modalMode.value = "create";
    showModal.value = true;
};

const openEditModal = (sup) => {
    selectedSupervisor.value = sup;
    modalMode.value = "edit";
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedSupervisor.value = null;
};

const handleModalSuccess = (payload) => {
    loadSupervisores();
    const msg = modalMode.value === 'create' ? "Supervisor Creado" : "Supervisor Actualizado";
    if (payload === 'provision') alert.toastSuccess("Supervisor Provisionado");
    else alert.toastSuccess(msg);
};

// Detail Modal
const openDetailModal = (id) => {
  selectedSupervisorId.value = id;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedSupervisorId.value = null;
};

// Acciones Item
const autorizarSupervisor = async (d) => {
  const r = await alert.confirm("¿Autorizar Supervisor?", `Supervisor: ${d.nombre}`);
  if (!r.isConfirmed) return;
  await usuariosWebService.autorizar(d.id);
  await loadSupervisores();
  alert.toastSuccess("Supervisor autorizado");
};

const rechazarSupervisor = async (d) => {
  const r = await alert.confirm("¿Rechazar Supervisor?", `Supervisor: ${d.nombre}`);
  if (!r.isConfirmed) return;
  await usuariosWebService.rechazar(d.id);
  await loadSupervisores();
  alert.toastSuccess("Supervisor rechazado");
};

const confirmDelete = async (d) => {
  const r = await alert.confirmDelete(
    "¿Eliminar Supervisor?",
    `Se eliminará a ${d.nombre}`
  );
  if (!r.isConfirmed) return;
  await usuariosWebService.delete(d.id);
  await loadSupervisores();
  alert.toastSuccess("Supervisor eliminado");
};

// Helpers
const formatInstituciones = (insts) => {
   if (!insts || insts.length === 0) return "Sin asignar";
   if (insts.length === 1) return insts[0].nombre;
   return `${insts.length} Instituciones`;
};

const setEstadoFilter = (estado) => {
  filterEstado.value = estado;
  showEstadoDropdown.value = false;
  loadSupervisores();
};

const capitalizeEstado = (estado) => estado.charAt(0).toUpperCase() + estado.slice(1);

const getEstadoClass = (estado) => {
  const classes = {
    pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    autorizado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    rechazado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return classes[estado] || "bg-gray-100 text-gray-800";
};

// Paginación local
const currentPage = ref(1);
const itemsPerPage = 10;
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const paginatedSupervisores = computed(() =>
  Supervisores.value.slice(startIndex.value, startIndex.value + itemsPerPage)
);

const handleSearch = () => loadSupervisores();

// Click Outside
const onGlobalPointerDown = (e) => {
  if (showEstadoDropdown.value) {
    const el = estadoFilterRef.value;
    if (el && !el.contains(e.target)) showEstadoDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("pointerdown", onGlobalPointerDown, { capture: true });
  loadSupervisores();
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onGlobalPointerDown, { capture: true });
});
</script>
