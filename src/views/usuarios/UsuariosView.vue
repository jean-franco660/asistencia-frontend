<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6"
  >
    <div class="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <!-- Header Premium -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex-1 min-w-0">
          <h1
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 truncate"
          >
            Gestión de Docentes
          </h1>
          <p
            class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 truncate"
          >
            Administra y organiza los docentes del sistema
          </p>
        </div>
        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0"
        >
          <Users :size="24" class="text-white sm:w-8 sm:h-8" />
        </div>
      </div>

      <!-- ⭐ NUEVO: Banner de importación en progreso -->
      <div
        v-if="isPollingStats"
        class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4 animate-fadeIn"
      >
        <div class="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
          <div class="flex items-center gap-3 flex-1">
            <Loader2
              :size="20"
              class="text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p
                class="font-semibold text-blue-900 dark:text-blue-100 text-sm sm:text-base"
              >
                Importación en progreso
              </p>
              <p class="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                Actualización automática cada 3 segundos
              </p>
            </div>
          </div>
          <button
            @click="stopStatsPolling"
            class="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap"
          >
            Detener
          </button>
        </div>
      </div>

      <!-- Estadísticas de Importación -->
      <div v-if="estadisticasImportacion" class="space-y-3 sm:space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Total Docentes -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p
                  class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Total Docentes
                </p>
                <p
                  class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2"
                >
                  {{ estadisticasImportacion.total || 0 }}
                </p>
              </div>
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 ml-2"
              >
                <Users
                  :size="20"
                  class="text-blue-600 dark:text-blue-400 sm:w-6 sm:h-6"
                />
              </div>
            </div>
          </div>

          <!-- Última Importación -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p
                  class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Última Importación
                </p>
                <p
                  class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 truncate"
                >
                  {{ estadisticasImportacion.ultima_importacion?.fecha || "N/A" }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ estadisticasImportacion.ultima_importacion?.hora || "" }}
                </p>
              </div>
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 ml-2"
              >
                <Upload
                  :size="20"
                  class="text-purple-600 dark:text-purple-400 sm:w-6 sm:h-6"
                />
              </div>
            </div>
          </div>

          <!-- Importados -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p
                  class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Importados
                </p>
                <p
                  class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mt-1 sm:mt-2"
                >
                  {{ estadisticasImportacion.ultima_importacion?.exitosos || 0 }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  de
                  {{ estadisticasImportacion.ultima_importacion?.total || 0 }} registros
                </p>
              </div>
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 ml-2"
              >
                <svg
                  class="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Errores -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Errores
                </p>
                <p class="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                  {{ estadisticasImportacion.ultima_importacion?.errores_count || 0 }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  última importación
                </p>
              </div>
              <div
                class="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- ⭐ NUEVO: Banner de Errores con Botón de Descarga -->
        <div
          v-if="
            estadisticasImportacion.ultima_importacion?.errores_count > 0 &&
            estadisticasImportacion.ultima_importacion?.id
          "
          class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4 animate-fadeIn"
        >
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0"
              >
                <svg
                  class="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-yellow-900 dark:text-yellow-100">
                  La última importación tuvo
                  {{ estadisticasImportacion.ultima_importacion.errores_count }} error(es)
                </p>
                <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Descarga el reporte para revisar los detalles de los errores y
                  corregirlos
                </p>
              </div>
            </div>

            <button
              @click="descargarReporteErrores"
              :disabled="descargandoErrores"
              class="flex items-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Loader2 v-if="descargandoErrores" :size="18" class="animate-spin" />
              <Download v-else :size="18" />
              <span>{{
                descargandoErrores ? "Descargando..." : "Descargar Errores"
              }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Card Principal -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Header con filtros -->
        <div
          class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600"
        >
          <div class="flex flex-col gap-4">
            <!-- Barra de búsqueda y ordenamiento -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="flex items-center gap-3 flex-1">
                <Search :size="20" class="text-gray-400" />
                <InputField
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar docente..."
                  @input="debounceSearch"
                  class="!border-0 !bg-transparent !focus:ring-0 flex-1"
                />
              </div>

              <!-- ⭐ NUEVO: Selector de ordenamiento -->
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-600 dark:text-gray-400 whitespace-nowrap"
                  >Ordenar por:</span
                >
                <select
                  v-model="sorting.sortBy"
                  @change="loadUsuarios"
                  class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="id">Orden de importación</option>
                  <option value="codigo_modular">Código modular</option>
                  <option value="apellido_paterno">Apellido paterno</option>
                  <option value="apellido_materno">Apellido materno</option>
                  <option value="nombres">Nombres</option>
                </select>
                <button
                  @click="
                    sorting.sortOrder = sorting.sortOrder === 'asc' ? 'desc' : 'asc';
                    loadUsuarios();
                  "
                  class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :title="sorting.sortOrder === 'asc' ? 'Ascendente' : 'Descendente'"
                >
                  <ChevronUp
                    v-if="sorting.sortOrder === 'asc'"
                    :size="18"
                    class="text-gray-600 dark:text-gray-300"
                  />
                  <ChevronDown
                    v-else
                    :size="18"
                    class="text-gray-600 dark:text-gray-300"
                  />
                </button>
              </div>
            </div>

            <!-- Filtros y botones -->
            <div class="space-y-3">
              <!-- Fila de filtros -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Filtro Estado -->
                <select
                  v-model="filterStatus"
                  @change="handleFilterChange"
                  class="w-full px-3 sm:px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Todos los estados</option>
                  <option value="activo">✓ Activos</option>
                  <option value="inactivo">✗ Inactivos</option>
                </select>

                <!-- Filtro Institución con Búsqueda -->
                <div class="relative">
                  <div class="relative">
                    <input
                      type="text"
                      v-model="institucionSearchQuery"
                      @input="buscarInstitucionFiltro"
                      @focus="showInstitucionDropdown = true"
                      placeholder="Buscar institución por nombre o código..."
                      class="w-full pl-9 pr-10 px-3 sm:px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <!-- Botón limpiar -->
                    <button
                      v-if="filterInstitucion"
                      @click="limpiarFiltroInstitucion"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      type="button"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Dropdown de resultados -->
                  <div
                    v-if="showInstitucionDropdown && filteredInstituciones.length"
                    class="absolute z-50 w-full mt-1 max-h-64 overflow-auto bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-xl shadow-2xl"
                  >
                    <button
                      type="button"
                      v-for="inst in filteredInstituciones"
                      :key="inst.id"
                      @click="seleccionarInstitucionFiltro(inst)"
                      class="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all border-b border-gray-100 dark:border-gray-700 last:border-b-0 group"
                      :class="{
                        'bg-blue-50 dark:bg-blue-900/20': filterInstitucion === inst.id,
                        'first:rounded-t-xl last:rounded-b-xl': true,
                      }"
                    >
                      <div class="flex items-start gap-3">
                        <div
                          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform"
                        >
                          <Building2 :size="20" class="text-white" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p
                            class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                          >
                            {{ inst.nombre }}
                          </p>
                          <div class="flex items-center gap-2 mt-1">
                            <span
                              class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                            >
                              <Hash :size="12" class="mr-1" />
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
                        <div v-if="filterInstitucion === inst.id" class="flex-shrink-0">
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

                  <!-- Institución seleccionada -->
                  <div
                    v-if="filterInstitucion"
                    class="mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-sm"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                      >
                        <Building2 :size="20" class="text-white" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p
                          class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                        >
                          {{ getInstitucionNombreFiltro(filterInstitucion) }}
                        </p>
                        <div class="flex items-center gap-2 mt-1">
                          <span
                            class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                          >
                            <Hash :size="12" class="mr-1" />
                            {{ getInstitucionCodigoFiltro(filterInstitucion) }}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        @click="limpiarFiltroInstitucion"
                        class="flex-shrink-0 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-all hover:scale-110"
                        title="Quitar filtro"
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

                  <!-- Mensaje si no hay resultados -->
                  <div
                    v-if="
                      showInstitucionDropdown &&
                      institucionSearchQuery &&
                      !filteredInstituciones.length
                    "
                    class="absolute z-50 w-full mt-1 p-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-xl"
                  >
                    <div class="flex flex-col items-center gap-2 py-2">
                      <div
                        class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                      >
                        <Search :size="24" class="text-gray-400" />
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
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <!-- Botón eliminar seleccionados -->
                <ButtonComponent
                  v-if="selectedIds.length > 0"
                  variant="danger"
                  @click="confirmBulkDelete"
                  class="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white animate-fadeIn w-full sm:flex-1"
                >
                  <Trash2 :size="18" class="sm:w-5 sm:h-5" />
                  <span class="text-sm sm:text-base"
                    >Eliminar ({{ selectedIds.length }})</span
                  >
                </ButtonComponent>
                <ButtonComponent
                  variant="secondary"
                  @click="openImportModal"
                  class="flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full sm:w-auto"
                >
                  <Upload :size="18" class="sm:w-5 sm:h-5" />
                  <span class="text-sm sm:text-base">
                    <span class="hidden sm:inline">Importar Excel</span>
                    <span class="sm:hidden">Importar</span>
                  </span>
                </ButtonComponent>
                <ButtonComponent
                  variant="primary"
                  @click="openCreateModal"
                  class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
                >
                  <Plus :size="18" class="sm:w-5 sm:h-5" />
                  <span class="text-sm sm:text-base">
                    <span class="hidden sm:inline">Nuevo Docente</span>
                    <span class="sm:hidden">Nuevo</span>
                  </span>
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla Premium -->
        <div v-if="loading" class="p-12 text-center">
          <Loader2 :size="48" class="inline-block animate-spin text-blue-600 mb-4" />
          <p class="text-gray-500 dark:text-gray-400">Cargando docentes...</p>
        </div>

        <div v-else>
          <!-- 📱 VISTA DE TARJETAS - Solo visible en móvil (< 768px) -->
          <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="docente in sortedUsuarios"
              :key="docente.id"
              class="p-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              :class="{
                'bg-blue-50 dark:bg-blue-900/20': selectedIds.includes(docente.id),
              }"
            >
              <!-- Header de la tarjeta -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    :checked="selectedIds.includes(docente.id)"
                    @change="toggleSelection(docente.id)"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer mt-1"
                  />
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {{ toTitleCase(docente.nombre_completo) }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span class="font-medium">Código:</span> {{ docente.codigo }}
                    </p>
                  </div>
                </div>

                <!-- Acciones -->
                <div class="flex gap-2 ml-2">
                  <button
                    @click="openEditModal(docente)"
                    class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                  >
                    <Edit2 :size="18" />
                  </button>
                  <button
                    @click="confirmDelete(docente)"
                    class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                  >
                    <Trash2 :size="18" />
                  </button>
                </div>
              </div>

              <!-- Información adicional -->
              <div class="grid grid-cols-2 gap-3 text-sm">
                <!-- Sexo -->
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Sexo</p>
                  <span
                    :class="
                      docente.sexo === 'M'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                    "
                    class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ docente.sexo === "M" ? "M" : "F" }}
                  </span>
                </div>

                <!-- Cargo -->
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Cargo</p>
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 truncate"
                  >
                    {{ toTitleCase(docente.cargo || "DOCENTE") }}
                  </span>
                </div>

                <!-- Estado -->
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Estado</p>
                  <span
                    :class="
                      docente.estado === 'ACTIVO'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    "
                    class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ toTitleCase(docente.estado || "ACTIVO") }}
                  </span>
                </div>

                <!-- Acceso -->
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Acceso</p>
                  <span
                    :class="
                      docente.activo
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    "
                    class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ docente.activo ? "Habilitado" : "Bloqueado" }}
                  </span>
                </div>
              </div>

              <!-- Instituciones -->
              <div v-if="docente.instituciones?.length" class="mt-3">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Instituciones</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="inst in docente.instituciones.slice(0, 2)"
                    :key="inst.id"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {{ inst.nombre_display }}
                  </span>
                  <span
                    v-if="docente.instituciones.length > 2"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    +{{ docente.instituciones.length - 2 }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Mensaje si no hay docentes -->
            <div v-if="!usuarios.length" class="p-12 text-center">
              <div class="flex flex-col items-center gap-3">
                <div
                  class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  <Users :size="32" class="text-gray-400" />
                </div>
                <p class="text-gray-500 dark:text-gray-400 font-medium">
                  No se encontraron docentes
                </p>
                <p class="text-gray-400 dark:text-gray-500 text-sm">
                  Crea uno nuevo o importa desde un archivo
                </p>
              </div>
            </div>
          </div>

          <!-- 💻 VISTA DE TABLA - Oculta en móvil, visible desde tablet -->
          <div class="hidden md:block">
            <div class="overflow-x-auto scrollbar-hide">
              <div class="inline-block min-w-full align-middle">
                <div class="overflow-hidden">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr
                        class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700"
                      >
                        <th class="px-4 lg:px-6 py-4 text-center w-12">
                          <input
                            type="checkbox"
                            :checked="isAllSelected"
                            @change="toggleSelectAll"
                            class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th
                          @click="handleSort('id')"
                          class="hidden xl:table-cell px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div class="flex items-center justify-center gap-1">
                            <span>ID</span>
                            <ChevronUp
                              v-if="
                                sorting.sortBy === 'id' && sorting.sortOrder === 'asc'
                              "
                              :size="14"
                            />
                            <ChevronDown
                              v-else-if="
                                sorting.sortBy === 'id' && sorting.sortOrder === 'desc'
                              "
                              :size="14"
                            />
                            <ChevronsUpDown v-else :size="14" class="text-gray-400" />
                          </div>
                        </th>
                        <th
                          @click="handleSort('apellido_paterno')"
                          class="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div class="flex items-center gap-1">
                            <span>Nombre</span>
                            <ChevronUp
                              v-if="
                                sorting.sortBy === 'apellido_paterno' &&
                                sorting.sortOrder === 'asc'
                              "
                              :size="14"
                            />
                            <ChevronDown
                              v-else-if="
                                sorting.sortBy === 'apellido_paterno' &&
                                sorting.sortOrder === 'desc'
                              "
                              :size="14"
                            />
                            <ChevronsUpDown v-else :size="14" class="text-gray-400" />
                          </div>
                        </th>
                        <th
                          @click="handleSort('codigo_modular')"
                          class="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div class="flex items-center gap-1">
                            <span>Código</span>
                            <ChevronUp
                              v-if="
                                sorting.sortBy === 'codigo_modular' &&
                                sorting.sortOrder === 'asc'
                              "
                              :size="14"
                            />
                            <ChevronDown
                              v-else-if="
                                sorting.sortBy === 'codigo_modular' &&
                                sorting.sortOrder === 'desc'
                              "
                              :size="14"
                            />
                            <ChevronsUpDown v-else :size="14" class="text-gray-400" />
                          </div>
                        </th>
                        <th
                          class="hidden lg:table-cell px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                        >
                          Sexo
                        </th>
                        <th
                          class="hidden xl:table-cell px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                        >
                          Cargo
                        </th>
                        <th
                          class="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                        >
                          Instituciones
                        </th>
                        <th
                          class="hidden lg:table-cell px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                        >
                          Estado
                        </th>
                        <th
                          class="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                        >
                          Acceso
                        </th>
                        <th
                          class="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                        >
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr
                        v-for="docente in sortedUsuarios"
                        :key="docente.id"
                        class="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        :class="{
                          'bg-blue-50 dark:bg-blue-900/20': selectedIds.includes(
                            docente.id
                          ),
                        }"
                      >
                        <td class="px-4 lg:px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            :checked="selectedIds.includes(docente.id)"
                            @change="toggleSelection(docente.id)"
                            class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td class="hidden xl:table-cell px-4 lg:px-6 py-4 text-center">
                          <span
                            class="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {{ docente.id }}
                          </span>
                        </td>
                        <td class="px-4 lg:px-6 py-4">
                          <p
                            class="text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100"
                          >
                            {{ toTitleCase(docente.nombre_completo) }}
                          </p>
                        </td>
                        <td class="px-4 lg:px-6 py-4">
                          <span
                            class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                          >
                            {{ docente.codigo }}
                          </span>
                        </td>
                        <td class="hidden lg:table-cell px-4 lg:px-6 py-4 text-center">
                          <span
                            :class="
                              docente.sexo === 'M'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                            "
                            class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm font-medium rounded-full"
                          >
                            {{ docente.sexo === "M" ? "M" : "F" }}
                          </span>
                        </td>
                        <td class="hidden xl:table-cell px-4 lg:px-6 py-4">
                          <span
                            class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          >
                            {{ toTitleCase(docente.cargo || "DOCENTE") }}
                          </span>
                        </td>
                        <td class="px-4 lg:px-6 py-4">
                          <div
                            v-if="docente.instituciones?.length"
                            class="flex flex-wrap gap-1 items-center"
                          >
                            <span
                              v-for="inst in docente.instituciones.slice(0, 1)"
                              :key="inst.id"
                              class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 truncate max-w-[120px]"
                            >
                              {{ inst.nombre_display }}
                            </span>
                            <span
                              v-if="docente.instituciones.length > 1"
                              class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 cursor-pointer hover:scale-105 transition-transform"
                              :title="
                                docente.instituciones
                                  .map((i) => i.nombre_display)
                                  .join('\n')
                              "
                            >
                              +{{ docente.instituciones.length - 1 }}
                            </span>
                          </div>
                          <span v-else class="text-gray-400 italic text-xs lg:text-sm"
                            >Sin instituciones</span
                          >
                        </td>
                        <td class="hidden lg:table-cell px-4 lg:px-6 py-4 text-center">
                          <span
                            :class="
                              docente.estado === 'ACTIVO'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            "
                            class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm font-medium rounded-full"
                          >
                            <span
                              v-if="docente.estado === 'ACTIVO'"
                              class="w-2 h-2 bg-green-500 rounded-full mr-1 lg:mr-2"
                            ></span>
                            <span
                              v-else
                              class="w-2 h-2 bg-gray-500 rounded-full mr-1 lg:mr-2"
                            ></span>
                            {{ toTitleCase(docente.estado || "ACTIVO") }}
                          </span>
                        </td>
                        <td class="px-4 lg:px-6 py-4 text-center">
                          <span
                            :class="
                              docente.activo
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            "
                            class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm font-medium rounded-full"
                          >
                            <span
                              v-if="docente.activo"
                              class="w-2 h-2 bg-green-500 rounded-full mr-1 lg:mr-2"
                            ></span>
                            <span
                              v-else
                              class="w-2 h-2 bg-red-500 rounded-full mr-1 lg:mr-2"
                            ></span>
                            <span class="hidden lg:inline">{{
                              docente.activo ? "Habilitado" : "Bloqueado"
                            }}</span>
                            <span class="lg:hidden">{{
                              docente.activo ? "✓" : "✗"
                            }}</span>
                          </span>
                        </td>
                        <td class="px-4 lg:px-6 py-4">
                          <div class="flex items-center justify-center gap-2">
                            <button
                              @click="openEditModal(docente)"
                              class="p-1.5 lg:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all hover:scale-110"
                              title="Editar"
                            >
                              <Edit2 :size="18" />
                            </button>
                            <button
                              @click="confirmDelete(docente)"
                              class="p-1.5 lg:p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all hover:scale-110"
                              title="Eliminar"
                            >
                              <Trash2 :size="18" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="!usuarios.length">
                        <td colspan="10" class="px-6 py-12 text-center">
                          <div class="flex flex-col items-center gap-3">
                            <div
                              class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                            >
                              <Users :size="32" class="text-gray-400" />
                            </div>
                            <p class="text-gray-500 dark:text-gray-400 font-medium">
                              No se encontraron docentes
                            </p>
                            <p class="text-gray-400 dark:text-gray-500 text-sm">
                              Crea uno nuevo o importa desde un archivo
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginación - AHORA VISIBLE FUERA DEL SCROLL -->
          <div
            class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 sm:px-6 py-3 sm:py-4"
          >
            <PaginationComponent
              :current-page="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="pagination.total"
              label="docentes"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </div>

      <!-- Modal Importar -->
      <ImportFileModal
        v-model="showImportModal"
        tipo="Docentes"
        :import-function="handleImportDocentes"
        :status-function="handleStatusDocentes"
        :download-template-function="handleDownloadTemplate"
        :download-error-report-function="handleDownloadErroresDocentes"
        @import-success="handleImportSuccess"
      />

      <!-- Modal Form -->
      <ModalComponent v-model="showModal" :title="''" @close="closeModal" size="xl">
        <div class="bg-white dark:bg-gray-800">
          <div
            class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 sm:px-8 py-6"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
              >
                <UserPlus :size="28" class="text-white" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">
                  {{ modalMode === "create" ? "Nuevo Docente" : "Editar Docente" }}
                </h3>
                <p class="text-blue-100 text-sm mt-1">
                  Complete la información del docente
                </p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 sm:p-8">
            <!-- SECCIÓN 1: INFORMACIÓN PERSONAL -->
            <div class="mb-8">
              <div class="flex items-center gap-2 mb-4">
                <div
                  class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                >
                  <User :size="18" class="text-blue-600 dark:text-blue-400" />
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                  Información Personal
                </h4>
              </div>

              <div class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                    >
                      Apellido Paterno *
                    </label>
                    <InputField
                      v-model="form.apellido_paterno"
                      type="text"
                      placeholder="García"
                      required
                      class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-lg hover:!border-blue-300 focus:!border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                    >
                      Apellido Materno *
                    </label>
                    <InputField
                      v-model="form.apellido_materno"
                      type="text"
                      placeholder="López"
                      required
                      class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-lg hover:!border-blue-300 focus:!border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                    >
                      Nombres *
                    </label>
                    <InputField
                      v-model="form.nombres"
                      type="text"
                      placeholder="Juan Carlos"
                      required
                      class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-lg hover:!border-blue-300 focus:!border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                    >
                      <div class="flex items-center gap-2">
                        <Hash :size="14" class="text-purple-600" />
                        Código Modular *
                      </div>
                    </label>
                    <InputField
                      v-model="form.codigo_modular"
                      type="text"
                      placeholder="DOC001"
                      required
                      maxlength="20"
                      class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-lg hover:!border-purple-300 focus:!border-purple-500 transition-colors"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                      Identificador único del docente
                    </p>
                  </div>

                  <div>
                    <label
                      class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                    >
                      Sexo
                    </label>
                    <select
                      v-model="form.sexo"
                      class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option :value="null">Seleccionar</option>
                      <option value="M">👨 Masculino</option>
                      <option value="F">👩 Femenino</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 my-8"></div>

            <!-- SECCIÓN 2: SEGURIDAD -->
            <div class="mb-8">
              <div class="flex items-center gap-2 mb-4">
                <div
                  class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                >
                  <Lock :size="18" class="text-red-600 dark:text-red-400" />
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white">Seguridad</h4>
              </div>

              <div>
                <label
                  class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  {{ modalMode === "create" ? "Contraseña *" : "Nueva Contraseña" }}
                </label>
                <input
                  v-model="form.password"
                  type="password"
                  :placeholder="
                    modalMode === 'create'
                      ? 'Ingrese la contraseña'
                      : 'Dejar vacío para mantener la actual'
                  "
                  :required="modalMode === 'create'"
                  class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  {{
                    modalMode === "create"
                      ? "Mínimo 8 caracteres recomendados"
                      : "Solo completar si desea cambiar la contraseña"
                  }}
                </p>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 my-8"></div>

            <!-- SECCIÓN 3: ASIGNACIONES -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"
                  >
                    <Building2 :size="18" class="text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                    Instituciones Asignadas
                  </h4>
                </div>

                <button
                  type="button"
                  @click="agregarAsignacion"
                  class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Plus :size="18" />
                  Agregar
                </button>
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Asigne al docente a una o más instituciones con su respectivo cargo
              </p>

              <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
                <div
                  v-for="(asignacion, index) in form.asignaciones"
                  :key="index"
                  class="group relative p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-lg"
                >
                  <div
                    class="flex items-center justify-between mb-4 pb-3 border-b border-gray-300 dark:border-gray-600"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center"
                      >
                        <span class="text-white font-bold text-sm">{{ index + 1 }}</span>
                      </div>
                      <h5 class="font-bold text-gray-900 dark:text-white">
                        Asignación {{ index + 1 }}
                      </h5>
                    </div>
                    <button
                      type="button"
                      @click="eliminarAsignacion(index)"
                      class="p-2 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:bg-red-600 rounded-lg transition-all"
                      title="Eliminar asignación"
                    >
                      <Trash2 :size="18" />
                    </button>
                  </div>

                  <div class="space-y-4">
                    <!-- ✅ Institución con Búsqueda (server-side /instituciones/mias) -->
                    <div>
                      <label
                        class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                      >
                        Institución *
                      </label>

                      <div class="relative inst-search-modal">
                        <div class="relative">
                          <Search
                            :size="16"
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            v-model="asignacion.institucion_search"
                            @input="buscarInstitucion(index)"
                            @focus="asignacion.show_dropdown = true"
                            placeholder="Buscar por nombre o código..."
                            class="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div
                          v-if="asignacion.show_dropdown"
                          class="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg inst-dropdown-modal"
                        >
                          <div
                            v-if="asignacion.loading_instituciones"
                            class="p-3 text-sm text-gray-500"
                          >
                            Buscando...
                          </div>

                          <button
                            v-else
                            type="button"
                            v-for="inst in asignacion.filtered_instituciones"
                            :key="inst.id"
                            @click="seleccionarInstitucion(index, inst)"
                            class="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                          >
                            <p
                              class="text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                              {{ inst.nombre }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                              Código: {{ inst.codigo_modular_ie }}
                            </p>
                          </button>

                          <div
                            v-if="
                              !asignacion.loading_instituciones &&
                              asignacion.institucion_search &&
                              !asignacion.filtered_instituciones?.length
                            "
                            class="p-3 text-sm text-gray-500 text-center"
                          >
                            No se encontraron instituciones
                          </div>
                        </div>

                        <div
                          v-if="asignacion.institucion_id"
                          class="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex-1 min-w-0">
                              <p
                                class="text-xs font-medium text-blue-900 dark:text-blue-100 truncate"
                              >
                                {{
                                  getInstitucionNombre(asignacion.institucion_id, index)
                                }}
                              </p>
                              <p class="text-xs text-blue-600 dark:text-blue-400">
                                {{
                                  getInstitucionCodigo(asignacion.institucion_id, index)
                                }}
                              </p>
                            </div>
                            <button
                              type="button"
                              @click="limpiarInstitucion(index)"
                              class="ml-2 p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                              title="Quitar institución"
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Cargo -->
                    <div>
                      <label
                        class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                      >
                        Cargo *
                      </label>
                      <input
                        type="text"
                        v-model="asignacion.cargo"
                        required
                        maxlength="50"
                        placeholder="Docente, Director, Coordinador..."
                        class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        Función del docente en esta institución
                      </p>
                    </div>

                    <!-- Estado y Fechas -->
                    <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                        >
                          Estado
                        </label>
                        <select
                          v-model="asignacion.estado"
                          class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        >
                          <option value="ACTIVO">✓ Activo</option>
                          <option value="INACTIVO">✗ Inactivo</option>
                        </select>
                      </div>

                      <div>
                        <label
                          class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                        >
                          Fecha Inicio
                        </label>
                        <input
                          type="date"
                          v-model="asignacion.fecha_inicio"
                          class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                        >
                          Fecha Fin
                        </label>
                        <input
                          type="date"
                          v-model="asignacion.fecha_fin"
                          :min="asignacion.fecha_inicio"
                          class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="form.asignaciones.length === 0"
                  class="text-center py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-800/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
                >
                  <div
                    class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-200 dark:bg-gray-600 flex items-center justify-center"
                  >
                    <Building2 :size="32" class="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    No hay instituciones asignadas
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Haz clic en "Agregar" para asignar una institución
                  </p>
                </div>
              </div>
            </div>

            <!-- BOTONES -->
            <div
              class="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-8 border-t-2 border-gray-200 dark:border-gray-700"
            >
              <ButtonComponent
                variant="secondary"
                @click="closeModal"
                type="button"
                class="px-6 py-3 rounded-xl font-semibold border-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all order-2 sm:order-1"
              >
                Cancelar
              </ButtonComponent>

              <ButtonComponent
                variant="primary"
                type="submit"
                :disabled="submitting"
                class="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl transform hover:scale-105 transition-all order-1 sm:order-2"
              >
                <span v-if="!submitting">
                  {{ modalMode === "create" ? "✓ Crear Docente" : "✓ Guardar Cambios" }}
                </span>
                <span v-else class="flex items-center gap-2">
                  <Loader2 :size="18" class="animate-spin" />
                  Guardando...
                </span>
              </ButtonComponent>
            </div>
          </form>
        </div>
      </ModalComponent>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { usuariosService, institucionesService, importService } from "@/services/api";
import ButtonComponent from "@/components/ui/ButtonComponent.vue";
import InputField from "@/components/ui/InputField.vue";
import ModalComponent from "@/components/ui/ModalComponent.vue";
import ImportFileModal from "@/components/ui/ImportFileModal.vue";
import PaginationComponent from "@/components/ui/PaginationComponent.vue";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  Loader2,
  UserPlus,
  User,
  Hash,
  Lock,
  Building2,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-vue-next";
import { useAlert } from "@/utils/sweetalert";

const alert = useAlert();

const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const showImportModal = ref(false);

const searchQuery = ref("");
const filterStatus = ref("");
const filterInstitucion = ref("");

const usuarios = ref([]);
const modalMode = ref("create");
const selectedIds = ref([]);

const estadisticasImportacion = ref(null);
const descargandoErrores = ref(false);

// Polling
const isPollingStats = ref(false);
let statsPollingInterval = null;

// ✅ Filtro institución (server-side)
const institucionSearchQuery = ref("");
const showInstitucionDropdown = ref(false);
const filteredInstituciones = ref([]);
const loadingInstitucionesFiltro = ref(false);
let filtroDebounce = null;
let filtroAbort = null;

// cache del seleccionado (filtro)
const selectedFilterInstitucionNombre = ref(null);
const selectedFilterInstitucionCodigo = ref(null);

const form = reactive({
  id: null,
  apellido_paterno: "",
  apellido_materno: "",
  nombres: "",
  codigo_modular: "",
  sexo: null,
  acceso_habilitado: true,
  password: "",
  asignaciones: [],
});

const pagination = reactive({
  currentPage: 1,
  perPage: 20,
  total: 0,
  lastPage: 1,
});

const sorting = reactive({
  sortBy: "id",
  sortOrder: "asc",
});

let searchDebounce = null;
const sortedUsuarios = computed(() => usuarios.value);

const debounceSearch = () => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    pagination.currentPage = 1;
    loadUsuarios();
  }, 500);
};

