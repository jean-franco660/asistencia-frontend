<template>
  <div
    class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600"
  >
    <div class="flex flex-col gap-4">
      <!-- Barra de búsqueda y ordenamiento -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="flex items-center gap-3 flex-1">
          <Search :size="20" class="text-gray-400" />
          <input
            type="text"
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            placeholder="Buscar institución..."
            class="flex-1 px-3 py-2 border-0 bg-transparent focus:ring-0 text-gray-700 dark:text-gray-300"
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
            <option value="codigo_modular_ie">Código modular</option>
            <option value="nombre">Nombre</option>
            <option value="distrito">Distrito</option>
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

      <!-- Botones de acción -->
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <!-- Botón eliminar seleccionados -->
        <button
          v-if="selectedIds.length > 0"
          @click="$emit('confirmBulkDelete')"
          class="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors animate-fadeIn w-full sm:flex-1"
        >
          <Trash2 :size="18" class="sm:w-5 sm:h-5" />
          <span class="text-sm sm:text-base"
            >Eliminar ({{ selectedIds.length }})</span
          >
        </button>
        <button
          @click="$emit('openImportModal')"
          class="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full sm:w-auto"
        >
          <Upload :size="18" class="sm:w-5 sm:h-5" />
          <span class="text-sm sm:text-base">
            <span class="hidden sm:inline">Importar Excel</span>
            <span class="sm:hidden">Importar</span>
          </span>
        </button>
        <button
          @click="$emit('openCreateModal')"
          class="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all text-white rounded-lg w-full sm:w-auto"
        >
          <Plus :size="18" class="sm:w-5 sm:h-5" />
          <span class="text-sm sm:text-base">
            <span class="hidden sm:inline">Nueva Institución</span>
            <span class="sm:hidden">Nueva</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Search,
  ChevronUp,
  ChevronDown,
  Trash2,
  Upload,
  Plus,
} from 'lucide-vue-next';

defineProps({
  searchQuery: String,
  sorting: Object,
  selectedIds: Array,
});

defineEmits([
  'update:searchQuery',
  'update:sortBy',
  'toggleSortOrder',
  'openImportModal',
  'openCreateModal',
  'confirmBulkDelete',
]);
</script>
