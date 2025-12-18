<template>
  <span 
    :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold', badgeClass]"
  >
    <span>{{ icon }}</span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  estado: { type: String, required: true },
  type: { type: String, default: 'justificacion' } // 'justificacion', 'asistencia', 'usuario'
})

const config = computed(() => {
  // Justificaciones
  if (props.type === 'justificacion') {
    const configs = {
      'PENDIENTE': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', icon: '⏳' },
      'APROBADO': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', icon: '✓' },
      'RECHAZADO': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', icon: '✗' }
    }
    return configs[props.estado] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '•' }
  }
  
  // Asistencias
  if (props.type === 'asistencia') {
    const configs = {
      'a_tiempo': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', icon: '✓' },
      'tarde': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', icon: '⏰' },
      'salida_antes': { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200', icon: '⚠' },
      'falta': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', icon: '✗' },
      'justificado': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200', icon: '📋' }
    }
    return configs[props.estado] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '•' }
  }
  
  // Usuarios (estado de autorización)
  if (props.type === 'usuario') {
    const configs = {
      'pendiente': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', icon: '⏳' },
      'autorizado': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', icon: '✓' },
      'rechazado': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', icon: '✗' }
    }
    return configs[props.estado] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '•' }
  }
  
  return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '•' }
})

const badgeClass = computed(() => {
  return `${config.value.bg} ${config.value.text}`
})

const icon = computed(() => config.value.icon)

const label = computed(() => {
  // Justificaciones
  if (props.type === 'justificacion') {
    const labels = {
      'PENDIENTE': 'Pendiente',
      'APROBADO': 'Aprobado',
      'RECHAZADO': 'Rechazado'
    }
    return labels[props.estado] || props.estado
  }
  
  // Asistencias
  if (props.type === 'asistencia') {
    const labels = {
      'a_tiempo': 'A tiempo',
      'tarde': 'Tarde',
      'salida_antes': 'Salida anticipada',
      'falta': 'Falta',
      'justificado': 'Justificado'
    }
    return labels[props.estado] || props.estado
  }
  
  // Usuarios
  if (props.type === 'usuario') {
    const labels = {
      'pendiente': 'Pendiente',
      'autorizado': 'Autorizado',
      'rechazado': 'Rechazado'
    }
    return labels[props.estado] || props.estado
  }
  
  return props.estado
})
</script>
