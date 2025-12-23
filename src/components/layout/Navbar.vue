<template>
  <header
    class="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-40 transition-colors"
  >
    <nav class="px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
      <!-- Botón menú móvil + título -->
      <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <!-- Botón móvil -->
        <button
          @click="toggleSidebar"
          class="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden touch-target flex-shrink-0"
          aria-label="Abrir menú lateral"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Botón desktop (siempre visible) -->
        <button
          @click="toggleSidebar"
          class="hidden lg:flex p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          aria-label="Alternar menú lateral"
          title="Ocultar/Mostrar menú"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 class="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
          <span class="hidden sm:inline">Sistema de Asistencia</span>
          <span class="sm:hidden">Asistencia</span>
        </h1>
      </div>

      <!-- Controles -->
      <div class="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
        <!-- Tema -->
        <button
          @click="toggleDarkMode"
          class="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
          aria-label="Cambiar tema"
        >
          <svg
            v-if="isDark"
            class="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            class="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        <!-- Usuario -->
        <div v-if="user" class="relative" ref="userMenuRef">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg"
            >
              {{ userInitials }}
            </div>
            <span
              class="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ user.nombre }}
            </span>
            <svg
              class="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform"
              :class="{ 'rotate-180': showUserMenu }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Menu Dropdown -->
          <Transition name="dropdown">
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              <!-- Header del menu -->
              <div
                class="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600"
              >
                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ user.nombre }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ user.email || user.codigo }}
                </p>
                <div class="mt-2">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getRoleBadgeClass(user.rol)"
                  >
                    {{ getRoleLabel(user.rol) }}
                  </span>
                </div>
              </div>

              <!-- Opciones del menu -->
              <div class="py-1">
                <!-- Mi Perfil - Solo para supervisores -->
                <button
                  v-if="user?.rol === 'supervisor'"
                  @click="handleProfile"
                  class="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg
                    class="w-4 h-4 mr-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Mi Perfil
                </button>

                <!-- Separador solo si hay Mi Perfil -->
                <div v-if="user?.rol === 'supervisor'" class="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                <button
                  @click="confirmLogout"
                  class="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg
                    class="w-4 h-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { useAlert } from "@/utils/sweetalert";

const emit = defineEmits(["toggle-sidebar"]);
const router = useRouter();
const authStore = useAuthStore();
const alert = useAlert();

const showUserMenu = ref(false);
const isDark = ref(false);
const userMenuRef = ref(null);

const user = computed(() => authStore.user);

const userInitials = computed(() => {
  const n = user.value?.nombre || "";
  return (
    n
      .split(" ")
      .map((v) => v[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
});

const toggleSidebar = () => emit("toggle-sidebar");

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

const getRoleLabel = (rol) => {
  const roles = {
    administrador: "Administrador",
    director: "Director",
    docente: "Docente",
  };
  return roles[rol] || rol;
};

const getRoleBadgeClass = (rol) => {
  const classes = {
    administrador:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    director: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    docente: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  };
  return classes[rol] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
};

const handleProfile = () => {
  showUserMenu.value = false;
  router.push("/perfil");
};

const handleSettings = () => {
  showUserMenu.value = false;
  router.push("/configuracion");
};

const confirmLogout = async () => {
  // Cerrar el menú primero
  showUserMenu.value = false;

  try {
    const result = await alert.confirm(
      "¿Cerrar sesión?",
      "Deberás iniciar sesión nuevamente para acceder al sistema",
      "Sí, cerrar sesión",
      "Cancelar"
    );

    if (!result.isConfirmed) {
      return;
    }

    // Mostrar loading
    alert.loading("Cerrando sesión...");

    // Ejecutar logout
    await authStore.logout();

    // Cerrar loading y mostrar éxito
    alert.close();
    alert.toastSuccess("Sesión cerrada correctamente");

    // Redirigir al login
    await router.push("/login");
  } catch (error) {
    alert.error("Error", "No se pudo cerrar la sesión correctamente");
  }
};

// Cerrar menú al hacer click fuera
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  // Cargar tema guardado
  const theme = localStorage.getItem("theme");
  isDark.value = theme === "dark";
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  }

  // Agregar listener para cerrar menú al hacer click fuera
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  // Limpiar listener
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