const toTitleCase = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// =========================
// ASIGNACIONES (MODAL)
// =========================
const agregarAsignacion = () => {
  form.asignaciones.push({
    institucion_id: null,
    institucion_search: "",
    show_dropdown: false,
    filtered_instituciones: [],
    cargo: "",
    estado: "ACTIVO",
    fecha_inicio: null,
    fecha_fin: null,

    // ✅ server-side autocomplete por asignación
    loading_instituciones: false,
    _debounce: null,
    _abort: null,

    // cache local
    _institucion_nombre: null,
    _institucion_codigo: null,
  });
};

const eliminarAsignacion = (index) => {
  const a = form.asignaciones[index];
  if (a?._abort) a._abort.abort();
  if (a?._debounce) clearTimeout(a._debounce);
  form.asignaciones.splice(index, 1);
};

const buscarInstitucion = (index) => {
  const asignacion = form.asignaciones[index];
  const term = (asignacion.institucion_search || "").trim();

  asignacion.show_dropdown = true;

  if (!term) {
    asignacion.filtered_instituciones = [];
    return;
  }

  if (asignacion._debounce) clearTimeout(asignacion._debounce);

  asignacion._debounce = setTimeout(async () => {
    if (asignacion._abort) asignacion._abort.abort();
    asignacion._abort = new AbortController();

    asignacion.loading_instituciones = true;

    try {
      // ✅ usa /instituciones/mias (backend filtra según rol)
      const r = await institucionesService.searchMias(term, 10, {
        signal: asignacion._abort.signal,
      });
      asignacion.filtered_instituciones = Array.isArray(r.data) ? r.data : [];
    } catch (e) {
      if (e?.name !== "AbortError" && e?.code !== "ERR_CANCELED") {
        console.error("Error buscando instituciones (modal):", e);
        asignacion.filtered_instituciones = [];
      }
    } finally {
      asignacion.loading_instituciones = false;
    }
  }, 300);
};

