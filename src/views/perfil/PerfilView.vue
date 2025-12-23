<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mi Perfil
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Información personal y configuración de cuenta
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="user" class="space-y-6">
        <!-- Personal Information Card -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-6">
          <div class="flex items-center space-x-4 mb-6">
            <!-- Avatar -->
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {{ userInitials }}
            </div>
            
            <!-- Name and Role -->
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ user.nombre }}
              </h2>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 mt-1">
                {{ getRoleLabel(user.rol) }}
              </span>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="grid md:grid-cols-2 gap-4">
            <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.email }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Código Modular</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.codigo || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Institutions Card -->
        <div v-if="user.instituciones && user.instituciones.length > 0" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-6 4h1m4 0h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Instituciones Asignadas
          </h3>
          
          <div class="space-y-3">
            <div 
              v-for="inst in user.instituciones" 
              :key="inst.id"
              class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <div class="flex-1">
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ inst.nombre }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Código: {{ inst.codigo_modular_ie }}
                </p>
              </div>
              <div class="ml-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                  Activo
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <strong>Total:</strong> {{ user.instituciones.length }} institución{{ user.instituciones.length !== 1 ? 'es' : '' }}
            </p>
          </div>
        </div>

        <!-- Account Info -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Información de Cuenta
          </h3>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Estado de cuenta</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                Activo
              </span>
            </div>
            
            <div v-if="user.created_at" class="flex items-center justify-between py-2">
              <span class="text-gray-600 dark:text-gray-400">Fecha de registro</span>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ formatDate(user.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(true);

const user = computed(() => authStore.user);

const userInitials = computed(() => {
  const nombre = user.value?.nombre || '';
  return nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
});

const getRoleLabel = (rol) => {
  const roles = {
    super_admin: 'Super Administrador',
    administrador: 'Administrador',
    supervisor: 'Supervisor',
  };
  return roles[rol] || rol;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

onMounted(() => {
  // Verificar que el usuario sea supervisor
  if (user.value?.rol !== 'supervisor') {
    router.push('/dashboard');
    return;
  }
  
  loading.value = false;
});
</script>
