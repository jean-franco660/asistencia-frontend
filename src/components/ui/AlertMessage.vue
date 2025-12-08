<template>
  <Transition name="alert">
    <div v-if="show" :class="alertClasses" role="alert">
      <!-- Efecto de brillo de fondo -->
      <div
        class="absolute inset-0 rounded-2xl opacity-20 blur-2xl"
        :class="glowClasses"
      ></div>

      <!-- Contenido -->
      <div class="relative flex items-start">
        <!-- Icono con gradiente -->
        <div class="flex-shrink-0">
          <div :class="iconContainerClasses">
            <component :is="iconComponent" class="h-5 w-5 text-white" />
          </div>
        </div>

        <!-- Mensaje -->
        <div class="ml-4 flex-1">
          <p class="text-sm font-semibold" :class="titleClasses">
            {{ title }}
          </p>
          <p v-if="message" class="text-sm mt-1 opacity-90">
            {{ message }}
          </p>
        </div>

        <!-- Botón cerrar -->
        <div v-if="closable" class="ml-4 flex-shrink-0">
          <button
            @click="close"
            :class="closeButtonClasses"
            class="group relative inline-flex items-center justify-center rounded-xl p-2 transition-all duration-300 hover:scale-110"
          >
            <span class="sr-only">Cerrar</span>
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Barra de progreso opcional -->
      <div
        v-if="autoClose && showProgress"
        class="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden"
      >
        <div
          :class="progressBarClasses"
          class="h-full transition-all duration-100 ease-linear"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, watch, onUnmounted, h } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "info",
    validator: (value) => ["success", "error", "warning", "info"].includes(value),
  },
  title: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  closable: {
    type: Boolean,
    default: true,
  },
  autoClose: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 5000, // 5 segundos
  },
  showProgress: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);

const progress = ref(100);
let intervalId = null;
let timeoutId = null;

// Clases del contenedor principal
const alertClasses = computed(() => {
  const base =
    "relative overflow-hidden rounded-2xl p-5 mb-4 shadow-xl border backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5";

  const types = {
    success:
      "bg-gradient-to-r from-emerald-50/95 to-teal-50/95 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-200/50 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100",
    error:
      "bg-gradient-to-r from-red-50/95 to-rose-50/95 dark:from-red-900/30 dark:to-rose-900/30 border-red-200/50 dark:border-red-800/50 text-red-900 dark:text-red-100",
    warning:
      "bg-gradient-to-r from-amber-50/95 to-orange-50/95 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-200/50 dark:border-amber-800/50 text-amber-900 dark:text-amber-100",
    info:
      "bg-gradient-to-r from-blue-50/95 to-indigo-50/95 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/50 dark:border-blue-800/50 text-blue-900 dark:text-blue-100",
  };

  return [base, types[props.type]];
});

// Clases del brillo de fondo
const glowClasses = computed(() => {
  const types = {
    success: "bg-gradient-to-r from-emerald-400 to-teal-400",
    error: "bg-gradient-to-r from-red-400 to-rose-400",
    warning: "bg-gradient-to-r from-amber-400 to-orange-400",
    info: "bg-gradient-to-r from-blue-400 to-indigo-400",
  };
  return types[props.type];
});

// Clases del contenedor del icono
const iconContainerClasses = computed(() => {
  const base =
    "flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-transform duration-300 hover:scale-110";

  const types = {
    success: "bg-gradient-to-br from-emerald-500 to-teal-600",
    error: "bg-gradient-to-br from-red-500 to-rose-600",
    warning: "bg-gradient-to-br from-amber-500 to-orange-600",
    info: "bg-gradient-to-br from-blue-500 to-indigo-600",
  };

  return [base, types[props.type]];
});

// Clases del título
const titleClasses = computed(() => {
  const types = {
    success: "text-emerald-900 dark:text-emerald-100",
    error: "text-red-900 dark:text-red-100",
    warning: "text-amber-900 dark:text-amber-100",
    info: "text-blue-900 dark:text-blue-100",
  };
  return types[props.type];
});

// Clases del botón cerrar
const closeButtonClasses = computed(() => {
  const types = {
    success:
      "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/50",
    error: "text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/50",
    warning:
      "text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/50",
    info: "text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50",
  };
  return types[props.type];
});

// Clases de la barra de progreso
const progressBarClasses = computed(() => {
  const types = {
    success: "bg-gradient-to-r from-emerald-500 to-teal-500",
    error: "bg-gradient-to-r from-red-500 to-rose-500",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500",
    info: "bg-gradient-to-r from-blue-500 to-indigo-500",
  };
  return types[props.type];
});

// Componente del icono
const iconComponent = computed(() => {
  const icons = {
    success: () =>
      h(
        "svg",
        {
          class: "h-5 w-5",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
        },
        [
          h("path", {
            "fill-rule": "evenodd",
            d:
              "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
            "clip-rule": "evenodd",
          }),
        ]
      ),
    error: () =>
      h(
        "svg",
        {
          class: "h-5 w-5",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
        },
        [
          h("path", {
            "fill-rule": "evenodd",
            d:
              "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
            "clip-rule": "evenodd",
          }),
        ]
      ),
    warning: () =>
      h(
        "svg",
        {
          class: "h-5 w-5",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
        },
        [
          h("path", {
            "fill-rule": "evenodd",
            d:
              "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
            "clip-rule": "evenodd",
          }),
        ]
      ),
    info: () =>
      h(
        "svg",
        {
          class: "h-5 w-5",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
        },
        [
          h("path", {
            "fill-rule": "evenodd",
            d:
              "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
            "clip-rule": "evenodd",
          }),
        ]
      ),
  };

  return icons[props.type];
});

// Función de cierre
const close = () => {
  clearTimers();
  emit("close");
};

// Limpiar timers
const clearTimers = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

// Auto-cierre con barra de progreso
watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.autoClose) {
      progress.value = 100;

      const step = 100 / (props.duration / 100);

      intervalId = setInterval(() => {
        progress.value -= step;
        if (progress.value <= 0) {
          clearTimers();
          close();
        }
      }, 100);

      timeoutId = setTimeout(() => {
        close();
      }, props.duration);
    } else {
      clearTimers();
      progress.value = 100;
    }
  }
);

onUnmounted(() => {
  clearTimers();
});
</script>

<style scoped>
.alert-enter-active {
  animation: alert-slide-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.alert-leave-active {
  animation: alert-slide-out 0.3s ease-out;
}

@keyframes alert-slide-in {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes alert-slide-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}
</style>