const seleccionarInstitucion = (index, institucion) => {
  const asignacion = form.asignaciones[index];
  asignacion.institucion_id = institucion.id;
  asignacion.institucion_search = institucion.nombre;

  asignacion._institucion_nombre = institucion.nombre;
  asignacion._institucion_codigo = institucion.codigo_modular_ie;

  asignacion.show_dropdown = false;
};

const limpiarInstitucion = (index) => {
  const asignacion = form.asignaciones[index];
  if (asignacion._abort) asignacion._abort.abort();
  if (asignacion._debounce) clearTimeout(asignacion._debounce);

  asignacion.institucion_id = null;
  asignacion.institucion_search = "";
  asignacion.show_dropdown = false;
  asignacion.filtered_instituciones = [];
  asignacion.loading_instituciones = false;

  asignacion._institucion_nombre = null;
  asignacion._institucion_codigo = null;
};

const getInstitucionNombre = (_institucionId, index = null) => {
  if (index !== null) {
    const a = form.asignaciones[index];
    if (a?._institucion_nombre) return a._institucion_nombre;
  }
  return "Desconocida";
};

const getInstitucionCodigo = (_institucionId, index = null) => {
  if (index !== null) {
    const a = form.asignaciones[index];
    if (a?._institucion_codigo) return a._institucion_codigo;
  }
  return "N/A";
};

