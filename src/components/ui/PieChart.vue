<template>
  <div class="relative w-full h-full flex items-center justify-center">
    <!-- SVG Pie Chart -->
    <svg 
      :width="size" 
      :height="size" 
      :viewBox="`0 0 ${size} ${size}`"
      class="transform -rotate-90"
    >
      <!-- Background circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="isDark ? '#1f2937' : '#f3f4f6'"
        :stroke-width="strokeWidth"
        class="transition-colors duration-300"
      />
      
      <!-- Pie slices -->
      <g v-for="(slice, index) in slices" :key="index">
        <path
          :d="slice.path"
          :fill="slice.gradient"
          :stroke="isDark ? '#111827' : '#ffffff'"
          :stroke-width="2"
          class="transition-all duration-500 cursor-pointer hover:opacity-80"
          :class="{ 'scale-105': hoveredIndex === index }"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
        >
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            :dur="`${0.5 + index * 0.1}s`"
            fill="freeze"
          />
        </path>
      </g>
      
      <!-- Center circle for donut effect -->
      <circle
        :cx="center"
        :cy="center"
        :r="innerRadius"
        :fill="isDark ? '#1f2937' : '#ffffff'"
        class="transition-colors duration-300"
      />
      
      <!-- Gradients definitions -->
      <defs>
        <linearGradient
          v-for="(dataset, index) in datasets"
          :key="`gradient-${index}`"
          :id="`gradient-${index}`"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" :stop-color="dataset.color" stop-opacity="1" />
          <stop offset="100%" :stop-color="lightenColor(dataset.color, 20)" stop-opacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
    
    <!-- Center text -->
    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div class="text-center">
        <p class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-pulse">
          {{ total }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
          Total
        </p>
      </div>
    </div>
    
    <!-- Legend -->
    <div class="absolute -bottom-4 left-0 right-0 flex flex-wrap justify-center gap-3 mt-6">
      <div
        v-for="(dataset, index) in datasets"
        :key="`legend-${index}`"
        class="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer"
        :class="[
          hoveredIndex === index 
            ? 'bg-gray-100 dark:bg-gray-700 scale-105' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        ]"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
        <div 
          class="w-3 h-3 rounded-full shadow-lg"
          :style="{ background: dataset.color }"
        ></div>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ dataset.label }}
        </span>
        <span class="text-sm font-bold text-gray-900 dark:text-white">
          {{ dataset.value }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          ({{ getPercentage(dataset.value) }}%)
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  datasets: {
    type: Array,
    required: true,
    // Format: [{ label: 'Asistencias', value: 45, color: '#10b981' }, ...]
  },
  size: {
    type: Number,
    default: 300
  },
  strokeWidth: {
    type: Number,
    default: 60
  }
})

const hoveredIndex = ref(null)
const isDark = ref(false)

// Computed values
const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const innerRadius = computed(() => radius.value - props.strokeWidth / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const total = computed(() => 
  props.datasets.reduce((sum, dataset) => sum + dataset.value, 0)
)

const slices = computed(() => {
  let currentAngle = 0
  
  return props.datasets.map((dataset, index) => {
    const percentage = dataset.value / total.value
    const angle = percentage * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    currentAngle = endAngle
    
    // Convert angles to radians
    const startRad = (startAngle - 90) * (Math.PI / 180)
    const endRad = (endAngle - 90) * (Math.PI / 180)
    
    // Calculate arc points
    const x1 = center.value + radius.value * Math.cos(startRad)
    const y1 = center.value + radius.value * Math.sin(startRad)
    const x2 = center.value + radius.value * Math.cos(endRad)
    const y2 = center.value + radius.value * Math.sin(endRad)
    
    // Large arc flag
    const largeArc = angle > 180 ? 1 : 0
    
    // Create path
    const path = [
      `M ${center.value} ${center.value}`,
      `L ${x1} ${y1}`,
      `A ${radius.value} ${radius.value} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')
    
    return {
      path,
      gradient: `url(#gradient-${index})`,
      percentage: (percentage * 100).toFixed(1)
    }
  })
})

const getPercentage = (value) => {
  return ((value / total.value) * 100).toFixed(1)
}

const lightenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)
}

// Check dark mode
onMounted(() => {
  const checkDarkMode = () => {
    isDark.value = document.documentElement.classList.contains('dark')
  }
  checkDarkMode()
  
  // Watch for dark mode changes
  const observer = new MutationObserver(checkDarkMode)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
