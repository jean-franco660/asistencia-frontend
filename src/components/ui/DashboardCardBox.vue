<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: String,
})
</script>
