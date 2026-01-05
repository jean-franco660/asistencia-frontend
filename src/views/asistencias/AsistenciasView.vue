<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-3 sm:p-4 md:p-6"
  >
    <div class="max-w-7xl mx-auto spacing-responsive">
      <!-- Header Premium -->
      <div
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3">
              <div
                class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg"
              >
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h1
                  class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
                >
                  Registro de Asistencias
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                  {{
                    userRole === "supervisor"
                      ? "Mis instituciones"
                      : "Gestión avanzada de control de asistencia"
                  }}
                </p>
              </div>
            </div>
          </div>
            <button
              v-if="userRole === 'supervisor'"
              @click="exportToExcel"
              :disabled="loading"
              class="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span class="flex items-center gap-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar Reporte
              </span>
            </button>
        </div>
      </div>

      <!-- Filtros Premium -->
      <div
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6"
      >
        <div class="flex items-center gap-3 mb-6">
          <div
            class="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Filtros de Búsqueda
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <!-- Fecha Inicio -->
          <div class="group">
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Fecha Inicio
            </label>
            <input
              v-model="filters.fecha_inicio"
              type="date"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 dark:text-white"
            />
          </div>

          <!-- Fecha Fin -->
          <div class="group">
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Fecha Fin
            </label>
            <input
              v-model="filters.fecha_fin"
              type="date"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 dark:text-white"
            />
          </div>

          <!-- Institución -->
          <div class="group">
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Institución
            </label>
            <!-- Dropdown SELECT para Supervisores -->
            <div v-if="userRole === 'supervisor'" class="relative">
              <select
                v-model="filters.institucion_id"
                @change="handleInstitutionChange"
                class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none appearance-none cursor-pointer hover:border-blue-400"
              >
                <option value="">Todas mis instituciones</option>
                <option
                  v-for="inst in instituciones"
                  :key="inst.id"
                  :value="inst.id"
                >
                  {{ inst.nombre }}
                </option>
              </select>
              <svg 
                class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Búsqueda Autocomplete para Administradores -->
            <div v-else class="relative group">
              <div class="relative">
                <input
                  type="text"
                  v-model="institucionSearch"
                  placeholder="Buscar por nombre o código..."
                  @focus="showInstitucionDropdown = true"
                  @keydown.esc="showInstitucionDropdown = false"
                  class="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 dark:text-white placeholder-gray-400"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <!-- Botón para limpiar selección -->
                <button 
                  v-if="filters.institucion_id"
                  @click="clearInstitucionSelection"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Lista desplegable (Dropup) -->
              <div 
                v-if="showInstitucionDropdown" 
                class="absolute z-50 w-full bottom-full mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 max-h-60 overflow-y-auto"
              >
                <div v-if="filteredInstituciones.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                  No se encontraron resultados
                </div>
                <ul v-else class="py-1">
                  <li 
                    v-for="i in filteredInstituciones" 
                    :key="i.id"
                    @click="selectInstitucion(i)"
                    class="px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors flex flex-col border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                  >
                    <span class="font-medium text-gray-900 dark:text-gray-100">{{ i.nombre }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400" v-if="i.codigo_modular_ie">
                      Cód: {{ i.codigo_modular_ie }}
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Overlay invisible para cerrar al hacer clic fuera -->
              <div 
                v-if="showInstitucionDropdown" 
                @click="showInstitucionDropdown = false"
                class="fixed inset-0 z-40 bg-transparent"
              ></div>
            </div>

          </div>

          <!-- Tipo -->
          <div class="group">
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Tipo
            </label>
            <select
              v-model="filters.tipo"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 dark:text-white"
            >
              <option value="">Todos los tipos</option>
              <option value="ENTRADA">Entrada</option>
              <option value="SALIDA">Salida</option>
            </select>
          </div>

          <!-- Búsqueda por Docente -->
          <div class="group">
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Buscar Docente
            </label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Nombre o código..."
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="applyFilters"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 transform hover:scale-105"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Aplicar Filtros
            </span>
          </button>
          <button
            @click="clearFilters"
            class="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Limpiar
            </span>
          </button>
        </div>
      </div>

      <!-- ⭐ NUEVO: Navegación por Tabs -->
      <div
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6"
      >
        <div class="flex gap-6 mb-0">
          <button
            @click="activeTab = 'cabeceras'; load(1);"
            :class="[
              'flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform',
              activeTab === 'cabeceras'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Estado Diario por Docente
              <span
                v-if="activeTab === 'cabeceras'"
                class="bg-white/20 px-2 py-1 rounded-lg text-xs"
              >
                {{ pagination.total }} registros
              </span>
            </span>
          </button>

          <button
            @click="activeTab = 'marcaciones'; load(1);"
            :class="[
              'flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform',
              activeTab === 'marcaciones'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Registros de Entrada/Salida
              <span
                v-if="activeTab === 'marcaciones'"
                class="bg-white/20 px-2 py-1 rounded-lg text-xs"
              >
                {{ pagination.total }} registros
              </span>
            </span>
          </button>
        </div>
      </div>

      <!-- Resumen Premium (Solo para Marcaciones) -->
      <div
        v-if="activeTab === 'marcaciones' && !loading && asistencias.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <!-- A Tiempo -->
        <div
          class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="text-sm font-medium opacity-90 mb-1">A Tiempo</div>
          <div class="text-4xl font-bold">{{ resumen.a_tiempo }}</div>
        </div>

        <!-- Tarde -->
        <div
          class="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="text-sm font-medium opacity-90 mb-1">Tarde</div>
          <div class="text-4xl font-bold">{{ resumen.tarde }}</div>
        </div>

        <!-- Faltas -->
        <div
          class="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="text-sm font-medium opacity-90 mb-1">Faltas</div>
          <div class="text-4xl font-bold">{{ resumen.faltas }}</div>
        </div>

        <!-- Total -->
        <div
          class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div class="text-sm font-medium opacity-90 mb-1">Total Registros</div>
          <div class="text-4xl font-bold">{{ asistencias.length }}</div>
        </div>
      </div>

      <!-- ⭐ NUEVA: Tabla de Cabeceras Diarias -->
      <div
        v-if="activeTab === 'cabeceras'"
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
      >
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="relative">
            <div
              class="w-20 h-20 border-8 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"
            ></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg
                class="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <p class="mt-6 text-lg font-semibold text-gray-600 dark:text-gray-400">
            Cargando resumen diario...
          </p>
        </div>

        <div
          v-else-if="cabeceras.length === 0"
          class="flex flex-col items-center justify-center py-20"
        >
          <div class="p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg
              class="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No se encontraron registros
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            No hay asistencias para el período seleccionado
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Docente
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Institución
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  H. Entrada
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  H. Salida
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Tardanza
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Observadas
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="cabecera in cabeceras"
                :key="cabecera.id"
                class="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <!-- Docente -->
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {{ cabecera.usuario?.apellido_paterno }} {{ cabecera.usuario?.apellido_materno }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ cabecera.usuario?.nombres }}
                    </span>
                    <span class="text-xs text-gray-400 dark:text-gray-500">
                      {{ cabecera.usuario?.codigo_modular }}
                    </span>
                  </div>
                </td>

                <!-- Institución -->
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ cabecera.institucion?.nombre || '-' }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ cabecera.institucion?.codigo_modular_ie || '-' }}
                    </span>
                  </div>
                </td>

                <!-- Fecha -->
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(cabecera.fecha) }}
                </td>

                <!-- Estado Diario con Badge -->
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap min-w-[80px]',
                      getEstadoDiarioClass(cabecera)
                    ]"
                  >
                    {{ getEstadoDiarioLabel(cabecera) }}
                  </span>
                </td>

                <!-- Hora Entrada -->
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {{ cabecera.hora_entrada || '--:--' }}
                </td>

                <!-- Hora Salida -->
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {{ cabecera.hora_salida || '--:--' }}
                </td>

                <!-- Minutos Tardanza -->
                <td class="px-6 py-4">
                  <span
                    v-if="cabecera.minutos_tardanza"
                    class="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded text-xs font-semibold"
                  >
                    {{ cabecera.minutos_tardanza }} min
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>

                <!-- Marcaciones Pendientes -->
                <td class="px-6 py-4">
                  <span
                    v-if="cabecera.marcaciones_pendientes > 0"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {{ cabecera.marcaciones_pendientes }}
                  </span>
                  <span v-else class="text-green-600 dark:text-green-400 text-sm font-medium">
                    ✓ Sin pendientes
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabla Premium (Marcaciones) -->
      <div
        v-if="activeTab === 'marcaciones'"
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
      >
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="relative">
            <div
              class="w-20 h-20 border-8 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"
            ></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg
                class="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p class="mt-6 text-lg font-semibold text-gray-600 dark:text-gray-400">
            Cargando asistencias...
          </p>
        </div>

        <div
          v-else-if="asistencias.length === 0"
          class="flex flex-col items-center justify-center py-20"
        >
          <div class="p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg
              class="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No se encontraron registros
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            {{
              userRole === "supervisor"
                ? "No hay asistencias en tus instituciones asignadas"
                : "Intenta ajustar los filtros de búsqueda"
            }}
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th
                  class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                >
                  Docente
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                >
                  Institución
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                >
                  Fecha/Hora
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                >
                  Tipo
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                >
                  Ubicación
                </th>

              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="row in asistencias"
                :key="row.id"
                class="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                @click="openDetailModal(row)"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <svg
                        class="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-gray-100">
                        {{ getDocenteNombre(row) }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ row.asistencia?.usuario?.codigo_modular || "" }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">{{
                      getInstitucionNombre(row)
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="row.marcada_en">
                    <div class="font-medium text-gray-900 dark:text-gray-100">
                      {{ formatDate(row.marcada_en) }}
                    </div>
                    <div
                      class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"
                    >
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ formatTime(row.marcada_en) }}
                    </div>
                  </div>
                  <span v-else class="text-gray-400">Sin fecha</span>
                </td>
                <td class="px-6 py-4">
                  <span
                    v-if="row.tipo === 'ENTRADA'"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Entrada
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Salida
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="getEstadoClass(row)"
                    class="inline-flex items-center gap-2 font-semibold"
                  >
                    <span v-html="estadoIcon(row)"></span>
                    {{ estadoLabel(row) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div
                      :class="
                        row.dentro_rango
                          ? 'text-green-600 dark:text-green-400 font-semibold flex items-center gap-1'
                          : 'text-red-600 dark:text-red-400 font-semibold flex items-center gap-1'
                      "
                    >
                      <svg
                        v-if="row.dentro_rango"
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {{ row.dentro_rango ? "En rango" : "Fuera de rango" }}
                    </div>
                    <div
                      class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"
                    >
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {{ formatCoordinate(row.latitud) }},
                      {{ formatCoordinate(row.longitud) }}
                    </div>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div
          v-if="pagination.total > pagination.per_page"
          class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700"
        >
          <nav class="flex items-center justify-center gap-2">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              class="px-4 py-2 rounded-lg font-semibold transition-all duration-300"
              :class="
                page === pagination.current_page
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-110'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              "
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal Foto -->
    <!-- Modal Foto -->
    <PhotoModal :open="showPhoto" :asistencia="selected" @close="closePhoto" />
    
    <!-- Modal Detalle -->
    <AsistenciaDetailModal 
      :is-open="showDetail" 
      :marcacion="selected" 
      :review-queue-length="reviewQueue.length"
      :current-review-index="currentReviewIndex"
      @close="showDetail = false" 
      @saved="load"
      @navigate="navigateReview"
      @approve-and-next="handleApproveAndNext"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { asistenciasService, institucionesService } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import PhotoModal from "@/components/ui/PhotoModal.vue";
import AsistenciaDetailModal from "@/components/features/asistencias/AsistenciaDetailModal.vue";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const userRole = computed(() => authStore.user?.rol);

// ⭐ NUEVO: Estado para tabs
const activeTab = ref('cabeceras'); // 'cabeceras' | 'marcaciones'

// Datos
const cabeceras = ref([]); // ⭐ NUEVO: Cabeceras diarias
const asistencias = ref([]); // Marcaciones individuales
const instituciones = ref([]);
const loading = ref(false);
const showPhoto = ref(false);
const showDetail = ref(false);
const selected = ref(null);

// ⭐ NUEVO HOY: Búsqueda Instituciones (Admin)
const institucionSearch = ref("");
const showInstitucionDropdown = ref(false);

const filteredInstituciones = computed(() => {
  const term = institucionSearch.value.toLowerCase().trim();
  if (!term) return instituciones.value.slice(0, 10); // Mostrar primeros 10 si no hay búsqueda
  
  return instituciones.value.filter(i => 
    i.nombre.toLowerCase().includes(term) || 
    (i.codigo_modular_ie && i.codigo_modular_ie.toString().includes(term))
  ).slice(0, 10);
});

const selectInstitucion = (inst) => {
  filters.institucion_id = inst.id;
  institucionSearch.value = inst.nombre;
  showInstitucionDropdown.value = false;
};

const clearInstitucionSelection = () => {
  filters.institucion_id = null;
  institucionSearch.value = "";
  showInstitucionDropdown.value = false;
};

// ⭐ FASE 6: Estado para cola de revisión
const reviewQueue = ref([]); // Array de IDs de marcaciones observadas
const currentReviewIndex = ref(0); // Índice actual en la cola

// Resumen de estadísticas
const resumen = ref({
  a_tiempo: 0,
  tarde: 0,
  faltas: 0,
  total: 0
});

const filters = reactive({
  fecha_inicio: "",
  fecha_fin: "",
  institucion_id: null,
  tipo: null, // Solo para tab marcaciones
  estado_diario: null, // ⭐ NUEVO: Solo para tab cabeceras
  search: "",
});

const pagination = reactive({
  current_page: 1,
  per_page: 20,
  total: 0,
});

const formatCoordinate = (coord) => {
  if (!coord) return "0.000000";
  const num = typeof coord === "string" ? parseFloat(coord) : coord;
  if (isNaN(num)) return "0.000000";
  return num.toFixed(6);
};

const getDocenteNombre = (row) => {
  const usuario = row.asistencia?.usuario;
  if (!usuario) return "-";
  const partes = [];
  if (usuario.apellido_paterno) partes.push(usuario.apellido_paterno);
  if (usuario.apellido_materno) partes.push(usuario.apellido_materno);
  if (usuario.nombres) partes.push(usuario.nombres);
  return partes.length > 0 ? partes.join(" ") : "-";
};

const getInstitucionNombre = (row) => {
    return row.asistencia?.institucion?.nombre || "-";
};

// ... (resumen logic needs update later or removed for now as endpoint changed) ... 

const estadoLabel = (row) => {
  // 1. Prioridad: Revisión Manual (Solo marcaciones)
  if (row.estado_revision === 'APROBADA') return 'Validada (Manual)';
  if (row.estado_revision === 'MANTENER_OBSERVADA') return 'Observada (Confirmada)';

  // 2. Estado Diario (Cabeceras - Tab 1)
  if (row.estado_diario) return row.estado_diario;

  // 3. Estado Marcación (Detalle - Tab 2)
  if (row.estado_marcacion === "VALIDA") return "Válida";
  if (row.estado_marcacion === "OBSERVADA") return "Observada";
  if (row.estado_marcacion === "ANULADA") return "Anulada";
  
  return row.estado_marcacion || "Pendiente";
};

const estadoIcon = (row) => {
  // 1. Revisión
  if (row.estado_revision === 'APROBADA')
     return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
  
  if (row.estado_revision === 'MANTENER_OBSERVADA')
     return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';

  // 2. Estado Diario (Cabeceras)
  if (row.estado_diario === 'PRESENTE')
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
  if (row.estado_diario === 'TARDANZA')
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
  if (row.estado_diario === 'FALTA')
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
  if (row.estado_diario === 'JUSTIFICADO')
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';

  // 3. Estado Marcación (Detalle)
  if (row.estado_marcacion === "VALIDA")
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
  if (row.estado_marcacion === "OBSERVADA")
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
  if (row.estado_marcacion === "ANULADA")
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
  
  return "";
};

const getEstadoClass = (row) => {
  // 1. Revisión
  if (row.estado_revision === 'APROBADA') return "text-green-600 dark:text-green-400";
  if (row.estado_revision === 'MANTENER_OBSERVADA') return "text-red-600 dark:text-red-400";

  // 2. Estado Diario (Cabeceras)
  if (row.estado_diario === 'PRESENTE') return "text-green-600 dark:text-green-400";
  if (row.estado_diario === 'TARDANZA') return "text-yellow-600 dark:text-yellow-400";
  if (row.estado_diario === 'FALTA') return "text-red-600 dark:text-red-400";
  if (row.estado_diario === 'JUSTIFICADO') return "text-blue-600 dark:text-blue-400";

  // 3. Estado Marcación (Detalle)
  if (row.estado_marcacion === "VALIDA") return "text-green-600 dark:text-green-400";
  if (row.estado_marcacion === "OBSERVADA") return "text-orange-600 dark:text-orange-400";
  if (row.estado_marcacion === "ANULADA") return "text-red-600 dark:text-red-400";
  
  return "text-gray-500";
};

// ⭐ NUEVO: Helpers para estado diario (Falta vs Falta Parcial)
const getEstadoDiarioLabel = (cabecera) => {
  if (cabecera.estado_diario === 'FALTA') {
    // Si tiene alguna marcación (entrada o salida) pero el estado es FALTA, es Parcial
    if (cabecera.hora_entrada || cabecera.hora_salida) {
      return 'FALTA PARCIAL';
    }
  }
  return cabecera.estado_diario || 'PENDIENTE';
};

const getEstadoDiarioClass = (cabecera) => {
  const estado = cabecera.estado_diario;

  if (estado === 'FALTA') {
    if (cabecera.hora_entrada || cabecera.hora_salida) {
      // Falta Parcial: Orange/Amber
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    }
    // Falta Total: Red
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }

  if (estado === 'TARDANZA') {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  }
  
  if (estado === 'PRESENTE') {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  }
  
  if (estado === 'JUSTIFICADO') {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }

  // Pendiente u otro
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha";
  try {
    // Extraemos solo la parte YYYY-MM-DD, ignorando la hora y zona horaria explícitamente
    // Esto funciona tanto para "2025-12-22" como para "2025-12-22T00:00:00.000000Z"
    let datePart = dateString;
    if (dateString.includes('T')) {
        datePart = dateString.split('T')[0];
    }
    
    if (datePart.length === 10 && datePart.includes('-')) {
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    }

    // Fallback por si llega algo muy raro
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha inválida";
    
    return date.toLocaleDateString("es-PE", {
      timeZone: "America/Lima",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Error en fecha";
  }
};

const formatTime = (dateString) => {
  if (!dateString) return "--:--";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "--:--";
    
    return date.toLocaleTimeString("es-PE", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    console.error("Error al formatear hora:", error);
    return "--:--";
  }
};

// ⭐ NUEVO: Cargar cabeceras diarias (Tab 1)
const loadCabeceras = async (page = 1) => {
  loading.value = true;
  try {
    const params = {
      fecha_inicio: filters.fecha_inicio || undefined,
      fecha_fin: filters.fecha_fin || undefined,
      institucion_id: filters.institucion_id || undefined,
      estado_diario: filters.estado_diario || undefined,
      search: filters.search || undefined,
      page,
      per_page: pagination.per_page,
      _t: Date.now(), // 🕒 Anti-cache force
    };

    console.log("📤 Cargando cabeceras con params:", params);

    const res = await asistenciasService.getCabeceras(params);

    console.log("📥 Cabeceras recibidas:", res.data);

    if (res.data?.success && res.data?.data) {
      const responseData = res.data.data;

      if (responseData.data && Array.isArray(responseData.data)) {
        cabeceras.value = responseData.data;
        pagination.total = responseData.total || 0;
        pagination.current_page = responseData.current_page || 1;
      } else if (Array.isArray(responseData)) {
        cabeceras.value = responseData;
        pagination.total = responseData.length;
      } else {
        cabeceras.value = [];
      }

      console.log(`✅ ${cabeceras.value.length} cabeceras cargadas`);
    } else {
      console.warn("⚠️ Estructura inesperada:", res.data);
      cabeceras.value = [];
    }
  } catch (error) {
    console.error("❌ Error cargando cabeceras:", error);
    cabeceras.value = [];


    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudieron cargar las cabeceras",
      confirmButtonColor: "#3B82F6",
    });
  }
  loading.value = false;
};

// Cargar marcaciones individuales (Tab 2 - método original)
const loadMarcaciones = async (page = 1) => {
  loading.value = true;
  try {
    const params = {
      fecha_inicio: filters.fecha_inicio || undefined,
      fecha_fin: filters.fecha_fin || undefined,
      institucion_id: filters.institucion_id || undefined,
      tipo: filters.tipo || undefined,
      search: filters.search || undefined,
      page,
      per_page: pagination.per_page,
    };

    console.log("📤 Cargando marcaciones con params:", params);

    const res = await asistenciasService.getAll(params);

    console.log("📥 Marcaciones recibidas:", res.data);

    if (res.data?.success && res.data?.data) {
      const responseData = res.data.data;

      if (responseData.data && Array.isArray(responseData.data)) {
        asistencias.value = responseData.data;
        pagination.total = responseData.total || 0;
        pagination.current_page = responseData.current_page || 1;
      } else if (Array.isArray(responseData)) {
        asistencias.value = responseData;
        pagination.total = responseData.length;
      } else {
        asistencias.value = [];
      }

      console.log(`✅ ${asistencias.value.length} marcaciones cargadas`);

      // Calcular resumen
      calcularResumen();
    } else {
      console.warn("⚠️ Estructura inesperada:", res.data);
      asistencias.value = [];
    }
  } catch (error) {
    console.error("❌ Error cargando marcaciones:", error);
    asistencias.value = [];

    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudieron cargar las marcaciones",
      confirmButtonColor: "#3B82F6",
    });
  }
  loading.value = false;
};