// =========================
// FILTRO INSTITUCIÓN (VISTA)
// =========================
const onFocusInstitucionFiltro = () => {
  showInstitucionDropdown.value = true;
  if ((institucionSearchQuery.value || "").trim()) buscarInstitucionFiltro();
};

const buscarInstitucionFiltro = () => {
  const term = (institucionSearchQuery.value || "").trim();
  showInstitucionDropdown.value = true;

  if (!term) {
    filteredInstituciones.value = [];
    return;
  }

  if (filtroDebounce) clearTimeout(filtroDebounce);

  filtroDebounce = setTimeout(async () => {
    if (filtroAbort) filtroAbort.abort();
    filtroAbort = new AbortController();

    loadingInstitucionesFiltro.value = true;

    try {
      // ✅ usa /instituciones/mias (backend filtra según rol)
      const r = await institucionesService.searchMias(term, 10, {
        signal: filtroAbort.signal,
      });
      filteredInstituciones.value = Array.isArray(r.data) ? r.data : [];
    } catch (e) {
      if (e?.name !== "AbortError" && e?.code !== "ERR_CANCELED") {
        console.error("Error buscando instituciones (filtro):", e);
        filteredInstituciones.value = [];
      }
    } finally {
      loadingInstitucionesFiltro.value = false;
    }
  }, 300);
};

