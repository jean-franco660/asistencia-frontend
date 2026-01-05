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
        class="relative w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300"
        :class="isProvisioningMode ? 'max-w-6xl' : 'max-w-2xl'"
      >
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/10 bg-white/5">
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400">
              {{ isEditMode ? 'Editar Supervisor' : 'Nuevo Supervisor' }}
            </h2>
            <p class="text-xs sm:text-sm text-white/60">
              {{ isEditMode ? 'Modificar datos del supervisor' : 'Crear o vincular un nuevo supervisor al sistema' }}
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors self-end sm:self-auto"
            aria-label="Cerrar modal"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mode Toggle (Only for Create) -->
        <div v-if="!isEditMode" class="flex border-b border-white/10">
          <button 
            @click="creationMode = 'manual'"
            class="flex-1 py-3 text-sm font-medium transition-colors relative"
            :class="creationMode === 'manual' ? 'text-white bg-white/5' : 'text-white/50 hover:text-white hover:bg-white/5'"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Creación Manual
            </div>
            <div v-if="creationMode === 'manual'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500"></div>
          </button>
          <button 
            @click="creationMode = 'provision'"
            class="flex-1 py-3 text-sm font-medium transition-colors relative"
            :class="creationMode === 'provision' ? 'text-white bg-white/5' : 'text-white/50 hover:text-white hover:bg-white/5'"
          >
            <div class="flex items-center justify-center gap-2">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.59-4.17M5.385 20.25h.01" /></svg>
              Vincular Docente (App)
            </div>
            <div v-if="creationMode === 'provision'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-fuchsia-500 to-cyan-500"></div>
          </button>
        </div>

        <!-- === CONTENT: MANUAL MODE & EDIT === -->
        <div v-if="!isProvisioningMode" class="p-6 overflow-y-auto max-h-[70vh]">
          <form @submit.prevent="handleManualSubmit" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Name -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/70">Nombre Completo <span class="text-red-400">*</span></label>
                <input
                  v-model="manualForm.nombre"
                  type="text"
                  required
                  class="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-white/20 shadow-inner"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              
              <!-- Email -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/70">Correo Electrónico <span class="text-red-400">*</span></label>
                <input
                  v-model="manualForm.email"
                  type="email"
                  required
                  class="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-white/20 shadow-inner"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <!-- Password -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/70">
                  {{ isEditMode ? 'Nueva Contraseña (Opcional)' : 'Contraseña' }} <span v-if="!isEditMode" class="text-red-400">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="manualForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    :required="!isEditMode"
                    minlength="8"
                    class="w-full bg-black/20 border border-white/10 rounded-xl p-3 pr-11 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-white/20 shadow-inner"
                    :placeholder="isEditMode ? 'Dejar vacío si no cambia' : 'Mínimo 8 caracteres'"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/70 transition-colors"
                    :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  >
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

               <!-- Password Confirm -->
              <div class="space-y-2" v-if="!isEditMode || manualForm.password">
                <label class="text-sm font-medium text-white/70">Confirmar Contraseña <span class="text-red-400">*</span></label>
                <div class="relative">
                  <input
                    v-model="manualForm.password_confirmation"
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    required
                    class="w-full bg-black/20 border border-white/10 rounded-xl p-3 pr-11 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-white/20 shadow-inner"
                    placeholder="Repetir contraseña"
                  />
                  <button
                    type="button"
                    @click="showPasswordConfirm = !showPasswordConfirm"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/70 transition-colors"
                    :aria-label="showPasswordConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  >
                    <svg v-if="!showPasswordConfirm" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Institutions Multiselect -->
            <div class="pt-4 border-t border-white/10 space-y-4">
              <h4 class="text-lg font-semibold text-white/90 flex items-center gap-2">
                  <svg class="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  Instituciones Asignadas
              </h4>
              
              <div class="relative">
                 <input 
                    v-model="instSearch"
                    type="text"
                    placeholder="Buscar y añadir instituciones..."
                     class="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-white/20 shadow-inner"
                    @focus="showInstDropdown = true"
                 />
                 <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>

                 <!-- Dropdown -->
                 <div v-if="showInstDropdown && (instSearch || availableInstitutions.length > 0)" class="absolute z-20 mt-2 w-full bg-slate-800 border border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    <div v-if="loadingInsts" class="p-3 text-center text-white/50 text-sm">Cargando...</div>
                    <div v-else-if="filteredInstitutions.length === 0" class="p-3 text-center text-white/50 text-sm">No se encontraron instituciones</div>
                    <button 
                       v-for="inst in filteredInstitutions" 
                       :key="inst.id"
                       type="button"
                       @click="toggleInstitution(inst)"
                       class="w-full text-left px-4 py-2 hover:bg-white/10 flex justify-between items-center group transition-colors"
                    >
                       <span class="text-sm text-white group-hover:text-cyan-300"><span class="text-cyan-400 font-semibold">I.E.</span> {{ inst.nombre }}</span>
                       <span class="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">{{ inst.codigo_modular_ie }}</span>
                    </button>
                 </div>
              </div>

              <!-- Selected Pills -->
              <div class="flex flex-wrap gap-2 min-h-[40px]">
                 <span v-if="manualForm.selectedInstitutions.length === 0" class="text-sm text-white/30 italic py-2">Ninguna institución seleccionada (el supervisor no verá nada)</span>
                 <div v-for="inst in manualForm.selectedInstitutions" :key="inst.id" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs">
                    <span class="text-cyan-400 font-semibold">I.E.</span> {{ inst.nombre }}
                    <button type="button" @click="removeInstitution(inst.id)" class="hover:text-white transition-colors">
                       <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                 </div>
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-xl text-sm animate-pulse">
               {{ error }}
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4">
               <button 
                  type="button" 
                  @click="$emit('close')"
                  class="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium"
               >
                  Cancelar
               </button>
               <button 
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                  <span v-if="isSubmitting" class="flex items-center gap-2">
                     <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     Guardando...
                  </span>
                  <span v-else>{{ isEditMode ? 'Guardar Cambios' : 'Crear Supervisor' }}</span>
               </button>
            </div>
          </form>
        </div>


        <!-- === CONTENT: PROVISION MODE === -->
        <div v-else class="flex flex-col lg:flex-row flex-1 overflow-hidden h-full min-h-[500px]">
           <!-- Search Column (Copying logic from ProvisioningModal) -->
           <div class="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-black/20">
               <div class="p-4 space-y-4">
                  <div class="relative">
                     <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                     <input
                        v-model="provSearchQuery"
                        @input="handleAppSearch"
                        type="text"
                        placeholder="Buscar docente..."
                         class="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-inner"
                     />
                  </div>
               </div>
               
               <div v-if="loadingProvSearch" class="flex-1 flex justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
               </div>

               <div v-else class="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
                  <div v-if="!provSearchQuery && provSearchResults.length === 0" class="text-center py-8 text-white/30 text-sm">Ingresa un nombre o código</div>
                  <div v-for="user in provSearchResults" :key="user.id" 
                       @click="selectAppCandidate(user)"
                       class="p-3 rounded-xl cursor-pointer transition-all border border-transparent"
                       :class="provSelected?.id === user.id ? 'bg-cyan-500/20 border-cyan-500/50' : 'hover:bg-white/5'"
                  >
                     <div class="flex justify-between items-start">
                        <div>
                           <h3 class="font-medium text-white text-sm">{{ user.nombre_completo }}</h3>
                           <p class="text-xs text-white/50 mt-1">{{ user.codigo_modular }}</p>
                        </div>
                        <div v-if="user.has_supervisor_web" class="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded border border-yellow-500/30">Ya existe</div>
                     </div>
                  </div>
               </div>
           </div>

           <!-- Details & Form Column -->
           <div class="w-full lg:w-2/3 flex-1 overflow-y-auto bg-slate-900/50 relative p-6">
              <div v-if="loadingDetails" class="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              </div>

              <div v-if="provSelected" class="space-y-6">
                  <!-- Header -->
                  <div class="flex items-center gap-4 pb-4 border-b border-white/10">
                     <div class="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white text-lg">{{ provSelected?.nombres?.charAt(0) || '?' }}</div>
                     <div>
                        <h3 class="text-xl font-bold text-white">{{ provSelected.nombres }} {{ provSelected.apellido_paterno }}</h3>
                        <p class="text-xs text-white/60">{{ provSelected.codigo_modular }}</p>
                     </div>
                  </div>

                  <div v-if="provSelected.has_supervisor_web" class="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-sm">
                     Este usuario ya tiene cuenta de supervisor.
                  </div>

                  <form v-else @submit.prevent="handleProvisionSubmit" class="space-y-5">
                     <div class="grid md:grid-cols-2 gap-4">
                        <div class="space-y-1">
                           <label class="text-sm font-medium text-white/70">Email</label>
                           <input v-model="provForm.email" type="email" required class="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-inner" />
                        </div>
                        <div class="space-y-1">
                           <label class="text-sm font-medium text-white/70">Password</label>
                           <div class="relative">
                             <input
                               v-model="provForm.password"
                               :type="showProvPassword ? 'text' : 'password'"
                               required
                               minlength="8"
                               class="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 pr-10 text-white focus:ring-1 focus:ring-cyan-500/50"
                               placeholder="Min 8 chars"
                             />
                             <button
                               type="button"
                               @click="showProvPassword = !showProvPassword"
                               class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/70 transition-colors"
                             >
                               <svg v-if="!showProvPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                               </svg>
                               <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                               </svg>
                             </button>
                           </div>
                        </div>
                     </div>

                     <!-- Institutions (Based on API response) -->
                     <div class="space-y-3">
                        <div class="flex justify-between items-center">
                           <label class="text-sm font-semibold text-white/90">Instituciones Vinculadas al Docente</label>
                           <label class="text-xs text-cyan-400 flex items-center gap-1.5 cursor-pointer hover:text-cyan-300 transition-colors">
                              <input type="checkbox" v-model="showAllProvInsts" class="rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-cyan-500/50">
                              Ver Inactivas
                           </label>
                        </div>
                        
                        <div class="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                           <div 
                              v-for="inst in visibleProvInsts" 
                              :key="inst.id" 
                              class="group relative flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-200"
                              :class="inst.pivot.estado === 'ACTIVO' 
                                 ? 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/50' 
                                 : 'border-gray-500/20 bg-gray-500/5 opacity-60'"
                           >
                              <input 
                                 type="checkbox" 
                                 :value="inst.id" 
                                 v-model="provForm.institucion_ids" 
                                 :disabled="inst.pivot.estado !== 'ACTIVO'" 
                                 class="mt-1 text-cyan-500 bg-black/40 border-white/20 rounded focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                              
                              <div class="flex-1 min-w-0">
                                 <div class="flex items-start justify-between gap-2 mb-1">
                                    <h4 class="text-sm font-semibold text-white leading-tight">
                                       <span class="text-cyan-400 font-bold">I.E.</span> {{ inst.nombre }}
                                    </h4>
                                    <span 
                                       class="flex-shrink-0 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wide"
                                       :class="inst.pivot.estado === 'ACTIVO' 
                                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'"
                                    >
                                       {{ inst.pivot.estado }}
                                    </span>
                                 </div>
                                 <p class="text-xs text-white/50 font-mono">
                                    Código: {{ inst.codigo_modular_ie }}
                                 </p>
                              </div>
                           </div>
                           
                           <div v-if="visibleProvInsts.length === 0" class="text-center py-8 px-4">
                              <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/5 flex items-center justify-center">
                                 <svg class="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                 </svg>
                              </div>
                              <p class="text-white/40 text-sm font-medium">
                                 {{ showAllProvInsts ? 'No hay instituciones vinculadas' : 'No hay instituciones activas' }}
                              </p>
                              <p class="text-white/30 text-xs mt-1">
                                 {{ showAllProvInsts ? '' : 'Marca "Ver Inactivas" para mostrar todas' }}
                              </p>
                           </div>
                        </div>
                     </div>

                     <div v-if="error" class="text-red-300 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">{{ error }}</div>

                     <div class="pt-2 flex justify-end gap-2">
                        <button type="button" @click="$emit('close')" class="px-4 py-2 text-white/70 hover:text-white">Cancelar</button>
                        <button type="submit" :disabled="isSubmitting" class="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg hover:brightness-110 disabled:opacity-50">
                           {{ isSubmitting ? 'Procesando...' : 'Vincular' }}
                        </button>
                     </div>
                  </form>
              </div>

              <div v-else class="h-full flex flex-col items-center justify-center text-white/30">
                 <p>Selecciona un docente del panel izquierdo</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { usuariosWebService, provisioningService, institucionesService } from '../../services/api'; 