// Calcular resumen de marcaciones
const calcularResumen = () => {
  const marcaciones = asistencias.value;
  
  resumen.value = {
    a_tiempo: marcaciones.filter(m => 
      m.tipo === 'ENTRADA' && 
      m.estado_marcacion === 'VALIDA' && 
      !m.es_tardanza
    ).length,
    
    tarde: marcaciones.filter(m => 
      m.tipo === 'ENTRADA' && 
      m.es_tardanza === true
    ).length,
    
    faltas: marcaciones.filter(m => 
      m.estado_marcacion === 'OBSERVADA'
    ).length,
    
    total: marcaciones.length
  };
};

// ⭐ NUEVO: Wrapper que carga según tab activo
const load = async (page = 1) => {
  if (activeTab.value === 'cabeceras') {
    await loadCabeceras(page);
  } else {
    await loadMarcaciones(page);
  }
};

// ⭐ FASE 6: Cargar cola de revisión
const loadReviewQueue = async () => {
  try {
    // Obtener solo marcaciones observadas pendientes
    const params = {
      ...filters,
      estado_revision: 'PENDIENTE',
      per_page: 100, // Límite razonable
      page: 1,
    };
    
    console.log('📋 Cargando cola de revisión...');
    
    let items = [];
    
    if (activeTab.value === 'cabeceras') {
      // Para cabeceras, necesitamos obtener las marcaciones observadas
      const res = await asistenciasService.getAll({
        ...params,
        estado_marcacion: 'OBSERVADA',
      });
      
      if (res.data?.success && res.data?.data?.data) {
        items = res.data.data.data;
      }
    } else {
      // Para tab marcaciones, filtrar observadas
      const res = await asistenciasService.getAll({
        ...params,
        estado_marcacion: 'OBSERVADA',
      });
      
      if (res.data?.success && res.data?.data?.data) {
        items = res.data.data.data.filter(m => m.estado_marcacion === 'OBSERVADA');
      }
    }
    
    // Extraer IDs
    reviewQueue.value = items.map(item => item.id);
    
    // Encontrar índice de la marcación actual
    if (selected.value) {
      currentReviewIndex.value = reviewQueue.value.indexOf(selected.value.id);
      if (currentReviewIndex.value === -1) {
        currentReviewIndex.value = 0;
        reviewQueue.value.unshift(selected.value.id); // Agregar al inicio si no está
      }
    } else {
      currentReviewIndex.value = 0;
    }
    
    console.log(`✅ Cola cargada: ${reviewQueue.value.length} marcaciones`);
    console.log(`📍 Índice actual: ${currentReviewIndex.value + 1}/${reviewQueue.value.length}`);
  } catch (error) {
    console.error('❌ Error loading review queue:', error);
    // Fallback: solo la marcación actual
    if (selected.value) {
      reviewQueue.value = [selected.value.id];
      currentReviewIndex.value = 0;
    }
  }
};

