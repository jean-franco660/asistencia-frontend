<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
      Registro de Asistencias
    </h1>

    <CardComponent>
      <!-- Filtros -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <InputField v-model="filters.fecha_inicio" type="date" label="Fecha inicio" />
        <InputField v-model="filters.fecha_fin" type="date" label="Fecha fin" />

        <div>
          <label class="label">Institución</label>
          <select v-model="filters.institucion_id" class="input-field">
            <option value="">Todas</option>
            <option v-for="i in instituciones" :key="i.id" :value="i.id">
              {{ i.nombre }}
            </option>
          </select>
        </div>

        <div>
          <label class="label">Tipo</label>
          <select v-model="filters.tipo" class="input-field">
            <option value="">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>
      </div>

      <div class="flex gap-3 mb-4">
        <ButtonComponent variant="primary" @click="applyFilters">
          Aplicar
        </ButtonComponent>
        <ButtonComponent variant="secondary" @click="clearFilters">
          Limpiar
        </ButtonComponent>
        <ButtonComponent variant="success" @click="exportToExcel" class="ml-auto">
          📊 Exportar Excel
        </ButtonComponent>
      </div>

      <!-- Resumen -->
      <div v-if="!loading && asistencias.length > 0" class="grid grid-cols-4 gap-4 mb-4">
        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div class="text-sm text-green-600 dark:text-green-400">A Tiempo</div>
          <div class="text-2xl font-bold text-green-700 dark:text-green-300">
            {{ resumen.a_tiempo }}
          </div>
        </div>
        <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div class="text-sm text-orange-600 dark:text-orange-400">Tarde</div>
          <div class="text-2xl font-bold text-orange-700 dark:text-orange-300">
            {{ resumen.tarde }}
          </div>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div class="text-sm text-red-600 dark:text-red-400">Faltas</div>
          <div class="text-2xl font-bold text-red-700 dark:text-red-300">
            {{ resumen.faltas }}
          </div>
        </div>
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div class="text-sm text-blue-600 dark:text-blue-400">Total</div>
          <div class="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {{ asistencias.length }}
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <LoadingSpinner v-if="loading" text="Cargando asistencias..." />

      <div v-else-if="asistencias.length === 0" class="text-center py-8 text-gray-500">
        No se encontraron registros de asistencia
      </div>

      <TableComponent v-else :columns="columns" :data="asistencias">
        <template #cell-docente="{ row }">
          <div>
            <div class="font-medium">{{ row.usuario?.nombre || "-" }}</div>
            <div class="text-sm text-gray-500">{{ row.usuario?.codigo || "" }}</div>
          </div>
        </template>

        <template #cell-institucion="{ row }">
          {{ row.institucion?.nombre || "-" }}
        </template>

        <template #cell-fecha="{ row }">
          <div v-if="row.fecha_hora">
            <div>{{ formatDate(row.fecha_hora) }}</div>
            <small class="text-gray-500">{{ formatTime(row.fecha_hora) }}</small>
          </div>
          <span v-else class="text-gray-400">Sin fecha</span>
        </template>

        <template #cell-tipo="{ row }">
          <span
            class="px-2 py-1 text-xs rounded-full"
            :class="
              row.tipo === 'entrada'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            "
          >
            {{ row.tipo === "entrada" ? "🟢 Entrada" : "🔴 Salida" }}
          </span>
        </template>

        <template #cell-estado="{ row }">
          <span :class="getEstadoClass(row)">
            {{ estadoLabel(row) }}
          </span>
        </template>

        <template #cell-ubicacion="{ row }">
          <div class="text-sm">
            <div
              :class="
                row.dentro_rango
                  ? 'text-green-600 font-medium'
                  : 'text-red-600 font-medium'
              "
            >
              {{ row.dentro_rango ? "✓ En rango" : "✗ Fuera de rango" }}
            </div>
            <div class="text-xs text-gray-500">
              {{ formatCoordinate(row.latitud) }}, {{ formatCoordinate(row.longitud) }}
            </div>
          </div>
        </template>

        <template #cell-foto="{ row }">
          <button
            v-if="row.foto"
            @click="openPhoto(row)"
            class="w-12 h-12 rounded overflow-hidden border hover:border-blue-500 transition"
          >
            <img
              :src="photoUrl(row.foto)"
              class="w-full h-full object-cover"
              alt="Foto de asistencia"
              @error="handleImageError"
            />
          </button>
          <span v-else class="text-gray-400">—</span>
        </template>
      </TableComponent>

      <!-- Paginación (si la API la soporta) -->
      <div v-if="pagination.total > pagination.per_page" class="mt-4 flex justify-center">
        <nav class="flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1 rounded"
            :class="
              page === pagination.current_page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            "
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </CardComponent>

    <!-- Modal Foto -->
    <PhotoModal :open="showPhoto" :asistencia="selected" @close="closePhoto" />
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { asistenciasService, institucionesService } from "@/services/api";
import CardComponent from "@/components/ui/UiCard.vue";
import InputField from "@/components/ui/InputField.vue";
import ButtonComponent from "@/components/ui/ButtonComponent.vue";
import TableComponent from "@/components/ui/TableComponent.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import PhotoModal from "@/components/ui/PhotoModal.vue";

const asistencias = ref([]);
const instituciones = ref([]);
const loading = ref(false);
const showPhoto = ref(false);
const selected = ref(null);

const filters = reactive({
  fecha_inicio: "",
  fecha_fin: "",
  institucion_id: null, // ✅ Cambiar de "" a null
  tipo: null, // ✅ Cambiar de "" a null
});

