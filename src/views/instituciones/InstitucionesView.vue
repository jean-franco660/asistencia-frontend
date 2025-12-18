<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6"
  >
    <div class="max-w-7xl mx-auto spacing-responsive">
      <!-- Header Premium -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
          <h1
            class="text-responsive-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          >
            Gestión de Instituciones
          </h1>
          <p class="text-responsive-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
            Administra las instituciones educativas de tu red
          </p>
        </div>
        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0"
        >
          <Building2 :size="24" class="text-white sm:w-8 sm:h-8" />
        </div>
      </div>

      <!-- ⭐ NUEVO: Banner de importación en progreso -->
      <div
        v-if="isPollingStats"
        class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 animate-fadeIn"
      >
        <div class="flex items-center gap-3">
          <Loader2 :size="20" class="text-blue-600 dark:text-blue-400 animate-spin" />
          <div class="flex-1">
            <p class="font-semibold text-blue-900 dark:text-blue-100">
              Importación en progreso
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Las estadísticas se actualizan automáticamente cada 3 segundos
            </p>
          </div>
          <button
            @click="stopStatsPolling"
            class="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Detener actualización
          </button>
        </div>
      </div>

      <!-- Estadísticas de Importación -->
      <div v-if="estadisticasImportacion" class="space-y-3 sm:space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Total Instituciones -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Instituciones
                </p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {{ estadisticasImportacion.total || 0 }}
                </p>
              </div>
              <div
                class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
              >
                <Building2 :size="24" class="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <!-- Última Importación -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Última Importación
                </p>
                <p class="text-lg font-bold text-gray-900 dark:text-white mt-2">
                  {{ estadisticasImportacion.ultima_importacion?.fecha || "N/A" }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ estadisticasImportacion.ultima_importacion?.hora || "" }}
                </p>
              </div>
              <div
                class="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center"
              >
                <Upload :size="24" class="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <!-- Importados -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Importados
                </p>
                <p class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {{ estadisticasImportacion.ultima_importacion?.exitosos || 0 }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  de
                  {{ estadisticasImportacion.ultima_importacion?.total || 0 }} registros
                </p>
              </div>
              <div
                class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-green-600 dark:text-green-400"
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
        <!-- Header de búsqueda -->
        <div
          class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600"
        >
          <!-- Primera fila: Búsqueda y selector de ordenamiento -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-3">
            <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Search :size="18" class="text-gray-400 flex-shrink-0 sm:w-5 sm:h-5" />
              <InputField
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por nombre..."
                @input="debounceSearch"
                class="!border-0 !bg-transparent !focus:ring-0 !text-sm sm:!text-base"
              />
            </div>

            <!-- ⭐ NUEVO: Selector de ordenamiento -->
            <div class="flex items-center gap-2 text-sm">
              <span class="text-gray-600 dark:text-gray-400 whitespace-nowrap"
                >Ordenar por:</span
              >
              <select
                v-model="sorting.sortBy"
                @change="loadInstituciones"
                class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="id">Orden de importación</option>
                <option value="codigo_modular_ie">Código modular</option>
                <option value="nombre">Nombre</option>
                <option value="distrito">Distrito</option>
              </select>
              <button
                @click="
                  sorting.sortOrder = sorting.sortOrder === 'asc' ? 'desc' : 'asc';
                  loadInstituciones();
                "
                class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                :title="sorting.sortOrder === 'asc' ? 'Ascendente' : 'Descendente'"
              >
                <ChevronUp
                  v-if="sorting.sortOrder === 'asc'"
                  :size="18"
                  class="text-gray-600 dark:text-gray-300"
                />
                <ChevronDown v-else :size="18" class="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          <!-- Segunda fila: Botones de acción -->
          <div
            class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
          >
            <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <!-- Botón eliminar seleccionados -->
              <ButtonComponent
                v-if="selectedIds.length > 0"
                variant="danger"
                @click="confirmBulkDelete"
                class="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white animate-fadeIn w-full sm:w-auto"
              >
                <Trash2 :size="20" />
                Eliminar ({{ selectedIds.length }})
              </ButtonComponent>
              <ButtonComponent
                variant="secondary"
                @click="openImportModal"
                class="flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full sm:w-auto"
              >
                <Upload :size="20" />
                <span class="hidden sm:inline">Importar Excel</span>
                <span class="sm:hidden">Importar</span>
              </ButtonComponent>
              <ButtonComponent
                variant="primary"
                @click="openCreateModal"
                class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
              >
                <Plus :size="20" />
                Nueva Institución
              </ButtonComponent>
            </div>
          </div>
        </div>

        <!-- Tabla Premium -->
        <div v-if="loading" class="p-12 text-center">
          <Loader2 :size="48" class="inline-block animate-spin text-blue-600 mb-4" />
          <p class="text-gray-500 dark:text-gray-400">Cargando instituciones...</p>
        </div>

        <div v-else>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr
                  class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700"
                >
                  <th class="px-6 py-4 text-center w-12">
                    <input
                      type="checkbox"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                      class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th
                    @click="handleSort('codigo_modular_ie')"
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div class="flex items-center gap-1">
                      <span>Código Modular</span>
                      <ChevronUp
                        v-if="
                          sorting.sortBy === 'codigo_modular_ie' &&
                          sorting.sortOrder === 'asc'
                        "
                        :size="14"
                      />
                      <ChevronDown
                        v-else-if="
                          sorting.sortBy === 'codigo_modular_ie' &&
                          sorting.sortOrder === 'desc'
                        "
                        :size="14"
                      />
                      <ChevronsUpDown v-else :size="14" class="text-gray-400" />
                    </div>
                  </th>
                  <th
                    @click="handleSort('nombre')"
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div class="flex items-center gap-1">
                      <span>Institución</span>
                      <ChevronUp
                        v-if="sorting.sortBy === 'nombre' && sorting.sortOrder === 'asc'"
                        :size="14"
                      />
                      <ChevronDown
                        v-else-if="
                          sorting.sortBy === 'nombre' && sorting.sortOrder === 'desc'
                        "
                        :size="14"
                      />
                      <ChevronsUpDown v-else :size="14" class="text-gray-400" />
                    </div>
                  </th>
                  <th
                    @click="handleSort('distrito')"
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div class="flex items-center gap-1">
                      <span>Distrito</span>
                      <ChevronUp
                        v-if="
                          sorting.sortBy === 'distrito' && sorting.sortOrder === 'asc'
                        "
                        :size="14"
                      />
                      <ChevronDown
                        v-else-if="
                          sorting.sortBy === 'distrito' && sorting.sortOrder === 'desc'
                        "
                        :size="14"
                      />
                      <ChevronsUpDown v-else :size="14" class="text-gray-400" />
                    </div>
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                  >
                    Dirección
                  </th>
                  <th
                    class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                  >
                    Coordenadas
                  </th>
                  <th
                    class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                  >
                    Radio
                  </th>
                  <th
                    class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="institucion in instituciones"
                  :key="institucion.id"
                  :class="[
                    'hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150',
                    selectedIds.includes(institucion.id)
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : '',
                  ]"
                >
                  <td class="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      :checked="selectedIds.includes(institucion.id)"
                      @change="toggleSelection(institucion.id)"
                      class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {{ institucion.codigo_modular_ie || "Sin código" }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <!-- Logo o icono por defecto -->
                      <div
                        v-if="institucion.logo"
                        class="w-12 h-12 rounded-lg overflow-hidden shadow-md flex-shrink-0"
                      >
                        <img
                          :src="getLogoUrl(institucion.logo)"
                          :alt="institucion.nombre"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        v-else
                        class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md flex-shrink-0"
                      >
                        <Building2 :size="24" class="text-white" />
                      </div>
                      <div>
                        <p class="font-semibold text-gray-800 dark:text-gray-200">
                          {{ institucion.nombre }}
                        </p>
                        <span
                          v-if="institucion.nivel_educativo"
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1"
                        >
                          {{ institucion.nivel_educativo }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin :size="16" class="text-gray-400 flex-shrink-0" />
                      <span class="text-sm">{{
                        institucion.distrito || "Sin distrito"
                      }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin :size="16" class="text-gray-400 flex-shrink-0" />
                      <span class="text-sm">{{
                        institucion.direccion || "Sin dirección"
                      }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col gap-1 items-center">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        Lat: {{ institucion.latitud || "-" }}
                      </span>
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      >
                        Lng: {{ institucion.longitud || "-" }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    >
                      {{ institucion.radio }} m
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-3">
                      <button
                        @click="openEditModal(institucion)"
                        class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all hover:scale-110"
                        title="Editar"
                      >
                        <Edit2 :size="20" />
                      </button>
                      <button
                        @click="confirmDelete(institucion)"
                        class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all hover:scale-110"
                        title="Eliminar"
                      >
                        <Trash2 :size="20" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!instituciones.length">
                  <td colspan="8" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center gap-3">
                      <div
                        class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                      >
                        <Building2 :size="32" class="text-gray-400" />
                      </div>
                      <p class="text-gray-500 dark:text-gray-400 font-medium">
                        No se encontraron instituciones
                      </p>
                      <p class="text-gray-400 dark:text-gray-500 text-sm">
                        Comienza creando una nueva institución
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ⭐ Paginación FUERA del scroll -->
          <div
            class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4"
          >
            <!-- 🔍 DEBUG: Información de paginación -->
            <div
              class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded text-xs"
            >
              <p><strong>DEBUG Paginación:</strong></p>
              <p>Total: {{ pagination.total }}</p>
              <p>
                Página actual: {{ pagination.currentPage }} de {{ pagination.lastPage }}
              </p>
              <p>Por página: {{ pagination.perPage }}</p>
              <p>Instituciones mostradas: {{ instituciones.length }}</p>
            </div>

            <PaginationComponent
              :current-page="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="pagination.total"
              label="instituciones"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </div>

      <!-- Modal Premium -->
      <ModalComponent
        v-model="showModal"
        :title="modalMode === 'create' ? 'Nueva Institución' : 'Editar Institución'"
      >
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <!-- Header Modal -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Building2 :size="24" class="text-white" />
              </div>
              <h3 class="text-xl font-bold text-white">
                {{ modalMode === "create" ? "Nueva Institución" : "Editar Institución" }}
              </h3>
            </div>
          </div>

          <!-- Contenido Modal -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
            <AlertMessage
              v-if="error"
              :show="!!error"
              type="error"
              :message="error"
              @close="error = ''"
            />

            <!-- Logo Upload -->
            <div class="md:col-span-2">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <div class="flex items-center gap-2">
                  <Building2 :size="18" class="text-blue-600" />
                  Logo de la Institución
                </div>
              </label>

              <div class="flex items-start gap-4">
                <!-- Preview del logo -->
                <div class="flex-shrink-0">
                  <div
                    v-if="logoPreview || form.logo"
                    class="w-24 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-600"
                  >
                    <img
                      :src="logoPreview || getLogoUrl(form.logo)"
                      alt="Logo preview"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                  >
                    <Building2 :size="32" class="text-white" />
                  </div>
                </div>

                <!-- Input de archivo -->
                <div class="flex-1">
                  <input
                    ref="logoInput"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                    @change="handleLogoChange"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.logoInput.click()"
                    class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <Upload :size="20" />
                      <span>{{
                        form.logo || logoPreview ? "Cambiar logo" : "Subir logo"
                      }}</span>
                    </div>
                  </button>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Formatos: JPG, PNG, GIF, SVG. Máx: 2MB
                  </p>

                  <!-- Botón para eliminar logo -->
                  <button
                    v-if="form.logo || logoPreview"
                    type="button"
                    @click="removeLogo"
                    class="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    Eliminar logo
                  </button>
                </div>
              </div>
            </div>

            <!-- Grid 2 columnas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Código Modular IE (full width) -->
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <FileDigit :size="18" class="text-indigo-600" />
                    Código Modular IE *
                  </div>
                </label>
                <InputField
                  v-model="form.codigo_modular_ie"
                  type="text"
                  placeholder="Ej: 0123456"
                  :required="true"
                  :error="errors.codigo_modular_ie"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Nombre (full width) -->
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <Building2 :size="18" class="text-blue-600" />
                    Nombre *
                  </div>
                </label>
                <InputField
                  v-model="form.nombre"
                  type="text"
                  placeholder="Ej: Instituto Técnico Central"
                  :required="true"
                  :error="errors.nombre"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Nivel Educativo -->
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <GraduationCap :size="18" class="text-green-600" />
                    Nivel Educativo
                  </div>
                </label>
                <select
                  v-model="form.nivel_educativo"
                  class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="INICIAL">Inicial</option>
                  <option value="PRIMARIA">Primaria</option>
                  <option value="SECUNDARIA">Secundaria</option>
                  <option value="SUPERIOR">Superior</option>
                  <option value="TECNICO">Técnico</option>
                </select>
              </div>

              <!-- Distrito -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <MapPin :size="18" class="text-purple-600" />
                    Distrito *
                  </div>
                </label>
                <InputField
                  v-model="form.distrito"
                  type="text"
                  placeholder="Ej: Lima"
                  :required="true"
                  :error="errors.distrito"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Centro Poblado -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <MapPin :size="18" class="text-orange-600" />
                    Centro Poblado
                  </div>
                </label>
                <InputField
                  v-model="form.centro_poblado"
                  type="text"
                  placeholder="Ej: San Juan"
                  :error="errors.centro_poblado"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Dirección (full width) -->
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <MapPin :size="18" class="text-blue-600" />
                    Dirección
                  </div>
                </label>
                <InputField
                  v-model="form.direccion"
                  type="text"
                  placeholder="Ej: Calle Principal 123"
                  :error="errors.direccion"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Latitud -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <Compass :size="18" class="text-blue-600" />
                    Latitud
                  </div>
                </label>
                <InputField
                  v-model="form.latitud"
                  type="number"
                  step="0.0000001"
                  placeholder="-12.123456"
                  :required="true"
                  min="-90"
                  max="90"
                  :error="errors.latitud"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Longitud -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <Compass :size="18" class="text-purple-600 transform rotate-90" />
                    Longitud
                  </div>
                </label>
                <InputField
                  v-model="form.longitud"
                  type="number"
                  step="0.0000001"
                  placeholder="-76.123456"
                  :required="true"
                  min="-180"
                  max="180"
                  :error="errors.longitud"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl"
                />
              </div>

              <!-- Radio (full width) -->
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <CircleDot :size="18" class="text-orange-600" />
                    Radio de cobertura (metros)
                  </div>
                </label>
                <div class="flex items-center gap-3">
                  <InputField
                    v-model="form.radio"
                    type="number"
                    :required="true"
                    min="10"
                    max="1000"
                    placeholder="50"
                    :error="errors.radio"
                    class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-xl flex-1"
                  />
                  <div class="text-right">
                    <div class="text-2xl font-bold text-orange-600">{{ form.radio }}</div>
                    <div class="text-xs text-gray-500">m</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <ButtonComponent
                variant="secondary"
                @click="closeModal"
                type="button"
                class="px-6 py-2.5 rounded-xl font-semibold"
              >
                Cancelar
              </ButtonComponent>
              <ButtonComponent
                variant="primary"
                type="submit"
                :loading="submitting"
                class="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <Loader2 v-if="submitting" :size="18" class="animate-spin mr-2" />
                {{
                  submitting
                    ? "Guardando..."
                    : modalMode === "create"
                    ? "Crear"
                    : "Actualizar"
                }}
              </ButtonComponent>
            </div>
          </form>
        </div>
      </ModalComponent>

      <!-- Modal Importar -->
      <ImportFileModal
        v-model="showImportModal"
        tipo="Instituciones"
        :import-function="handleImportInstituciones"
        :status-function="handleStatusInstituciones"
        :download-template-function="handleDownloadInstitucionesTemplate"
        :download-error-report-function="handleDownloadErroresInstituciones"
        @import-success="handleImportSuccess"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { institucionesService, importService } from "../../services/api";
import ButtonComponent from "../../components/ui/ButtonComponent.vue";
import InputField from "../../components/ui/InputField.vue";
import ModalComponent from "../../components/ui/ModalComponent.vue";
import AlertMessage from "../../components/ui/AlertMessage.vue";
import ImportFileModal from "../../components/ui/ImportFileModal.vue";
import PaginationComponent from "../../components/ui/PaginationComponent.vue";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  MapPin,
  Compass,
  CircleDot,
  Loader2,
  Upload,
  GraduationCap,
  FileDigit,
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
const modalMode = ref("create");
const searchQuery = ref("");
const error = ref("");
const logoInput = ref(null);
const logoPreview = ref(null);
const logoFile = ref(null);
const showImportModal = ref(false);

const instituciones = ref([]);
const selectedIds = ref([]);
const estadisticasImportacion = ref(null);
const descargandoErrores = ref(false);

// ⭐ NUEVO: Estado de polling
const isPollingStats = ref(false);
let statsPollingInterval = null;
let searchDebounce = null;

const pagination = reactive({
  currentPage: 1,
  perPage: 20,
  total: 0,
  lastPage: 1,
});

// ⭐ NUEVO: Estado de ordenamiento
const sorting = reactive({
  sortBy: "id", // Por defecto: orden de importación
  sortOrder: "asc",
});

const form = reactive({
  id: null,
  codigo_modular_ie: "",
  nombre: "",
  nivel_educativo: "",
  distrito: "",
  centro_poblado: "",
  direccion: "",
  latitud: null,
  longitud: null,
  radio: 30,
  logo: null,
  remove_logo: false,
});

const errors = reactive({
  codigo_modular_ie: "",
  nombre: "",
  nivel_educativo: "",
  distrito: "",
  centro_poblado: "",
  direccion: "",
  latitud: "",
  longitud: "",
  radio: "",
  logo: "",
});

const getLogoUrl = (logoPath) => {
  if (!logoPath) return null;

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const fileName = logoPath.replace(/^logos\//, "");

  return `${apiBase}/v1/web/logos/${encodeURIComponent(fileName)}`;
};

// Manejar cambio de archivo de logo
const handleLogoChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tamaño (2MB)
  if (file.size > 2 * 1024 * 1024) {
    errors.logo = "El archivo no debe superar 2MB";
    alert.error("Error", "El archivo no debe superar 2MB");
    return;
  }

  // Validar tipo
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/svg+xml",
  ];
  if (!validTypes.includes(file.type)) {
    errors.logo = "Formato no válido";
    alert.error("Error", "Formato de imagen no válido");
    return;
  }

  logoFile.value = file;
  errors.logo = "";

  // Crear preview
  const reader = new FileReader();
  reader.onload = (e) => {
    logoPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Eliminar logo
const removeLogo = () => {
  logoFile.value = null;
  logoPreview.value = null;
  form.logo = null;
  form.remove_logo = true;
  if (logoInput.value) {
    logoInput.value.value = "";
  }
};

const resetForm = () => {
  form.id = null;
  form.codigo_modular_ie = "";
  form.nombre = "";
  form.nivel_educativo = "";
  form.distrito = "";
  form.centro_poblado = "";
  form.direccion = "";
  form.latitud = null;
  form.longitud = null;
  form.radio = 30;
  form.logo = null;
  form.remove_logo = false;
  logoFile.value = null;
  logoPreview.value = null;
  error.value = "";
  Object.keys(errors).forEach((k) => (errors[k] = ""));
};

// ⭐ NUEVO: Función para cargar estadísticas
const loadEstadisticasImportacion = async () => {
  try {
    const { data } = await institucionesService.getEstadisticasImportacion();
    const nuevasEstadisticas = data.data || data;

    // Detectar cambio de estado
    const estadoAnterior = estadisticasImportacion.value?.ultima_importacion?.estado;
    const estadoNuevo = nuevasEstadisticas?.ultima_importacion?.estado;

    // Si cambió de "processing" a "completada"
    if (estadoAnterior === "processing" && estadoNuevo === "completada") {
      const exitosos = nuevasEstadisticas.ultima_importacion?.exitosos || 0;
      const errores = nuevasEstadisticas.ultima_importacion?.errores_count || 0;

      alert.toastSuccess(
        `Importación completada: ${exitosos} instituciones importadas${
          errores > 0 ? `, ${errores} con errores` : ""
        }`
      );

      // Recargar lista de instituciones
      await loadInstituciones();
    }

    estadisticasImportacion.value = nuevasEstadisticas;

    // Verificar si hay importación en progreso
    const ultimaImportacion = estadisticasImportacion.value?.ultima_importacion;
    const estadoEnProgreso =
      ultimaImportacion?.estado === "processing" ||
      ultimaImportacion?.estado === "pendiente" ||
      ultimaImportacion?.estado === "en_proceso";

    if (estadoEnProgreso && !isPollingStats.value) {
      startStatsPolling();
    } else if (!estadoEnProgreso && isPollingStats.value) {
      stopStatsPolling();
    }
  } catch (err) {
    console.error("Error cargando estadísticas:", err);
  }
};

// ⭐ NUEVO: Iniciar polling de estadísticas
const startStatsPolling = () => {
  if (statsPollingInterval) return;

  isPollingStats.value = true;
  console.log("📊 Iniciando polling de estadísticas...");

  statsPollingInterval = setInterval(async () => {
    await loadEstadisticasImportacion();
  }, 3000);
};

// ⭐ NUEVO: Detener polling de estadísticas
const stopStatsPolling = () => {
  if (statsPollingInterval) {
    clearInterval(statsPollingInterval);
    statsPollingInterval = null;
  }
  isPollingStats.value = false;
  console.log("📊 Polling de estadísticas detenido");
};

/* -------------------- IMPORT -------------------- */
const handleImportInstituciones = (file) => institucionesService.importar(file);

const handleDownloadInstitucionesTemplate = async () => {
  try {
    const response = await institucionesService.descargarTemplate();
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "plantilla_instituciones.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    alert.toastSuccess("Plantilla descargada correctamente");
  } catch (e) {
    alert.error("Error", "No se pudo descargar la plantilla");
  }
};

const handleStatusInstituciones = (importId) =>
  institucionesService.estadoImportacion(importId);

const handleDownloadErroresInstituciones = async (importId) => {
  try {
    const response = await institucionesService.descargarErroresXlsx(importId);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `errores_instituciones_${importId}.xlsx`);
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

// ⭐ MODIFICAR: handleImportSuccess
const handleImportSuccess = async (data) => {
  console.log("✅ Importación completada:", data);
  showImportModal.value = false;

  // Recargar instituciones y estadísticas
  await loadInstituciones();
  await loadEstadisticasImportacion();

  // Iniciar polling por si acaso
  startStatsPolling();
};

// ⭐ MODIFICAR: openImportModal
const openImportModal = () => {
  showImportModal.value = true;
  loadEstadisticasImportacion();
};

const openCreateModal = () => {
  resetForm();
  modalMode.value = "create";
  showModal.value = true;
};

const openEditModal = (institucion) => {
  resetForm();
  modalMode.value = "edit";
  Object.assign(form, { ...institucion, remove_logo: false });
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const validateForm = () => {
  let ok = true;
  Object.keys(errors).forEach((k) => (errors[k] = ""));

  if (!form.codigo_modular_ie) {
    errors.codigo_modular_ie = "El código modular es obligatorio";
    ok = false;
  }
  if (!form.nombre) {
    errors.nombre = "El nombre es obligatorio";
    ok = false;
  }
  if (!form.distrito) {
    errors.distrito = "El distrito es obligatorio";
    ok = false;
  }
  if (form.radio <= 0) {
    errors.radio = "El radio debe ser mayor a 0";
    ok = false;
  }

  return ok;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  submitting.value = true;

  try {
    const formData = new FormData();
    formData.append("codigo_modular_ie", form.codigo_modular_ie);
    formData.append("nombre", form.nombre);
    formData.append("nivel_educativo", form.nivel_educativo || "");
    formData.append("distrito", form.distrito);
    formData.append("centro_poblado", form.centro_poblado || "");
    formData.append("direccion", form.direccion || "");
    formData.append("latitud", form.latitud || "");
    formData.append("longitud", form.longitud || "");
    formData.append("radio", form.radio);
    formData.append("remove_logo", form.remove_logo ? "1" : "0");

    if (logoFile.value) {
      formData.append("logo", logoFile.value);
    }

    if (modalMode.value === "create") {
      await institucionesService.create(formData);
      alert.toastSuccess("Institución registrada");
    } else {
      formData.append("_method", "PUT");
      await institucionesService.update(form.id, formData);
      alert.toastSuccess("Institución actualizada");
    }

    closeModal();
    await loadInstituciones();
    await loadEstadisticasImportacion(); // ⭐ NUEVO
  } catch (err) {
    error.value = err.response?.data?.message || "No se pudo guardar";
    alert.error("Error", error.value);
  }

  submitting.value = false;
};

const confirmDelete = async (institucion) => {
  console.log("🗑️ FRONTEND - Intentando eliminar:", institucion);

  const r = await alert.confirmDelete(
    `Eliminar "${institucion.nombre}"`,
    "Esta acción no se puede deshacer"
  );

  if (!r.isConfirmed) {
    console.log("❌ FRONTEND - Eliminación cancelada por el usuario");
    return;
  }

  try {
    console.log("📤 FRONTEND - Enviando DELETE request para ID:", institucion.id);
    const response = await institucionesService.delete(institucion.id);
    console.log("✅ FRONTEND - Respuesta del servidor:", response.data);

    await loadInstituciones();
    await loadEstadisticasImportacion();
    alert.toastSuccess("Institución eliminada");
  } catch (error) {
    console.error("❌ FRONTEND - Error al eliminar:", error);
    console.error("❌ FRONTEND - Respuesta del servidor:", error.response?.data);
    console.error("❌ FRONTEND - Status code:", error.response?.status);
    alert.error("Error", error.response?.data?.message || "No se pudo eliminar");
  }
};

// ⭐ NUEVO: Debounce search
const debounceSearch = () => {
  if (searchDebounce) clearTimeout(searchDebounce);

  searchDebounce = setTimeout(() => {
    pagination.currentPage = 1;
    loadInstituciones();
  }, 500);
};

// ⭐ MODIFICADO: loadInstituciones con paginación del backend
const loadInstituciones = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.currentPage,
      per_page: pagination.perPage,
      search: searchQuery.value || undefined,
      sort_by: sorting.sortBy, // ⭐ NUEVO
      sort_order: sorting.sortOrder, // ⭐ NUEVO
    };

    console.log("📤 INSTITUCIONES - Enviando request con params:", params);
    const r = await institucionesService.getAll(params);
    console.log("📥 INSTITUCIONES - Respuesta completa:", r.data);

    // ✅ Manejar respuesta paginada correctamente
    const responseData = r.data;

    // Laravel paginate devuelve: { data: [...], current_page, last_page, per_page, total }
    if (responseData.data && Array.isArray(responseData.data)) {
      // Respuesta paginada de Laravel
      instituciones.value = responseData.data;
      pagination.currentPage = responseData.current_page || 1;
      pagination.lastPage = responseData.last_page || 1;
      pagination.perPage = responseData.per_page || 20;
      pagination.total = responseData.total || 0;

      console.log("✅ INSTITUCIONES - Paginación actualizada:", {
        total: pagination.total,
        currentPage: pagination.currentPage,
        lastPage: pagination.lastPage,
        perPage: pagination.perPage,
        registrosMostrados: instituciones.value.length,
      });
    } else if (Array.isArray(responseData)) {
      // Respuesta sin paginar (fallback)
      instituciones.value = responseData;
      pagination.total = responseData.length;
      pagination.lastPage = 1;

      console.log("⚠️ INSTITUCIONES - Respuesta sin paginar. Total:", pagination.total);
    } else {
      // Formato desconocido
      console.warn("❌ INSTITUCIONES - Formato de respuesta inesperado:", responseData);
      instituciones.value = [];
      pagination.total = 0;
    }

    // Limpiar selección
    selectedIds.value = [];
  } catch (err) {
    console.error("❌ INSTITUCIONES - Error cargando:", err);
    console.error("❌ INSTITUCIONES - Detalles del error:", err.response?.data);
    instituciones.value = [];
    pagination.total = 0;

    if (err.response?.status >= 500) {
      alert.error("Error del servidor", "Hubo un problema en el servidor.");
    }
  }
  loading.value = false;
};

// ⭐ NUEVO: Manejador de cambio de página
const handlePageChange = (page) => {
  pagination.currentPage = page;
  loadInstituciones();
};

// ⭐ NUEVO: Función para cambiar ordenamiento
const handleSort = (column) => {
  if (sorting.sortBy === column) {
    // Si ya está ordenando por esta columna, cambiar dirección
    sorting.sortOrder = sorting.sortOrder === "asc" ? "desc" : "asc";
  } else {
    // Nueva columna, ordenar ascendente
    sorting.sortBy = column;
    sorting.sortOrder = "asc";
  }

  pagination.currentPage = 1; // Resetear a primera página
  loadInstituciones();
};

// Computed para saber si todos están seleccionados
const isAllSelected = computed(() => {
  return (
    instituciones.value.length > 0 &&
    selectedIds.value.length === instituciones.value.length
  );
});

// Toggle selección individual
const toggleSelection = (id) => {
  const index = selectedIds.value.indexOf(id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(id);
  }
};

// Toggle seleccionar todos
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = instituciones.value.map((inst) => inst.id);
  }
};

// Eliminar seleccionados
const confirmBulkDelete = async () => {
  const count = selectedIds.value.length;
  const r = await alert.confirmDelete(
    `Eliminar ${count} ${count === 1 ? "institución" : "instituciones"}`,
    "Esta acción no se puede deshacer"
  );

  if (!r.isConfirmed) return;

  try {
    await institucionesService.deleteMultiple(selectedIds.value);
    selectedIds.value = [];
    await loadInstituciones();
    await loadEstadisticasImportacion(); // ⭐ NUEVO
    alert.toastSuccess(
      `${count} ${count === 1 ? "institución eliminada" : "instituciones eliminadas"}`
    );
  } catch (error) {
    console.error("Error eliminando instituciones:", error);
    alert.error(
      "Error",
      error.response?.data?.message || "No se pudieron eliminar algunas instituciones"
    );
  }
};

// ⭐ NUEVO: Descargar reporte de errores
const descargarReporteErrores = async () => {
  const importId = estadisticasImportacion.value?.ultima_importacion?.id;

  if (!importId) {
    alert.error("Error", "No se encontró el ID de la importación");
    return;
  }

  descargandoErrores.value = true;

  try {
    const response = await institucionesService.descargarErroresXlsx(importId);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `errores_instituciones_${importId}.xlsx`);
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

// ⭐ MODIFICADO: onMounted
onMounted(async () => {
  await loadInstituciones();
  await loadEstadisticasImportacion();

  // Iniciar polling si hay importación en progreso
  const ultimaImportacion = estadisticasImportacion.value?.ultima_importacion;
  const estadoEnProgreso =
    ultimaImportacion?.estado === "processing" ||
    ultimaImportacion?.estado === "pendiente";

  if (estadoEnProgreso) {
    startStatsPolling();
  }
});

// ⭐ NUEVO: Limpiar polling al desmontar
onBeforeUnmount(() => {
  stopStatsPolling();
  if (searchDebounce) clearTimeout(searchDebounce);
});
</script>
