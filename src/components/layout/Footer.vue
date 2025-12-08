<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 mt-auto transition-colors">
    <div class="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <p>© {{ currentYear }} Sistema de Asistencia Docente. Todos los derechos reservados.</p>
      <p class="mt-2 md:mt-0">Versión 1.0.0</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