const props = defineProps({
  open: { type: Boolean, required: true },
  supervisor: { type: Object, default: null }, // If present, EDIT mode
  mode: { type: String, default: 'create' } // 'create' | 'edit'
});

const emit = defineEmits(['close', 'success']);

// --- General State ---
const creationMode = ref('manual'); // 'manual' | 'provision'
const isEditMode = computed(() => props.mode === 'edit');
const isProvisioningMode = computed(() => !isEditMode.value && creationMode.value === 'provision');
const isSubmitting = ref(false);
const error = ref('');

// --- Manual Mode State ---
const manualForm = reactive({
   nombre: '',
   email: '',
   password: '',
   password_confirmation: '',
   selectedInstitutions: []
});
const instSearch = ref('');
const showInstDropdown = ref(false);
const availableInstitutions = ref([]);
const loadingInsts = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const showProvPassword = ref(false);

// --- Provision Mode State ---
const provSearchQuery = ref('');
const provSearchResults = ref([]);
const loadingProvSearch = ref(false);
const provSelected = ref(null);
const loadingDetails = ref(false);
const provAppInstitutions = ref([]);
const showAllProvInsts = ref(false);
const provForm = reactive({
   email: '',
   password: '',
   institucion_ids: []
});

// =======================================================
// MANUAL LOGIC
// =======================================================

