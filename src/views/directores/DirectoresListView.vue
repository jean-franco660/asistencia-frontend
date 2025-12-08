<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Gestión de Directores</h1>
        <p class="text-gray-600">Administra los directores registrados</p>
      </div>
      <ButtonComponent variant="primary" @click="openCreateModal"
        >Nuevo Director</ButtonComponent
      >
    </div>

    <CardComponent>
      <div class="mb-4 flex flex-col md:flex-row gap-4">
        <InputField
          v-model="searchQuery"
          type="text"
          placeholder="Buscar..."
          @input="handleSearch"
        />
        <select
          v-model="filterEstado"
          @change="handleSearch"
          class="input-field w-full md:w-64"
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="autorizado">Autorizados</option>
          <option value="rechazado">Rechazados</option>
        </select>
      </div>

      <LoadingSpinner v-if="loading" text="Cargando..." />

      <TableComponent v-else :columns="columns" :data="paginatedDirectores">
        <template #cell-nombre="{ row }">
          <div class="font-medium">{{ row.nombre }}</div>
          <div class="text-sm text-gray-500">{{ row.email }}</div>
        </template>

        <template #cell-institucion="{ row }">
          <span>{{ row.institucion_nombre || "Sin asignar" }}</span>
        </template>

        <template #cell-estado="{ row }">
          <span
            :class="estadoClass(row.estado)"
            class="px-2 py-1 rounded text-xs capitalize"
          >
            {{ row.estado }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex gap-2">
            <button
              v-if="row.estado === 'pendiente'"
              @click="autorizarDirector(row)"
              class="text-green-600 hover:text-green-700"
            >
              <CheckCircleIcon class="w-5 h-5" />
            </button>
            <button
              v-if="row.estado === 'pendiente'"
              @click="rechazarDirector(row)"
              class="text-red-500 hover:text-red-600"
            >
              <XCircleIcon class="w-5 h-5" />
            </button>
            <button @click="openEditModal(row)" class="text-blue-600 hover:text-blue-700">
              <PencilSquareIcon class="w-5 h-5" />
            </button>
            <button @click="confirmDelete(row)" class="text-red-600 hover:text-red-700">
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </template>
      </TableComponent>
    </CardComponent>

    <!-- MODAL -->
    <ModalComponent
      v-model="showModal"
      :title="modalMode === 'create' ? 'Nuevo Director' : 'Editar Director'"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <InputField v-model="form.nombre" label="Nombre completo" required />
        <InputField
          v-model="form.email"
          label="Correo electrónico"
          type="email"
          required
        />

        <div class="space-y-2">
          <div class="relative">
            <InputField
              v-model="form.password"
              :label="
                modalMode === 'create' ? 'Contraseña' : 'Nueva contraseña (opcional)'
              "
              :type="showPass ? 'text' : 'password'"
              :placeholder="
                modalMode === 'create'
                  ? 'Mínimo 8 caracteres'
                  : 'Dejar vacío si no cambia'
              "
              :required="modalMode === 'create'"
            />
            <button
              type="button"
              @click="showPass = !showPass"
              class="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              <EyeIcon v-if="!showPass" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div v-if="modalMode === 'create' || form.password" class="relative">
            <InputField
              v-model="form.password_confirmation"
              label="Confirmar contraseña"
              :type="showPassConfirm ? 'text' : 'password'"
              required
            />
            <button
              type="button"
              @click="showPassConfirm = !showPassConfirm"
              class="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              <EyeIcon v-if="!showPassConfirm" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <label class="block text-sm font-medium mb-1">Institución</label>
        <select v-model="form.institucion_id" class="input-field w-full" required>
          <option value="">Seleccione</option>
          <option v-for="i in instituciones" :key="i.id" :value="i.id">
            {{ i.nombre }}
          </option>
        </select>

        <div v-if="modalMode === 'edit'">
          <label class="block text-sm font-medium mb-1">Estado</label>
          <select v-model="form.estado" class="input-field w-full">
            <option value="pendiente">Pendiente</option>
            <option value="autorizado">Autorizado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <ButtonComponent variant="secondary" @click="closeModal" type="button"
            >Cancelar</ButtonComponent
          >
          <ButtonComponent variant="primary" type="submit" :loading="submitting"
            >Guardar</ButtonComponent
          >
        </div>
      </form>
    </ModalComponent>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { usuariosWebService, institucionesService } from "@/services/api";
import ButtonComponent from "@/components/ui/ButtonComponent.vue";
import CardComponent from "@/components/ui/UiCard.vue";
import InputField from "@/components/ui/InputField.vue";
import TableComponent from "@/components/ui/TableComponent.vue";
import ModalComponent from "@/components/ui/ModalComponent.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

// SweetAlert2 Premium
import { useAlert } from "@/utils/sweetalert";
const alert = useAlert();

import {
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/solid";

const showPass = ref(false);
const showPassConfirm = ref(false);
const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const modalMode = ref("create");
const searchQuery = ref("");
const filterEstado = ref("");
const directores = ref([]);
const instituciones = ref([]);

const form = reactive({
  id: null,
  nombre: "",
  email: "",
  password: "",
  password_confirmation: "",
  institucion_id: "",
  estado: "pendiente",
});

const columns = [
  { key: "nombre", label: "Director" },
  { key: "institucion", label: "Institución" },
  { key: "estado", label: "Estado" },
];

const flattenDirector = (d) => ({
  ...d,
  institucion_id: d.instituciones?.[0]?.id || null,
  institucion_nombre: d.instituciones?.[0]?.nombre || null,
});

const loadDirectores = async () => {
  loading.value = true;
  const params = {
    rol: "director",
    search: searchQuery.value.trim() || undefined,
    estado: filterEstado.value || undefined,
  };
  const r = await usuariosWebService.getAll(params);
  directores.value = r.data?.data?.map(flattenDirector) || [];
  loading.value = false;
};

const loadInstituciones = async () => {
  const r = await institucionesService.getAll();
  instituciones.value = r.data?.data || [];
};

const resetForm = () =>
  Object.assign(form, {
    id: null,
    nombre: "",
    email: "",
    password: "",
    password_confirmation: "",
    institucion_id: "",
    estado: "pendiente",
  });

const openCreateModal = () => {
  resetForm();
  modalMode.value = "create";
  showModal.value = true;
};
const openEditModal = (d) => {
  Object.assign(form, {
    id: d.id,
    nombre: d.nombre,
    email: d.email,
    institucion_id: d.institucion_id,
    estado: d.estado,
    password: "",
    password_confirmation: "",
  });
  modalMode.value = "edit";
  showModal.value = true;
};
const closeModal = () => (showModal.value = false);

const validateForm = () => {
  if (!form.nombre || !form.email || !form.institucion_id)
    return alert.error("Error", "Complete los campos obligatorios");
  if (modalMode.value === "create") {
    if (!form.password || form.password.length < 8)
      return alert.error("Error", "Contraseña mínima 8 caracteres");
    if (form.password !== form.password_confirmation)
      return alert.error("Error", "Contraseñas no coinciden");
  }
  if (modalMode.value === "edit" && form.password) {
    if (form.password.length < 8)
      return alert.error("Error", "Contraseña mínima 8 caracteres");
    if (form.password !== form.password_confirmation)
      return alert.error("Error", "Contraseñas no coinciden");
  }
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  submitting.value = true;
  try {
    const payload = {
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      rol: "director",
      institucion_id: form.institucion_id,
      estado: form.estado,
    };

    if (modalMode.value === "create") {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
      await usuariosWebService.create(payload);
    } else {
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      await usuariosWebService.update(form.id, payload);
    }

    await loadDirectores();
    closeModal();

    alert.toastSuccess(
      modalMode.value === "create" ? "Director creado" : "Director actualizado"
    );
  } catch (err) {
    alert.error("Error", err.response?.data?.message || "Error al guardar");
  } finally {
    submitting.value = false;
  }
};

const autorizarDirector = async (d) => {
  const r = await alert.confirm("¿Autorizar director?", `Director: ${d.nombre}`);
  if (!r.isConfirmed) return;

  await usuariosWebService.autorizar(d.id);
  await loadDirectores();

  alert.toastSuccess("Director autorizado");
};

const rechazarDirector = async (d) => {
  const r = await alert.confirm("¿Rechazar director?", `Director: ${d.nombre}`);
  if (!r.isConfirmed) return;

  await usuariosWebService.rechazar(d.id);
  await loadDirectores();

  alert.toastSuccess("Director rechazado");
};

const confirmDelete = async (d) => {
  const r = await alert.confirmDelete(
    "¿Eliminar director?",
    `Se eliminará a ${d.nombre}`
  );
  if (!r.isConfirmed) return;

  await usuariosWebService.delete(d.id);
  await loadDirectores();

  alert.toastSuccess("Director eliminado");
};

const estadoClass = (e) => ({
  "bg-yellow-200 text-yellow-800": e === "pendiente",
  "bg-green-200 text-green-800": e === "autorizado",
  "bg-red-200 text-red-800": e === "rechazado",
});

const currentPage = ref(1);
const itemsPerPage = 5;
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const paginatedDirectores = computed(() =>
  directores.value.slice(startIndex.value, startIndex.value + itemsPerPage)
);

const handleSearch = () => loadDirectores();

onMounted(() => {
  loadInstituciones();
  loadDirectores();
});
</script>

<style scoped>
.input-field {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
</style>
