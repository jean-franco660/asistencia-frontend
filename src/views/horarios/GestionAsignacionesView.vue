<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-4 md:p-6 lg:p-8">
    <!-- Header mejorado -->
    <div class="mb-8 animate-fade-in">
      <div class="flex items-center gap-3 mb-3">
        <div class="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Gestión de Horarios
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Monitorea y gestiona las asignaciones de horarios de los docentes
          </p>
        </div>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-xs font-medium">Total Asignaciones</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ asignaciones.length }}</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-xs font-medium">Cambios Hoy</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ cambiosHoy }}</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-xs font-medium">Instituciones</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ institucionesUnicas }}</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-xs font-medium">Docentes Activos</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ docentesUnicos }}</p>
            </div>
            <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs mejorados -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6 p-1 border border-gray-200 dark:border-gray-700">
      <div class="flex gap-1">
        <button
          @click="activeTab = 'asignaciones'"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'asignaciones'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Asignaciones Actuales
        </button>
        <button
          @click="activeTab = 'historial'"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'historial'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Historial de Cambios
        </button>
      </div>
    </div>

    <!-- Asignaciones Tab -->
    <div v-if="activeTab === 'asignaciones'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Filters mejorados -->
      <div class="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2 mb-4">
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filtros de Búsqueda</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Usuario
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                v-model="filtros.usuario"
                type="text"
                placeholder="Buscar por nombre..."
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Institución
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              <select
                v-if="esSupervisor"
                v-model="filtros.institucion_id"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">Todas mis instituciones</option>
                <option v-for="inst in instituciones" :key="inst.id" :value="inst.id">
                  {{ inst.nombre }}
                </option>
              </select>

              <input
                v-else
                v-model="filtros.institucion"
                type="text"
                placeholder="Buscar institución..."
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div class="flex items-end">
            <button
              @click="cargarAsignaciones"
              class="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Table mejorada -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Usuario
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Institución
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Horarios
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Última Modificación
              </th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody v-if="loading">
            <tr>
              <td colspan="5" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center gap-4">
                  <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  <p class="text-gray-600 dark:text-gray-400 font-medium">Cargando asignaciones...</p>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="asignaciones.length === 0">
            <tr>
              <td colspan="5" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center gap-4">
                  <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white mb-1">No se encontraron asignaciones</p>
                    <p class="text-gray-500 dark:text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="asig in asignaciones" 
              :key="`${asig.usuario_id}-${asig.institucion_id}`" 
              class="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ asig.nombres }} {{ asig.apellido_paterno }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ asig.usuario_id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    I.E. {{ asig.institucion }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-2">
                  <template v-if="asig.horarios">
                    <span
                      v-for="(horario, index) in asig.horarios.split(', ')"
                      :key="index"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-800"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ horario }}
                    </span>
                  </template>
                  <span v-else class="text-xs text-gray-500 italic">
                    Sin horario asignado
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDateTime(asig.ultima_modificacion) }}
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="abrirModalEdicion(asig)"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modificar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Historial Tab -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Filters -->
      <div class="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2 mb-4">
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filtros de Fecha</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Desde
            </label>
            <input
              v-model="filtrosHistorial.fecha_desde"
              type="date"
              class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Hasta
            </label>
            <input
              v-model="filtrosHistorial.fecha_hasta"
              type="date"
              class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="cargarHistorial"
              class="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- History Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Fecha/Hora</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Institución</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cambios</th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Origen</th>
            </tr>
          </thead>
          <tbody v-if="loadingHistorial">
            <tr>
              <td colspan="5" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center gap-4">
                  <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  <p class="text-gray-600 dark:text-gray-400 font-medium">Cargando historial...</p>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="historial.length === 0">
            <tr>
              <td colspan="5" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center gap-4">
                  <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white mb-1">No se encontraron cambios</p>
                    <p class="text-gray-500 dark:text-gray-400">Ajusta el rango de fechas para ver el historial</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="cambio in historial" :key="cambio.id" class="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-all duration-200">
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatDateTime(cambio.created_at) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ cambio.usuario?.nombres }} {{ cambio.usuario?.apellido_paterno }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                I.E. {{ cambio.institucion?.nombre }}
              </td>
              <td class="px-6 py-4">
                <div class="space-y-2">
                  <div v-if="cambio.horario_anterior" class="flex items-start gap-2">
                    <div class="p-1 bg-red-100 dark:bg-red-900/30 rounded mt-0.5">
                      <svg class="w-3 h-3 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span class="text-sm text-red-600 dark:text-red-400 font-medium">
                      Removido: {{ formatHorarios(cambio.horario_anterior) }}
                    </span>
                  </div>
                  <div class="flex items-start gap-2">
                    <div class="p-1 bg-green-100 dark:bg-green-900/30 rounded mt-0.5">
                      <svg class="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class="text-sm text-green-600 dark:text-green-400 font-medium">
                      Agregado: {{ formatHorarios(cambio.horario_nuevo) }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider',
                    cambio.origen === 'APP' 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700' 
                      : 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                  ]"
                >
                  <svg v-if="cambio.origen === 'APP'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ cambio.origen }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Edición Mejorado -->
    <div
      v-if="mostrarModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      @click.self="cerrarModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in border border-gray-200 dark:border-gray-700">
        <!-- Modal Header -->
        <div class="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-white/20 rounded-xl backdrop-blur">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold">
                  Modificar Horarios
                </h2>
                <p class="text-blue-100 text-sm mt-0.5">
                  {{ asignacionSeleccionada?.nombres }} {{ asignacionSeleccionada?.apellido_paterno }}
                </p>
              </div>
            </div>
            <button
              @click="cerrarModal"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-3 flex items-center gap-2 text-sm text-blue-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            I.E. {{ asignacionSeleccionada?.institucion }}
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 max-h-[calc(90vh-220px)] overflow-y-auto">
          <div class="mb-4">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Selecciona los horarios disponibles
            </h3>
          </div>
          <div class="space-y-3">
            <label
              v-for="horario in horariosDisponibles"
              :key="horario.id"
              class="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group"
              :class="horariosSeleccionados.includes(horario.id) 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'"
            >
              <input
                type="checkbox"
                :value="horario.id"
                v-model="horariosSeleccionados"
                class="w-5 h-5 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all"
              />
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                  <div class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ horario.nombre_turno }}
                  </div>
                  <span 
                    v-if="horariosSeleccionados.includes(horario.id)"
                    class="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-bold"
                  >
                    Seleccionado
                  </span>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ horario.hora_entrada }} - {{ horario.hora_salida }}
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            @click="cerrarModal"
            class="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow"
          >
            Cancelar
          </button>
          <button
            @click="guardarCambios"
            :disabled="guardando || horariosSeleccionados.length === 0"
            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md flex items-center gap-2"
          >
            <svg v-if="!guardando" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div v-else class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { horariosGestionService, institucionesService } from '@/services/api'