const seleccionarInstitucionFiltro = (institucion) => {
  filterInstitucion.value = institucion.id;
  institucionSearchQuery.value = institucion.nombre;
  selectedFilterInstitucionNombre.value = institucion.nombre;
  selectedFilterInstitucionCodigo.value = institucion.codigo_modular_ie;

  showInstitucionDropdown.value = false;
  handleFilterChange();
};

const limpiarFiltroInstitucion = () => {
  if (filtroAbort) filtroAbort.abort();
  if (filtroDebounce) clearTimeout(filtroDebounce);

  filterInstitucion.value = "";
  institucionSearchQuery.value = "";
  selectedFilterInstitucionNombre.value = null;
  selectedFilterInstitucionCodigo.value = null;

  showInstitucionDropdown.value = false;
  filteredInstituciones.value = [];
  loadingInstitucionesFiltro.value = false;

  handleFilterChange();
};

// =========================
// CLICK OUTSIDE (ROBUSTO)
// =========================
const handleClickOutside = (event) => {
  // modal
  const insideModalSearch = event.target.closest(".inst-search-modal");
  const insideModalDropdown = event.target.closest(".inst-dropdown-modal");
  if (!insideModalSearch && !insideModalDropdown) {
    form.asignaciones.forEach((a) => (a.show_dropdown = false));
  }

  // filtro
  const insideFilterSearch = event.target.closest(".inst-search-filter");
  const insideFilterDropdown = event.target.closest(".inst-dropdown-filter");
  if (!insideFilterSearch && !insideFilterDropdown) {
    showInstitucionDropdown.value = false;
  }
};