const pagination = reactive({
  current_page: 1,
  per_page: 20,
  total: 0,
});

const columns = [
  { key: "docente", label: "DOCENTE" },
  { key: "institucion", label: "INSTITUCIÓN" },
  { key: "fecha", label: "FECHA/HORA" },
  { key: "tipo", label: "TIPO" },
  { key: "estado", label: "ESTADO" },
  { key: "ubicacion", label: "UBICACIÓN" },
  { key: "foto", label: "FOTO" },
];

const formatCoordinate = (coord) => {
  if (!coord) return "0.000000";

  // Convertir a número si es string
  const num = typeof coord === "string" ? parseFloat(coord) : coord;

  // Validar que sea un número válido
  if (isNaN(num)) return "0.000000";

  return num.toFixed(6);
};

// Resumen calculado
const resumen = computed(() => {
  const a_tiempo = asistencias.value.filter((a) => a.estado === "a_tiempo").length;
  const tarde = asistencias.value.filter((a) => a.estado === "tarde").length;
  const faltas = asistencias.value.filter((a) => a.falta === true).length;
  return { a_tiempo, tarde, faltas };
});

const totalPages = computed(() => Math.ceil(pagination.total / pagination.per_page));

const photoUrl = (path) => {
  if (!path) return null;

  // ✅ Validar que VITE_API_BASE_URL exista
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiUrl) {
    console.error("VITE_API_BASE_URL no está definida en .env");
    return null;
  }

  const baseUrl = apiUrl.replace("/api/v1/web", "");
  return `${baseUrl}/storage/${path}`;
};

const handleImageError = (event) => {
  console.error("Error cargando imagen:", event.target.src);
  event.target.style.display = "none";
};

const openPhoto = (row) => {
  selected.value = row;
  showPhoto.value = true;
};

const closePhoto = () => {
  showPhoto.value = false;
  selected.value = null;
};

const estadoLabel = (row) => {
  if (row.falta === true) return "❌ Ausente";
  if (row.estado === "a_tiempo") return "✅ A Tiempo";
  if (row.estado === "tarde") return "⏰ Tarde";
  if (row.estado === "salida_antes") return "⚠️ Salida Anticipada";
  return "—";
};

const getEstadoClass = (row) => {
  if (row.falta === true) return "text-red-600 font-medium";
  if (row.estado === "a_tiempo") return "text-green-600 font-medium";
  if (row.estado === "tarde") return "text-orange-600 font-medium";
  if (row.estado === "salida_antes") return "text-yellow-600 font-medium";
  return "text-gray-500";
};

const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Error en fecha";
  }
};

const formatTime = (dateString) => {
  if (!dateString) return "--:--";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "--:--";
    }

    return date.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    console.error("Error al formatear hora:", error);
    return "--:--";
  }
};

const load = async (page = 1) => {
  loading.value = true;

  try {
    const params = {
      fecha_inicio: filters.fecha_inicio || undefined,
      fecha_fin: filters.fecha_fin || undefined,
      institucion_id: filters.institucion_id || undefined,
      tipo: filters.tipo || undefined,
      page,
      per_page: pagination.per_page,
    };

    const res = await asistenciasService.getAll(params);

    // ✅ La API devuelve { data: [...], total: X, success: true }
    if (res.data && res.data.data) {
      asistencias.value = res.data.data;
      pagination.total = res.data.total || res.data.data.length;
    } else {
      console.warn("⚠️ Estructura inesperada:", res.data);
      asistencias.value = [];
    }
  } catch (error) {
    console.error("❌ Error cargando asistencias:", error);
    console.error("Response:", error.response?.data);
    asistencias.value = [];
  }

  loading.value = false;
};

const loadInstituciones = async () => {
  try {
    const res = await institucionesService.getAll();
    instituciones.value = Array.isArray(res.data) ? res.data : res.data?.data || [];
  } catch (error) {
    console.error("❌ Error cargando instituciones:", error);
    instituciones.value = [];
  }
};

const applyFilters = () => {
  load(1);
};

const clearFilters = () => {
  const d = new Date();
  filters.fecha_inicio = new Date(d.getFullYear(), d.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  filters.fecha_fin = d.toISOString().slice(0, 10);
  filters.institucion_id = null;
  filters.tipo = null;
  load(1);
};

const goToPage = (page) => {
  if (page !== pagination.current_page) {
    load(page);
  }
};

const exportToExcel = async () => {
  if (asistencias.value.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  try {
    loading.value = true;

    // Preparar parámetros de filtros
    const params = {
      fecha_inicio: filters.fecha_inicio || undefined,
      fecha_fin: filters.fecha_fin || undefined,
      institucion_id: filters.institucion_id || undefined,
      tipo: filters.tipo || undefined,
    };

    // Llamar al endpoint del backend
    const response = await asistenciasService.exportar(params);

    // Crear blob y descargar
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const fecha_inicio = filters.fecha_inicio || "inicio";
    const fecha_fin = filters.fecha_fin || "fin";
    link.download = `Reporte_Asistencias_${fecha_inicio}_a_${fecha_fin}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("✅ Archivo exportado correctamente");
  } catch (error) {
    console.error("❌ Error al exportar:", error);
    alert("Error al exportar el archivo. Por favor intenta nuevamente.");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const d = new Date();
  filters.fecha_inicio = new Date(d.getFullYear(), d.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  filters.fecha_fin = d.toISOString().slice(0, 10);

  load();
  loadInstituciones();
});
</script>
