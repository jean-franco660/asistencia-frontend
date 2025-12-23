<template>
  <ModalComponent
    :model-value="isOpen"
    title=""
    size="xl"
    :hideHeader="true"
    :noPadding="true"
    @close="close"
    @update:model-value="close"
  >
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 px-6">
      <div class="relative">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-900"></div>
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-t-purple-600 dark:border-t-purple-400 absolute top-0 left-0"></div>
      </div>
      <p class="mt-6 text-gray-600 dark:text-gray-300 font-medium">Cargando información...</p>
      <p class="mt-1 text-sm text-gray-400">Por favor espera un momento</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 px-6">
      <div class="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Error al cargar</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">{{ error }}</p>
      <button 
        @click="fetchDetail" 
        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
      >
        Reintentar
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="supervisor">
      
      <!-- Banner Header -->
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-700 to-fuchsia-800 p-8 text-white shadow-2xl">
        <!-- Close Button -->
        <button
          @click="close"
          class="absolute top-4 right-4 z-20 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 hover:scale-110"
        >
          <X :size="24" />
        </button>

        <!-- Efectos decorativos -->
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-fuchsia-400 opacity-10 rounded-full blur-3xl"></div>
        
        <!-- Patrón de fondo -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
        </div>
        
        <div class="relative z-10">
          <!-- Kicker -->
          <p class="text-purple-200 text-sm font-semibold uppercase tracking-wide mb-4">Detalle de Supervisor</p>
          
          <div class="flex flex-col md:flex-row md:items-start gap-6">
            <!-- Avatar inicial -->
            <div class="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center shadow-2xl">
              <span class="text-3xl font-black text-white">{{ getInitials(supervisor.nombre) }}</span>
            </div>
            
            <div class="flex-1">
              <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 class="text-3xl font-black mb-2 tracking-tight">{{ supervisor.nombre }}</h3>
                  <div class="flex flex-wrap items-center gap-3 text-purple-100">
                    <span class="inline-flex items-center gap-1.5 text-sm font-medium">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                      </svg>
                      {{ supervisor.email }}
                    </span>
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-2">
                  <span 
                    class="px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider backdrop-blur-md shadow-lg transition-transform hover:scale-105"
                    :class="getEstadoClass(supervisor.estado)"
                  >
                    <span class="inline-flex items-center gap-1.5">
                      <svg v-if="supervisor.estado === 'autorizado'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      <svg v-else-if="supervisor.estado === 'pendiente'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                      </svg>
                      {{ supervisor.estado }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Body -->
      <div class="px-6 pb-6 space-y-6">
        <!-- Grid de información -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Información General -->
          <div class="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">Información General</h4>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-start justify-between gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Nombre</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right">
                  {{ supervisor.nombre }}
                </span>
              </div>
              <div class="flex items-start justify-between gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Email</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right break-all">
                  {{ supervisor.email }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Registrado
                </div>
                <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ formatDateTime(supervisor.created_at) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Estado y Rol -->
          <div class="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">Estado y Rol</h4>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Rol</span>
                <span class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {{ supervisor.rol }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Estado</span>
                <span 
                  class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase"
                  :class="getEstadoBadgeClass(supervisor.estado)"
                >
                  {{ supervisor.estado }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Instituciones Asignadas -->
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">Instituciones Asignadas</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ supervisor.instituciones?.length || 0 }} {{ supervisor.instituciones?.length === 1 ? 'institución' : 'instituciones' }}
              </p>
            </div>
          </div>

          <div v-if="supervisor.instituciones?.length" class="space-y-3">
            <div 
              v-for="inst in supervisor.instituciones"
              :key="inst.id"
              class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                 <h5 class="font-bold text-base text-gray-900 dark:text-gray-100 truncate">
                   <span class="text-blue-600 dark:text-blue-400 font-bold">I.E.</span> {{ inst.nombre }}
                 </h5>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                  {{ inst.codigo_modular_ie || 'Sin código' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Estado Vacío -->
          <div v-else class="text-center py-12 rounded-xl bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <p class="text-base font-bold text-gray-700 dark:text-gray-300 mb-1">
              Sin instituciones
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Este supervisor no tiene instituciones asignadas
            </p>
          </div>
        </div>
      </div>
    </div>
  </ModalComponent>
</template>

<script setup>
import { ref, watch } from 'vue';
import { usuariosWebService } from '@/services/api';
import { X } from 'lucide-vue-next';
import ModalComponent from '../ui/ModalComponent.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  supervisorId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['close']);

const supervisor = ref(null);
const loading = ref(false);
const error = ref(null);

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.supervisorId) {
    fetchDetail();
  } else if (!newVal) {
    supervisor.value = null;
    error.value = null;
  }
});

const fetchDetail = async () => {
  if (!props.supervisorId) return;

  loading.value = true;
  error.value = null;

  try {
    const response = await usuariosWebService.getById(props.supervisorId);
    supervisor.value = response.data.data || response.data;
  } catch (err) {
    console.error('Error fetching supervisor detail:', err);
    error.value = 'No se pudo cargar el detalle del supervisor.';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit('close');
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'No disponible';
  const date = new Date(dateString);
  return date.toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getEstadoClass = (estado) => {
  const classes = {
    pendiente: 'bg-yellow-500/30 border-2 border-yellow-400/50 text-yellow-50',
    autorizado: 'bg-green-500/30 border-2 border-green-400/50 text-green-50',
    rechazado: 'bg-red-500/30 border-2 border-red-400/50 text-red-50'
  };
  return classes[estado] || 'bg-gray-500/30 border-2 border-gray-400/50 text-gray-50';
};

const getEstadoBadgeClass = (estado) => {
  const classes = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    autorizado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rechazado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };
  return classes[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
};
</script>
