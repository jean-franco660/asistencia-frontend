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
          <div class="flex gap-3">
            <button
              @click="exportToExcel"
              :disabled="asistencias.length === 0"
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
                Exportar Excel
              </span>
            </button>
          </div>
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
            <select
              v-model="filters.institucion_id"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 dark:text-white"
            >
              <option value="">
                {{
                  userRole === "supervisor"
                    ? "Mis instituciones"
                    : "Todas las instituciones"
                }}
              </option>
              <option v-for="i in instituciones" :key="i.id" :value="i.id">
                {{ i.nombre }} {{ i.codigo_modular_ie ? `(${i.codigo_modular_ie})` : "" }}
              </option>
            </select>
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

      <!-- Resumen Premium -->
      <div
        v-if="!loading && asistencias.length > 0"
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

      <!-- Tabla Premium -->
      <div
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
                <th
                  class="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                >
                  Foto
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="row in asistencias"
                :key="row.id"
                class="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
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
                        {{ getDocenteNombre(row.usuario) }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ row.usuario?.codigo_modular || "" }}
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
                      row.institucion?.nombre || "-"
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="row.fecha_hora">
                    <div class="font-medium text-gray-900 dark:text-gray-100">
                      {{ formatDate(row.fecha_hora) }}
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
                      {{ formatTime(row.fecha_hora) }}
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
                <td class="px-6 py-4">
                  <button
                    v-if="row.foto"
                    @click="openPhoto(row)"
                    class="group relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                  >
                    <img
                      :src="photoUrl(row.foto)"
                      class="w-full h-full object-cover"
                      alt="Foto de asistencia"
                      @error="handleImageError"
                    />
                    <div
                      class="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg
                        class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                    </div>
                  </button>
                  <span v-else class="text-gray-400">—</span>
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
    <PhotoModal :open="showPhoto" :asistencia="selected" @close="closePhoto" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { asistenciasService, institucionesService } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import PhotoModal from "@/components/ui/PhotoModal.vue";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const userRole = computed(() => authStore.user?.rol);

const asistencias = ref([]);
const instituciones = ref([]);
const loading = ref(false);
const showPhoto = ref(false);
const selected = ref(null);

const filters = reactive({
  fecha_inicio: "",
  fecha_fin: "",
  institucion_id: null,
  tipo: null,
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

const getDocenteNombre = (usuario) => {
  if (!usuario) return "-";
  const partes = [];
  if (usuario.apellido_paterno) partes.push(usuario.apellido_paterno);
  if (usuario.apellido_materno) partes.push(usuario.apellido_materno);
  if (usuario.nombres) partes.push(usuario.nombres);
  return partes.length > 0 ? partes.join(" ") : "-";
};

const resumen = computed(() => {
  const a_tiempo = asistencias.value.filter((a) => a.resultado === "A_TIEMPO").length;
  const tarde = asistencias.value.filter((a) => a.resultado === "TARDE").length;
  const faltas = asistencias.value.filter((a) => a.situacion === "FALTA").length;
  return { a_tiempo, tarde, faltas };
});

const totalPages = computed(() => Math.ceil(pagination.total / pagination.per_page));

const photoUrl = (path) => {
  if (!path) return null;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiUrl) {
    console.error("VITE_API_BASE_URL no está definida en .env");
    return null;
  }
  const baseUrl = apiUrl.replace("/api/v1/web", "");
  return `${baseUrl}/storage/${path}`;
};

const handleImageError = (event) => {
  console.error("Error cargando imagen:", event.target.src);
  event.target.style.display = "none";
};

const openPhoto = (row) => {
  selected.value = row;
  showPhoto.value = true;
};

const closePhoto = () => {
  showPhoto.value = false;
  selected.value = null;
};

const estadoLabel = (row) => {
  if (row.situacion === "FALTA") return "Ausente";
  if (row.resultado === "A_TIEMPO") return "A Tiempo";
  if (row.resultado === "TARDE") return "Tarde";
  if (row.resultado === "SALIDA_ANTES") return "Salida Anticipada";
  return "—";
};

const estadoIcon = (row) => {
  if (row.situacion === "FALTA")
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
  if (row.resultado === "A_TIEMPO")
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
  if (row.resultado === "TARDE")
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
  if (row.resultado === "SALIDA_ANTES")
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
  return "";
};

const getEstadoClass = (row) => {
  if (row.situacion === "FALTA") return "text-red-600 dark:text-red-400";
  if (row.resultado === "A_TIEMPO") return "text-green-600 dark:text-green-400";
  if (row.resultado === "TARDE") return "text-orange-600 dark:text-orange-400";
  if (row.resultado === "SALIDA_ANTES") return "text-yellow-600 dark:text-yellow-400";
  return "text-gray-500";
};

const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha inválida";
    return date.toLocaleDateString("es-PE", {
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
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    console.error("Error al formatear hora:", error);
    return "--:--";
  }
};

const load = async (page = 1) => {
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

    console.log("📤 Cargando asistencias con params:", params);

    const res = await asistenciasService.getAll(params);

    console.log("📥 Respuesta recibida:", res.data);

    if (res.data?.success && res.data?.data) {
      const responseData = res.data.data;

      // Manejar paginación de Laravel
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

      console.log(`✅ ${asistencias.value.length} asistencias cargadas`);
    } else {
      console.warn("⚠️ Estructura inesperada:", res.data);
      asistencias.value = [];
    }
  } catch (error) {
    console.error("❌ Error cargando asistencias:", error);
    asistencias.value = [];

    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudieron cargar las asistencias",
      confirmButtonColor: "#3B82F6",
    });
  }
  loading.value = false;
};

const loadInstituciones = async () => {
  try {
    const res = await institucionesService.getMias();

    console.log("📥 Instituciones recibidas:", res.data);

    if (res.data?.success && res.data?.data) {
      instituciones.value = Array.isArray(res.data.data) ? res.data.data : [];
    } else if (Array.isArray(res.data)) {
      instituciones.value = res.data;
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
  if (asistencias.value.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Sin datos",
      text: "No hay datos para exportar",
      confirmButtonColor: "#3B82F6",
    });
    return;
  }

  try {
    Swal.fire({
      title: "Exportando...",
      html: "Generando archivo Excel, por favor espere",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const params = {
      fecha_inicio: filters.fecha_inicio || undefined,
      fecha_fin: filters.fecha_fin || undefined,
      institucion_id: filters.institucion_id || undefined,
      tipo: filters.tipo || undefined,
    };

    const response = await asistenciasService.exportar(params);

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const institucionNombre = filters.institucion_id
      ? instituciones.value.find((i) => i.id === filters.institucion_id)?.nombre ||
        "Seleccionada"
      : userRole.value === "supervisor"
      ? "Mis_Instituciones"
      : "Todas";

    const fecha_inicio = filters.fecha_inicio || "inicio";
    const fecha_fin = filters.fecha_fin || "fin";
    link.download = `Asistencias_${institucionNombre}_${fecha_inicio}_a_${fecha_fin}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    Swal.fire({
      icon: "success",
      title: "¡Exportado!",
      text: "El archivo se descargó correctamente",
      confirmButtonColor: "#10B981",
      timer: 3000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("❌ Error al exportar:", error);

    Swal.fire({
      icon: "error",
      title: "Error al exportar",
      text:
        error.response?.data?.message ||
        "No se pudo generar el archivo. Intenta nuevamente.",
      confirmButtonColor: "#EF4444",
    });
  }
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
</script>
