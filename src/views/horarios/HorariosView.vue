<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6"
  >
    <div class="max-w-7xl mx-auto spacing-responsive">
      <!-- Header Premium -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex-1 min-w-0">
          <h1
            class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 truncate"
          >
            Gestión de Horarios
          </h1>
          <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 truncate">
            Administra los turnos y horarios de tu institución
          </p>
        </div>
        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0"
        >
          <svg
            class="w-6 h-6 sm:w-8 sm:h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Selector de institución Premium con Buscador -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 backdrop-blur-sm"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0"
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
          </div>
          <label
            class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100"
          >
            Institución
          </label>
        </div>

        <!-- Mostrar dropdown para supervisores, búsqueda para admins -->
        <template v-if="auth.user?.rol === 'supervisor'">
          <!-- Dropdown SELECT para supervisores -->
          <div class="relative">
            <select
              v-model="institucionId"
              @change="onSelectInstitucion"
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none appearance-none cursor-pointer hover:border-blue-400"
            >
              <option value="">Selecciona una institución...</option>
              <option
                v-for="inst in instituciones"
                :key="inst.id"
                :value="inst.id"
              >
                I.E. {{ inst.nombre }}
              </option>
            </select>
            <svg 
              class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <!-- Institución seleccionada info -->
          <div
            v-if="institucionId"
            class="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-300 dark:border-blue-700"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Código Modular:
                <span class="font-mono font-semibold text-gray-800 dark:text-gray-200">{{ selectedInstitucionCodigo || 'N/A' }}</span>
              </span>
            </div>
          </div>
        </template>

        <!-- Campo de búsqueda para administradores y super_admin -->
        <template v-else-if="mostrarSelector">
          <div class="relative inst-search-horarios">
            <div class="relative">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>

              <input
                type="text"
                v-model="institucionSearchQuery"
                @input="onInputBuscarInstitucion"
                @focus="onFocusInstitucion"
                placeholder="Buscar institución por nombre o código..."
                :disabled="loadingInstituciones"
                class="w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />

              <!-- Spinner de búsqueda -->
              <div
                v-if="loadingInstitucionesBuscador"
                class="absolute right-3 top-1/2 -translate-y-1/2"
                title="Buscando..."
              >
                <svg
                  class="animate-spin h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>

              <!-- Botón limpiar -->
              <button
                v-else-if="institucionId"
                @click="limpiarInstitucion"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                type="button"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5"
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
              </button>
            </div>

            <!-- Dropdown de resultados -->
            <div
              v-if="showInstitucionDropdown && filteredInstituciones.length"
              class="absolute z-50 w-full mt-1 max-h-64 overflow-auto bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-xl shadow-2xl inst-dropdown-horarios"
            >
              <button
                type="button"
                v-for="inst in filteredInstituciones"
                :key="inst.id"
                @click="seleccionarInstitucion(inst)"
                class="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all border-b border-gray-100 dark:border-gray-700 last:border-b-0 group"
                :class="{
                  'bg-blue-50 dark:bg-blue-900/20':
                    String(institucionId) === String(inst.id),
                  'first:rounded-t-xl last:rounded-b-xl': true,
                }"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <svg
                      class="w-5 h-5 text-white"
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
                  </div>

                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                     <span class="text-blue-600 dark:text-blue-400 font-semibold text-xs">I.E.</span> {{ inst.nombre }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                      >
                        <svg
                          class="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                          />
                        </svg>
                        {{ inst.codigo_modular_ie }}
                      </span>

                      <span
                        v-if="inst.distrito"
                        class="text-xs text-gray-500 dark:text-gray-400 truncate"
                      >
                        {{ inst.distrito }}
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="String(institucionId) === String(inst.id)"
                    class="flex-shrink-0"
                  >
                    <div
                      class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <!-- No resultados -->
            <div
              v-if="
                showInstitucionDropdown &&
                institucionSearchQuery &&
                !filteredInstituciones.length &&
                !loadingInstitucionesBuscador
              "
              class="absolute z-50 w-full mt-1 p-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-xl inst-dropdown-horarios"
            >
              <div class="flex flex-col items-center gap-2 py-2">
                <div
                  class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-gray-400"
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
                <p
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center"
                >
                  No se encontraron instituciones
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            </div>

            <!-- Institución seleccionada -->
            <div
              v-if="institucionId"
              class="mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
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
                </div>

                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                  >
                    <span class="text-blue-600 dark:text-blue-400 font-semibold text-xs">I.E.</span> {{ selectedInstitucionNombre || "Institución seleccionada" }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                      {{ selectedInstitucionCodigo || "N/A" }}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  @click="limpiarInstitucion"
                  class="flex-shrink-0 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-all hover:scale-110"
                  title="Quitar selección"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Vista fija para supervisores con una sola institución -->
        <template v-else>
          <div
            class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4"
          >
            <p
              class="font-semibold text-gray-800 dark:text-gray-100 text-base sm:text-lg"
            >
              <span v-if="loadingInstituciones">Cargando...</span>
              <span v-else>
                <span class="text-blue-600 dark:text-blue-400 font-semibold text-sm">I.E.</span> 
                {{ selectedInstitucionNombre || getInstitucionNombre(institucionId) }}
              </span>
            </p>
          </div>
        </template>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6 p-1 border border-gray-200 dark:border-gray-700">
        <div class="flex gap-1">
          <button
            @click="activeTab = 'turnos'"
            :class="[
              'flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
              activeTab === 'turnos'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Turnos
          </button>
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
            Asignaciones
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
            Historial
          </button>
        </div>
      </div>

      <!-- Tab Turnos -->
      <div v-if="activeTab === 'turnos'">
      <div 
        v-if="institucionId && !loadingHorarios"
        class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 rounded-2xl shadow-xl border border-blue-200 dark:border-gray-600 p-4 sm:p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Estadísticas</h3>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <!-- Total Horarios -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-600">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total</span>
            </div>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ statistics.total }}</p>
          </div>

          <!-- Mañana -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-600">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">☀️</span>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Mañana</span>
            </div>
            <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ statistics.manana }}</p>
          </div>

          <!-- Tarde -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-600">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">🌤️</span>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Tarde</span>
            </div>
            <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ statistics.tarde }}</p>
          </div>

          <!-- Noche -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-600">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">🌙</span>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Noche</span>
            </div>
            <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ statistics.noche }}</p>
          </div>
        </div>
      </div>

      <!-- Filtros Panel -->
      <div 
        v-if="institucionId && horarios.length > 0 && auth.user?.rol !== 'supervisor'"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Filtros</h3>
          <button
            v-if="filtroActivo"
            @click="limpiarFiltros"
            class="ml-auto text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
          >
            Limpiar filtros
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Filtro por Turno -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por Turno
            </label>
            <select
              v-model="filtros.turno"
              class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Todos los turnos</option>
              <option value="MAÑANA">☀️ Mañana</option>
              <option value="TARDE">🌤️ Tarde</option>
              <option value="NOCHE">🌙 Noche</option>
            </select>
          </div>

          <!-- Filtro por Días -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por Día
            </label>
            <select
              v-model="filtros.dia"
              class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Todos los días</option>
              <option value="L">Lunes</option>
              <option value="M">Martes</option>
              <option value="X">Miércoles</option>
              <option value="J">Jueves</option>
              <option value="V">Viernes</option>
              <option value="S">Sábado</option>
              <option value="D">Domingo</option>
            </select>
          </div>
        </div>

        <!-- Conteo de resultados filtrados -->
        <div v-if="filtroActivo" class="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Mostrando {{ horariosFiltrados.length }} de {{ horarios.length }} horarios
        </div>
      </div>

      <!-- Alerta para Supervisores sin Horarios -->
      <div
        v-if="!loadingHorarios && horarios.length === 0 && institucionId && auth.user?.rol === 'supervisor'"
        class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-2xl shadow-xl p-6"
      >
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
              ⚠️ Tu institución no tiene horarios configurados
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Para que los docentes puedan marcar asistencia, necesitas configurar al menos un horario (turno mañana, tarde o noche) con sus respectivas horas de entrada y salida.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="openCreate"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Crear Primer Horario
              </button>
              <a
                href="#"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 border-2 border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-400 font-semibold rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Ver Guía
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón crear Premium -->
      <div class="flex justify-end">
        <button
          class="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
          @click="openCreate"
          :disabled="!institucionId || loadingHorarios"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          <span class="hidden sm:inline">Registrar nuevo horario</span>
          <span class="sm:hidden">Nuevo</span>
        </button>
      </div>

      <!-- Tabla Premium -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-600"
        >
          <h2
            class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3"
          >
            <div
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            Horarios Registrados
            <span v-if="loadingHorarios" class="animate-spin">⏳</span>
          </h2>
        </div>

        <div v-if="loadingHorarios" class="p-12 text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"
          ></div>
          <p class="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Cargando horarios...
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700"
              >
                <th
                  class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Turno
                </th>
                <th
                  class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Entrada
                </th>
                <th
                  class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Salida
                </th>
                <th
                  class="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Días
                </th>
                <th
                  class="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Tolerancia
                </th>
                <th
                  class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="h in horariosFiltrados"
                :key="`horario-${h.institucion_id || institucionId}-${h.id}-${
                  h.nombre_turno
                }`"
                class="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-4 sm:px-6 py-3 sm:py-4">
                  <div class="flex items-center gap-2 sm:gap-3">
                    <div
                      class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md flex-shrink-0"
                    >
                      <svg
                        class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        ></path>
                      </svg>
                    </div>
                    <span
                      class="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base"
                    >
                      {{ h.nombre_turno }}
                    </span>
                  </div>
                </td>

                <td class="px-4 sm:px-6 py-3 sm:py-4">
                  <div
                    class="flex items-center gap-1 sm:gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      class="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      ></path>
                    </svg>
                    <span class="font-medium text-xs sm:text-sm">{{
                      formatearHora(h.hora_entrada)
                    }}</span>
                  </div>
                </td>

                <td class="px-4 sm:px-6 py-3 sm:py-4">
                  <div
                    class="flex items-center gap-1 sm:gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      class="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      ></path>
                    </svg>
                    <span class="font-medium text-xs sm:text-sm">{{
                      formatearHora(h.hora_salida)
                    }}</span>
                  </div>
                </td>

                <td class="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4">
                  <span
                    class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {{ formatearDias(h.dias_laborales || h.dias_semana) }}
                  </span>
                </td>

                <td class="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4">
                  <div class="flex flex-col gap-1">
                    <span
                      class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      ↓ {{ h.tolerancia_entrada_minutos || h.tolerancia_minutos || 5 }} min
                    </span>
                    <span
                      class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    >
                      ↑ {{ h.tolerancia_salida_minutos || h.tolerancia_minutos || 5 }} min
                    </span>
                  </div>
                </td>

                <td class="px-4 sm:px-6 py-3 sm:py-4">
                  <div class="flex items-center justify-center gap-2 sm:gap-3">
                    <button
                      @click="openEdit(h)"
                      class="p-1.5 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all hover:scale-110"
                      title="Editar"
                    >
                      <svg
                        class="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>

                    <button
                      @click="confirmDelete(h.id)"
                      class="p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all hover:scale-110"
                      title="Eliminar"
                    >
                      <svg
                        class="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M7 7h10"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!horarios.length">
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div
                      class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <svg
                        class="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        ></path>
                      </svg>
                    </div>
                    <p
                      class="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base"
                    >
                      No hay horarios registrados
                    </p>
                    <p class="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                      Comienza creando un nuevo horario
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Instituciones sin Horarios -->
      <div
        v-if="!loadingHorarios && institucionesSinHorarios.length > 0 && (auth.user?.rol === 'administrador' || auth.user?.rol === 'super_admin')"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-orange-200 dark:border-orange-700 overflow-hidden"
      >
        <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 px-4 sm:px-6 py-4 border-b border-orange-200 dark:border-orange-600">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">
                Instituciones sin Horarios Asignados
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ institucionesSinHorarios.length }} institución(es) requiere(n) configuración de horario
              </p>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="inst in institucionesSinHorarios"
              :key="`sin-horario-${inst.id}`"
              class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 rounded-xl p-4 border-2 border-dashed border-orange-300 dark:border-orange-600 hover:border-orange-500 dark:hover:border-orange-400 transition-all group"
            >
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-800 dark:text-gray-100 truncate text-sm">
                    <span class="text-orange-600 dark:text-orange-400 font-semibold text-xs">I.E.</span> {{ inst.nombre }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    CM: {{ inst.codigo_modular_ie }}
                  </p>
                  <button
                    @click="crearHorarioParaInstitucion(inst.id)"
                    class="mt-3 w-full px-3 py-2 text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Crear Horario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Asignación -->
    <div
      v-if="mostrarModalAsignacion"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      @click.self="cerrarModalAsignacion"
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
                <h2 class="text-2xl font-bold">Modificar Horarios</h2>
                <p class="text-blue-100 text-sm mt-0.5">{{ asignacionSeleccionada?.nombres }} {{ asignacionSeleccionada?.apellido_paterno }}</p>
              </div>
            </div>
            <button @click="cerrarModalAsignacion" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
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
                  <span v-if="horariosSeleccionados.includes(horario.id)" class="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">Seleccionado</span>
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
          <button @click="cerrarModalAsignacion" class="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow">
            Cancelar
          </button>
          <button
            @click="guardarCambiosAsignacion"
            :disabled="guardandoAsignacion || horariosSeleccionados.length === 0"
            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md flex items-center gap-2"
          >
            <svg v-if="!guardandoAsignacion" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div v-else class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            {{ guardandoAsignacion ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Premium -->
    <transition name="modal">
      <div
        v-if="modalOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all max-h-[90vh] overflow-y-auto"
        >
          <!-- Header del Modal -->
          <div
            class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-3xl sticky top-0 z-10"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                {{ editMode ? "Editar Horario" : "Registrar Horario" }}
              </h3>

              <button
                @click="closeModal"
                class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all"
                :disabled="saving"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido del Modal -->
          <div class="p-6 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <!-- Turno -->
              <div class="col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Turno
                </label>
                <select
                  v-model="form.nombre_turno"
                  class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Seleccione un turno</option>
                  <option value="MAÑANA">☀️ Mañana</option>
                  <option value="TARDE">🌤️ Tarde</option>
                  <option value="NOCHE">🌙 Noche</option>
                </select>
              </div>

              <!-- Hora Entrada -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Hora de Entrada
                </label>
                <input
                  type="time"
                  v-model="form.hora_entrada"
                  class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <!-- Hora Salida -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Hora de Salida
                </label>
                <input
                  type="time"
                  v-model="form.hora_salida"
                  class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <!-- Tolerancia Entrada -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tolerancia Entrada (min)
                </label>
                <input
                  type="number"
                  v-model.number="form.tolerancia_entrada_minutos"
                  min="0"
                  max="60"
                  class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ej: 5"
                />
              </div>

              <!-- Tolerancia Salida -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tolerancia Salida (min)
                </label>
                <input
                  type="number"
                  v-model.number="form.tolerancia_salida_minutos"
                  min="0"
                  max="60"
                  class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ej: 5"
                />
              </div>
            </div>

            <!-- Días de la semana -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                Días de la semana
              </label>
              <div class="grid grid-cols-7 gap-2">
                <label
                  v-for="d in diasOpciones"
                  :key="d.valor"
                  class="relative cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    :value="d.valor"
                    v-model="form.dias_semana"
                    class="peer sr-only"
                  />
                  <div
                    class="flex flex-col items-center justify-center p-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 peer-checked:shadow-md transition-all hover:scale-105"
                  >
                    <span
                      class="text-xs font-bold text-gray-700 dark:text-gray-300 peer-checked:text-blue-600 dark:peer-checked:text-blue-400"
                    >
                      {{ d.valor }}
                    </span>
                    <span class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      {{ d.nombre.substring(0, 3) }}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer del Modal -->
          <div
            class="bg-gray-50 dark:bg-gray-750 px-6 py-4 rounded-b-3xl flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0"
          >
            <button
              class="px-6 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50 order-2 sm:order-1"
              @click="closeModal"
              :disabled="saving"
            >
              Cancelar
            </button>

            <button
              class="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 order-1 sm:order-2"
              @click="saveHorario"
              :disabled="saving"
            >
              <svg
                v-if="saving"
                class="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span v-if="saving">Guardando...</span>
              <span v-else>{{ editMode ? "Actualizar" : "Guardar" }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import api, { institucionesService } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import { useAlert } from "@/utils/sweetalert";

const auth = useAuthStore();
const alert = useAlert();

const instituciones = ref([]); // cache local (lo que venga de /instituciones/mias)
const horarios = ref([]);
const institucionId = ref("");

const loadingInstituciones = ref(false);
const loadingHorarios = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editMode = ref(false);

// Buscador server-side (mismo patrón que Docentes)
const institucionSearchQuery = ref("");
const showInstitucionDropdown = ref(false);
const filteredInstituciones = ref([]);
const loadingInstitucionesBuscador = ref(false);

let instDebounce = null;
let instAbort = null;

// cache de institución seleccionada (evita depender del array completo)
const selectedInstitucionNombre = ref(null);
const selectedInstitucionCodigo = ref(null);

const form = ref({
  id: null,
  institucion_id: "",
  nombre_turno: "",
  hora_entrada: "",
  hora_salida: "",
  tolerancia_entrada_minutos: 5,
  tolerancia_salida_minutos: 5,
  dias_semana: [],
});

// Tabs
const activeTab = ref('turnos');

// Asignaciones
const asignaciones = ref([]);
const loadingAsignaciones = ref(false);
const filtrosAsignaciones = ref({
  usuario: '',
  institucion: '',
  institucion_id: '',
});

// Historial
const historial = ref([]);
const loadingHistorial = ref(false);
const filtrosHistorial = ref({
  fecha_desde: '',
  fecha_hasta: '',
});

// Modal asignación
const mostrarModalAsignacion = ref(false);
const asignacionSeleccionada = ref(null);
const horariosDisponibles = ref([]);
const horariosSeleccionados = ref([]);
const guardandoAsignacion = ref(false);

const diasOpciones = [
  { nombre: "Lunes", valor: "L" },
  { nombre: "Martes", valor: "M" },
  { nombre: "Miércoles", valor: "X" },
  { nombre: "Jueves", valor: "J" },
  { nombre: "Viernes", valor: "V" },
  { nombre: "Sábado", valor: "S" },
  { nombre: "Domingo", valor: "D" },
];

// Filtros state
const filtros = ref({
  turno: "",
  dia: "",
});

// Computed: Estadísticas
const statistics = computed(() => {
  const total = horarios.value.length;
  const manana = horarios.value.filter(h => h.nombre_turno === 'MAÑANA').length;
  const tarde = horarios.value.filter(h => h.nombre_turno === 'TARDE').length;
  const noche = horarios.value.filter(h => h.nombre_turno === 'NOCHE').length;
  
  return { total, manana, tarde, noche };
});

// Computed: Horarios filtrados
const horariosFiltrados = computed(() => {
  let resultado = horarios.value;

  // Filtrar por turno
  if (filtros.value.turno) {
    resultado = resultado.filter(h => h.nombre_turno === filtros.value.turno);
  }

  // Filtrar por día
  if (filtros.value.dia) {
    resultado = resultado.filter(h => {
      const dias = h.dias_laborales || h.dias_semana;
      if (!dias) return false;
      if (Array.isArray(dias)) return dias.includes(filtros.value.dia);
      if (typeof dias === 'string') {
        try {
          const parsed = JSON.parse(dias);
          return Array.isArray(parsed) && parsed.includes(filtros.value.dia);
        } catch {
          return dias.includes(filtros.value.dia);
        }
      }
      return false;
    });
  }

  return resultado;
});

// Computed: Verificar si hay filtros activos
const filtroActivo = computed(() => {
  return filtros.value.turno || filtros.value.dia;
});

// Método: Limpiar filtros
const limpiarFiltros = () => {
  filtros.value.turno = "";
  filtros.value.dia = "";
};

// Computed: Instituciones sin horarios
const institucionesSinHorarios = computed(() => {
  if (!instituciones.value.length) return [];
  
  // Obtener IDs de instituciones con horarios
  const institucionesConHorarios = new Set();
  horarios.value.forEach(h => {
    if (h.institucion_id) {
      institucionesConHorarios.add(h.institucion_id);
    }
  });

  // Filtrar instituciones que NO tienen horarios
  return instituciones.value.filter(inst => !institucionesConHorarios.has(inst.id));
});

// Método: Crear horario para institución específica
const crearHorarioParaInstitucion = (instId) => {
  institucionId.value = instId;
  
  // Actualizar cache de institución seleccionada
  const inst = instituciones.value.find(i => i.id === instId);
  if (inst) {
    selectedInstitucionNombre.value = inst.nombre;
    selectedInstitucionCodigo.value = inst.codigo_modular_ie;
    institucionSearchQuery.value = `IE ${inst.nombre}`;
  }
  
  // Abrir modal de creación
  openCreate();
};

const mostrarSelector = computed(() => {
  return (
    auth.user?.rol === "administrador" ||
    auth.user?.rol === "super_admin" ||
    instituciones.value.length > 1
  );
});

const formatearDias = (dias) => {
  if (!dias) return "Sin días";
  if (Array.isArray(dias)) return dias.join(", ");
  try {
    if (typeof dias === "string" && dias.startsWith("["))
      return JSON.parse(dias).join(", ");
  } catch {}
  if (typeof dias === "string" && dias.includes(",")) {
    return dias
      .split(",")
      .map((d) => d.trim())
      .join(", ");
  }
  return dias;
};

const formatearHora = (hora) => (hora && hora.length > 5 ? hora.substring(0, 5) : hora);

// =========================
// Instituciones (server-side)
// =========================
const onFocusInstitucion = () => {
  showInstitucionDropdown.value = true;

  // si ya hay texto, buscar; si no, mostrar sugerencias (primeras 10 de cache)
  const term = (institucionSearchQuery.value || "").trim();
  if (!term) {
    filteredInstituciones.value = instituciones.value.slice(0, 10);
  } else {
    onInputBuscarInstitucion();
  }
};

const onInputBuscarInstitucion = () => {
  const term = (institucionSearchQuery.value || "").trim();
  showInstitucionDropdown.value = true;

  // si vacío, sugerencias de cache
  if (!term) {
    if (instAbort) instAbort.abort();
    loadingInstitucionesBuscador.value = false;
    filteredInstituciones.value = instituciones.value.slice(0, 10);
    return;
  }

  if (instDebounce) clearTimeout(instDebounce);

  instDebounce = setTimeout(async () => {
    if (instAbort) instAbort.abort();
    instAbort = new AbortController();

    loadingInstitucionesBuscador.value = true;

    try {
      // ✅ Usar el mismo endpoint que la vista de Instituciones
      const r = await institucionesService.getAll(
        { search: term, limit: 10 },
        { signal: instAbort.signal }
      );
      // Normalizar respuesta (puede venir con data.data o data directamente)
      const data = r.data.data || r.data;
      filteredInstituciones.value = Array.isArray(data) ? data : [];
    } catch (e) {
      if (e?.name !== "AbortError" && e?.code !== "ERR_CANCELED") {
        console.error("❌ Error buscando instituciones:", e);
        filteredInstituciones.value = [];
      }
    } finally {
      loadingInstitucionesBuscador.value = false;
    }
  }, 300);
};

const seleccionarInstitucion = async (inst) => {
  institucionId.value = inst.id;
  institucionSearchQuery.value = inst.nombre;

  selectedInstitucionNombre.value = inst.nombre;
  selectedInstitucionCodigo.value = inst.codigo_modular_ie;

  showInstitucionDropdown.value = false;
  await Promise.all([
    loadHorarios(),
    cargarAsignaciones(),
    cargarHistorial()
  ]);
};

const limpiarInstitucion = () => {
  if (instAbort) instAbort.abort();
  if (instDebounce) clearTimeout(instDebounce);

  institucionId.value = "";
  institucionSearchQuery.value = "";
  selectedInstitucionNombre.value = null;
  selectedInstitucionCodigo.value = null;

  showInstitucionDropdown.value = false;
  filteredInstituciones.value = [];
  horarios.value = [];
};

const getInstitucionNombre = (institucionIdParam) => {
  const inst = instituciones.value.find(
    (i) => String(i.id) === String(institucionIdParam)
  );
  return inst?.nombre || "Desconocida";
};

const getInstitucionCodigo = (institucionIdParam) => {
  const inst = instituciones.value.find(
    (i) => String(i.id) === String(institucionIdParam)
  );
  return inst?.codigo_modular_ie || "N/A";
};

// Método para el dropdown select (supervisores)
const onSelectInstitucion = async () => {
  if (!institucionId.value) {
    selectedInstitucionNombre.value = null;
    selectedInstitucionCodigo.value = null;
    horarios.value = [];
    asignaciones.value = [];
    historial.value = [];
    return;
  }
  
  const inst = instituciones.value.find(i => String(i.id) === String(institucionId.value));
  if (inst) {
    selectedInstitucionNombre.value = inst.nombre;
    selectedInstitucionCodigo.value = inst.codigo_modular_ie;
  }
  
  await Promise.all([
    loadHorarios(),
    cargarAsignaciones(),
    cargarHistorial()
  ]);
};

// ✅ Click-outside robusto (no depende de clases genéricas)
const handleClickOutside = (event) => {
  const insideSearch = event.target.closest(".inst-search-horarios");
  const insideDropdown = event.target.closest(".inst-dropdown-horarios");
  if (!insideSearch && !insideDropdown) {
    showInstitucionDropdown.value = false;
  }
};

// =========================
// Load instituciones
// =========================
const loadInstituciones = async () => {
  loadingInstituciones.value = true;

  try {
    // ✅ siempre usar /instituciones/mias (backend filtra por rol)
    const r = await institucionesService.getMias();
    const list = r.data?.data || r.data || [];

    instituciones.value = Array.isArray(list) ? list : [];

    // si hay al menos 1, seleccionar la primera por defecto
    if (instituciones.value.length >= 1) {
      const inst = instituciones.value[0];

      institucionId.value = inst.id;
      institucionSearchQuery.value = inst.nombre;

      selectedInstitucionNombre.value = inst.nombre;
      selectedInstitucionCodigo.value = inst.codigo_modular_ie;

      // precargar sugerencias
      filteredInstituciones.value = instituciones.value.slice(0, 10);

      await Promise.all([
        loadHorarios(),
        cargarAsignaciones(),
        cargarHistorial()
      ]);
    } else {
      // no hay instituciones asignadas
      institucionId.value = "";
      institucionSearchQuery.value = "";
      horarios.value = [];
    }
  } catch (e) {
    console.error("❌ Error cargando instituciones:", e);
    alert.error("Error", "No se pudieron cargar las instituciones");
  } finally {
    loadingInstituciones.value = false;
  }
};

// =========================
// Load horarios
// =========================
const loadHorarios = async () => {
  horarios.value = [];
  if (!institucionId.value) return;

  loadingHorarios.value = true;

  try {
    // asumo tu backend filtra por institucion_id
    const r = await api.get(`/horarios?institucion_id=${institucionId.value}`);
    const data = Array.isArray(r.data) ? r.data : r.data?.data ?? [];

    horarios.value = (Array.isArray(data) ? data : []).filter(
      (h) => String(h.institucion_id) === String(institucionId.value)
    );
  } catch (e) {
    console.error("❌ Error cargando horarios:", e);
    if (e.response?.status === 422) {
      const errors = e.response?.data?.errors;
      if (errors) {
        const errorMsg = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        alert.error("Error de validación", errorMsg);
      } else {
        alert.error(
          "Error de validación",
          e.response?.data?.message || "Datos inválidos"
        );
      }
    } else {
      alert.error("Error", "No se pudieron cargar los horarios");
    }
    horarios.value = [];
  } finally {
    loadingHorarios.value = false;
  }
};

// =========================
// Modal create/edit
// =========================
const openCreate = () => {
  if (!institucionId.value) {
    alert.error("Error", "Debe seleccionar una institución primero");
    return;
  }

  editMode.value = false;
  form.value = {
    id: null,
    institucion_id: institucionId.value,
    nombre_turno: "",
    hora_entrada: "",
    hora_salida: "",
    tolerancia_entrada_minutos: 5,
    tolerancia_salida_minutos: 5,
    dias_semana: [],
  };
  modalOpen.value = true;
};

const openEdit = (h) => {
  editMode.value = true;

  const parseDias = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      const s = val.trim();
      if (!s) return [];
      if (s.startsWith("[")) {
        try {
          const arr = JSON.parse(s);
          return Array.isArray(arr) ? arr : [];
        } catch {
          // fallback a split
        }
      }
      return s
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
    }
    return [];
  };

  const diasArray = parseDias(h.dias_laborales || h.dias_semana);

  form.value = {
    id: h.id,
    institucion_id: h.institucion_id || institucionId.value,
    nombre_turno: h.nombre_turno,
    hora_entrada: h.hora_entrada,
    hora_salida: h.hora_salida,
    tolerancia_entrada_minutos: h.tolerancia_entrada_minutos || h.tolerancia_minutos || 5,
    tolerancia_salida_minutos: h.tolerancia_salida_minutos || h.tolerancia_minutos || 5,
    dias_semana: diasArray,
  };

  modalOpen.value = true;
};

const closeModal = () => {
  if (!saving.value) modalOpen.value = false;
};

// =========================
// Save / Delete
// =========================
const saveHorario = async () => {
  if (!form.value.nombre_turno) return alert.error("Validación", "Seleccione un turno");
  if (!form.value.hora_entrada || !form.value.hora_salida)
    return alert.error("Validación", "Complete la hora de entrada y salida");
  if (!form.value.dias_semana.length)
    return alert.error("Validación", "Seleccione al menos un día");

  const formatoHora12 = (hora24) => {
    const [horas, minutos] = hora24.split(":");
    let h = parseInt(horas, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minutos} ${ampm}`;
  };

  const validarHorarioTurno = () => {
    // Validación desactivada por solicitud del usuario
    return { valido: true };
  };

  const validacion = validarHorarioTurno();
  if (!validacion.valido) return alert.error("Validación de Turno", validacion.mensaje);

  if (form.value.hora_entrada >= form.value.hora_salida) {
    return alert.error(
      "Validación",
      "La hora de salida debe ser posterior a la hora de entrada"
    );
  }

  saving.value = true;

  try {
    const sanitizar = (h) => (h && h.length > 5 ? h.substring(0, 5) : h);

    const payload = {
      institucion_id: form.value.institucion_id,
      nombre_turno: form.value.nombre_turno,
      hora_entrada: sanitizar(form.value.hora_entrada),
      hora_salida: sanitizar(form.value.hora_salida),
      tolerancia_entrada_minutos: form.value.tolerancia_entrada_minutos,
      tolerancia_salida_minutos: form.value.tolerancia_salida_minutos,
      dias_semana: form.value.dias_semana,
      activo: true,
    };

    if (editMode.value) {
      await api.put(`/horarios/${form.value.id}`, payload);
      alert.toastSuccess("Horario actualizado");
    } else {
      await api.post(`/horarios`, payload);
      alert.toastSuccess("Horario registrado");
    }

    await loadHorarios();
    modalOpen.value = false;
  } catch (e) {
    console.error("❌ Error guardando horario:", e);

    if (e.response?.data?.errors) {
      const traducciones = {
        hora_entrada: "Hora de entrada",
        hora_salida: "Hora de salida",
        nombre_turno: "Nombre del turno",
        tolerancia_minutos: "Tolerancia en minutos",
        dias_semana: "Días de la semana",
        institucion_id: "Institución",
      };

      const traducirMsg = (msg) => {
        if (msg.includes("required")) return "es requerido";
        if (msg.includes("invalid")) return "no es válido";
        if (msg.includes("must be")) return "no cumple el formato requerido";
        return msg;
      };

      const errores = Object.entries(e.response.data.errors)
        .map(
          ([campo, msgs]) =>
            `${traducciones[campo] || campo}: ${(msgs || []).map(traducirMsg).join(", ")}`
        )
        .join("<br>");

      alert.error("Errores de validación", errores);
    } else {
      alert.error("Error", e.response?.data?.message || "Error guardando horario");
    }
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (id) => {
  const r = await alert.confirmDelete(
    "¿Eliminar horario?",
    "Esta acción no se puede deshacer"
  );
  if (!r.isConfirmed) return;

  try {
    await api.delete(`/horarios/${id}`);
    await loadHorarios();
    alert.toastSuccess("Horario eliminado");
  } catch (e) {
    console.error("❌ Error eliminando horario:", e);
    alert.error("Error", "No se pudo eliminar el horario");
  }
};

// =========================
// Asignaciones
// =========================
const cargarAsignaciones = async () => {
  if (!institucionId.value) return;
  loadingAsignaciones.value = true;
  try {
    const filtros = { ...filtrosAsignaciones.value };
    if (institucionId.value) filtros.institucion_id = institucionId.value;
    const response = await api.get('/horarios/asignaciones', { params: filtros });
    asignaciones.value = response.data.data || [];
  } catch (error) {
    console.error('Error al cargar asignaciones:', error);
    asignaciones.value = [];
  } finally {
    loadingAsignaciones.value = false;
  }
};

// =========================
// Historial
// =========================
const cargarHistorial = async () => {
  if (!institucionId.value) return;
  loadingHistorial.value = true;
  try {
    const filtros = { ...filtrosHistorial.value };
    if (institucionId.value) filtros.institucion_id = institucionId.value;
    const response = await api.get('/horarios/historial', { params: filtros });
    historial.value = response.data.data || [];
  } catch (error) {
    console.error('Error al cargar historial:', error);
    historial.value = [];
  } finally {
    loadingHistorial.value = false;
  }
};

// =========================
// Modal Asignación
// =========================
const abrirModalEdicion = async (asignacion) => {
  asignacionSeleccionada.value = asignacion;
  mostrarModalAsignacion.value = true;
  
  try {
    // Cargar horarios reales desde la API
    const response = await api.get(`/horarios?institucion_id=${asignacion.institucion_id}`);
    horariosDisponibles.value = response.data || [];
    
    // Mapear horarios seleccionados
    horariosSeleccionados.value = asignacion.horarios ? asignacion.horarios.split(', ').map((_, i) => i + 1) : [];
  } catch (error) {
    console.error('Error al cargar horarios:', error);
    horariosDisponibles.value = [];
  }
};

const guardarCambiosAsignacion = async () => {
  if (horariosSeleccionados.value.length === 0) {
    alert.error("Validación", "Debes seleccionar al menos un horario");
    return;
  }

  guardandoAsignacion.value = true;
  try {
    await api.post('/horarios/modificar-asignacion', {
      usuario_app_id: asignacionSeleccionada.value.usuario_id,
      institucion_id: asignacionSeleccionada.value.institucion_id,
      horario_ids: horariosSeleccionados.value,
    });
    
    alert.toastSuccess("Horarios modificados correctamente");
    cerrarModalAsignacion();
    await Promise.all([cargarAsignaciones(), cargarHistorial()]);
  } catch (error) {
    console.error('Error al guardar:', error);
    alert.error("Error", "No se pudieron guardar los cambios");
  } finally {
    guardandoAsignacion.value = false;
  }
};

const cerrarModalAsignacion = () => {
  mostrarModalAsignacion.value = false;
  asignacionSeleccionada.value = null;
  horariosSeleccionados.value = [];
};

// =========================
// Helpers
// =========================
const toggleHorario = (horarioId) => {
  const index = horariosSeleccionados.value.indexOf(horarioId);
  if (index > -1) {
    horariosSeleccionados.value.splice(index, 1);
  } else {
    horariosSeleccionados.value.push(horarioId);
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatHorarios = (ids) => {
  if (!Array.isArray(ids)) return '-';
  return ids.map(id => `Horario ${id}`).join(', ');
};

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  loadInstituciones();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  if (instAbort) instAbort.abort();
  if (instDebounce) clearTimeout(instDebounce);
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

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
