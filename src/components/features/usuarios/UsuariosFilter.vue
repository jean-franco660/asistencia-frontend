<template>
  <div
    class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600"
  >
    <div class="flex flex-col gap-4">
      <!-- Barra de búsqueda y ordenamiento -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="flex items-center gap-3 flex-1">
          <Search :size="20" class="text-gray-400" />
          <InputField
            :model-value="searchQuery"
            @update:model-value="$emit('update:searchQuery', $event)"
            type="text"
            placeholder="Buscar docente..."
            class="!border-0 !bg-transparent !focus:ring-0 flex-1"
          />
        </div>

        <!-- Selector de ordenamiento -->
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-600 dark:text-gray-400 whitespace-nowrap"
            >Ordenar por:</span
          >
          <select
            :value="sorting.sortBy"
            @change="$emit('update:sortBy', $event.target.value)"
            class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="id">Orden de importación</option>
            <option value="codigo_modular">Código modular</option>
            <option value="apellido_paterno">Apellido paterno</option>
            <option value="apellido_materno">Apellido materno</option>
            <option value="nombres">Nombres</option>
          </select>
          <button
            @click="$emit('toggleSortOrder')"
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
            :value="filterStatus"
            @change="$emit('update:filterStatus', $event.target.value)"
            class="w-full px-3 sm:px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Todos los estados</option>
            <option value="activo">✓ Activos</option>
            <option value="inactivo">✗ Inactivos</option>
            <option value="pendiente">⏳ Pendientes</option>
          </select>

          <!-- Filtro Institución con Búsqueda -->
          <div class="relative inst-search-filter">
            <div class="relative">
              <input
                type="text"
                :value="institucionSearchQuery"
                @input="$emit('update:institucionSearchQuery', $event.target.value)"
                @focus="$emit('focusInstitucion')"
                placeholder="Buscar institución por nombre o código..."
                class="w-full pl-9 pr-10 px-3 sm:px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <!-- Botón limpiar -->
              <button
                v-if="filterInstitucion"
                @click="$emit('limpiarInstitucion')"
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
              class="absolute z-50 w-full mt-1 max-h-64 overflow-auto bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-xl shadow-2xl inst-dropdown-filter"
            >
              <button
                type="button"
                v-for="inst in filteredInstituciones"
                :key="inst.id"
                @click="$emit('seleccionarInstitucion', inst)"
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
                     <span class="text-blue-600 dark:text-blue-400 font-semibold text-xs">I.E.</span> {{ inst.nombre }}
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
              v-if="filterInstitucion && selectedInstitucionNombre"
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
                    {{ selectedInstitucionNombre }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                    >
                      <Hash :size="12" class="mr-1" />
                      {{ selectedInstitucionCodigo }}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  @click="$emit('limpiarInstitucion')"
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
            @click="$emit('confirmBulkDelete')"
            class="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white animate-fadeIn w-full sm:flex-1"
          >
            <Trash2 :size="18" class="sm:w-5 sm:h-5" />
            <span class="text-sm sm:text-base"
              >Eliminar ({{ selectedIds.length }})</span
            >
          </ButtonComponent>
          <ButtonComponent
            variant="secondary"
            @click="$emit('openImportModal')"
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
            @click="$emit('openCreateModal')"
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
</template>

<script setup>
import { 
  Search, ChevronUp, ChevronDown, Building2, 
  Hash, Trash2, Upload, Plus 
} from 'lucide-vue-next';
import InputField from '@/components/ui/InputField.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';

defineProps({
  searchQuery: String,
  sorting: Object,
  filterStatus: String,
  institucionSearchQuery: String,
  showInstitucionDropdown: Boolean,
  filteredInstituciones: Array,
  filterInstitucion: [String, Number],
  selectedIds: Array,
  selectedInstitucionNombre: String, // From composable return
  selectedInstitucionCodigo: String // From composable return
});

defineEmits([
  'update:searchQuery', 
  'update:sortBy', 
  'toggleSortOrder',
  'update:filterStatus',
  'update:institucionSearchQuery',
  'focusInstitucion',
  'seleccionarInstitucion',
  'limpiarInstitucion',
  'openImportModal',
  'openCreateModal',
  'confirmBulkDelete'
]);
</script>
