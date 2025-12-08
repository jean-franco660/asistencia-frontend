<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
  >
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header Premium -->
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          >
            Gestión de Docentes
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            Administra y organiza los docentes del sistema
          </p>
        </div>
        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg"
        >
          <Users :size="32" class="text-white" />
        </div>
      </div>

      <!-- Card Principal -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Header con filtros -->
        <div
          class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600"
        >
          <div class="flex flex-col gap-4">
            <!-- Barra de búsqueda -->
            <div class="flex items-center gap-3">
              <Search :size="20" class="text-gray-400" />
              <InputField
                v-model="searchQuery"
                type="text"
                placeholder="Buscar docente..."
                @input="debounceSearch"
                class="!border-0 !bg-transparent !focus:ring-0 flex-1"
              />
            </div>

            <!-- Filtros y botones -->
            <div class="flex flex-col md:flex-row gap-3 items-center justify-between">
              <div class="flex gap-3 flex-1">
                <!-- Filtro Estado -->
                <select
                  v-model="filterStatus"
                  @change="loadUsuarios"
                  class="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Todos los estados</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>

                <!-- Filtro Institución -->
                <select
                  v-model="filterInstitucion"
                  @change="loadUsuarios"
                  class="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Todas las instituciones</option>
                  <option v-for="i in instituciones" :key="i.id" :value="i.id">
                    {{ i.nombre }}
                  </option>
                </select>
              </div>

              <!-- Botones de acción -->
              <div class="flex gap-3">
                <ButtonComponent
                  variant="secondary"
                  @click="openImportModal"
                  class="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Upload :size="20" />
                  Importar Excel
                </ButtonComponent>
                <ButtonComponent
                  variant="primary"
                  @click="openCreateModal"
                  class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  <Plus :size="20" />
                  Nuevo Docente
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla Premium -->
        <div v-if="loading" class="p-12 text-center">
          <Loader2 :size="48" class="inline-block animate-spin text-blue-600 mb-4" />
          <p class="text-gray-500 dark:text-gray-400">Cargando docentes...</p>
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
                  Docente
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Código
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Instituciones
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
                v-for="docente in sortedUsuarios"
                :key="docente.id"
                class="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md text-white font-semibold"
                    >
                      {{ getInitials(docente.nombre) }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800 dark:text-gray-200">
                        {{ docente.nombre }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {{ docente.codigo }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div
                    v-if="docente.instituciones?.length"
                    class="flex flex-wrap gap-1 items-center"
                  >
                    <!-- Mostrar las primeras 2 instituciones -->
                    <span
                      v-for="inst in docente.instituciones.slice(0, 2)"
                      :key="inst.id"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {{ inst.nombre }}
                    </span>

                    <!-- Badge +N con tooltip premium -->
                    <span
                      v-if="docente.instituciones.length > 2"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 cursor-pointer hover:scale-105 transition-transform"
                      :title="docente.instituciones.map((i) => i.nombre).join('\n')"
                    >
                      +{{ docente.instituciones.length - 2 }}
                    </span>
                  </div>

                  <!-- Si no tiene instituciones -->
                  <span v-else class="text-gray-400 italic text-sm">
                    Sin instituciones
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="
                      docente.activo
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    "
                    class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full"
                  >
                    <span
                      v-if="docente.activo"
                      class="w-2 h-2 bg-green-500 rounded-full mr-2"
                    ></span>
                    <span v-else class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {{ docente.activo ? "Activo" : "Inactivo" }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-3">
                    <button
                      @click="openEditModal(docente)"
                      class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all hover:scale-110"
                      title="Editar"
                    >
                      <Edit2 :size="20" />
                    </button>
                    <button
                      @click="confirmDelete(docente)"
                      class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all hover:scale-110"
                      title="Eliminar"
                    >
                      <Trash2 :size="20" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!usuarios.length">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div
                      class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <Users :size="32" class="text-gray-400" />
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium">
                      No se encontraron docentes
                    </p>
                    <p class="text-gray-400 dark:text-gray-500 text-sm">
                      Crea uno nuevo o importa desde un archivo
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Importar Premium -->
      <ModalComponent v-model="showImportModal" title="Importar Docentes">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <!-- Header Modal -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Upload :size="24" class="text-white" />
              </div>
              <h3 class="text-xl font-bold text-white">Importar Docentes</h3>
            </div>
          </div>

          <!-- Contenido Modal -->
          <div class="p-6 space-y-5">
            <div
              class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4"
            >
              <p class="text-sm text-blue-800 dark:text-blue-200">
                📝 Formato aceptado: .xlsx, .xls, .csv
              </p>
            </div>

            <div
              @click="$refs.fileInput.click()"
              @dragover.prevent="dragActive = true"
              @dragleave.prevent="dragActive = false"
              @drop.prevent="handleDropFile"
              :class="dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''"
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Upload :size="48" class="mx-auto text-gray-400 mb-3" />
              <p class="text-gray-700 dark:text-gray-300 font-semibold">
                Haz clic o arrastra un archivo
              </p>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Soportados: Excel, CSV
              </p>
              <p
                v-if="selectedFile"
                class="font-bold text-green-600 dark:text-green-400 mt-3"
              >
                ✓ {{ selectedFile.name }}
              </p>
            </div>

            <input
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              accept=".xlsx,.xls,.csv"
              class="hidden"
            />

            <!-- Footer Modal -->
            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <ButtonComponent
                variant="secondary"
                @click="closeImportModal"
                class="px-6 py-2.5 rounded-xl font-semibold"
              >
                Cancelar
              </ButtonComponent>
              <ButtonComponent
                variant="primary"
                @click="handleImport"
                :disabled="importing || !selectedFile"
                class="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Loader2 v-if="importing" :size="18" class="animate-spin" />
                {{ importing ? "Importando..." : "Importar" }}
              </ButtonComponent>
            </div>
          </div>
        </div>
      </ModalComponent>

      <!-- Modal Form Premium -->
      <ModalComponent
        v-model="showModal"
        :title="modalMode === 'create' ? 'Nuevo Docente' : 'Editar Docente'"
        @close="closeModal"
      >
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <!-- Header Modal -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <UserPlus :size="24" class="text-white" />
              </div>
              <h3 class="text-xl font-bold text-white">
                {{ modalMode === "create" ? "Nuevo Docente" : "Editar Docente" }}
              </h3>
            </div>
          </div>

          <!-- Contenido Modal -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
            <!-- Nombre -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <div class="flex items-center gap-2">
                  <User :size="18" class="text-blue-600" />
                  Nombre Completo
                </div>
              </label>
              <InputField
                v-model="form.nombre"
                type="text"
                placeholder="Ej: Juan Pérez García"
                class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
              />
            </div>

            <!-- Código -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <div class="flex items-center gap-2">
                  <Hash :size="18" class="text-purple-600" />
                  Código
                </div>
              </label>
              <InputField
                v-model="form.codigo"
                type="text"
                placeholder="Ej: DOC001"
                class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
              />
            </div>

            <!-- Contraseña -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <div class="flex items-center gap-2">
                  <Lock :size="18" class="text-red-600" />
                  {{
                    modalMode === "create"
                      ? "Contraseña"
                      : "Contraseña (dejar en blanco para no cambiar)"
                  }}
                </div>
              </label>
              <input
                v-model="form.password"
                type="password"
                :placeholder="modalMode === 'create' ? 'Contraseña' : '(opcional)'"
                class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Instituciones -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                <div class="flex items-center gap-2">
                  <Building2 :size="18" class="text-orange-600" />
                  Asignar Instituciones
                </div>
              </label>
              <div
                class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 max-h-64 overflow-y-auto border-2 border-gray-200 dark:border-gray-600"
              >
                <div
                  v-if="instituciones.length === 0"
                  class="text-center text-gray-500 dark:text-gray-400 py-6"
                >
                  <p class="text-sm">No hay instituciones disponibles</p>
                </div>
                <div v-else class="space-y-2">
                  <label
                    v-for="inst in instituciones"
                    :key="inst.id"
                    class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      :value="inst.id"
                      v-model="form.institucion_ids"
                      class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div class="flex-1">
                      <p class="font-medium text-gray-700 dark:text-gray-300">
                        {{ inst.nombre }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ inst.direccion || "Sin dirección" }}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              <div
                v-if="form.institucion_ids.length > 0"
                class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <p class="text-xs text-blue-800 dark:text-blue-300 font-medium">
                  ✓ {{ form.institucion_ids.length }}
                  {{
                    form.institucion_ids.length === 1 ? "institución" : "instituciones"
                  }}
                  seleccionada{{ form.institucion_ids.length === 1 ? "" : "s" }}
                </p>
              </div>
            </div>

            <!-- Footer Modal -->
            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <ButtonComponent
                variant="secondary"
                @click="closeModal"
                type="button"
                class="px-6 py-2.5 rounded-xl font-semibold"
              >
                Cancelar
              </ButtonComponent>
              <ButtonComponent
                variant="primary"
                type="submit"
                :loading="submitting"
                class="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <Loader2 v-if="submitting" :size="18" class="animate-spin" />
                {{
                  submitting
                    ? "Guardando..."
                    : modalMode === "create"
                    ? "Crear"
                    : "Actualizar"
                }}
              </ButtonComponent>
            </div>
          </form>
        </div>
      </ModalComponent>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { usuariosService, institucionesService } from "@/services/api";
import ButtonComponent from "@/components/ui/ButtonComponent.vue";
import InputField from "@/components/ui/InputField.vue";
import ModalComponent from "@/components/ui/ModalComponent.vue";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  Loader2,
  UserPlus,
  User,
  Hash,
  Lock,
  Building2,
} from "lucide-vue-next";
import { useAlert } from "@/utils/sweetalert";

const alert = useAlert();

/* ------------------------- REFS / STATE ------------------------- */
const loading = ref(false);
const submitting = ref(false);
const importing = ref(false);
const dragActive = ref(false);
const showModal = ref(false);
const showImportModal = ref(false);
const searchQuery = ref("");
const filterStatus = ref("");
const filterInstitucion = ref("");
const selectedFile = ref(null);
const usuarios = ref([]);
const instituciones = ref([]);
const modalMode = ref("create");

/* ---------------------- FORM CORREGIDO ------------------------ */
const form = reactive({
  id: null,
  nombre: "",
  codigo: "",
  password: "",
  institucion_ids: [], // FALTABA !!
});

/* -------------------- COMPUTED: ORDEN / FILTRO -------------------- */
const sortedUsuarios = computed(() => {
  return usuarios.value
    .filter((u) =>
      (u.nombre?.toLowerCase() || "").includes(searchQuery.value.toLowerCase())
    )
    .filter((u) =>
      filterStatus.value ? u.activo == (filterStatus.value === "activo") : true
    )
    .filter((u) =>
      filterInstitucion.value
        ? u.instituciones?.some((i) => i.id == filterInstitucion.value)
        : true
    )
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
});

/* -------------------- DEBOUNCE SIMPLE -------------------- */
const debounceSearch = () => loadUsuarios();

/* -------------------- HELPERS -------------------- */
const getInitials = (n) =>
  n
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

/* -------------------- IMPORT -------------------- */
const handleFileSelect = (e) => {
  selectedFile.value = e.target.files[0];
};

const handleDropFile = (e) => {
  dragActive.value = false;
  selectedFile.value = e.dataTransfer.files[0];
};

const handleImport = async () => {
  if (!selectedFile.value) return;

  const r = await alert.confirm(
    "Importar docentes",
    `Se importarán los datos del archivo:\n\n${selectedFile.value.name}`
  );

  if (!r.isConfirmed) return;

  importing.value = true;

  try {
    const formData = new FormData();
    formData.append("archivo", selectedFile.value);

    const res = await usuariosService.importar(formData);

    alert.toastSuccess(`Se importaron ${res.data.procesados || 0} docentes`);
    loadUsuarios();
    closeImportModal();
  } catch {
    alert.error("Error", "No se pudo importar el archivo");
  }
  importing.value = false;
};

/* -------------------- DELETE -------------------- */
const confirmDelete = async (u) => {
  const r = await alert.confirmDelete(
    `Eliminar docente`,
    `¿Deseas eliminar a "${u.nombre}"? Esta acción no se puede deshacer.`
  );

  if (!r.isConfirmed) return;

  try {
    await usuariosService.delete(u.id);
    alert.toastSuccess("Docente eliminado correctamente");
    loadUsuarios();
  } catch {
    alert.error("Error", "No se pudo eliminar el docente");
  }
};

/* -------------------- CREATE / UPDATE -------------------- */
const handleSubmit = async () => {
  if (!form.nombre || !form.codigo) {
    alert.error("Validación", "El nombre y código son obligatorios");
    return;
  }

  submitting.value = true;

  const payload = {
    nombre: form.nombre,
    codigo: form.codigo,
    password: form.password || undefined,
    institucion_ids: form.institucion_ids,
    activo: true,
  };

  try {
    if (modalMode.value === "create") {
      await usuariosService.create(payload);
      alert.toastSuccess("Docente creado correctamente");
    } else {
      await usuariosService.update(form.id, payload);
      alert.toastSuccess("Docente actualizado correctamente");
    }

    loadUsuarios();
    closeModal();
  } catch (err) {
    alert.error("Error", err.response?.data?.message || "No se pudo guardar");
  }
  submitting.value = false;
};

/* -------------------- MODALES -------------------- */
const openCreateModal = () => {
  Object.assign(form, {
    id: null,
    nombre: "",
    codigo: "",
    password: "",
    institucion_ids: [],
    activo: true,
  });
  modalMode.value = "create";
  showModal.value = true;
};

const openEditModal = (u) => {
  Object.assign(form, {
    id: u.id,
    nombre: u.nombre,
    codigo: u.codigo,
    password: "",
    institucion_ids: u.instituciones?.map((i) => i.id) || [],
    activo: u.activo ?? true,
  });
  modalMode.value = "edit";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const openImportModal = () => {
  selectedFile.value = null;
  showImportModal.value = true;
};

const closeImportModal = () => {
  showImportModal.value = false;
  selectedFile.value = null;
};

/* -------------------- LOAD DATA -------------------- */
const loadUsuarios = async () => {
  loading.value = true;
  try {
    const r = await usuariosService.getAll();
    usuarios.value = r.data?.data || [];
  } catch {
    usuarios.value = [];
    alert.error("Error", "No se pudieron cargar los docentes");
  }
  loading.value = false;
};

onMounted(async () => {
  try {
    const r = await institucionesService.getAll();
    instituciones.value = r.data?.data || [];
  } catch {
    instituciones.value = [];
  }

  await loadUsuarios();
});
</script>
