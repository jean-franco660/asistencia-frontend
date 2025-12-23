<template>
  <div class="flex items-center justify-between gap-3">
    <div class="flex-1 min-w-0">
      <h1
        class="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 truncate"
      >
        Gestión de Docentes
      </h1>
      <p
        class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 truncate"
      >
        Administra y organiza los docentes del sistema
      </p>
    </div>
    <div
      class="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0"
    >
      <Users :size="24" class="text-white sm:w-8 sm:h-8" />
    </div>
  </div>
</template>

<script setup>
import { Users } from 'lucide-vue-next';
</script>