// ⭐ FASE 6: Navegar en cola de revisión
const navigateReview = async (direction) => {
  if (direction === 'stay') {
    // Recargar marcación en índice actual
    // (sin nothing, just reload)
  } else {
    // Calcular nuevo índice
    const newIndex = direction === 'next' 
      ? currentReviewIndex.value + 1 
      : currentReviewIndex.value - 1;
    
    // Validar límites
    if (newIndex < 0 || newIndex >= reviewQueue.value.length) {
      console.log('⚠️ No hay más marcaciones en esa dirección');
      return;
    }
    
    // Actualizar índice
    currentReviewIndex.value = newIndex;
  }
  
  // Cargar marcación correspondiente
  const marcacionId = reviewQueue.value[currentReviewIndex.value];
  
  try {
    loading.value = true;
    console.log(`🔄 Cargando marcación ${currentReviewIndex.value + 1}/${reviewQueue.value.length}...`);
    
    // ⭐ CORREGIDO: Usar getMarcacionById en lugar de getById
    const response = await asistenciasService.getMarcacionById(marcacionId);
    
    if (response.data?.success && response.data?.data) {
      selected.value = response.data.data;
      console.log('✅ Marcación cargada');
    } else {
      throw new Error('Estructura de respuesta inesperada');
    }
  } catch (error) {
    console.error('❌ Error loading marcacion:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo cargar la marcación',
      confirmButtonColor: '#3B82F6',
    });
  } finally {
    loading.value = false;
  }
};