// Fetch institutions for manual assignment
const fetchInstitutions = async (query = '') => {
  loadingInsts.value = true;
  try {
     const { data } = await institucionesService.searchMias(query);
     availableInstitutions.value = data;
  } catch(e) { console.error(e); }
  finally { loadingInsts.value = false; }
};

const filteredInstitutions = computed(() => {
   return availableInstitutions.value.filter(inst => 
      !manualForm.selectedInstitutions.some(sel => sel.id === inst.id)
   );
});

const toggleInstitution = (inst) => {
   manualForm.selectedInstitutions.push(inst);
   instSearch.value = '';
   // showInstDropdown.value = false; // Keep open for multi-select convenience? User preference.
};

const removeInstitution = (id) => {
   manualForm.selectedInstitutions = manualForm.selectedInstitutions.filter(i => i.id !== id);
};

const handleManualSubmit = async () => {
   isSubmitting.value = true;
   error.value = '';
   
   // Client-side validation
   if (manualForm.password && manualForm.password !== manualForm.password_confirmation) {
      error.value = "Las contraseñas no coinciden.";
      isSubmitting.value = false;
      return;
   }

   try {
      const payload = {
         nombre: manualForm.nombre,
         email: manualForm.email,
         rol: 'supervisor',
         institucion_ids: manualForm.selectedInstitutions.map(i => i.id)
      };
      
      if (manualForm.password) payload.password = manualForm.password;
      if (manualForm.password_confirmation) payload.password_confirmation = manualForm.password_confirmation;

      if (isEditMode.value) {
         await usuariosWebService.update(props.supervisor.id, payload);
      } else {
         await usuariosWebService.create(payload);
      }
      
      emit('success', isEditMode.value ? 'edit' : 'create');
      emit('close');
   } catch (e) {
      error.value = e.response?.data?.message || "Error al guardar supervisor.";
   } finally {
      isSubmitting.value = false;
   }
};

