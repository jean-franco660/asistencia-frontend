<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="p-12 text-center">
      <Loader2 :size="48" class="inline-block animate-spin text-blue-600 mb-4" />
      <p class="text-gray-500 dark:text-gray-400">Cargando instituciones...</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th class="px-6 py-4 text-center w-12">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="$emit('toggleSelectAll')"
                class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Logo
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Código Modular
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Nombre
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Distrito
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Nivel Educativo
            </th>
            <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="institucion in instituciones"
            :key="institucion.id"
            @click="$emit('viewDetail', institucion.id)"
            :class="[
              'cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150',
              selectedIds.includes(institucion.id)
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : '',
            ]"
          >
            <td class="px-6 py-4 text-center" @click.stop>
              <input
                type="checkbox"
                :checked="selectedIds.includes(institucion.id)"
                @change="$emit('toggleSelection', institucion.id)"
                class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </td>
            <td class="px-6 py-4">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <img
                  v-if="institucion.logo || institucion.logo_url"
                  :src="institucion.logo_url || institucion.logo"
                  :alt="institucion.nombre"
                  class="w-full h-full object-cover"
                />
                <Building2 v-else :size="24" class="text-gray-400" />
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {{ institucion.codigo_modular_ie }}
              </span>
            </td>
            <td class="px-6 py-4">
              <p class="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight">
               <span class="text-blue-600 dark:text-blue-400 font-bold text-sm">I.E.</span>
                {{ institucion.nombre }}
              </p>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ institucion.distrito || 'N/A' }}
              </p>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {{ institucion.nivel_educativo || 'N/A' }}
              </span>
            </td>
            <td class="px-6 py-4 text-center" @click.stop>
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="$emit('edit', institucion)"
                  class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 :size="18" />
                </button>
                <button
                  @click="$emit('delete', institucion)"
                  class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.total > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando
            <span class="font-medium">{{ (pagination.currentPage - 1) * pagination.perPage + 1 }}</span>
            a
            <span class="font-medium">{{ Math.min(pagination.currentPage * pagination.perPage, pagination.total) }}</span>
            de
            <span class="font-medium">{{ pagination.total }}</span>
            resultados
          </p>
          <div class="flex gap-2">
            <button
              @click="$emit('pageChange', pagination.currentPage - 1)"
              :disabled="pagination.currentPage === 1"
              class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft :size="20" />
            </button>
            <button
              @click="$emit('pageChange', pagination.currentPage + 1)"
              :disabled="pagination.currentPage === pagination.lastPage"
              class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight :size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Loader2, Edit2, Trash2, Building2, ChevronLeft, ChevronRight } from 'lucide-vue-next';

defineProps({
  instituciones: Array,
  loading: Boolean,
  selectedIds: Array,
  pagination: Object,
  isAllSelected: Boolean,
});

defineEmits([
  'toggleSelection',
  'toggleSelectAll',
  'edit',
  'delete',
  'viewDetail',
  'pageChange',
]);
</script>
