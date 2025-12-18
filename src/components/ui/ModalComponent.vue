<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeModal"
      >
        <!-- Mobile: full screen, Desktop: centered with padding -->
        <div class="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

          <!-- Modal content with responsive sizing and max-height -->
          <div 
            :class="modalClasses" 
            class="max-h-screen sm:max-h-[90vh] overflow-y-auto scrollbar-thin"
            @click.stop
          >
            <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 mb-3 sm:mb-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 pr-8">
                {{ title }}
              </h3>
              <button
                v-if="closable"
                @click="closeModal"
                class="absolute right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-target"
              >
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="text-gray-700 dark:text-gray-300">
              <slot></slot>
            </div>

            <div v-if="$slots.footer" class="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4 mt-3 sm:mt-4">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const modalClasses = computed(() => {
  const base = 'relative bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-xl w-full transition-all'
  
  // Mobile: full screen for all sizes except 'sm'
  // Desktop: use specified size
  const sizes = {
    sm: 'max-w-sm mx-4',
    md: 'max-w-full sm:max-w-lg mx-0 sm:mx-4',
    lg: 'max-w-full sm:max-w-2xl mx-0 sm:mx-4',
    xl: 'max-w-full sm:max-w-4xl mx-0 sm:mx-4',
    full: 'max-w-full mx-0'
  }

  // Mobile: reduce padding, Desktop: normal padding
  const padding = props.size === 'sm' ? 'p-4 sm:p-6' : 'p-4 sm:p-6 lg:p-8'

  return [base, sizes[props.size], padding]
})

const closeModal = () => {
  if (props.closable) {
    emit('update:modelValue', false)
    emit('close')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
