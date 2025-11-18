<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 transition-colors"
  >
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Sistema de Asistencia
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <CardComponent padding="lg">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <AlertMessage
            v-if="error"
            :show="!!error"
            type="error"
            :message="error"
            @close="error = ''"
          />

          <InputField
            v-model="form.email"
            label="Correo electrónico"
            type="email"
            placeholder="usuario@ejemplo.com"
            :required="true"
            :error="errors.email"
          />

          <div>
            <InputField
              v-model="form.password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              :required="true"
              :error="errors.password"
            />

            <div class="mt-2 text-right">
              <a
                href="#"
                class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <ButtonComponent
            type="submit"
            variant="primary"
            :loading="loading"
            class="w-full"
          >
            {{ loading ? "Iniciando sesión..." : "Iniciar sesión" }}
          </ButtonComponent>
        </form>
      </CardComponent>

      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Sistema de gestión de asistencias v1.0
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import CardComponent from "../../components/ui/UiCard.vue";
import InputField from "../../components/ui/InputField.vue";
import ButtonComponent from "../../components/ui/ButtonComponent.vue";
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

const handleLogin = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = "";

  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password,
    });

    // Login correcto → mostrar toast
    if (result.success) {
      alert.toastSuccess("Bienvenido");

      const user = authStore.user;
      if (user?.rol === "admin") {
        router.push("/dashboard");
      } else if (user?.rol === "director") {
        router.push("/director/dashboard");
      } else {
        alert.error("Acceso denegado", "Rol no autorizado");
      }

      return;
    }

    // Credenciales incorrectas → error en formulario
    error.value = result.error || "Credenciales inválidas";
  } catch (err) {
    // Error grave del servidor → SweetAlert modal
    alert.error(
      "Error del servidor",
      err.response?.data?.message || "No se pudo conectar al servidor"
    );
    console.error("Error de login:", err);
  } finally {
    loading.value = false;
  }
};
</script>