// =======================================================
// PROVISION LOGIC
// =======================================================

let debounceTimer = null;
const handleAppSearch = () => {
   clearTimeout(debounceTimer);
   if (!provSearchQuery.value || provSearchQuery.value.length < 2) {
      provSearchResults.value = [];
      return;
   }
   loadingProvSearch.value = true;
   debounceTimer = setTimeout(async () => {
      try {
         const { data } = await provisioningService.search(provSearchQuery.value);
         // Backend returns { data: [...] }, so we need to access data.data
         provSearchResults.value = data.data || data || [];
      } catch(e) { 
         console.error('Error searching app users:', e);
         provSearchResults.value = [];
      }
      finally { loadingProvSearch.value = false; }
   }, 400);
};

const selectAppCandidate = async (user) => {
   provSelected.value = user;
   loadingDetails.value = true;
   error.value = '';
   provForm.email = '';
   provForm.institucion_ids = [];
   
   try {
      const { data } = await provisioningService.getUsuarioApp(user.id);
      // Update provSelected with full data from API
      provSelected.value = {
         ...user,
         ...data.usuario_app,
         has_supervisor_web: data.has_supervisor_web
      };
      provAppInstitutions.value = data.instituciones || [];
      provForm.email = data.suggested_email;
      if (data.default_institucion_ids) provForm.institucion_ids = data.default_institucion_ids;
   } catch(e) { error.value = "Error obteniendo detalles"; }
   finally { loadingDetails.value = false; }
};