// =========================
// IMPORTACIÓN / ERRORES (igual)
// =========================
const handleImportDocentes = (file) => usuariosService.importar(file);
const handleStatusDocentes = (importId) => usuariosService.estadoImportacion(importId);

const handleDownloadTemplate = async () => {
  try {
    const response = await usuariosService.descargarTemplate();
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "plantilla_docentes.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    alert.toastSuccess("Plantilla descargada correctamente");
  } catch (error) {
    console.error("Error descargando plantilla:", error);
    alert.error("Error", "No se pudo descargar la plantilla");
  }
};

const handleDownloadErroresDocentes = async (importId) => {
  try {
    const response = await usuariosService.descargarErroresXlsx(importId);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `errores_docentes_${importId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    alert.toastSuccess("Reporte de errores descargado");
  } catch (error) {
    console.error("Error descargando reporte:", error);
    alert.error("Error", "No se pudo descargar el reporte de errores");
  }
};

const handleImportSuccess = async (data) => {
  console.log("✅ Importación completada:", data);
  await loadUsuarios();
  await loadEstadisticasImportacion();
  showImportModal.value = false;
  startStatsPolling();
};

const loadEstadisticasImportacion = async () => {
  try {
    const { data } = await usuariosService.getEstadisticasImportacion();
    const nuevasEstadisticas = data.data || data;

    const estadoAnterior = estadisticasImportacion.value?.ultima_importacion?.estado;
    const estadoNuevo = nuevasEstadisticas?.ultima_importacion?.estado;

    if (estadoAnterior === "processing" && estadoNuevo === "completada") {
      const exitosos = nuevasEstadisticas.ultima_importacion?.exitosos || 0;
      const errores = nuevasEstadisticas.ultima_importacion?.errores_count || 0;

      alert.toastSuccess(
        `Importación completada: ${exitosos} docentes importados${
          errores > 0 ? `, ${errores} con errores` : ""
        }`
      );
      await loadUsuarios();
    }

    estadisticasImportacion.value = nuevasEstadisticas;

    const ultimaImportacion = estadisticasImportacion.value?.ultima_importacion;
    const estadoEnProgreso =
      ultimaImportacion?.estado === "processing" ||
      ultimaImportacion?.estado === "pendiente" ||
      ultimaImportacion?.estado === "en_proceso";

    if (estadoEnProgreso && !isPollingStats.value) startStatsPolling();
    else if (!estadoEnProgreso && isPollingStats.value) stopStatsPolling();
  } catch (err) {
    console.error("Error cargando estadísticas:", err);
  }
};

const startStatsPolling = () => {
  if (statsPollingInterval) return;
  isPollingStats.value = true;
  statsPollingInterval = setInterval(async () => {
    await loadEstadisticasImportacion();
  }, 3000);
};

const stopStatsPolling = () => {
  if (statsPollingInterval) {
    clearInterval(statsPollingInterval);
    statsPollingInterval = null;
  }
  isPollingStats.value = false;
};

const descargarReporteErrores = async () => {
  const importId = estadisticasImportacion.value?.ultima_importacion?.id;
  if (!importId) {
    alert.error("Error", "No se encontró el ID de la importación");
    return;
  }

  descargandoErrores.value = true;

  try {
    const response = await usuariosService.descargarErroresXlsx(importId);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `errores_docentes_${importId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    alert.toastSuccess("Reporte de errores descargado correctamente");
  } catch (error) {
    console.error("Error descargando reporte:", error);
    alert.error("Error", "No se pudo descargar el reporte de errores");
  } finally {
    descargandoErrores.value = false;
  }
};

// =========================
// CRUD DOCENTES (igual)
// =========================
const handleSubmit = async () => {
  if (!form.apellido_paterno || !form.apellido_materno || !form.nombres) {
    alert.error("Validación", "Los apellidos y nombres son obligatorios");
    return;
  }

  if (!form.codigo_modular) {
    alert.error("Validación", "El código modular es obligatorio");
    return;
  }

  if (form.asignaciones.length === 0) {
    alert.error("Validación", "Debe asignar al menos una institución");
    return;
  }

  for (let i = 0; i < form.asignaciones.length; i++) {
    const asig = form.asignaciones[i];
    if (!asig.institucion_id) {
      alert.error("Validación", `La asignación ${i + 1} debe tener una institución`);
      return;
    }
    if (!asig.cargo || asig.cargo.trim() === "") {
      alert.error("Validación", `La asignación ${i + 1} debe tener un cargo`);
      return;
    }
    if (asig.fecha_inicio && asig.fecha_fin && asig.fecha_fin < asig.fecha_inicio) {
      alert.error(
        "Validación",
        `En la asignación ${i + 1}, la fecha fin debe ser posterior a la fecha inicio`
      );
      return;
    }
  }

  submitting.value = true;

  try {
    const payload = {
      apellido_paterno: form.apellido_paterno,
      apellido_materno: form.apellido_materno,
      nombres: form.nombres,
      codigo_modular: form.codigo_modular,
      sexo: form.sexo,
      acceso_habilitado: form.acceso_habilitado,
      asignaciones: form.asignaciones.map((asig) => ({
        institucion_id: asig.institucion_id,
        cargo: asig.cargo,
        estado: asig.estado,
        fecha_inicio: asig.fecha_inicio,
        fecha_fin: asig.fecha_fin,
      })),
    };

    if (form.password && form.password.trim() !== "") {
      payload.password = form.password;
      payload.password_confirmation = form.password;
    }

    if (modalMode.value === "create") {
      await usuariosService.create(payload);
      alert.toastSuccess("Docente creado correctamente");
    } else {
      await usuariosService.update(form.id, payload);
      alert.toastSuccess("Docente actualizado correctamente");
    }

    await loadUsuarios();
    await loadEstadisticasImportacion();
    closeModal();
  } catch (err) {
    console.error("Error al guardar docente:", err);
    if (err.response?.status === 422) {
      const errors = err.response.data.errors;
      let errorMsg = "Errores de validación:\n";
      Object.keys(errors).forEach((key) => {
        errorMsg += `- ${errors[key][0]}\n`;
      });
      alert.error("Error de validación", errorMsg);
    } else {
      alert.error(
        "Error",
        err.response?.data?.message || "No se pudo guardar el docente"
      );
    }
  } finally {
    submitting.value = false;
  }
};

const openCreateModal = () => {
  Object.assign(form, {
    id: null,
    apellido_paterno: "",
    apellido_materno: "",
    nombres: "",
    codigo_modular: "",
    sexo: null,
    acceso_habilitado: true,
    password: "",
    asignaciones: [],
  });
  modalMode.value = "create";
  showModal.value = true;
};

const openEditModal = (u) => {
  Object.assign(form, {
    id: u.id,
    apellido_paterno: u.apellido_paterno || "",
    apellido_materno: u.apellido_materno || "",
    nombres: u.nombres || "",
    codigo_modular: u.codigo_modular || "",
    sexo: u.sexo,
    acceso_habilitado: u.acceso_habilitado ?? true,
    password: "",
    asignaciones: (u.instituciones || []).map((inst) => ({
      institucion_id: inst.id,
      institucion_search: inst.nombre || "",
      show_dropdown: false,
      filtered_instituciones: [],
      cargo: inst.pivot?.cargo || "",
      estado: inst.pivot?.estado || "ACTIVO",
      fecha_inicio: inst.pivot?.fecha_inicio || null,
      fecha_fin: inst.pivot?.fecha_fin || null,

      loading_instituciones: false,
      _debounce: null,
      _abort: null,

      _institucion_nombre: inst.nombre || null,
      _institucion_codigo: inst.codigo_modular_ie || null,
    })),
  });
  modalMode.value = "edit";
  showModal.value = true;
};

const closeModal = () => {
  // cancelar requests de asignaciones
  form.asignaciones.forEach((a) => {
    if (a?._abort) a._abort.abort();
    if (a?._debounce) clearTimeout(a._debounce);
  });

  showModal.value = false;
};

const openImportModal = () => {
  showImportModal.value = true;
  loadEstadisticasImportacion();
};

const loadUsuarios = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.currentPage,
      buscar: searchQuery.value || undefined,
      sort_by: sorting.sortBy,
      sort_order: sorting.sortOrder,
      estado:
        filterStatus.value === "activo"
          ? "ACTIVO"
          : filterStatus.value === "inactivo"
          ? "INACTIVO"
          : undefined,
      institucion_id: filterInstitucion.value || undefined,
      activo:
        filterStatus.value === "activo"
          ? true
          : filterStatus.value === "inactivo"
          ? false
          : undefined,
    };

    const r = await usuariosService.getAll(params);

    let data = [];
    let paginationData = {};

    if (r.data.success && r.data.data) {
      const innerData = r.data.data;
      if (Array.isArray(innerData.data)) {
        data = innerData.data;
        paginationData = innerData;
      } else if (Array.isArray(innerData)) {
        data = innerData;
        paginationData = {
          current_page: 1,
          last_page: 1,
          per_page: data.length,
          total: data.length,
        };
      }
    } else if (r.data.data && Array.isArray(r.data.data)) {
      data = r.data.data;
      paginationData = r.data;
    } else if (Array.isArray(r.data)) {
      data = r.data;
      paginationData = {
        current_page: 1,
        last_page: 1,
        per_page: data.length,
        total: data.length,
      };
    } else if (r.data.usuarios && Array.isArray(r.data.usuarios)) {
      data = r.data.usuarios;
      paginationData = r.data;
    } else {
      data = [];
      paginationData = { current_page: 1, last_page: 1, per_page: 20, total: 0 };
    }

    pagination.currentPage = paginationData.current_page || 1;
    pagination.lastPage = paginationData.last_page || 1;
    pagination.perPage = paginationData.per_page || 20;
    pagination.total = paginationData.total || 0;

    usuarios.value = data.map((docente) => ({
      ...docente,
      codigo: docente.codigo_modular_docente || docente.codigo || "",
    }));

    selectedIds.value = [];
  } catch (error) {
    console.error("Error cargando docentes:", error);
    usuarios.value = [];
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page) => {
  pagination.currentPage = page;
  loadUsuarios();
};

