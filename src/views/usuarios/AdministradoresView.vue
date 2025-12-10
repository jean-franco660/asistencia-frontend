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
            Gestión de Administradores
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            Administra usuarios administradores del sistema
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Búsqueda y Botón Premium -->
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
                ></path>
              </svg>
              Buscar
            </label>
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Buscar por nombre o correo..."
              class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Botón Nuevo Administrador -->
          <div class="flex items-end">
            <button
              @click="openCreateModal"
              class="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 justify-center"
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
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Nuevo Administrador
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
                ></path>
              </svg>
            </div>
            Administradores Registrados
            <span v-if="loading" class="animate-spin">⏳</span>
          </h2>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"
          ></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">
            Cargando administradores...
          </p>
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
                  Administrador
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Correo
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Rol
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
                v-for="admin in paginatedAdmins"
                :key="admin.id"
                class="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md"
                    >
                      <span class="text-white font-bold text-lg">{{
                        admin.nombre.charAt(0).toUpperCase()
                      }}</span>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-gray-100">
                        {{ admin.nombre }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">{{
                      admin.email
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                    Administrador
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <!-- Editar -->
                    <button
                      @click="openEditModal(admin)"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>

                    <!-- Eliminar -->
                    <button
                      @click="confirmDelete(admin)"
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
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!paginatedAdmins.length">
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        ></path>
                      </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium">
                      No se encontraron administradores
                    </p>
                    <p class="text-gray-400 dark:text-gray-500 text-sm">
                      Comienza creando un nuevo administrador
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación Premium -->
        <div
          v-if="admins.length > 0"
          class="bg-gray-50 dark:bg-gray-750 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Mostrando <span class="font-semibold">{{ startIndex + 1 }}</span> a
            <span class="font-semibold">{{ Math.min(endIndex, admins.length) }}</span> de
            <span class="font-semibold">{{ admins.length }}</span> administradores
          </p>
          <div class="flex gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span
              class="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium flex items-center"
            >
              Página {{ currentPage }} / {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Premium -->
    <transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all"
        >
          <!-- Header del Modal -->
          <div
            class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-3xl"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                {{
                  modalMode === "create" ? "Nuevo Administrador" : "Editar Administrador"
                }}
              </h3>
              <button
                @click="closeModal"
                class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all"
                :disabled="submitting"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido del Modal -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
            <!-- Error Message -->
            <div
              v-if="error"
              class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400"
            >
              {{ error }}
            </div>

            <!-- Nombre -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Nombre completo *
              </label>
              <input
                v-model="form.nombre"
                type="text"
                required
                class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <!-- Email -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Correo electrónico *
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <!-- Contraseña (solo en creación) -->
            <div v-if="modalMode === 'create'">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Contraseña *
              </label>
              <input
                v-model="form.password"
                type="password"
                required
                class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <!-- Confirmar Contraseña (solo en creación) -->
            <div v-if="modalMode === 'create'">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirmar contraseña *
              </label>
              <input
                v-model="form.password_confirmation"
                type="password"
                required
                class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Confirmar contraseña"
              />
            </div>

            <!-- Rol (solo lectura) -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Rol
              </label>
              <input
                type="text"
                value="Administrador"
                disabled
                class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            <!-- Footer del Modal -->
            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                :disabled="submitting"
                class="px-6 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                <svg
                  v-if="submitting"
                  class="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span v-if="submitting">Guardando...</span>
                <span v-else>{{ modalMode === "create" ? "Crear" : "Actualizar" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { usuariosWebService } from "../../services/api";
import { useAlert } from "@/utils/sweetalert";

const alert = useAlert();

const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const modalMode = ref("create");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const admins = ref([]);
const error = ref("");

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

const closeModal = () => (showModal.value = false);

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
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