const visibleProvInsts = computed(() => {
   if (!provSelected.value) return [];
   return provAppInstitutions.value.filter(i => showAllProvInsts.value || i.pivot.estado === 'ACTIVO');
});

const handleProvisionSubmit = async () => {
   isSubmitting.value = true;
   error.value = '';
   try {
      const payload = {
         usuario_app_id: provSelected.value.id,
         email: provForm.email,
         password: provForm.password,
         institucion_ids: provForm.institucion_ids
      };
      const { data } = await provisioningService.provision(payload);
      emit('success', data.usuario_web);
      emit('close');
   } catch (e) {
      if (e.response?.status === 409) error.value = "Usuario ya provisionado.";
      else error.value = e.response?.data?.message || "Error provisionando.";
   } finally {
      isSubmitting.value = false;
   }
};

// =======================================================
// WATCHERS & INIT
// =======================================================
watch(() => props.open, (isOpen) => {
   if (isOpen) {
      // Reset State
      error.value = '';
      if (isEditMode.value && props.supervisor) {
         // Populate Manual Form
         manualForm.nombre = props.supervisor.nombre;
         manualForm.email = props.supervisor.email;
         manualForm.password = '';
         manualForm.password_confirmation = '';
         // Populate Institutions
         // Note: supervisor object must have 'instituciones' relation loaded. 
         // If SupervisoresListView doesn't load it, we might need a separate 'get' call here.
         // Assuming it's simple for now or passed in props.
         manualForm.selectedInstitutions = props.supervisor.instituciones || [];
         
         fetchInstitutions(); // Pre-load for add more
      } else {
         // Clear Manual
         manualForm.nombre = '';
         manualForm.email = '';
         manualForm.password = '';
         manualForm.selectedInstitutions = [];
         creationMode.value = 'manual';
         fetchInstitutions(); // Pre-load
         
         // Clear Provision
         provSearchQuery.value = '';
         provSearchResults.value = [];
         provSelected.value = null;
      }
   }
});

watch(instSearch, (val) => {
   fetchInstitutions(val);
});

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.open) {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
