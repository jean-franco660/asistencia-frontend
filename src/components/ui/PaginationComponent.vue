<template>
  <div
    v-if="total > perPage"
    class="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700"
  >
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Info de registros -->
      <p class="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
        Mostrando {{ from }} - {{ to }} de {{ total }} {{ label }}
      </p>

      <!-- Controles de paginación -->
      <nav class="flex items-center gap-2">
        <!-- Botón Anterior -->
        <button
          @click="goToPrevious"
          :disabled="currentPage === 1"
          class="px-2 sm:px-3 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:hover:bg-white dark:disabled:hover:bg-gray-800 touch-target"
          :class="{ 'cursor-not-allowed': currentPage === 1 }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span class="hidden sm:inline">Anterior</span>
        </button>

        <!-- Números de página -->
        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base touch-target"
            :class="
              page === currentPage
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-110'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            "
          >
            {{ page }}
          </button>
        </div>

        <!-- Botón Siguiente -->
        <button
          @click="goToNext"
          :disabled="currentPage >= totalPages"
          class="px-2 sm:px-3 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:hover:bg-white dark:disabled:hover:bg-gray-800 touch-target"
          :class="{ 'cursor-not-allowed': currentPage >= totalPages }"
        >
          <span class="hidden sm:inline">Siguiente</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  perPage: {
    type: Number,
    required: true,
    default: 20,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  label: {
    type: String,
    default: "registros",
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["page-change"]);

const totalPages = computed(() => Math.ceil(props.total / props.perPage));

const from = computed(() => (props.currentPage - 1) * props.perPage + 1);

const to = computed(() => Math.min(props.currentPage * props.perPage, props.total));

// Calcular páginas visibles con elipsis inteligente
// En móvil mostramos menos páginas (3) para ahorrar espacio
const visiblePages = computed(() => {
  const pages = [];
  // Detectar si es móvil basado en el ancho de ventana
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const maxVisible = isMobile ? 3 : props.maxVisiblePages;
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, props.currentPage - half);
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  // Ajustar start si estamos cerca del final
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit("page-change", page);
  }
};

const goToPrevious = () => {
  if (props.currentPage > 1) {
    emit("page-change", props.currentPage - 1);
  }
};

const goToNext = () => {
  if (props.currentPage < totalPages.value) {
    emit("page-change", props.currentPage + 1);
  }
};
</script>