import { useAuthStore } from '@/store/auth'
import Swal from 'sweetalert2'

const activeTab = ref('asignaciones')
const loading = ref(false)
const loadingHistorial = ref(false)
const asignaciones = ref([])
const historial = ref([])
const mostrarModal = ref(false)
const guardando = ref(false)
const asignacionSeleccionada = ref(null)
const horariosDisponibles = ref([])
const horariosSeleccionados = ref([])

const auth = useAuthStore()
const instituciones = ref([])

const userRole = computed(() => auth.user?.rol)
const esSupervisor = computed(() => userRole.value === 'supervisor')

const filtros = ref({
  usuario: '',
  institucion: '',
  institucion_id: '',
})

const filtrosHistorial = ref({
  fecha_desde: '',
  fecha_hasta: '',
})

// Computed properties para estadísticas
const cambiosHoy = computed(() => {
  const hoy = new Date().toDateString()
  return historial.value.filter(c => new Date(c.created_at).toDateString() === hoy).length
})

const institucionesUnicas = computed(() => {
  return new Set(asignaciones.value.map(a => a.institucion_id)).size
})

const docentesUnicos = computed(() => {
  return new Set(asignaciones.value.map(a => a.usuario_id)).size
})

onMounted(async () => {
  if (esSupervisor.value) {
    await loadInstituciones()
  }
  cargarAsignaciones()
})

watch(esSupervisor, (newValue) => {
  if (newValue) {
    loadInstituciones()
  }
})

async function loadInstituciones() {
  try {
    const response = await institucionesService.getAll({ sin_paginacion: true })
    instituciones.value = response.data.data
  } catch (error) {
    console.error('Error al cargar instituciones:', error)
  }
}

async function cargarAsignaciones() {
  loading.value = true
  try {
    const response = await horariosGestionService.getAsignaciones(filtros.value)
    asignaciones.value = response.data.data.data || []
  } catch (error) {
    console.error('Error al cargar asignaciones:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las asignaciones',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    loading.value = false
  }
}

async function cargarHistorial() {
  loadingHistorial.value = true
  try {
    const response = await horariosGestionService.getHistorial(filtrosHistorial.value)
    historial.value = response.data.data.data || []
  } catch (error) {
    console.error('Error al cargar historial:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el historial',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    loadingHistorial.value = false
  }
}

async function abrirModalEdicion(asignacion) {
  asignacionSeleccionada.value = asignacion
  mostrarModal.value = true
  
  try {
    const response = await horariosGestionService.getAsignaciones({
      institucion_id: asignacion.institucion_id,
    })
    horariosDisponibles.value = [
      { id: 1, nombre_turno: 'Mañana', hora_entrada: '07:00', hora_salida: '13:00' },
      { id: 2, nombre_turno: 'Tarde', hora_entrada: '13:00', hora_salida: '18:00' },
      { id: 3, nombre_turno: 'Noche', hora_entrada: '18:00', hora_salida: '23:00' },
    ]
    
    horariosSeleccionados.value = asignacion.horarios ? asignacion.horarios.split(', ').map((_, i) => i + 1) : []
  } catch (error) {
    console.error('Error al cargar horarios:', error)
  }
}

async function guardarCambios() {
  if (horariosSeleccionados.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Debes seleccionar al menos un horario',
      confirmButtonColor: '#3b82f6'
    })
    return
  }

  guardando.value = true
  try {
    await horariosGestionService.modificar({
      usuario_app_id: asignacionSeleccionada.value.usuario_id,
      institucion_id: asignacionSeleccionada.value.institucion_id,
      horario_ids: horariosSeleccionados.value,
    })
    
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Horarios modificados correctamente',
      confirmButtonColor: '#3b82f6',
      timer: 2000
    })
    cerrarModal()
    cargarAsignaciones()
  } catch (error) {
    console.error('Error al guardar:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron guardar los cambios',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    guardando.value = false
  }
}

function cerrarModal() {
  mostrarModal.value = false
  asignacionSeleccionada.value = null
  horariosSeleccionados.value = []
}

function formatDateTime(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatHorarios(ids) {
  if (!Array.isArray(ids)) return '-'
  return ids.map(id => `Horario ${id}`).join(', ')
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
</style>