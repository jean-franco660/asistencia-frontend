<template>
  <ModalComponent
    :model-value="isOpen"
    title=""
    size="lg"
    :hideHeader="true"
    :noPadding="true"
    @close="$emit('close')"
    @update:model-value="$emit('close')"
    class="asistencia-modal-custom"
  >
    <div v-if="marcacion">
      
      <!-- Header Mejorado - Limpio y profesional -->
      <div class="relative bg-gray-800 dark:bg-gray-900 p-6 overflow-hidden">
        
        <div class="relative z-10 space-y-5">
          <!-- Top row: Close button only -->
          <div class="flex items-center justify-end">
            <button
              @click="$emit('close')"
              class="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Nombre del colaborador con badges -->
          <div>
            <h3 class="text-3xl font-bold text-white mb-3">
              {{ marcacion.asistencia?.usuario?.apellido_paterno }} {{ marcacion.asistencia?.usuario?.nombres }}
            </h3>
            <div class="flex flex-wrap items-center gap-2">
              <!-- Badge de tipo (ENTRADA/SALIDA) -->
              <span 
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md"
                :class="marcacion.tipo === 'ENTRADA' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ marcacion.tipo }}
              </span>
              <!-- Badge de estado -->
              <span 
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md"
                :class="getStatusDisplay(marcacion).class"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ getStatusDisplay(marcacion).text }}
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-blue-600/20 rounded-lg">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 font-medium">Institución</p>
                <p class="text-sm font-semibold text-white">
                  <span class="text-blue-400 font-bold text-xs">I.E.</span> {{ marcacion.asistencia?.institucion?.nombre }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-purple-600/20 rounded-lg">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 font-medium">Fecha y Hora</p>
                <p class="text-sm font-semibold text-white">
                  {{ formatDate(marcacion.marcada_en) }}
                </p>
                <p class="text-sm font-bold text-white">
                  {{ formatTime(marcacion.marcada_en) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Body Content with padding -->
      <div class="p-6 space-y-6">
        <!-- Main Content Grid - Mejorado con mejores sombras y efectos hover -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Ubicación - Mejorada -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 space-y-4">
          <div class="flex items-center gap-2 mb-4">
            <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">Ubicación GPS</h4>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Latitud</span>
              <span class="text-sm font-mono font-semibold text-gray-900 dark:text-white">{{ formatCoord(marcacion.latitud) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Longitud</span>
              <span class="text-sm font-mono font-semibold text-gray-900 dark:text-white">{{ formatCoord(marcacion.longitud) }}</span>
            </div>
          </div>
          
          <a 
            v-if="marcacion.latitud && marcacion.longitud"
            :href="getMapaUrl(marcacion.latitud, marcacion.longitud)" 
            target="_blank"
            class="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 hover:scale-105"
            aria-label="Ver ubicación en Google Maps"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Ver en Google Maps
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <!-- Motivo - Mejorado con mejor diseño -->
          <div v-if="marcacion.motivo" class="mt-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-l-4 border-yellow-500 rounded-xl p-4" role="alert">
            <div class="flex items-start gap-3">
              <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex-shrink-0">
                <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide mb-1">Motivo Detectado</p>
                <p class="text-sm font-medium text-yellow-800 dark:text-yellow-300">{{ marcacion.motivo }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Evidencia - Mejorada con mejor presentación -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex items-center gap-2 mb-4">
            <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">Evidencia Fotográfica</h4>
          </div>
          
          <!-- Image Container - Mejorado con sombras y efectos -->
          <div v-if="marcacion.foto_url || marcacion.tipo === 'ENTRADA'" class="relative group cursor-pointer" @click="openLightbox">
            <div class="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-xl">
              
              <!-- Loading State - Mejorado -->
              <div v-if="imageState.loading" class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <svg class="w-12 h-12 text-blue-500 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">Cargando imagen...</p>
              </div>

              <!-- Error State - Mejorado -->
              <div v-if="imageState.error" class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 text-center p-6" role="alert">
                <div class="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                  <svg class="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p class="text-sm font-bold text-red-700 dark:text-red-400 mb-2">Error al cargar la imagen</p>
                <p class="text-xs text-red-600 dark:text-red-500 mb-4">No se pudo cargar la evidencia fotográfica</p>
                <button 
                  @click="retryLoadImage"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reintentar
                </button>
              </div>

              <!-- Actual Image - Con efecto hover -->
              <img 
                v-show="!imageState.loading && !imageState.error"
                :key="imageKey"
                :src="imageUrl" 
                :alt="`Evidencia de marcación de ${marcacion.asistencia?.usuario?.nombres || 'colaborador'}`"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                @load="handleImageLoad"
                @error="handleImageError"
              >
              
              <!-- Overlay on hover -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span class="text-white text-sm font-semibold">Click para ampliar</span>
              </div>
            </div>
          </div>

          <!-- No Photo - Mejorado -->
          <div v-if="!marcacion.foto_url && marcacion.tipo !== 'ENTRADA'" class="aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div class="p-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
              <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Sin fotografía</p>
          </div>
        </div>
      </div>



      <!-- Sección de Revisión - Mejorada -->
      <div class="bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-5">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Revisión y Validación</h3>
        </div>
        
        <!-- Warning Alert - Mejorado -->
        <div v-if="form.estado_revision === 'MANTENER_OBSERVADA'" class="relative overflow-hidden bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-l-4 border-yellow-500 rounded-xl p-4 shadow-md animate-in slide-in-from-top" role="alert">
          <div class="flex gap-3">
            <div class="flex-shrink-0">
              <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div>
              <p class="text-sm font-bold text-yellow-800 dark:text-yellow-300 mb-1">⚠️ Acción Importante</p>
              <p class="text-sm text-yellow-700 dark:text-yellow-400">
                Al guardar como <strong>"Observada"</strong>, se actualizará automáticamente el estado de la asistencia. Esta acción puede afectar reportes y cálculos.
              </p>
            </div>
          </div>
        </div>

        <!-- Estado de Revisión - Mejorado con cards -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Estado de Revisión</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Pendiente -->
            <label 
              class="relative flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-102"
              :class="[
                form.estado_revision === 'PENDIENTE' 
                  ? 'border-gray-500 bg-gray-50 dark:bg-gray-800 shadow-md' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
                { 'opacity-50 cursor-not-allowed': isReadOnly }
              ]"
            >
              <input 
                type="radio" 
                v-model="form.estado_revision" 
                value="PENDIENTE" 
                class="w-5 h-5 text-gray-600"
                :disabled="isReadOnly"
                aria-label="Marcar como pendiente"
              >
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Pendiente</span>
              </div>
              <div v-if="form.estado_revision === 'PENDIENTE'" class="absolute top-2 right-2">
                <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </label>

            <!-- Aprobada -->
            <label 
              class="relative flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-102"
              :class="[
                form.estado_revision === 'APROBADA' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md shadow-green-500/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300',
                { 'opacity-50 cursor-not-allowed': isReadOnly }
              ]"
            >
              <input 
                type="radio" 
                v-model="form.estado_revision" 
                value="APROBADA" 
                class="w-5 h-5 text-green-600"
                :disabled="isReadOnly"
                aria-label="Aprobar marcación"
              >
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-bold text-green-700 dark:text-green-400">Aprobada</span>
              </div>
              <div v-if="form.estado_revision === 'APROBADA'" class="absolute top-2 right-2">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </label>

            <!-- Observada -->
            <label 
              class="relative flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-102"
              :class="[
                form.estado_revision === 'MANTENER_OBSERVADA' 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md shadow-red-500/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-red-300',
                { 'opacity-50 cursor-not-allowed': isReadOnly }
              ]"
            >
              <input 
                type="radio" 
                v-model="form.estado_revision" 
                value="MANTENER_OBSERVADA" 
                class="w-5 h-5 text-red-600"
                :disabled="isReadOnly"
                aria-label="Rechazar marcación"
              >
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-bold text-red-700 dark:text-red-400">Observada</span>
              </div>
              <div v-if="form.estado_revision === 'MANTENER_OBSERVADA'" class="absolute top-2 right-2">
                <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </label>
          </div>
        </div>

        <!-- Observación - Mejorada -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Observación del Supervisor
            </span>
          </label>
          <textarea 
            v-model="form.observacion" 
            rows="4"
            class="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
            placeholder="Ingrese un comentario detallado justificando la decisión de revisión..."
            :disabled="isReadOnly"
            aria-label="Observación del supervisor"
          ></textarea>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Proporcione detalles específicos que justifiquen su decisión de revisión.
          </p>
        </div>

        <!-- Footer - Mejorado con mejor diseño de botones -->
        <div class="flex items-center justify-between gap-4 pt-5 border-t-2 border-gray-200 dark:border-gray-700">
          <!-- Navegación -->
          <div v-if="reviewQueueLength > 1" class="flex items-center gap-3">
            <button
              @click="$emit('navigate', 'prev')"
              :disabled="currentReviewIndex === 0"
              class="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Revisión anterior"
            >
              <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <div class="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <span class="text-sm font-bold text-gray-900 dark:text-white">
                {{ currentReviewIndex + 1 }}
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-400 mx-1">/</span>
              <span class="text-sm font-bold text-gray-900 dark:text-white">
                {{ reviewQueueLength }}
              </span>
            </div>

            <button
              @click="$emit('navigate', 'next')"
              :disabled="currentReviewIndex === reviewQueueLength - 1"
              class="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Siguiente revisión"
            >
              Siguiente
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div v-else></div>

          <!-- Acciones - Mejoradas con gradientes y sombras -->
          <div class="flex gap-3">
            <button 
              @click="$emit('close')"
              class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </button>
            
            <button 
              @click="saveReview"
              :disabled="saving"
              class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
            >
              <svg v-if="saving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {{ saving ? 'Guardando...' : 'Guardar Revisión' }}
            </button>
            
            <button
              v-if="reviewQueueLength > 0"
              @click="approveAndNext"
              :disabled="saving"
              class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105"
            >
              <svg v-if="saving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ saving ? 'Aprobando...' : 'Aprobar y Siguiente' }}
            </button>
          </div>
        </div>
        </div>
      </div>
      
      <!-- Lightbox / Expanded Image Overlay -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="isExpanded && !imageState.error && !imageState.loading"
            class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            @click="isExpanded = false"
          >
            <button 
              class="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-10"
              @click.stop="isExpanded = false"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img 
              :src="imageUrl" 
              class="max-w-full max-h-screen object-contain rounded-lg shadow-2xl transition-transform duration-300 transform scale-100"
              :alt="`Evidencia ampliada`"
              @click.stop
            />
          </div>
        </Transition>
      </Teleport>

    </div>
  </ModalComponent>
</template>

<script setup>
import { computed, ref, watch, reactive } from 'vue';
import ModalComponent from '../../ui/ModalComponent.vue';
import { asistenciasService } from '@/services/api';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/store/auth';

const props = defineProps({
  isOpen: Boolean,
  marcacion: Object, 
  reviewQueueLength: {
    type: Number,
    default: 0
  },
  currentReviewIndex: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close', 'saved', 'navigate', 'approve-and-next']);

const authStore = useAuthStore();

const form = ref({
  estado_revision: 'PENDIENTE',
  observacion: ''
});
const saving = ref(false);

// Image State Logic
const imageState = reactive({
  loading: true,
  error: false,
  retryCount: 0,
  maxRetries: 3,
  retryTimeout: null
});

const imageKey = ref(0);
const imageUrl = ref('');
const isExpanded = ref(false); // Valid state for expansion

// Reset image state when marcacion changes
watch(() => props.marcacion, (newVal) => {
  if (newVal) {
    form.value.estado_revision = newVal.estado_revision || 'PENDIENTE';
    form.value.observacion = newVal.revision_observacion || '';
    
    // Reset Image State
    imageUrl.value = getFotoUrl(newVal);
    imageState.loading = !!(newVal.foto_url || newVal.tipo === 'ENTRADA');
    imageState.error = false;
    imageState.retryCount = 0;
    imageKey.value++;
    if (imageState.retryTimeout) clearTimeout(imageState.retryTimeout);
  }
}, { immediate: true });

// Watch for estado_revision changes
watch(() => form.value.estado_revision, async (newVal, oldVal) => {
  if (newVal === 'MANTENER_OBSERVADA' && oldVal === 'APROBADA') {
    const result = await Swal.fire({
      title: '¿Cambiar estado de validación?',
      text: 'Al marcar como "Observada", se actualizará automáticamente el estado de la asistencia.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    });
    
    if (!result.isConfirmed) {
      form.value.estado_revision = oldVal;
    }
  }
});

const openLightbox = () => {
  if (!imageState.loading && !imageState.error) {
    isExpanded.value = true;
  }
};

const handleImageLoad = () => {
  imageState.loading = false;
  imageState.error = false;
};

const handleImageError = () => {
  if (imageState.retryCount < imageState.maxRetries) {
    imageState.retryCount++;
    imageState.retryTimeout = setTimeout(() => {
      retryLoadImage();
    }, 1000 * imageState.retryCount);
  } else {
    imageState.loading = false;
    imageState.error = true;
    console.error('❌ Image load failed:', {
      url: imageUrl.value,
      timestamp: new Date(),
      retries: imageState.retryCount
    });
  }
};

const retryLoadImage = () => {
  imageState.error = false;
  imageState.loading = true;
  imageState.retryCount = 0;
  imageKey.value++;
  
  const url = getFotoUrl(props.marcacion);
  const timestamp = new Date().getTime();
  imageUrl.value = url.includes('?') ? `${url}&_t=${timestamp}` : `${url}?_t=${timestamp}`;
};

const isReadOnly = computed(() => {
  const supervisorRoles = ['super_admin', 'administrador', 'supervisor'];
  const userRole = authStore.user?.rol;
  
  return !supervisorRoles.includes(userRole) && 
         props.marcacion?.estado_revision === 'APROBADA';
});

const saveReview = async () => {
  if (!props.marcacion?.id) return;
  
  saving.value = true;
  try {
     const payload = {
        ...form.value,
        metadata: {
          usuario_id: authStore.user?.id,
          rol: authStore.user?.rol,
          timestamp: new Date().toISOString(),
          estado_anterior: props.marcacion.estado_revision,
          impacta_asistencia: form.value.estado_revision === 'MANTENER_OBSERVADA'
        }
     };

     console.log('💾 Guardando revisión:', payload);
     
     const response = await asistenciasService.updateReview(props.marcacion.id, payload);
     
     await Swal.fire({
       icon: 'success',
       title: '¡Guardado!',
       text: 'La revisión se guardó correctamente',
       timer: 1500,
       showConfirmButton: false
     });
     
     emit('saved');
     emit('close');
  } catch (error) {
    console.error("❌ Error saving review:", error);
    
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error
      || 'Error al guardar la revisión';
    
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#3B82F6'
    });
  } finally {
    saving.value = false;
  }
};

const approveAndNext = async () => {
  if (!props.marcacion?.id) return;
  
  saving.value = true;
  try {
     const payload = {
       estado_revision: 'APROBADA',
       observacion: form.value.observacion || 'Aprobada automáticamente',
       metadata: {
          usuario_id: authStore.user?.id,
          rol: authStore.user?.rol,
          timestamp: new Date().toISOString(),
          accion: 'approve_and_next'
       }
     };

     const response = await asistenciasService.updateReview(props.marcacion.id, payload);
     
     emit('approve-and-next');
  } catch (error) {
    console.error("❌ Error approving review:", error);
    
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error
      || 'Error al aprobar la revisión';
    
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#3B82F6'
    });
  } finally {
    saving.value = false;
  }
};

const getFotoUrl = (marcacion) => {
  if (marcacion?.foto_url) {
     const apiUrl = import.meta.env.VITE_API_BASE_URL;
     const baseUrl = apiUrl.replace(/\/api\/v1\/web\/?$/, ""); 
     return `${baseUrl}/storage/${marcacion.foto_url}`;
  }
  return '';
};

const getMapaUrl = (lat, lon) => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-PE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'UTC' 
  });
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('es-PE', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'America/Lima' 
  });
};

const formatCoord = (val) => {
  return val ? parseFloat(val).toFixed(6) : '—';
};

const getStatusDisplay = (marcacion) => {
  if (marcacion.estado_revision === 'APROBADA') {
    return {
      text: 'VALIDADA',
      class: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30'
    };
  }
  
  if (marcacion.estado_revision === 'MANTENER_OBSERVADA') {
    return {
      text: 'OBSERVADA',
      class: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-500/30'
    };
  }

  switch (marcacion.estado_marcacion) {
    case 'VALIDA': 
      return { 
        text: 'VALIDA', 
        class: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30' 
      };
    case 'OBSERVADA':
      return { 
        text: 'OBSERVADA', 
        class: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/30' 
      };
    case 'ANULADA':
      return { 
        text: 'ANULADA', 
        class: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/30' 
      };
    default:
      return { 
        text: marcacion.estado_marcacion, 
        class: 'bg-gray-500 text-white' 
      };
  }
};
</script>

<style scoped>
/* Ocultar el header del modal base ya que tenemos uno personalizado */
:deep(.modal-header) {
  display: none !important;
}

/* Asegurar que el modal tenga el padding correcto */
:deep(.modal-body) {
  padding: 0 !important;
}
</style>