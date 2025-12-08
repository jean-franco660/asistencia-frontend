<template>
  <div
    class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950"
  >
    <!-- Efectos de fondo animados -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Círculos flotantes -->
      <div
        class="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-blob"
      ></div>
      <div
        class="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute -bottom-20 left-1/2 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl animate-blob animation-delay-4000"
      ></div>

      <!-- Grid pattern -->
      <div
        class="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      ></div>
    </div>

    <!-- Contenedor principal -->
    <div class="relative w-full max-w-md px-6 z-10">
      <!-- Header con logo y título -->
      <div class="text-center mb-10 animate-fade-in-down">
        <!-- Logo animado -->
        <div
          class="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50 dark:shadow-blue-500/30 transform hover:scale-110 transition-transform duration-300"
        >
          <svg
            class="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <h1
          class="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-100 bg-clip-text text-transparent mb-3"
        >
          Sistema de Asistencia
        </h1>
        <p class="text-slate-600 dark:text-slate-400 text-lg">Bienvenido de vuelta</p>
      </div>

      <!-- Card del formulario -->
      <div class="relative group animate-fade-in-up">
        <!-- Glow effect -->
        <div
          class="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"
        ></div>

        <!-- Card principal -->
        <div
          class="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8"
        >
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Alerta de error con animación -->
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <AlertMessage
                v-if="error"
                :show="true"
                type="error"
                title="Error de autenticación"
                :message="error"
                @close="error = ''"
              />
            </Transition>

            <!-- Campo de email -->
            <div class="space-y-2">
              <label
                class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Correo electrónico
              </label>
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  @input="errors.email = ''"
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none"
                  :class="{
                    'border-red-500 focus:border-red-500 focus:ring-red-500/10':
                      errors.email,
                  }"
                />
              </div>
              <p
                v-if="errors.email"
                class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errors.email }}
              </p>
            </div>

            <!-- Campo de contraseña -->
            <div class="space-y-2">
              <label
                class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Contraseña
              </label>
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="••••••••"
                  @input="errors.password = ''"
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none"
                  :class="{
                    'border-red-500 focus:border-red-500 focus:ring-red-500/10':
                      errors.password,
                  }"
                />
              </div>
              <p
                v-if="errors.password"
                class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errors.password }}
              </p>
            </div>

            <!-- Olvidaste contraseña -->
            <div class="flex justify-end">
              <a
                href="#"
                @click.prevent
                class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <!-- Botón de login -->
            <button
              type="submit"
              :disabled="loading"
              class="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-[2px] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                class="relative px-6 py-3.5 rounded-[10px] bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300"
              >
                <span
                  v-if="!loading"
                  class="relative z-10 font-semibold text-white flex items-center justify-center gap-2"
                >
                  Iniciar sesión
                  <svg
                    class="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <span
                  v-else
                  class="relative z-10 font-semibold text-white flex items-center justify-center gap-3"
                >
                  <svg
                    class="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Iniciando sesión...
                </span>
              </div>
            </button>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center animate-fade-in">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Sistema de gestión de asistencias
          <span class="inline-block mx-2">•</span>
          <span
            class="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >v1.0</span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import AlertMessage from "../../components/ui/AlertMessage.vue";

// SweetAlert Premium
import { useAlert } from "@/utils/sweetalert";
const alert = useAlert();

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref("");

const form = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
});

const validateForm = () => {
  let isValid = true;
  errors.email = "";
  errors.password = "";

  if (!form.email) {
    errors.email = "El correo electrónico es requerido";
    isValid = false;
  } else if (!isValidEmail(form.email)) {
    errors.email = "El formato del correo electrónico no es válido";
    isValid = false;
  }

  if (!form.password) {
    errors.password = "La contraseña es requerida";
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
    isValid = false;
  }

  return isValid;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleLogin = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = "";

  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password,
    });

    if (result?.success) {
      alert.toastSuccess("Bienvenido");

      const user = authStore.user;
      if (user?.rol === "admin") {
        await router.push("/dashboard");
      } else if (user?.rol === "director") {
        await router.push("/director/dashboard");
      } else {
        alert.error("Acceso denegado", "Rol no autorizado");
      }
    } else {
      error.value = result?.error || "Credenciales inválidas";
      form.password = "";
    }
  } catch (err) {
    alert.error(
      "Error del servidor",
      err.response?.data?.message || "No se pudo conectar al servidor"
    );
    console.error("Error de login:", err);
    form.password = "";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Animación de blobs flotantes */
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Grid pattern */
.bg-grid-slate-200\/50 {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(203 213 225 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

.dark .bg-grid-slate-700\/25 {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(51 65 85 / 0.25)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Animaciones de entrada */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out 0.2s both;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out 0.4s both;
}
</style>
