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
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900"></div>
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 dark:border-t-blue-400 absolute top-0 left-0"></div>
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
        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
      >
        Reintentar
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="usuario">
      
      <!-- Banner Identidad Mejorado -->
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-2xl">
        <!-- Close Button -->
        <button
          @click="close"
          class="absolute top-4 right-4 z-20 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 hover:scale-110"
        >
          <X :size="24" />
        </button>
        <!-- Efectos decorativos -->
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-400 opacity-10 rounded-full blur-3xl"></div>
        
        <!-- Patrón de fondo -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
        </div>
        
        <div class="relative z-10">
          <!-- Kicker -->
          <p class="text-blue-200 text-sm font-semibold uppercase tracking-wide mb-4">Detalle de Usuario</p>
          
          <!-- Avatar inicial -->
          <div class="flex flex-col md:flex-row md:items-start gap-6">
            <div class="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center shadow-2xl">
              <span class="text-3xl font-black text-white">{{ usuario.iniciales }}</span>
            </div>
            
            <div class="flex-1">
              <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 class="text-3xl font-black mb-2 tracking-tight">{{ usuario.nombre_completo }}</h3>
                  <div class="flex flex-wrap items-center gap-3 text-blue-100">
                    <span class="inline-flex items-center gap-1.5 font-mono bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-semibold border border-white/20">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                      </svg>
                      {{ usuario.codigo_modular }}
                    </span>
                    <span class="text-blue-200">•</span>
                    <span class="inline-flex items-center gap-1.5 text-sm font-medium">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
                      </svg>
                      {{ usuario.dni || 'Sin DNI' }}
                    </span>
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-2">
                  <span 
                    class="px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider backdrop-blur-md shadow-lg transition-transform hover:scale-105"
                    :class="usuario.acceso_habilitado 
                      ? 'bg-green-500/30 border-2 border-green-400/50 text-green-50' 
                      : 'bg-red-500/30 border-2 border-red-400/50 text-red-50'"
                  >
                    <span class="inline-flex items-center gap-1.5">
                      <svg v-if="usuario.acceso_habilitado" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                      </svg>
                      {{ usuario.acceso_habilitado ? 'Habilitado' : 'Deshabilitado' }}
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
        <!-- Grid de Información Personal y Contacto -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Datos Personales -->
        <div class="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">Datos Personales</h4>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Apellidos</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right">
                {{ usuario.apellido_paterno }} {{ usuario.apellido_materno }}
              </span>
            </div>
            <div class="flex items-start justify-between gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Nombres</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right">
                {{ usuario.nombres }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Sexo</span>
              <span 
                class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase"
                :class="getSexoClass(usuario.sexo)"
              >
                {{ usuario.sexo_formateado || usuario.sexo || '—' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Datos de Contacto -->
        <div class="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">Información de Contacto</h4>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Teléfono
              </div>
              <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 font-mono">
                {{ usuario.telefono || '—' }}
              </span>
            </div>
            <div class="flex items-start justify-between gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
                Email
              </div>
              <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right break-all">
                {{ usuario.email || '—' }}
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
                {{ formatDateTime(usuario.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de Asignaciones -->
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
              {{ usuario.asignaciones?.length || 0 }} {{ usuario.asignaciones?.length === 1 ? 'asignación' : 'asignaciones' }}
            </p>
          </div>
        </div>

        <div v-if="usuario.asignaciones?.length" class="space-y-4">
          <div 
            v-for="(asig, index) in usuario.asignaciones"
            :key="index"
            class="group bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
          >
            <!-- Header de Asignación -->
            <div class="p-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/10 flex flex-wrap justify-between items-center gap-3 rounded-t-xl">
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="font-bold text-base text-gray-900 dark:text-gray-100 truncate">
                    {{ asig.institucion?.nombre_display || asig.institucion?.nombre }}
                  </h5>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                    </svg>
                    {{ asig.institucion?.codigo_modular_ie }}
                  </p>
                </div>
              </div>
              <span 
                class="px-4 py-2 rounded-xl text-xs font-bold uppercase border-2 shadow-sm"
                :class="getEstadoClass(asig.estado)"
              >
                {{ asig.estado }}
              </span>
            </div>

            <!-- Body de Asignación -->
            <div class="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
              <!-- Info Cargo/Fechas -->
              <div class="space-y-3">
                <div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                  <div class="w-8 h-8 rounded-lg bg-blue-500 dark:bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Cargo</p>
                    <p class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{{ asig.cargo }}</p>
                  </div>
                </div>
                
                <div v-if="asig.fecha_inicio" class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30">
                  <div class="w-8 h-8 rounded-lg bg-green-500 dark:bg-green-600 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Fecha Inicio</p>
                    <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ formatDate(asig.fecha_inicio) }}</p>
                  </div>
                </div>
                
                <div v-if="asig.fecha_fin" class="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-800/30">
                  <div class="w-8 h-8 rounded-lg bg-red-500 dark:bg-red-600 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Fecha Fin</p>
                    <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ formatDate(asig.fecha_fin) }}</p>
                  </div>
                </div>
              </div>

              <!-- Info Horario -->
              <div class="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-xl p-5 border-2 border-indigo-100 dark:border-indigo-800/30 h-full">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h6 class="text-sm font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-wide">
                    Horario Asignado
                  </h6>
                </div>
                
                <div v-if="asig.horario" class="space-y-3">
                  <div class="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">Turno</span>
                    <span class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ asig.horario.nombre_turno }}</span>
                  </div>
                  <div class="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">Horario</span>
                    <span class="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {{ asig.horario.hora_entrada?.substring(0,5) }} - {{ asig.horario.hora_salida?.substring(0,5) }}
                    </span>
                  </div>
                  <div class="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Días Laborales</p>
                    <p class="text-xs text-gray-900 dark:text-gray-100 font-semibold">
                      {{ asig.horario.dias_laborales_text }}
                    </p>
                  </div>
                </div>
                
                <div v-else class="flex flex-col items-center justify-center py-4 text-yellow-600 dark:text-yellow-500">
                  <svg class="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <p class="text-sm font-semibold text-center">Sin horario asignado</p>
                </div>
              </div>
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
            Sin asignaciones
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Este usuario no tiene instituciones asignadas
          </p>
        </div>
      </div>
      </div>
    </div>
  </ModalComponent>
