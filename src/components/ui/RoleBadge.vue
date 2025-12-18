<template>
  <span 
    :class="['inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm', badgeClass]"
  >
    <span v-if="rol === 'administrador'">👑</span>
    <span v-else-if="rol === 'supervisor'">📋</span>
    <span v-else>🔹</span>
    {{ rolLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { ROLE_LABELS, ROLE_COLORS, ROLES } from '@/constants/roles'

const props = defineProps({
  rol: { type: String, required: true }
})

const rolLabel = computed(() => {
  return ROLE_LABELS[props.rol] || props.rol
})

const badgeClass = computed(() => {
  const colors = ROLE_COLORS[props.rol]
  if (!colors) {
    return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
  
  return `${colors.bg} ${colors.text}`
})
</script>
