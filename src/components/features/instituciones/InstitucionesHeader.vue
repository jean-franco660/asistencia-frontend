<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div class="flex-1 min-w-0">
      <h1
        class="text-responsive-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
      >
        Gestión de Instituciones
      </h1>
      <p class="text-responsive-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
        Administra las instituciones educativas de tu red
      </p>
    </div>
    <div
      class="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0"
    >
      <Building2 :size="24" class="text-white sm:w-8 sm:h-8" />
    </div>
  </div>
</template>

<script setup>
import { Building2 } from 'lucide-vue-next';
</script>