</template>

<script setup>
import { ref, watch } from 'vue';
import { usuariosService } from '@/services/api';
import { X } from 'lucide-vue-next';
import ModalComponent from '../../ui/ModalComponent.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  usuarioId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['close']);

const usuario = ref(null);
const loading = ref(false);
const error = ref(null);

// Fetch detail when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.usuarioId) {
    fetchDetail();
  } else if (!newVal) {
    // Reset state when closing
    usuario.value = null;
    error.value = null;
  }
});

const fetchDetail = async () => {
  if (!props.usuarioId) return;

  loading.value = true;
  error.value = null;

  try {
    const response = await usuariosService.getById(props.usuarioId);
    usuario.value = response.data.data;
  } catch (err) {
    console.error('Error fetching usuario detail:', err);
    error.value = 'No se pudo cargar ficha detalle del usuario.';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit('close');
};

const formatDate = (dateString) => {
  if (!dateString) return 'No especificado';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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

const getSexoClass = (sexo) => {
  const s = (sexo || '').toLowerCase();
  if (s === 'm' || s === 'masculino') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  if (s === 'f' || s === 'femenino') return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
  return 'bg-gray-100 text-gray-600';
};

const getEstadoClass = (estado) => {
  switch(estado) {
    case 'ACTIVO': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    case 'INACTIVO': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    case 'PENDIENTE': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
    default: return 'bg-gray-100 text-gray-600';
  }
};
</script>
