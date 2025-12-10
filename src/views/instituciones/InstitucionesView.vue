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
            Gestión de Instituciones
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            Administra las instituciones educativas de tu red
          </p>
        </div>
        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg"
        >
          <Building2 :size="32" class="text-white" />
        </div>
      </div>

      <!-- Card Principal -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Header de búsqueda -->
        <div
          class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 flex-1">
              <Search :size="20" class="text-gray-400" />
              <InputField
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por nombre..."
                @input="handleSearch"
                class="!border-0 !bg-transparent !focus:ring-0"
              />
            </div>
            <ButtonComponent
              variant="primary"
              @click="openCreateModal"
              class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus :size="20" />
              Nueva Institución
            </ButtonComponent>
          </div>
        </div>

        <!-- Tabla Premium -->
        <div v-if="loading" class="p-12 text-center">
          <Loader2 :size="48" class="inline-block animate-spin text-blue-600 mb-4" />
          <p class="text-gray-500 dark:text-gray-400">Cargando instituciones...</p>
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
                  Institución
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Dirección
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Coordenadas
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Radio
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
                v-for="institucion in instituciones"
                :key="institucion.id"
                class="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <!-- Logo o icono por defecto -->
                    <div
                      v-if="institucion.logo"
                      class="w-12 h-12 rounded-lg overflow-hidden shadow-md flex-shrink-0"
                    >
                      <img
                        :src="getLogoUrl(institucion.logo)"
                        :alt="institucion.nombre"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      v-else
                      class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md flex-shrink-0"
                    >
                      <Building2 :size="24" class="text-white" />
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800 dark:text-gray-200">
                        {{ institucion.nombre }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin :size="16" class="text-gray-400 flex-shrink-0" />
                    <span class="text-sm">{{
                      institucion.direccion || "Sin dirección"
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1 items-center">
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      Lat: {{ institucion.latitud || "-" }}
                    </span>
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    >
                      Lng: {{ institucion.longitud || "-" }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    {{ institucion.radio }} m
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-3">
                    <button
                      @click="openEditModal(institucion)"
                      class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all hover:scale-110"
                      title="Editar"
                    >
                      <Edit2 :size="20" />
                    </button>
                    <button
                      @click="confirmDelete(institucion)"
                      class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all hover:scale-110"
                      title="Eliminar"
                    >
                      <Trash2 :size="20" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!instituciones.length">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div
                      class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <Building2 :size="32" class="text-gray-400" />
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium">
                      No se encontraron instituciones
                    </p>
                    <p class="text-gray-400 dark:text-gray-500 text-sm">
                      Comienza creando una nueva institución
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Premium -->
      <ModalComponent
        v-model="showModal"
        :title="modalMode === 'create' ? 'Nueva Institución' : 'Editar Institución'"
      >
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <!-- Header Modal -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Building2 :size="24" class="text-white" />
              </div>
              <h3 class="text-xl font-bold text-white">
                {{ modalMode === "create" ? "Nueva Institución" : "Editar Institución" }}
              </h3>
            </div>
          </div>

          <!-- Contenido Modal -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
            <AlertMessage
              v-if="error"
              :show="!!error"
              type="error"
              :message="error"
              @close="error = ''"
            />

            <!-- Logo Upload -->
            <div class="md:col-span-2">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <div class="flex items-center gap-2">
                  <Building2 :size="18" class="text-blue-600" />
                  Logo de la Institución
                </div>
              </label>

              <div class="flex items-start gap-4">
                <!-- Preview del logo -->
                <div class="flex-shrink-0">
                  <div
                    v-if="logoPreview || form.logo"
                    class="w-24 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-600"
                  >
                    <img
                      :src="logoPreview || getLogoUrl(form.logo)"
                      alt="Logo preview"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                  >
                    <Building2 :size="32" class="text-white" />
                  </div>
                </div>

                <!-- Input de archivo -->
                <div class="flex-1">
                  <input
                    ref="logoInput"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                    @change="handleLogoChange"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.logoInput.click()"
                    class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <Upload :size="20" />
                      <span>{{
                        form.logo || logoPreview ? "Cambiar logo" : "Subir logo"
                      }}</span>
                    </div>
                  </button>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Formatos: JPG, PNG, GIF, SVG. Máx: 2MB
                  </p>

                  <!-- Botón para eliminar logo -->
                  <button
                    v-if="form.logo || logoPreview"
                    type="button"
                    @click="removeLogo"
                    class="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    Eliminar logo
                  </button>
                </div>
              </div>
            </div>

            <!-- Grid 2 columnas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nombre (full width) -->
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <Building2 :size="18" class="text-blue-600" />
                    Nombre
                  </div>
                </label>
                <InputField
                  v-model="form.nombre"
                  type="text"
                  placeholder="Ej: Instituto Técnico Central"
                  :required="true"
                  :error="errors.nombre"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Dirección (full width) -->
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <MapPin :size="18" class="text-blue-600" />
                    Dirección
                  </div>
                </label>
                <InputField
                  v-model="form.direccion"
                  type="text"
                  placeholder="Ej: Calle Principal 123"
                  :error="errors.direccion"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Latitud -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <Compass :size="18" class="text-blue-600" />
                    Latitud
                  </div>
                </label>
                <InputField
                  v-model="form.latitud"
                  type="number"
                  step="0.0000001"
                  placeholder="-12.123456"
                  :error="errors.latitud"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Longitud -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <Compass :size="18" class="text-purple-600 transform rotate-90" />
                    Longitud
                  </div>
                </label>
                <InputField
                  v-model="form.longitud"
                  type="number"
                  step="0.0000001"
                  placeholder="-76.123456"
                  :error="errors.longitud"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Radio (full width) -->
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <CircleDot :size="18" class="text-orange-600" />
                    Radio de cobertura (metros)
                  </div>
                </label>
                <div class="flex items-center gap-3">
                  <InputField
                    v-model="form.radio"
                    type="number"
                    min="1"
                    placeholder="50"
                    :error="errors.radio"
                    class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl flex-1"
                  />
                  <div class="text-right">
                    <div class="text-2xl font-bold text-orange-600">{{ form.radio }}</div>
                    <div class="text-xs text-gray-500">m</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
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
                class="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <Loader2 v-if="submitting" :size="18" class="animate-spin mr-2" />
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
import { ref, reactive, onMounted } from "vue";
import { institucionesService } from "../../services/api";
import ButtonComponent from "../../components/ui/ButtonComponent.vue";
import InputField from "../../components/ui/InputField.vue";
import ModalComponent from "../../components/ui/ModalComponent.vue";
import AlertMessage from "../../components/ui/AlertMessage.vue";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  MapPin,
  Compass,
  CircleDot,
  Loader2,
  Upload,
} from "lucide-vue-next";
import { useAlert } from "@/utils/sweetalert";

const alert = useAlert();

const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const modalMode = ref("create");
const searchQuery = ref("");
const error = ref("");
const logoInput = ref(null);
const logoPreview = ref(null);
const logoFile = ref(null);

const instituciones = ref([]);

const form = reactive({
  id: null,
  nombre: "",
  direccion: "",
  latitud: null,
  longitud: null,
  radio: 50,
  logo: null,
});

const errors = reactive({
  nombre: "",
  direccion: "",
  latitud: "",
  longitud: "",
  radio: "",
  logo: "",
});

// Obtener URL completa del logo
const getLogoUrl = (logoPath) => {
  if (!logoPath) return null;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${baseUrl}/storage/${logoPath}`;
};

// Manejar cambio de archivo de logo
const handleLogoChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tamaño (2MB)
  if (file.size > 2 * 1024 * 1024) {
    errors.logo = "El archivo no debe superar 2MB";
    alert.error("Error", "El archivo no debe superar 2MB");
    return;
  }

  // Validar tipo
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/svg+xml",
  ];
  if (!validTypes.includes(file.type)) {
    errors.logo = "Formato no válido";
    alert.error("Error", "Formato de imagen no válido");
    return;
  }

  logoFile.value = file;
  errors.logo = "";

  // Crear preview
  const reader = new FileReader();
  reader.onload = (e) => {
    logoPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Eliminar logo
const removeLogo = () => {
  logoFile.value = null;
  logoPreview.value = null;
  form.logo = null;
  if (logoInput.value) {
    logoInput.value.value = "";
  }
};

const resetForm = () => {
  form.id = null;
  form.nombre = "";
  form.direccion = "";
  form.latitud = null;
  form.longitud = null;
  form.radio = 50;
  form.logo = null;
  logoFile.value = null;
  logoPreview.value = null;
  error.value = "";
  Object.keys(errors).forEach((k) => (errors[k] = ""));
};

const openCreateModal = () => {
  resetForm();
  modalMode.value = "create";
  showModal.value = true;
};

const openEditModal = (institucion) => {
  resetForm();
  modalMode.value = "edit";
  Object.assign(form, { ...institucion });
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const validateForm = () => {
  let ok = true;
  Object.keys(errors).forEach((k) => (errors[k] = ""));

  if (!form.nombre) {
    errors.nombre = "El nombre es obligatorio";
    ok = false;
  }
  if (form.radio <= 0) {
    errors.radio = "El radio debe ser mayor a 0";
    ok = false;
  }

  return ok;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  submitting.value = true;

  try {
    // Crear FormData para enviar archivos
    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("direccion", form.direccion || "");
    formData.append("latitud", form.latitud || "");
    formData.append("longitud", form.longitud || "");
    formData.append("radio", form.radio);

    // Agregar logo si existe
    if (logoFile.value) {
      formData.append("logo", logoFile.value);
    }

    if (modalMode.value === "create") {
      await institucionesService.create(formData);
      alert.toastSuccess("Institución registrada");
    } else {
      // Para actualizar, necesitamos simular PUT con POST
      formData.append("_method", "PUT");
      await institucionesService.update(form.id, formData);
      alert.toastSuccess("Institución actualizada");
    }

    closeModal();
    await loadInstituciones();
  } catch (err) {
    error.value = err.response?.data?.message || "No se pudo guardar";
    alert.error("Error", error.value);
  }

  submitting.value = false;
};

const confirmDelete = async (institucion) => {
  const r = await alert.confirmDelete(
    `Eliminar "${institucion.nombre}"`,
    "Esta acción no se puede deshacer"
  );

  if (!r.isConfirmed) return;

  try {
    await institucionesService.delete(institucion.id);
    await loadInstituciones();
    alert.toastSuccess("Institución eliminada");
  } catch {
    alert.error("Error", "No se pudo eliminar");
  }
};

const handleSearch = () => loadInstituciones();

const loadInstituciones = async () => {
  loading.value = true;
  try {
    const r = await institucionesService.getAll({ search: searchQuery.value || "" });
    instituciones.value = r.data?.data || [];
  } catch {
    instituciones.value = [];
    alert.error("Error", "No se pudieron cargar las instituciones");
  }
  loading.value = false;
};

onMounted(loadInstituciones);
</script>