// ⭐ FASE 6: Aprobar y pasar a siguiente
const approveAndNext = async () => {
  // Esta función será llamada desde el modal
  // El modal debe emitir un evento 'approve-and-next'
  console.log('✅ Aprobando y pasando a siguiente...');
};

// ⭐ FASE 6: Handler para evento approve-and-next
// ⭐ FASE 6: Handler para evento approve-and-next
const handleApproveAndNext = async () => {
  try {
    console.log('📝 Manejando aprobación y navegación...');
    
    // 1. Refrescar lista de fondo para reflejar el cambio de estado
    // Esto se hace en segundo plano para no bloquear la UI
    load().catch(e => console.error('Error refreshing list:', e));
    
    // 2. Remover marcación actual de la cola
    reviewQueue.value.splice(currentReviewIndex.value, 1);
    
    console.log(`📊 Estado de cola: ${reviewQueue.value.length} restantes. Índice actual: ${currentReviewIndex.value}`);

    // 3. Verificar si hay más marcaciones
    if (reviewQueue.value.length > 0) {
      // Ajustar índice si es necesario
      if (currentReviewIndex.value >= reviewQueue.value.length) {
        currentReviewIndex.value = reviewQueue.value.length - 1;
      }
      
      // 4. Cargar siguiente marcación
      console.log(`🔄 Cargando siguiente at index ${currentReviewIndex.value}`);
      await navigateReview('stay'); // Cargar marcación en índice actual (que ahora es la siguiente)
    } else {
      // 5. No hay más marcaciones, cerrar modal
      console.log('✅ Cola de revisión completada!');
      showDetail.value = false;
      selected.value = null;
      
      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Cola completada!',
        text: 'Has revisado todas las marcaciones pendientes',
        confirmButtonColor: '#10B981',
        timer: 2000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.error('❌ Error en handleApproveAndNext:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al navegar a la siguiente marcación',
    });
  }
};


