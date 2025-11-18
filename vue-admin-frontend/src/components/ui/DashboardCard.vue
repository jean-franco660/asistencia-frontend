<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-300">{{ label }}</p>
        <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ value }}</p>
      </div>

      <div class="p-3 rounded-full bg-blue-50 dark:bg-blue-900 flex items-center justify-center">
        <component :is="icon" class="w-7 h-7 text-blue-600 dark:text-blue-300" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  k: String,
  label: String,
  value: [String, Number],
  icon: [Object, Function], // soporte para Heroicons
})
</script>
