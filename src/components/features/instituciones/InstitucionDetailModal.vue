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
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-900"></div>
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-600 dark:border-t-indigo-400 absolute top-0 left-0"></div>
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
        class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
      >
        Reintentar
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="institucion">
      
      <!-- Banner Header -->
      <div class="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-2xl">
        <!-- Close Button -->
        <button
          @click="close"
          class="absolute top-4 right-4 z-20 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 hover:scale-110"
        >
          <X :size="24" />
        </button>
        <!-- Efectos decorativos -->
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-400 opacity-10 rounded-full blur-3xl"></div>
        
        <!-- Patrón de fondo -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
        </div>

        <div class="relative z-10">
          <!-- Kicker -->
          <p class="text-indigo-200 text-sm font-semibold uppercase tracking-wide mb-4">Detalle de Institución</p>
          
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Logo -->
          <div class="flex-shrink-0 bg-white p-2 rounded-xl shadow-sm">
            <img 
              v-if="institucion.logo" 
              :src="`/storage/${institucion.logo}`" 
              alt="Logo Institución" 
              class="w-20 h-20 object-contain"
            />
            <div v-else class="w-20 h-20 bg-indigo-50 flex items-center justify-center rounded text-indigo-200">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          </div>

          <!-- Info Principal -->
          <div class="text-center sm:text-left flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
             <h3 class="text-2xl font-bold leading-tight"><span class="text-blue-500 dark:text-blue-400">I.E.</span> {{ institucion.nombre }}</h3>
              <span class="px-2 py-1 bg-white/20 text-xs font-mono rounded backdrop-blur-md border border-white/20">
                #{{ institucion.id }}
              </span>
            </div>
            
            <p class="text-indigo-200 font-mono mt-1 text-sm bg-white/10 inline-block px-2 py-0.5 rounded">
              CÓD: {{ institucion.codigo_modular_ie }}
            </p>

            <div class="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30">
                {{ institucion.nivel_educativo || 'Nivel No Esp.' }}
              </span>
              <span 
                class="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30"
                :class="getTipoGestionClass(institucion.tipo_gestion, true)"
              >
                {{ institucion.tipo_gestion || 'Gestión No Esp.' }}
              </span>
            </div>
          </div>
          </div>
        </div>
      </div>

      <!-- Content Body -->
      <div class="px-6 pb-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Ubicación Card -->
        <div class="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
          <h4 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Ubicación & Geofence
          </h4>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 border-dashed last:border-0 hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded transition-colors">
              <span class="text-sm text-gray-500">Distrito</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ institucion.distrito || '—' }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 border-dashed last:border-0 hover:bg-white p-2 rounded transition-colors">
              <span class="text-sm text-gray-500">Coordenadas</span>
              <div class="text-right">
                <div class="text-xs font-mono text-gray-600 dark:text-gray-300">Lat: {{ institucion.latitud || '—' }}</div>
                <div class="text-xs font-mono text-gray-600 dark:text-gray-300">Lon: {{ institucion.longitud || '—' }}</div>
              </div>
            </div>

            <div class="flex justify-between items-center py-2 hover:bg-white p-2 rounded transition-colors">
              <span class="text-sm text-gray-500">Radio Permitido</span>
              <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold dark:bg-blue-900/40 dark:text-blue-300">
                {{ institucion.radio || 0 }} metros
              </span>
            </div>
            
            <!-- Map Link -->
            <a 
              v-if="institucion.latitud && institucion.longitud"
              :href="`https://www.google.com/maps/search/?api=1&query=${institucion.latitud},${institucion.longitud}`"
              target="_blank"
              class="block w-full text-center py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-blue-600 dark:text-blue-300 font-medium hover:bg-blue-50 dark:hover:bg-gray-500 transition-colors mt-2"
            >
              Ver Ubicación en Mapa
            </a>
          </div>
        </div>

        <!-- Estadísticas Card -->
        <div class="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
          <h4 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Métricas
          </h4>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 text-center">
              <div class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{{ institucion.usuarios_count || 0 }}</div>
              <div class="text-xs text-gray-500 uppercase tracking-wide mt-1">Docentes</div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 text-center">
              <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ institucion.horarios_count || 0 }}</div>
              <div class="text-xs text-gray-500 uppercase tracking-wide mt-1">Horarios</div>
            </div>
          </div>

          <div class="pt-4 mt-2 border-t border-gray-200 dark:border-gray-600">
            <div class="flex justify-between items-center text-xs text-gray-400">
              <span>Creado el:</span>
              <span>{{ formatDate(institucion.created_at) }}</span>
            </div>
            <div class="flex justify-between items-center text-xs text-gray-400 mt-1">
              <span>Última mod:</span>
              <span>{{ formatDate(institucion.updated_at) }}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </ModalComponent>
</template>

<script setup>
import { ref, watch } from 'vue';
import { institucionesService } from '@/services/api';
import { X } from 'lucide-vue-next';
import ModalComponent from '../../ui/ModalComponent.vue';
// Fix: Import X icon for close button (v2)

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  institucionId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['close']);

const institucion = ref(null);
const loading = ref(false);
const error = ref(null);

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.institucionId) {
    fetchDetail();
  } else if (!newVal) {
    institucion.value = null;
    error.value = null;
  }
});

const fetchDetail = async () => {
  if (!props.institucionId) return;

  loading.value = true;
  error.value = null;

  try {
    const response = await institucionesService.getById(props.institucionId);
    institucion.value = response.data;
  } catch (err) {
    console.error('Error fetching institucion detail:', err);
    error.value = 'No se pudo cargar el detalle de la institución.';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit('close');
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getTipoGestionClass = (tipo, isHeader = false) => {
  const t = (tipo || '').toUpperCase();
  
  if (isHeader) {
     // For the header (white text context)
     if (t === 'PUBLICA') return 'bg-green-500/20 text-green-100 border-green-400/30';
     if (t === 'PRIVADA') return 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30';
     return 'bg-gray-500/20 text-gray-100 border-gray-400/30';
  }

  // Fallback for other contexts if needed
  if (t === 'PUBLICA') return 'bg-green-100 text-green-700';
  if (t === 'PRIVADA') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
};
</script>
