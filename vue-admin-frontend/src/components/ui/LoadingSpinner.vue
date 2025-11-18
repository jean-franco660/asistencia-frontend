<template>
  <div :class="containerClasses">
    <div :class="spinnerClasses"></div>
    <p v-if="text" :class="textClasses">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})

const containerClasses = computed(() => {
  const base = 'flex flex-col items-center justify-center'
  const fullscreen = props.fullscreen 
    ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50' 
    : ''

  return [base, fullscreen].filter(Boolean).join(' ')
})

const spinnerClasses = computed(() => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4'
  }

  return [
    'border-primary-600',
    'border-t-transparent',
    'rounded-full',
    'animate-spin',
    sizes[props.size]
  ].join(' ')
})

const textClasses = computed(() => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return [
    'mt-4',
    'text-gray-600',
    'dark:text-gray-400',
    sizes[props.size]
  ].join(' ')
})
</script>