const handleInstitutionChange = () => {
    // Recargar datos al cambiar la institución
    load(1);
};


const loadInstituciones = async () => {
  try {
    const res = await institucionesService.getMias();

    console.log("📥 Instituciones recibidas:", res.data);

    if (res.data?.success && res.data?.data) {
      instituciones.value = Array.isArray(res.data.data) ? res.data.data : [];
      
      // Auto-seleccionar: No forzar selección para permitir "Todas"
      // if (userRole.value === 'supervisor' && instituciones.value.length > 0) {
      //   filters.institucion_id = instituciones.value[0].id;
      // }
    } else if (Array.isArray(res.data)) {
      instituciones.value = res.data;
      // if (userRole.value === 'supervisor' && instituciones.value.length > 0) {
      //   filters.institucion_id = instituciones.value[0].id;
      // }
    } else {
      instituciones.value = [];
    }

    console.log(`✅ ${instituciones.value.length} instituciones cargadas`);
  } catch (error) {
    console.error("❌ Error cargando instituciones:", error);
    instituciones.value = [];
  }
};

const applyFilters = () => {
  console.log("🔍 Aplicando filtros:", filters);
  load(1);
};

const clearFilters = () => {
  const d = new Date();
  filters.fecha_inicio = new Date(d.getFullYear(), d.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  filters.fecha_fin = d.toISOString().slice(0, 10);
  filters.institucion_id = null;
  filters.tipo = null;
  filters.search = "";
  
  // Limpiar búsqueda inst
  institucionSearch.value = "";
  showInstitucionDropdown.value = false;

  Swal.fire({
    icon: "success",
    title: "Filtros limpiados",
    text: "Se restablecieron los filtros por defecto",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  load(1);
};

const goToPage = (page) => {
  if (page !== pagination.current_page) {
    load(page);
  }
};

const exportToExcel = async () => {
  try {
    const isSpecific = !!filters.institucion_id;
    const title = isSpecific ? "Reporte Institucional" : "Reporte General";

    Swal.fire({
      title: `Generando ${title}...`,
      text: "Procesando datos detallados...",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const params = {
      fecha_inicio: filters.fecha_inicio || undefined,
      fecha_fin: filters.fecha_fin || undefined,
      // Si es reporte general, podemos pasar otros filtros si quisiéramos
      tipo: filters.tipo || undefined, 
    };

    let response;
    
    if (isSpecific) {
      // 1. Reporte Específico de una Institución
      response = await asistenciasService.exportarInstitucion(filters.institucion_id, params);
    } else {
      // 2. Reporte General (Todas las instituciones asignadas)
      // El backend filtra automáticamente por las instituciones del supervisor
      response = await asistenciasService.exportar(params);
    }

    // Download Logic
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = response.headers['content-disposition'];
    let filename = isSpecific 
      ? `Reporte_Institucion_${filters.institucion_id}.xlsx` 
      : `Reporte_Asistencias_${new Date().toISOString().slice(0,10)}.xlsx`;

    if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match && match.length > 1) filename = match[1];
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    Swal.fire({
      icon: "success",
      title: "¡Reporte Generado!",
      text: "La descarga ha comenzado.",
      confirmButtonColor: "#10B981",
      timer: 2000,
      timerProgressBar: true,
    });

  } catch (error) {
    console.error("❌ Error exportando:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudo generar el reporte.",
      confirmButtonColor: "#EF4444",
    });
  }
};


// ⭐ FASE 6: Abrir modal con cola de revisión
const openDetailModal = async (marcacion) => {
  console.log('🔍 Abriendo modal de detalle para marcación:', marcacion.id);
  
  try {
    selected.value = marcacion;
    showDetail.value = true;
    
    // Cargar cola de revisión
    await loadReviewQueue();
    
    console.log('✅ Modal abierto correctamente');
  } catch (error) {
    console.error('❌ Error al abrir modal:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo abrir el detalle de la marcación',
      confirmButtonColor: '#3B82F6',
    });
  }
};

// Funciones de modal
const openPhoto = (marcacion) => {
  selected.value = marcacion;
  showPhoto.value = true;
};

const closePhoto = () => {
  showPhoto.value = false;
  selected.value = null;
};

const photoUrl = (foto) => {
  if (!foto) return '';
  return foto.startsWith('http') ? foto : `${import.meta.env.VITE_API_BASE_URL}/${foto}`;
};

const handleImageError = (event) => {
  event.target.src = '/placeholder-image.png'; //  Puedes agregar un placeholder
};

onMounted(() => {
  const d = new Date();
  filters.fecha_inicio = new Date(d.getFullYear(), d.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  filters.fecha_fin = d.toISOString().slice(0, 10);

  loadInstituciones();
  load();
});
// Force HMR update
</script>
