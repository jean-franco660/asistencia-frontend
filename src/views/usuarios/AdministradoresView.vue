<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Gestión de Administradores
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Administra usuarios administradores del sistema
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
        Nuevo Administrador
      </ButtonComponent>
    </div>

    <!-- Card -->
    <CardComponent>
      <!-- Filtros -->
      <div class="mb-4 flex flex-col md:flex-row gap-4">
        <InputField
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre o correo..."
          @input="handleSearch"
        />
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" text="Cargando administradores..." class="py-12" />

      <!-- Tabla -->
      <TableComponent v-else :columns="columns" :data="paginatedAdmins">
        <template #cell-nombre="{ row }">
          <div class="flex items-center gap-3">
            <div
              class="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center"
            >
              <span class="text-primary-600 dark:text-primary-300 font-semibold text-sm">
                {{ row.nombre.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ row.nombre }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ row.email }}</p>
            </div>
          </div>
        </template>

        <!-- Acciones -->
        <template #actions="{ row }">
          <div class="flex justify-end items-center gap-3 pr-4">
            <button
              @click="openEditModal(row)"
              class="text-blue-600 hover:text-blue-700"
              title="Editar"
            >
              <PencilSquareIcon class="w-5 h-5" />
            </button>
            <button
              @click="confirmDelete(row)"
              class="text-red-600 hover:text-red-700"
              title="Eliminar"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </template>

        <!-- Vacío -->
        <template #empty>
          <div class="text-center py-12 text-gray-400 dark:text-gray-500">
            No se encontraron administradores
          </div>
        </template>
      </TableComponent>

      <!-- Paginación -->
      <div
        v-if="admins.length > 0"
        class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Mostrando <span class="font-semibold">{{ startIndex + 1 }}</span> a
          <span class="font-semibold">{{ Math.min(endIndex, admins.length) }}</span> de
          <span class="font-semibold">{{ admins.length }}</span> administradores
        </p>
        <div class="flex gap-2">
          <ButtonComponent
            variant="secondary"
            @click="previousPage"
            :disabled="currentPage === 1"
            >Anterior</ButtonComponent
          >
          <span class="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium">
            Página {{ currentPage }} / {{ totalPages }}
          </span>
          <ButtonComponent
            variant="secondary"
            @click="nextPage"
            :disabled="currentPage === totalPages"
            >Siguiente</ButtonComponent
          >
        </div>
      </div>
    </CardComponent>

    <!-- Modal -->
    <ModalComponent
      v-model="showModal"
      :title="modalMode === 'create' ? 'Nuevo Administrador' : 'Editar Administrador'"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Mensaje error simple -->
        <div v-if="error" class="text-sm text-red-600">{{ error }}</div>

        <InputField v-model="form.nombre" label="Nombre completo" type="text" required />
        <InputField
          v-model="form.email"
          label="Correo electrónico"
          type="email"
          required
        />

        <InputField
          v-if="modalMode === 'create'"
          v-model="form.password"
          label="Contraseña"
          type="password"
          required
        />
        <InputField
          v-if="modalMode === 'create'"
          v-model="form.password_confirmation"
          label="Confirmar contraseña"
          type="password"
          required
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Rol</label
          >
          <input
            type="text"
            value="Administrador"
            disabled
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border rounded-lg dark:border-gray-600"
          />
        </div>

        <input type="hidden" v-model="form.rol" />

        <div
          class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <ButtonComponent variant="secondary" type="button" @click="closeModal"
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
import { ref, reactive, computed, onMounted } from "vue";
import { usuariosWebService } from "../../services/api";
import CardComponent from "../../components/ui/UiCard.vue";
import ButtonComponent from "../../components/ui/ButtonComponent.vue";
import InputField from "../../components/ui/InputField.vue";
import TableComponent from "../../components/ui/TableComponent.vue";
import ModalComponent from "../../components/ui/ModalComponent.vue";
import LoadingSpinner from "../../components/ui/LoadingSpinner.vue";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";

// SweetAlert helper
import { useAlert } from "@/utils/sweetalert";
const alert = useAlert();

const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const modalMode = ref("create");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;
const admins = ref([]);
const error = ref("");

const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "email", label: "Correo" },
  { key: "rol", label: "Rol" },
];

const form = reactive({
  id: null,
  nombre: "",
  email: "",
  password: "",
  password_confirmation: "",
  rol: "admin",
});

const totalPages = computed(() => Math.ceil(admins.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);
const paginatedAdmins = computed(() =>
  admins.value.slice(startIndex.value, endIndex.value)
);

const resetForm = () => {
  form.id = null;
  form.nombre = "";
  form.email = "";
  form.password = "";
  form.password_confirmation = "";
  form.rol = "admin";
  error.value = "";
};

const loadAdmins = async () => {
  loading.value = true;
  try {
    const { data } = await usuariosWebService.getAll({
      rol: "admin",
      search: searchQuery.value,
    });
    admins.value = data?.data || [];
  } catch {
    alert.error("Error", "No se pudieron cargar los administradores");
  }
  loading.value = false;
};

const openCreateModal = () => {
  resetForm();
  modalMode.value = "create";
  showModal.value = true;
};

const openEditModal = (admin) => {
  resetForm();
  modalMode.value = "edit";
  Object.assign(form, { id: admin.id, nombre: admin.nombre, email: admin.email });
  showModal.value = true;
};

const handleSubmit = async () => {
  submitting.value = true;
  error.value = "";
  try {
    const payload = { nombre: form.nombre, email: form.email, rol: "admin" };

    if (modalMode.value === "create") {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
      await usuariosWebService.create(payload);
      alert.toastSuccess("Administrador creado");
    } else {
      await usuariosWebService.update(form.id, payload);
      alert.toastSuccess("Administrador actualizado");
    }

    await loadAdmins();
    showModal.value = false;
  } catch (err) {
    error.value = err.response?.data?.message || "No se pudo guardar";
  }
  submitting.value = false;
};

const confirmDelete = async (admin) => {
  const r = await alert.confirmDelete(
    "Eliminar administrador",
    `Se eliminará a "${admin.nombre}".`
  );
  if (!r.isConfirmed) return;

  try {
    await usuariosWebService.delete(admin.id);
    await loadAdmins();
    alert.toastSuccess("Administrador eliminado");
  } catch {
    alert.error("Error", "No se pudo eliminar");
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadAdmins();
};

const previousPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++;

onMounted(loadAdmins);
</script>

<style scoped>
.input-field {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
</style>
