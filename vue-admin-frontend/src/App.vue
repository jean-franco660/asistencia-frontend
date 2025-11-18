<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './store/auth'
import Navbar from './components/layout/Navbar.vue'
import Sidebar from './components/layout/Sidebar.vue'
import Footer from './components/layout/Footer.vue'
import LoadingSpinner from './components/ui/LoadingSpinner.vue'

const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(true)
const isInitializing = ref(true)

const isEmptyLayout = computed(() => route.meta.layout === 'empty')

const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value)
const closeSidebar = () => (sidebarOpen.value = false)

watch(route, () => {
  if (window.innerWidth >= 1024) sidebarOpen.value = true
})

// monitor auth state
watch(() => authStore.isAuthenticated, val => {
  console.log('🔐 auth state changed:', val)
})

// init visual only
onMounted(() => {
  console.log('🚀 App mounted')
  setTimeout(() => {
    isInitializing.value = false
    console.log('✅ App ready')
  }, 300)
})
</script>

<template>
  <!-- Pantalla de carga inicial (solo 300ms) -->
  <LoadingSpinner 
    v-if="isInitializing" 
    fullscreen 
    size="xl" 
    text="Cargando Sistema..." 
  />

  <!-- Layout vacío para login y páginas públicas -->
  <router-view v-else-if="isEmptyLayout" />

  <!-- Layout principal con navbar, sidebar y footer -->
  <div v-else class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
    <Navbar @toggle-sidebar="toggleSidebar" />
    
    <div class="flex flex-1 pt-16">
      <Sidebar :is-open="sidebarOpen" @close="closeSidebar" />
      
      <main class="flex-1 lg:ml-64 transition-all duration-300">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-view />
        </div>
        <Footer />
      </main>
    </div>
  </div>
</template>

<style>
/* Estilos globales opcionales */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: #f1f1f1;
}

*::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

*::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>