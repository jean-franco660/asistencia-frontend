<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6">
    <div class="max-w-7xl mx-auto spacing-responsive space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-[22px] font-medium text-slate-900 dark:text-slate-100">Gestión de Feriados</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Feriados nacionales e institucionales</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-100 text-blue-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8h18M7 4h10M16 16v1a2 2 0 01-2 2H10a2 2 0 01-2-2v-1"/></svg>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Feriados Totales</p>
              <p class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ stats.total }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-100 text-rose-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3"/></svg>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Nacionales</p>
              <p class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ stats.nacionales }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Institucionales</p>
              <p class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ stats.institucionales }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-gray-900 shadow-sm p-4 space-y-4">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex flex-col gap-3 w-full lg:w-auto">
                <div class="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                  <button
                    type="button"
                    @click="selectTipo('nacional')"
                    :class="['px-3 py-1 rounded-lg text-sm font-medium', tipoActual === 'nacional' ? 'bg-[#185FA5] text-white' : 'text-slate-500 dark:text-slate-400']"
                  >
                    Nacionales
                  </button>
                  <button
                    type="button"
                    @click="selectTipo('institucional')"
                    :class="['px-3 py-1 rounded-lg text-sm font-medium', tipoActual === 'institucional' ? 'bg-[#3B6D11] text-white' : 'text-slate-500 dark:text-slate-400']"
                  >
                    Institucionales
                  </button>
                </div>

                <div v-if="(isAdmin || isSupervisor) && instituciones.length" class="relative w-full lg:w-[380px]">
                  <button
                    type="button"
                    @click="toggleDropdown"
                    class="w-full flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-left shadow-sm"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-7 h-7 rounded-xl flex items-center justify-center" :style="selectedInstColor">
                        {{ institutionInitials }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{{ selectedInstitutionName }}</p>
                        <p class="text-xs text-slate-500 dark:text-slate-400">{{ selectedInstitutionMeta }}</p>
                      </div>
                    </div>
                    <i class="ti ti-chevron-down text-slate-500 transition-transform" :class="dropdownOpen ? 'rotate-180' : ''"></i>
                  </button>

                  <div
                    v-if="dropdownOpen"
                    class="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-xl"
                  >
                    <div class="p-3 border-b border-slate-200/80 dark:border-slate-700">
                      <div class="relative">
                        <i class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input
                          v-model="institucionSearch"
                          type="text"
                          placeholder="Buscar..."
                          class="w-full rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 py-2 pl-10 pr-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div class="max-h-64 overflow-auto">
                      <button
                        v-for="inst in filteredInstituciones"
                        :key="inst.id"
                        type="button"
                        @click="selectInstitution(inst.id)"
                        :class="['w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition', inst.id === institucionSeleccionada ? 'bg-[#EEEDFE]' : 'hover:bg-slate-100 dark:hover:bg-slate-800']"
                      >
                        <div class="flex items-center gap-3 min-w-0">
                          <div class="w-9 h-9 rounded-xl flex items-center justify-center" :style="institutionColor(inst.id)">
                            {{ initials(inst.nombre) }}
                          </div>
                          <div class="min-w-0">
                            <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{{ inst.nombre }}</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">{{ getInstitutionCount(inst.id) }} feriados inst.</p>
                          </div>
                        </div>
                        <i v-if="inst.id === institucionSeleccionada" class="ti ti-check text-slate-700 dark:text-slate-200"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-if="isAdmin"
                  @click="syncFeriados"
                  :disabled="loading"
                  class="rounded-2xl border px-3 py-2 text-[13px] font-medium"
                  :class="loading ? 'border-[#B8D3F0] bg-[#E6F1FB] text-[#185FA5] opacity-60' : 'border-[#B8D3F0] bg-[#E6F1FB] text-[#185FA5] hover:bg-[#d7e8fb]'"
                >
                  {{ loading ? 'Actualizando...' : 'Sincronizar Nacionales' }}
                </button>

                <button
                  v-if="canSave && tipoActual === 'institucional'"
                  @click="openNew"
                  class="rounded-2xl border border-[#DDEECD] bg-[#EAF3DE] px-3 py-2 text-[13px] font-medium text-[#3B6D11] hover:bg-[#e1ebca]"
                >
                  Nuevo feriado
                </button>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3">
              <VCalendar
                expanded
                title-position="center"
                :is-dark="isDarkTheme"
                :attributes="attributes"
                @dayclick="handleDayClick"
                @page-change="handlePageChange"
                class="rounded-2xl"
              />
            </div>

            <div class="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div class="flex items-center gap-2">
                <span class="inline-flex h-2.5 w-2.5 rounded-full bg-rose-300"></span>
                Nacional
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300"></span>
                Institucional
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 border border-slate-200/80 dark:border-slate-700 rounded-2xl shadow-sm p-4">
          <div class="flex items-center justify-between gap-3 mb-4">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Feriados</h3>
            <div class="relative w-full max-w-[220px]">
              <i class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                v-model="sidebarSearch"
                type="text"
                placeholder="Buscar..."
                class="w-full rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2 pl-10 pr-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="space-y-5 max-h-[70vh] overflow-auto pr-1">
            <template v-if="groupedFeriadosKeys.length">
              <div v-for="month in groupedFeriadosKeys" :key="month" class="space-y-3">
                <div class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{{ month }}</div>
                <div class="space-y-2">
                  <div
                    v-for="f in groupedFeriados[month]"
                    :key="f.id"
                    class="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-3 transition hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    <div class="min-w-[72px] text-[11px] text-slate-500 dark:text-slate-400">{{ displayDate(f.fecha) }}</div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate">{{ f.nombre || f.descripcion }}</p>
                      <span
                        :class="['inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold', f.tipo === 'nacional' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700']"
                      >
                        {{ f.tipo === 'nacional' ? 'Nacional' : 'Institucional' }}
                      </span>
                    </div>
                    <button
                      type="button"
                      @click="editFromList(f)"
                      class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition"
                      aria-label="Editar feriado"
                    >
                      <i class="ti ti-edit text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="text-sm text-slate-500 dark:text-slate-400">No se encontraron feriados.</div>
          </div>

          <!-- Modal -->
          <div
            v-if="modalOpen"
            class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-96 animate-fadeIn">
              <h2
                class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4"
              >
                <i class="fas fa-calendar-plus text-blue-600 dark:text-blue-400"></i>
                {{ editMode ? "Editar Feriado" : "Nuevo Feriado" }}
              </h2>

              <div class="space-y-4">
                <!-- Fecha -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                  <input type="date" v-model="form.fecha" class="w-full border p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm" />
                </div>

                <!-- Nombre / Descripción -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                  <input type="text" v-model="form.descripcion" placeholder="Ej: Día del Maestro" class="w-full border p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm" />
                </div>

                <!-- Activo (solo institucional) -->
                <div v-if="tipoActual === 'institucional'" class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="form.activo"
                    class="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300 font-medium"
                    >Activo</span
                  >
                </div>
              </div>

              <!-- Botones -->
              <div class="flex justify-end gap-2 mt-6">
                <button
                  class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300"
                  @click="closeModal"
                >
                  Cancelar
                </button>

                <button
                  v-if="editMode && canDelete"
                  @click="deleteFeriado"
                  class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                >
                  Eliminar
                </button>

                <button
                  v-if="canSave"
                  @click="saveFeriado"
                  class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/services/api";
import { useAuthStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import { useAlert } from "@/utils/sweetalert";

const auth = useAuthStore();
const theme = useThemeStore();
const alert = useAlert();

/* === STATE === */
const instituciones = ref([]);
const institucionSeleccionada = ref(null);

const attributes = ref([]);
const feriadosRaw = ref([]);
const modalOpen = ref(false);
const editMode = ref(false);
const selectedId = ref(null);

const tipoActual = ref('nacional'); // "nacional" | "institucional"

const loading = ref(false);
const currentYear = ref(new Date().getFullYear());

const form = ref({
  fecha: "",
  descripcion: "",
  activo: true,
});

const dropdownOpen = ref(false);
const institucionSearch = ref("");
const sidebarSearch = ref("");

/* === HELPERS === */
const normalize = (d) => {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt.toISOString().split("T")[0];
};

const displayDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch (e) {
    return iso;
  }
};

const isAdmin = computed(() => auth.user?.rol === "administrador" || auth.user?.rol === "super_admin");
const isSupervisor = computed(() => auth.user?.rol === "supervisor");
const isDarkTheme = computed(() => theme.isDark);

const initials = (nombre) => {
  if (!nombre) return "--";
  const parts = nombre.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getInstitutionCount = (id) => {
  return feriadosRaw.value.filter((f) => f.tipo === 'institucional' && f.institucion_id === id).length;
};

const institutionColor = (id) => {
  const palette = [
    '#C7D2FE',
    '#FDE68A',
    '#A7F3D0',
    '#FBCFE8',
    '#BFDBFE',
  ];
  return {
    backgroundColor: palette[id % palette.length],
    color: '#0F172A',
  };
};

const filteredInstituciones = computed(() => {
  const query = institucionSearch.value.toLowerCase().trim();
  return instituciones.value.filter((inst) =>
    inst.nombre.toLowerCase().includes(query)
  );
});

const selectedInstitution = computed(() => {
  return instituciones.value.find((inst) => inst.id === institucionSeleccionada.value) || null;
});

const selectedInstitutionName = computed(() => selectedInstitution.value?.nombre || 'Selecciona institución');
const selectedInstitutionMeta = computed(() => {
  if (!selectedInstitution.value) return 'Todas las instituciones';
  return `${getInstitutionCount(selectedInstitution.value.id)} feriados`; 
});
const institutionInitials = computed(() => initials(selectedInstitution.value?.nombre || 'IN'));
const selectedInstColor = computed(() => `background-color: #E0E7FF; color: #1E3A8A;`);

const filteredListFeriados = computed(() => {
  const query = sidebarSearch.value.toLowerCase().trim();
  return filteredFeriados.value.filter((f) => {
    return (
      !query ||
      `${f.nombre || f.descripcion}`.toLowerCase().includes(query)
    );
  });
});

const groupedFeriados = computed(() => {
  return filteredListFeriados.value.reduce((acc, feriado) => {
    const date = new Date(feriado.fecha);
    const month = date.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(feriado);
    return acc;
  }, {});
});

const groupedFeriadosKeys = computed(() => Object.keys(groupedFeriados.value));

/* === PERMISOS === */
const canSave = computed(() => {
  if (tipoActual.value === "nacional") return isAdmin.value;
  if (tipoActual.value === "institucional") {
    if (isAdmin.value) return true;
    if (isSupervisor.value && institucionSeleccionada.value) return true;
  }
  return false;
});

const canDelete = computed(() => canSave.value && editMode.value);

const filteredFeriados = computed(() => {
  return feriadosRaw.value.filter((f) => f.tipo === tipoActual.value);
});

const stats = computed(() => {
  const total = feriadosRaw.value.length;
  const nacionales = feriadosRaw.value.filter((f) => f.tipo === 'nacional').length;
  const institucionales = feriadosRaw.value.filter((f) => f.tipo === 'institucional').length;
  return { total, nacionales, institucionales };
});

/* === Cargar instituciones === */
const loadInstituciones = async () => {
  try {
    if (isAdmin.value || isSupervisor.value) {
      const { data } = await api.get("/instituciones");
      instituciones.value = Array.isArray(data) ? data : data?.data ?? [];

      if (instituciones.value.length && !institucionSeleccionada.value) {
        institucionSeleccionada.value = instituciones.value[0].id;
      }
    }

    await loadFeriados();
  } catch (e) {
    console.error("Error cargando instituciones:", e);
    alert.error("Error", "No se pudieron cargar las instituciones");
  }
};

/* === Cargar feriados (nacionales + institucionales) === */
const loadFeriados = async () => {
  try {
    const params = {};

    // Si es director o se está trabajando institucional, filtrar
    if (isSupervisor.value || tipoActual.value === "institucional") {
      params.institucion_id = institucionSeleccionada.value ?? null;
    }

    const { data } = await api.get("/feriados", { params });

    // Keep raw list for the side panel and actions
    feriadosRaw.value = data || [];

    attributes.value = feriadosRaw.value.map((f) => {
      const fecha = new Date(f.fecha);

      return {
        key: `feriado-${f.id}`,
        dates: fecha,
        highlight: f.tipo === "nacional" ? "red" : "green",
        popover: { label: `${f.nombre || f.descripcion} (${f.tipo})` },
        customData: f,
        contentClass:
          f.tipo === "nacional" ? "feriado-nacional" : "feriado-institucional",
      };
    });
  } catch (err) {
    console.error("Error cargando feriados:", err);
    console.error("Response:", err.response?.data);
    
    if (err.response?.status === 403) {
      alert.error(
        "Acceso denegado", 
        "No tienes permisos para acceder a los feriados. Este es un problema de configuración del backend."
      );
    } else {
      alert.error("Error", err.response?.data?.message || "No se pudieron cargar los feriados");
    }
  }
};

/* === Cambio de mes en calendario === */
const handlePageChange = ({ year }) => {
  currentYear.value = year;
  loadFeriados();
};

/* === Click en día === */
const handleDayClick = ({ date }) => {
  const norm = normalize(date);

  const f = attributes.value.find((a) => normalize(a.dates) === norm);

  if (f) {
    // Editar feriado existente
    selectedId.value = f.customData.id;
    tipoActual.value = f.customData.tipo;

    form.value = {
      fecha: norm,
      descripcion: f.customData.descripcion,
      activo: f.customData.activo ?? true,
    };

    editMode.value = true;
  } else {
    // Crear nuevo feriado
    selectedId.value = null;
    tipoActual.value = isAdmin.value ? "nacional" : "institucional";

    form.value = {
      fecha: norm,
      descripcion: "",
      activo: true,
    };

    editMode.value = false;
  }

  modalOpen.value = true;
};

const selectTipo = (t) => {
  tipoActual.value = t;
  loadFeriados();
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectInstitution = (id) => {
  institucionSeleccionada.value = id;
  dropdownOpen.value = false;
  institucionSearch.value = '';
  loadFeriados();
};

const openNew = () => {
  selectedId.value = null;
  editMode.value = false;
  form.value = { fecha: normalize(new Date()), descripcion: '', activo: true };
  tipoActual.value = 'institucional';
  modalOpen.value = true;
};

const editFromList = (f) => {
  selectedId.value = f.id;
  tipoActual.value = f.tipo;
  form.value = { fecha: f.fecha, descripcion: f.nombre || f.descripcion, activo: f.activo ?? true };
  editMode.value = true;
  modalOpen.value = true;
};

const canDeleteFromList = (f) => {
  if (!f) return false;
  if (f.tipo === 'nacional') return isAdmin.value;
  // institutional: admins and supervisors (if selected institution matches)
  if (f.tipo === 'institucional') {
    if (isAdmin.value) return true;
    if (isSupervisor.value && f.institucion_id === institucionSeleccionada.value) return true;
  }
  return false;
};

const confirmDeleteFromList = async (f) => {
  selectedId.value = f.id;
  const r = await alert.confirmDelete('¿Eliminar feriado?', 'Esta acción no se puede deshacer');
  if (!r.isConfirmed) return;
  try {
    await api.delete(`/feriados/${f.id}`);
    alert.toastSuccess('Feriado eliminado');
    await loadFeriados();
  } catch (err) {
    alert.error('Error', 'No se pudo eliminar el feriado');
  }
};

/* === Guardar feriado === */
const saveFeriado = async () => {
  if (!form.value.fecha || !form.value.descripcion) {
    alert.error("Campos requeridos", "Debe completar la fecha y la descripción");
    return;
  }

  // Validar que institucion_id sea requerido para tipo institucional
  if (tipoActual.value === "institucional" && !institucionSeleccionada.value) {
    alert.error("Validación", "Debe seleccionar una institución para feriados institucionales");
    return;
  }

  const payload = {
    tipo: tipoActual.value,  // "nacional" o "institucional" (minúscula)
    nombre: form.value.descripcion,  // Backend espera "nombre", no "descripcion"
    fecha: form.value.fecha,  // YYYY-MM-DD
    activo: form.value.activo,
  };

  // institucion_id es REQUERIDO para tipo institucional
  if (tipoActual.value === "institucional") {
    payload.institucion_id = institucionSeleccionada.value;
  }

  console.log('📤 [FERIADOS] Datos a enviar:', payload);

  try {
    if (editMode.value) {
      await api.put(`/feriados/${selectedId.value}`, payload);
      alert.toastSuccess("Feriado actualizado");
    } else {
      await api.post("/feriados", payload);
      alert.toastSuccess("Feriado agregado");
    }

    modalOpen.value = false;
    await loadFeriados();
  } catch (err) {
    console.error("Error guardando feriado:", err);
    const errorMsg = err.response?.data?.message || "No se pudo guardar el feriado";
    alert.error("Error", errorMsg);
  }
};

/* === Eliminar feriado === */
const deleteFeriado = async () => {
  const r = await alert.confirmDelete(
    "¿Eliminar feriado?",
    "Esta acción no se puede deshacer"
  );
  if (!r.isConfirmed) return;

  try {
    await api.delete(`/feriados/${selectedId.value}`);
    alert.toastSuccess("Feriado eliminado");
    modalOpen.value = false;
    await loadFeriados();
  } catch (err) {
    alert.error("Error", "No se pudo eliminar el feriado");
  }
};

/* === Sincronizar feriados nacionales === */
const syncFeriados = async () => {
  const r = await alert.confirm(
    "¿Sincronizar feriados nacionales?",
    "Esto actualizará los registros oficiales de feriados nacionales."
  );
  if (!r.isConfirmed) return;

  loading.value = true;
  try {
    await api.post("/feriados/actualizar-automatico");
    alert.toastSuccess("Feriados nacionales sincronizados");
    await loadFeriados();
  } catch (err) {
    alert.error("Error", "No se pudo sincronizar los feriados");
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  modalOpen.value = false;
};

onMounted(loadInstituciones);
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Nacional rojo */
.feriado-nacional > div {
  background-color: rgba(220, 38, 38, 0.22) !important;
  color: #b91c1c !important;
  border-radius: 50% !important;
  font-weight: 700 !important;
}

/* Institucional verde */
.feriado-institucional > div {
  background-color: rgba(16, 185, 129, 0.25) !important;
  color: #047857 !important;
  border-radius: 50% !important;
  font-weight: 700 !important;
}

.dark .feriado-nacional > div {
  background-color: rgba(220, 38, 38, 0.45) !important;
  color: #fecaca !important;
}

.dark .feriado-institucional > div {
  background-color: rgba(16, 185, 129, 0.35) !important;
  color: #6ee7b7 !important;
}
</style>
