<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h3>
      </slot>
    </div>

    <div :class="bodyClasses">
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'none'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  const base = 'bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-200'
  const hover = props.hoverable ? 'hover:shadow-lg cursor-pointer' : ''
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: 'p-0'
  }

  return [base, hover, paddings[props.padding]]
})

const bodyClasses = computed(() => {
  return 'text-gray-700 dark:text-gray-300'
})
</script>
