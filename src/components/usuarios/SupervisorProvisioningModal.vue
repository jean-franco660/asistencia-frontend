<template>
  <transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('close')"
      @keydown.esc="$emit('close')"
    >
      <!-- Glow Effects -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-3xl opacity-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl opacity-20 pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <!-- Main Card -->
      <div
        class="relative w-full max-w-5xl bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div>
            <h2 class="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400">
              Provisionar Supervisor
            </h2>
            <p class="text-sm text-white/60">Promover un usuario de la App a Supervisor Web</p>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          <!-- LEFT COLUMN: Search & Results -->
          <div class="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-black/20">
            <div class="p-4 space-y-4">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="searchQuery"
                  @input="handleSearch"
                  ref="searchInput"
                  type="text"
                  placeholder="Buscar por código o nombre..."
                  class="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <!-- Loader -->
            <div v-if="loadingSearch" class="flex-1 flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>

            <!-- Results List -->
            <div v-else class="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div
                v-for="user in searchResults"
                :key="user.id"
                @click="selectCandidate(user)"
                class="group p-3 rounded-xl cursor-pointer transition-all border border-transparent"
                :class="selectedCandidate?.id === user.id ? 'bg-indigo-500/20 border-indigo-500/50' : 'hover:bg-white/5'"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-medium text-white group-hover:text-indigo-300 transition-colors">
                      {{ user.apellido_paterno }} {{ user.apellido_materno }}, {{ user.nombres }}
                    </h3>
                    <p class="text-xs text-white/50 bg-white/5 inline-block px-2 py-0.5 rounded mt-1">
                      {{ user.codigo_modular }}
                    </p>
                  </div>
                  <div v-if="user.has_supervisor_web" class="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg border border-yellow-500/30">
                    Ya asignado
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="!loadingSearch && searchQuery && searchResults.length === 0" class="text-center py-8 text-white/40">
                No se encontraron resultados
              </div>
              <div v-if="!searchQuery && searchResults.length === 0" class="text-center py-8 text-white/30 text-sm">
                Ingresa un nombre o código para buscar
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: User Details & Form -->
          <div class="w-full lg:w-2/3 flex-1 overflow-y-auto bg-slate-900/50 relative">
            <div v-if="loadingDetails" class="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
              <div class="flex flex-col items-center">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mb-2"></div>
                <span class="text-cyan-400 text-sm">Cargando detalles...</span>
              </div>
            </div>

            <div v-if="selectedCandidate" class="p-6 space-y-8">
              
              <!-- Selected User Badge -->
              <div class="flex items-center gap-4 pb-6 border-b border-white/10">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {{ selectedCandidate.nombres.charAt(0) }}
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">
                    {{ selectedCandidate.nombres }} {{ selectedCandidate.apellido_paterno }}
                  </h3>
                  <div class="flex gap-2 mt-1">
                    <span class="px-2 py-0.5 rounded bg-white/10 text-xs text-white/70 border border-white/5">
                      {{ selectedCandidate.codigo_modular }}
                    </span>
                    <span 
                      v-if="selectedCandidate.has_supervisor_web"
                      class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-xs border border-red-500/30"
                    >
                      Usuario Web Existente
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="selectedCandidate.has_supervisor_web" class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                 <p class="text-yellow-200 text-sm flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    Este usuario ya tiene una cuenta de supervisor. No se puede provisionar nuevamente.
                 </p>
              </div>

              <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                
                <!-- Credentials Section -->
                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-white/90 flex items-center gap-2">
                    <svg class="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 19l-1 1-6-6 1-1 3.486-4.514A6.002 6.002 0 0115 7z"/></svg>
                    Credenciales de Acceso
                  </h4>
                  
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-white/70">Correo Electrónico</label>
                      <input
                        v-model="form.email"
                        type="email"
                        required
                        class="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        placeholder="usuario@ejemplo.com"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-white/70">Contraseña</label>
                      <input
                        v-model="form.password"
                        type="password"
                        required
                        minlength="8"
                        class="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                  </div>
                </div>

                <!-- Institutions Section -->
                <div class="space-y-4 pt-4 border-t border-white/10">
                   <div class="flex justify-between items-center">
                      <h4 class="text-lg font-semibold text-white/90 flex items-center gap-2">
                        <svg class="w-5 h-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        Instituciones Asignadas
                      </h4>
                      <label class="flex items-center gap-2 text-xs text-white/60 cursor-pointer hover:text-white transition-colors">
                        <input type="checkbox" v-model="showPendingInstitutions" class="rounded border-white/20 bg-white/10 text-fuchsia-500 focus:ring-fuchsia-500/50">
                        Mostrar pendientes/inactivas
                      </label>
                   </div>
                   
                   <p class="text-sm text-white/50">
                     Selecciona las instituciones a las que tendrá acceso el supervisor. Las activas se seleccionan por defecto.
                   </p>

                   <div class="space-y-2">
                      <div v-for="inst in visibleInstitutions" :key="inst.id" 
                           class="flex items-center p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                           :class="{'opacity-60': inst.pivot.estado !== 'ACTIVO' && !form.institucion_ids.includes(inst.id)}">
                         <label class="flex items-center gap-3 w-full cursor-pointer">
                            <input 
                              type="checkbox" 
                              :value="inst.id" 
                              v-model="form.institucion_ids"
                              :disabled="inst.pivot.estado === 'INACTIVO'"
                              class="w-5 h-5 rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-cyan-500/50 disabled:opacity-50"
                            >
                            <div class="flex-1">
                               <div class="flex justify-between">
                                  <span class="text-white font-medium">{{ inst.nombre }}</span>
                                  <span class="text-xs px-2 py-0.5 rounded border"
                                    :class="{
                                       'bg-green-500/20 text-green-300 border-green-500/30': inst.pivot.estado === 'ACTIVO',
                                       'bg-yellow-500/20 text-yellow-300 border-yellow-500/30': inst.pivot.estado === 'PENDIENTE',
                                       'bg-red-500/20 text-red-300 border-red-500/30': inst.pivot.estado === 'INACTIVO',
                                    }">
                                     {{ inst.pivot.estado }}
                                  </span>
                               </div>
                               <span class="text-xs text-white/40">{{ inst.codigo_modular_ie }}</span>
                            </div>
                         </label>
                      </div>
                      
                      <div v-if="visibleInstitutions.length === 0" class="text-center py-4 text-white/30 text-sm italic">
                         No hay instituciones disponibles para mostrar.
                      </div>
                   </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-xl text-sm animate-pulse">
                   {{ error }}
                </div>

                <!-- Actions -->
                <div class="pt-6 flex justify-end gap-3">
                   <button 
                     type="button" 
                     @click="$emit('close')"
                     class="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium"
                   >
                     Cancelar
                   </button>
                   <button 
                     type="submit"
                     :disabled="isSubmitting || form.institucion_ids.length === 0"
                     class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 text-white font-bold shadow-lg shadow-indigo-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                   >
                     <span v-if="isSubmitting" class="flex items-center gap-2">
                        <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Provisionando...
                     </span>
                     <span v-else>Confirmar Provisionamiento</span>
                   </button>
                </div>

              </form>
            </div>

            <!-- Intro State -->
            <div v-else class="h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
               <svg class="w-24 h-24 mb-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
               <h3 class="text-xl font-medium text-white mb-2">Selecciona un candidato</h3>
               <p class="text-sm text-white/60 max-w-sm">Busca un usuario app en el panel izquierdo para ver sus detalles y comenzar el proceso.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import { provisioningService } from '../../services/api'; 
