<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Gestión de Instituciones
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Administra las instituciones educativas
        </p>
      </div>
      <ButtonComponent variant="primary" @click="openCreateModal">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Nueva Institución
      </ButtonComponent>
    </div>

    <!-- Tabla y búsqueda -->
    <CardComponent>
      <div class="mb-4">
        <InputField
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre..."
          @input="handleSearch"
        />
      </div>

      <LoadingSpinner v-if="loading" :text="'Cargando instituciones...'" class="py-12" />

      <TableComponent v-else :columns="columns" :data="instituciones">
        <template #cell-nombre="{ row }">
          {{ row.nombre }}
        </template>
        <template #cell-direccion="{ row }">
          {{ row.direccion || "Sin dirección" }}
        </template>
        <template #cell-latitud="{ row }">
          {{ row.latitud || "-" }}
        </template>
        <template #cell-longitud="{ row }">
          {{ row.longitud || "-" }}
        </template>
        <template #cell-radio="{ row }"> {{ row.radio }} m </template>

        <template #actions="{ row }">
          <div class="flex items-center space-x-2">
            <button
              @click="openEditModal(row)"
              title="Editar"
              class="text-primary-600 hover:text-primary-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              @click="confirmDelete(row)"
              title="Eliminar"
              class="text-red-600 hover:text-red-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </template>

        <template #empty>
          <div class="text-center py-8">
            <p class="mt-4 text-gray-500 dark:text-gray-400">
              No se encontraron instituciones
            </p>
          </div>
        </template>
      </TableComponent>
    </CardComponent>

    <!-- Modal de creación/edición -->
    <ModalComponent
      v-model="showModal"
      :title="modalMode === 'create' ? 'Nueva Institución' : 'Editar Institución'"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <AlertMessage
          v-if="error"
          :show="!!error"
          type="error"
          :message="error"
          @close="error = ''"
        />

        <InputField
          v-model="form.nombre"
          label="Nombre"
          type="text"
          :required="true"
          :error="errors.nombre"
        />
        <InputField
          v-model="form.direccion"
          label="Dirección"
          type="text"
          :error="errors.direccion"
        />
        <InputField
          v-model="form.latitud"
          label="Latitud"
          type="number"
          step="0.0000001"
          :error="errors.latitud"
        />
        <InputField
          v-model="form.longitud"
          label="Longitud"
          type="number"
          step="0.0000001"
          :error="errors.longitud"
        />
        <InputField
          v-model="form.radio"
          label="Radio (metros)"
          type="number"
          min="1"
          :error="errors.radio"
        />

        <div class="flex justify-end space-x-3 pt-4">
          <ButtonComponent variant="secondary" @click="closeModal" type="button"
            >Cancelar</ButtonComponent
          >
          <ButtonComponent variant="primary" type="submit" :loading="submitting">
            {{ submitting ? "Guardando..." : "Guardar" }}
          </ButtonComponent>
        </div>
      </form>
    </ModalComponent>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { institucionesService } from "../../services/api";
import CardComponent from "../../components/ui/UiCard.vue";
import ButtonComponent from "../../components/ui/ButtonComponent.vue";
import InputField from "../../components/ui/InputField.vue";
import TableComponent from "../../components/ui/TableComponent.vue";
import ModalComponent from "../../components/ui/ModalComponent.vue";
import LoadingSpinner from "../../components/ui/LoadingSpinner.vue";

// ✅ importar SweetAlert premium
import { useAlert } from "@/utils/sweetalert";
const alert = useAlert();

const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const modalMode = ref("create");
const searchQuery = ref("");

const instituciones = ref([]);

const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "direccion", label: "Dirección" },
  { key: "latitud", label: "Latitud" },
  { key: "longitud", label: "Longitud" },
  { key: "radio", label: "Radio (m)" },
];

const form = reactive({
  id: null,
  nombre: "",
  direccion: "",
  latitud: null,
  longitud: null,
  radio: 50,
});

const errors = reactive({
  nombre: "",
  direccion: "",
  latitud: "",
  longitud: "",
  radio: "",
});

const resetForm = () => {
  form.id = null;
  form.nombre = "";
  form.direccion = "";
  form.latitud = null;
  form.longitud = null;
  form.radio = 50;
  Object.keys(errors).forEach((k) => (errors[k] = ""));
};

/* ================= Abrir modal Crear ================= */
const openCreateModal = () => {
  resetForm();
  modalMode.value = "create";
  showModal.value = true;
};

/* ================= Abrir modal Editar ================= */
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

/* ================= Validación ================= */
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

/* ================= Guardar ================= */
const handleSubmit = async () => {
  if (!validateForm()) return;

  submitting.value = true;

  try {
    const payload = {
      nombre: form.nombre,
      direccion: form.direccion || null,
      latitud: form.latitud || null,
      longitud: form.longitud || null,
      radio: form.radio,
    };

    if (modalMode.value === "create") {
      await institucionesService.create(payload);
      alert.toastSuccess("Institución registrada");
    } else {
      await institucionesService.update(form.id, payload);
      alert.toastSuccess("Institución actualizada");
    }

    closeModal();
    await loadInstituciones();
  } catch (err) {
    alert.error("Error", err.response?.data?.message || "No se pudo guardar");
  }

  submitting.value = false;
};

/* ================= Eliminar ================= */
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

/* ================= Buscar ================= */
const handleSearch = () => loadInstituciones();

/* ================= Cargar lista ================= */
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
