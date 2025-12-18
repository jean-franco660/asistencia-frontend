<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex items-center justify-between bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-3">
        <div
          class="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-800/30 dark:text-emerald-300 rounded-lg"
        >
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div>
          <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Gestión de Feriados
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Feriados nacionales e institucionales
          </p>
        </div>
      </div>

      <!-- Botón sincronizar nacionales (solo admin) -->
      <button
        v-if="isAdmin"
        @click="syncFeriados"
        :disabled="loading"
        class="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow flex items-center gap-2 disabled:opacity-60"
      >
        <i v-if="loading" class="fas fa-sync-alt animate-spin"></i>
        <i v-else class="fas fa-cloud-download-alt"></i>
        {{ loading ? "Actualizando..." : "Sincronizar Nacionales" }}
      </button>
    </div>

    <!-- Selector institución (admin/director) -->
    <div
      v-if="(isAdmin || isSupervisor) && instituciones.length"
      class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
        Seleccionar institución
      </label>

      <select
        v-model="institucionSeleccionada"
        @change="loadFeriados"
        class="w-full border p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
      >
        <option v-for="inst in instituciones" :key="inst.id" :value="inst.id">
          {{ inst.nombre }}
        </option>
      </select>
    </div>

    <!-- Calendario -->
    <div
      class="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <VCalendar
        expanded
        title-position="center"
        :is-dark="isDarkTheme"
        :attributes="attributes"
        @dayclick="handleDayClick"
        @page-change="handlePageChange"
        class="rounded-lg"
      />
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
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
            >
              Fecha
            </label>
            <input
              type="date"
              v-model="form.fecha"
              class="w-full border p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
              disabled
            />
          </div>

          <!-- Descripción -->
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
            >
              Descripción
            </label>
            <input
              type="text"
              v-model="form.descripcion"
              placeholder="Ej: Día del Maestro"
              class="w-full border p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
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
const modalOpen = ref(false);
const editMode = ref(false);
const selectedId = ref(null);

const tipoActual = ref(null); // "nacional" | "institucional"

const loading = ref(false);
const currentYear = ref(new Date().getFullYear());

const form = ref({
  fecha: "",
  descripcion: "",
  activo: true,
});

/* === HELPERS === */
const normalize = (d) => {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt.toISOString().split("T")[0];
};

const isAdmin = computed(() => auth.user?.rol === "administrador" || auth.user?.rol === "super_admin");
const isSupervisor = computed(() => auth.user?.rol === "supervisor");
const isDarkTheme = computed(() => theme.isDark);

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

    attributes.value = data.map((f) => {
      const fecha = new Date(currentYear.value, f.mes - 1, f.dia);

      return {
        key: `feriado-${f.id}`,
        dates: fecha,
        highlight: f.tipo === "nacional" ? "red" : "green",
        popover: { label: `${f.descripcion} (${f.tipo})` },
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