// Assuming api.js is 2 levels up relative to component/usuarios is incorrect based on structure being components/usuarios
// Actually component is in src/components/usuarios, api is in src/services. So ../../services/api is correct.

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'success']);

// State
const searchQuery = ref('');
const searchResults = ref([]);
const loadingSearch = ref(false);
const selectedCandidate = ref(null);
const loadingDetails = ref(false);
const institutions = ref([]);
const showPendingInstitutions = ref(false);

const form = reactive({
  email: '',
  password: '',
  institucion_ids: []
});

const isSubmitting = ref(false);
const error = ref('');
const searchInput = ref(null);

// Debounce for search
let debounceTimer = null;

const handleSearch = () => {
  clearTimeout(debounceTimer);
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }
  
  loadingSearch.value = true;
  debounceTimer = setTimeout(async () => {
    try {
      const { data } = await provisioningService.search(searchQuery.value);
      searchResults.value = data;
    } catch (e) {
      console.error(e);
      searchResults.value = [];
    } finally {
      loadingSearch.value = false;
    }
  }, 400);
};

// Select Candidate Logic
const selectCandidate = async (user) => {
  selectedCandidate.value = user;
  loadingDetails.value = true;
  error.value = '';
  // Reset form
  form.email = '';
  form.password = '';
  form.institucion_ids = [];
  institutions.value = [];

  try {
     const { data } = await provisioningService.getUsuarioApp(user.id);
     
     // Setup returned data
     const userData = data.usuario_app; // Detailed user with pivots
     institutions.value = userData.instituciones || [];
     
     // Pre-populate form
     form.email = data.suggested_email || ''; 
     
     // Pre-select Active institutions
     // From backend we might get 'default_institucion_ids' if we want strictly what backend suggests
     // But we can also derive it from the detailed institutions list
     if (data.default_institucion_ids) {
        form.institucion_ids = data.default_institucion_ids;
     }
     
  } catch (e) {
     console.error(e);
     error.value = "Error al cargar detalles del usuario.";
  } finally {
     loadingDetails.value = false;
  }
};

const visibleInstitutions = computed(() => {
   if (!selectedCandidate.value) return [];
   return institutions.value.filter(inst => {
      // Always show selected/active ones
      if (inst.pivot.estado === 'ACTIVO') return true;
      // Show others only if toggle is on
      return showPendingInstitutions.value;
   });
});

const handleSubmit = async () => {
   if (!selectedCandidate.value) return;
   
   isSubmitting.value = true;
   error.value = '';

   try {
      const payload = {
         usuario_app_id: selectedCandidate.value.id,
         email: form.email,
         password: form.password,
         institucion_ids: form.institucion_ids
      };

      const { data } = await provisioningService.provision(payload);
      
      emit('success', data.usuario_web);
      emit('close');
      
   } catch (e) {
      if (e.response?.status === 422) {
         error.value = Object.values(e.response.data.errors).flat().join(', ');
      } else if (e.response?.status === 409) {
         error.value = "El usuario ya fue provisionado (Conflicto de duplicidad).";
      } else {
         error.value = e.response?.data?.message || "Ocurrió un error al procesar la solicitud.";
      }
   } finally {
      isSubmitting.value = false;
   }
};

// Focus on open
watch(() => props.open, (val) => {
   if (val) {
      nextTick(() => {
         if (searchInput.value) searchInput.value.focus();
      });
      // Reset state
      searchQuery.value = '';
      searchResults.value = [];
      selectedCandidate.value = null;
      error.value = '';
   }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