const isAllSelected = computed(() => {
  return usuarios.value.length > 0 && selectedIds.value.length === usuarios.value.length;
});

const toggleSelection = (id) => {
  const index = selectedIds.value.indexOf(id);
  if (index > -1) selectedIds.value.splice(index, 1);
  else selectedIds.value.push(id);
};

const toggleSelectAll = () => {
  if (isAllSelected.value) selectedIds.value = [];
  else selectedIds.value = usuarios.value.map((u) => u.id);
};

const confirmBulkDelete = async () => {
  const count = selectedIds.value.length;
  const r = await alert.confirmDelete(
    `Eliminar ${count} ${count === 1 ? "docente" : "docentes"}`,
    "Esta acción no se puede deshacer"
  );
  if (!r.isConfirmed) return;

  try {
    const response = await usuariosService.deleteMultiple(selectedIds.value);
    const eliminados = response.data.eliminados || 0;
    alert.toastSuccess(`${eliminados} docente(s) eliminado(s)`);
    selectedIds.value = [];
    await loadUsuarios();
    await loadEstadisticasImportacion();
  } catch (error) {
    console.error("Error eliminando docentes:", error);
    alert.error("Error", error.response?.data?.message || "No se pudieron eliminar");
  }
};

const handleFilterChange = () => {
  pagination.currentPage = 1;
  loadUsuarios();
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);

  await loadUsuarios();
  await loadEstadisticasImportacion();

  const ultimaImportacion = estadisticasImportacion.value?.ultima_importacion;
  const estadoEnProgreso =
    ultimaImportacion?.estado === "processing" ||
    ultimaImportacion?.estado === "pendiente";

  if (estadoEnProgreso) startStatsPolling();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);

  if (searchDebounce) clearTimeout(searchDebounce);
  if (filtroDebounce) clearTimeout(filtroDebounce);
  if (filtroAbort) filtroAbort.abort();

  // cancelar asignaciones
  form.asignaciones.forEach((a) => {
    if (a?._abort) a._abort.abort();
    if (a?._debounce) clearTimeout(a._debounce);
  });

  stopStatsPolling();
});
</script>
