<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Gestión de Docentes
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Administra los docentes del sistema
        </p>
      </div>

      <div class="flex gap-3">
        <!-- Importar Excel -->
        <ButtonComponent variant="secondary" @click="openImportModal">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Importar Excel
        </ButtonComponent>

        <!-- Nuevo -->
        <ButtonComponent variant="primary" @click="openCreateModal">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Docente
        </ButtonComponent>
      </div>
    </div>

    <!-- Tabla -->
    <CardComponent>
      <div class="mb-4 flex flex-col md:flex-row gap-4">
        <InputField
          v-model="searchQuery"
          type="text"
          placeholder="Buscar..."
          @input="debounceSearch"
        />
        <select
          v-model="filterStatus"
          @change="loadUsuarios"
          class="input-field w-full md:w-48"
        >
          <option value="">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
        <select
          v-model="filterInstitucion"
          @change="loadUsuarios"
          class="input-field w-full md:w-48"
        >
          <option value="">Todas Instituciones</option>
          <option v-for="i in instituciones" :key="i.id" :value="i.id">
            {{ i.nombre }}
          </option>
        </select>
      </div>

      <LoadingSpinner v-if="loading" text="Cargando docentes..." class="py-12" />

      <div v-else>
        <TableComponent
          :columns="columns"
          :data="sortedUsuarios"
          :sortable="true"
          @sort="handleSort"
        >
          <template #cell-nombre="{ row }">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
              >
                <span
                  class="text-primary-700 dark:text-primary-300 font-medium text-sm"
                  >{{ getInitials(row.nombre) }}</span
                >
              </div>
              <div>
                <p class="font-medium">{{ row.nombre }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ row.codigo }}</p>
              </div>
            </div>
          </template>

          <template #cell-instituciones="{ row }">
            <div v-if="row.instituciones?.length" class="flex flex-wrap gap-1">
              <span
                v-for="inst in row.instituciones.slice(0, 2)"
                :key="inst.id"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {{ inst.nombre }}
              </span>
              <span
                v-if="row.instituciones.length > 2"
                class="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                +{{ row.instituciones.length - 2 }}
              </span>
            </div>
            <span v-else class="text-gray-400 italic text-sm">Sin instituciones</span>
          </template>

          <template #cell-estado="{ row }">
            <span
              :class="
                row.activo
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              "
              class="px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ row.activo ? "Activo" : "Inactivo" }}
            </span>
          </template>

          <template #actions="{ row }">
            <button
              @click="openEditModal(row)"
              class="text-primary-600 hover:text-primary-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828z"
                />
              </svg>
            </button>

            <button @click="confirmDelete(row)" class="text-red-600 hover:text-red-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862A2 2 0 015.868 19.142L5 7m5 4v6m4-6v6m1-10V4H9v3H4"
                />
              </svg>
            </button>
          </template>
        </TableComponent>
      </div>
    </CardComponent>

    <!-- Modal Importar -->
    <ModalComponent v-model="showImportModal" title="Importar Docentes">
      <div class="space-y-4">
        <input
          ref="fileInput"
          type="file"
          @change="handleFileSelect"
          accept=".xlsx,.xls,.csv"
          class="hidden"
        />

        <div
          @click="$refs.fileInput.click()"
          class="border-dashed border p-6 text-center rounded-lg cursor-pointer"
        >
          <p class="text-sm">Haz clic o arrastra archivo</p>
          <p v-if="selectedFile" class="font-medium mt-2">{{ selectedFile.name }}</p>
        </div>

        <div class="flex justify-end space-x-2">
          <ButtonComponent variant="secondary" @click="closeImportModal"
            >Cerrar</ButtonComponent
          >
          <ButtonComponent
            variant="primary"
            @click="handleImport"
            :disabled="importing || !selectedFile"
            :loading="importing"
          >
            Importar
          </ButtonComponent>
        </div>
      </div>
    </ModalComponent>

    <!-- Modal Form -->
    <ModalComponent
      v-model="showModal"
      :title="modalMode === 'create' ? 'Nuevo Docente' : 'Editar Docente'"
      @close="closeModal"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <InputField v-model="form.nombre" label="Nombre" />
        <InputField v-model="form.codigo" label="Código" />

        <label class="text-sm font-medium block">Contraseña</label>
        <input v-model="form.password" type="password" class="input-field" />

        <div class="flex justify-end space-x-2">
          <ButtonComponent variant="secondary" @click="closeModal"
            >Cancelar</ButtonComponent
          >
          <ButtonComponent variant="primary" type="submit" :loading="submitting">
            Guardar
          </ButtonComponent>
        </div>
      </form>
    </ModalComponent>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { usuariosService, institucionesService } from "@/services/api";
import ButtonComponent from "@/components/ui/ButtonComponent.vue";
import CardComponent from "@/components/ui/UiCard.vue";
import InputField from "@/components/ui/InputField.vue";
import TableComponent from "@/components/ui/TableComponent.vue";
import ModalComponent from "@/components/ui/ModalComponent.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { useAlert } from "@/utils/sweetalert";

const alert = useAlert();

const loading = ref(false);
const submitting = ref(false);
const importing = ref(false);
const showModal = ref(false);
const showImportModal = ref(false);
const searchQuery = ref("");
const filterStatus = ref("");
const filterInstitucion = ref("");
const selectedFile = ref(null);
const usuarios = ref([]);
const instituciones = ref([]);
const modalMode = ref("create");

const form = reactive({ id: null, nombre: "", codigo: "", password: "" });

const columns = [
  { key: "nombre", label: "Docente", sortable: true },
  { key: "instituciones", label: "Instituciones" },
  { key: "estado", label: "Estado", sortable: true },
];

const sortedUsuarios = computed(() => usuarios.value);

const debounceSearch = () => loadUsuarios();

const getInitials = (n) =>
  n
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const handleFileSelect = (e) => (selectedFile.value = e.target.files[0]);

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
    alert.success("Importación completada", `Se importaron ${res.data.procesados}`);
    loadUsuarios();
    closeImportModal();
  } catch {
    alert.error("Error", "No se pudo importar");
  }
  importing.value = false;
};

const confirmDelete = async (u) => {
  const r = await alert.confirmDelete(`Eliminar docente "${u.nombre}"`);

  if (!r.isConfirmed) return;

  try {
    await usuariosService.delete(u.id);
    alert.toastSuccess("Docente eliminado");
    loadUsuarios();
  } catch {
    alert.error("Error", "No se pudo eliminar");
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    if (modalMode.value === "create") {
      await usuariosService.create(form);
      alert.success("Docente creado");
    } else {
      await usuariosService.update(form.id, form);
      alert.success("Docente actualizado");
    }
    loadUsuarios();
    closeModal();
  } catch {
    alert.error("Error", "No se pudo guardar");
  }
  submitting.value = false;
};

const openCreateModal = () => {
  Object.assign(form, { id: null, nombre: "", codigo: "", password: "" });
  modalMode.value = "create";
  showModal.value = true;
};

const openEditModal = (u) => {
  Object.assign(form, u, { password: "" });
  modalMode.value = "edit";
  showModal.value = true;
};

const closeModal = () => (showModal.value = false);
const closeImportModal = () => {
  showImportModal.value = false;
  selectedFile.value = null;
};

const loadUsuarios = async () => {
  loading.value = true;
  const r = await usuariosService.getAll();
  usuarios.value = r.data?.data || [];
  loading.value = false;
};

onMounted(async () => {
  const r = await institucionesService.getAll();
  instituciones.value = r.data?.data || [];
  loadUsuarios();
});
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100;
}
</style>
