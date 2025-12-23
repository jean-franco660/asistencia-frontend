<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="p-12 text-center">
      <Loader2 :size="48" class="inline-block animate-spin text-blue-600 mb-4" />
      <p class="text-gray-500 dark:text-gray-400">Cargando docentes...</p>
    </div>

    <div v-else>
      <!-- 📱 MOBILE CARD VIEW (< 768px) -->
      <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="docente in usuarios"
          :key="docente.id"
          class="p-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
          :class="{
            'bg-blue-50 dark:bg-blue-900/20': selectedIds.includes(docente.id),
          }"
        >
          <!-- Card Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-start gap-3 flex-1">
              <input
                type="checkbox"
                :checked="selectedIds.includes(docente.id)"
                @change="$emit('toggleSelection', docente.id)"
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

            <!-- Actions -->
            <div class="flex gap-2 ml-2">
              <button
                @click="$emit('edit', docente)"
                class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
              >
                <Edit2 :size="18" />
              </button>
              <button
                @click="$emit('delete', docente)"
                class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
              >
                <Trash2 :size="18" />
              </button>
            </div>
          </div>

          <!-- Card Body -->
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Instituciones</p>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="inst in docente.instituciones.slice(0, 2)"
                  :key="inst.id"
                  class="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-md truncate max-w-full"
                >
                 <span class="text-blue-600 dark:text-blue-400 font-semibold text-xs">I.E.</span> {{ inst.nombre }}
                </span>
                <span
                  v-if="docente.instituciones.length > 2"
                  class="text-xs text-gray-500"
                  >+{{ docente.instituciones.length - 2 }}</span
                >
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Estado</p>
              <span
                class="inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                :class="
                  docente.estado === 'ACTIVO'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                "
              >
                {{ docente.estado }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 💻 DESKTOP TABLE VIEW (>= 768px) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th class="px-4 lg:px-6 py-4 text-center w-12">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="$emit('toggleSelectAll')"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <!-- Headers -->
              <th
                @click="$emit('update:sortBy', 'id')"
                class="hidden xl:table-cell px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div class="flex items-center justify-center gap-1">
                  <span>ID</span>
                  <SortIcon col="id" :sorting="sorting" />
                </div>
              </th>
              <th
                @click="$emit('update:sortBy', 'apellido_paterno')"
                class="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
                <div class="flex items-center gap-1">
                  <span>Docente</span>
                  <SortIcon col="apellido_paterno" :sorting="sorting" />
                </div>
              </th>
               <th
                @click="$emit('update:sortBy', 'codigo_modular')"
                class="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
                <div class="flex items-center gap-1">
                  <span>Código</span>
                  <SortIcon col="codigo_modular" :sorting="sorting" />
                </div>
              </th>
              <th class="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Instituciones
              </th>
              <th class="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Vigencia
              </th>
               <th class="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Acceso
              </th>
              <th class="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
             <tr
                v-for="docente in usuarios"
                :key="docente.id"
                @click="$emit('view-detail', docente.id)"
                class="cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
                 :class="{
                  'bg-blue-50 dark:bg-blue-900/20': selectedIds.includes(docente.id),
                }"
             >
                <td class="px-4 lg:px-6 py-4 text-center" @click.stop>
                   <input
                    type="checkbox"
                    :checked="selectedIds.includes(docente.id)"
                    @change="$emit('toggleSelection', docente.id)"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td class="hidden xl:table-cell px-4 lg:px-6 py-4 text-center">
                    <span class="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {{ docente.id }}
                    </span>
                </td>
                <td class="px-4 lg:px-6 py-4">
                     <p class="text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100">
                        {{ toTitleCase(docente.nombre_completo) }}
                     </p>
                </td>
                 <td class="px-4 lg:px-6 py-4">
                    <span class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        {{ docente.codigo }}
                    </span>
                </td>
                <td class="px-4 lg:px-6 py-4">
                    <div class="flex flex-col gap-1">
                        <span v-for="inst in docente.instituciones" :key="inst.id" class="text-xs lg:text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                             <Building2 :size="12" class="text-gray-400" />
                            <span class="text-blue-600 dark:text-blue-400 font-semibold text-xs">I.E.</span> {{ inst.nombre }}
                        </span>
                         <span v-if="!docente.instituciones.length" class="text-xs text-gray-400 italic">
                            Sin asignar
                        </span>
                    </div>
                </td>
                <td class="px-4 lg:px-6 py-4 text-center">
                    <div class="flex flex-col gap-1 items-center">
                        <VigenciaBadge 
                          v-for="inst in docente.instituciones" 
                          :key="inst.id" 
                          :asignacion="inst.pivot" 
                        />
                        <span v-if="!docente.instituciones || docente.instituciones.length === 0" class="text-xs text-gray-400 italic">
                            Sin instituciones
                        </span>
                    </div>
                </td>
                <td class="px-4 lg:px-6 py-4 text-center">
                     <span
                        class="inline-flex px-2 lg:px-3 py-1 rounded-full text-xs font-semibold"
                        :class="docente.estado === 'ACTIVO' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
                      >
                        {{ docente.estado }}
                      </span>
                </td>
                 <td class="px-4 lg:px-6 py-4 text-center">
                    <span
                        class="inline-flex items-center justify-center w-8 h-8 rounded-full"
                        :class="docente.acceso_habilitado ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'"
                    >
                         <CheckCircle2 v-if="docente.acceso_habilitado" :size="18" />
                         <XCircle v-else :size="18" />
                    </span>
                 </td>
                 <td class="px-4 lg:px-6 py-4 text-center">
                     <div class="flex items-center justify-center gap-2" @click.stop>
                        <button
                            @click="$emit('edit', docente)"
                            class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors group"
                             title="Editar docente"
                          >
                            <Edit2 :size="18" class="group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            @click="$emit('inactivate', docente)"
                            class="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg transition-colors group"
                            title="Inactivar asignación"
                            :disabled="!docente.instituciones?.length"
                          >
                            <UserX :size="18" class="group-hover:scale-110 transition-transform" />
                          </button>
                           <button
                             @click="$emit('delete', docente)"
                            class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors group"
                             title="Eliminar docente"
                          >
                            <Trash2 :size="18" class="group-hover:scale-110 transition-transform" />
                          </button>
                     </div>
                 </td>
             </tr>
              <tr v-if="usuarios.length === 0">
                <td colspan="8" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <div class="flex flex-col items-center justify-center gap-3">
                     <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                         <Search :size="32" class="text-gray-400" />
                     </div>
                      <p class="text-lg font-medium">No se encontraron docentes</p>
                      <p class="text-sm">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
      
       <!-- Footer / Pagination -->
      <div v-if="usuarios.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex flex-col sm:flex-row items-center justify-between gap-4">
         <p class="text-sm text-gray-600 dark:text-gray-400">
             Mostrando
              <span class="font-medium text-gray-900 dark:text-white">
                {{ (pagination.currentPage - 1) * pagination.perPage + 1 }}
              </span>
              a
              <span class="font-medium text-gray-900 dark:text-white">
                {{ Math.min(pagination.currentPage * pagination.perPage, pagination.total) }}
              </span>
              de
              <span class="font-medium text-gray-900 dark:text-white">
                {{ pagination.total }}
              </span>
              resultados
         </p>
         
         <div class="flex items-center gap-2">
            <button
              @click="$emit('pageChange', pagination.currentPage - 1)"
              :disabled="pagination.currentPage === 1"
              class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft :size="20" />
            </button>
             <div class="flex items-center gap-1">
                 <!-- Simple pagination logic -->
                 <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="$emit('pageChange', page)"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
                    :class="page === pagination.currentPage ? 'bg-blue-600 text-white' : 'hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'"
                 >
                    {{ page }}
                 </button>
             </div>
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
</template>

<script setup>
import { computed, h } from 'vue';
import { 
  Loader2, Edit2, Trash2, Building2, 
  ChevronUp, ChevronDown, ChevronsUpDown,
  CheckCircle2, XCircle, Search,
  ChevronLeft, ChevronRight, UserX
} from 'lucide-vue-next';
import VigenciaBadge from './VigenciaBadge.vue';

const props = defineProps({
  usuarios: Array,
  loading: Boolean,
  selectedIds: Array,
  pagination: Object, // { currentPage, lastPage, perPage, total }
  isAllSelected: Boolean,
  sorting: Object
});

const emit = defineEmits([
  'toggleSelection', 
  'toggleSelectAll', 
  'edit',
  'inactivate', 
  'delete',
  'pageChange',
  'update:sortBy',
  'view-detail'
]);

// Helper Sort Icon Component
const SortIcon = (propsObj) => {
    const { col, sorting } = propsObj;
    if (sorting.sortBy !== col) return h(ChevronsUpDown, { size: 14, class: 'text-gray-400' });
    if (sorting.sortOrder === 'asc') return h(ChevronUp, { size: 14 });
    return h(ChevronDown, { size: 14 });
};
SortIcon.props = ['col', 'sorting'];


const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const visiblePages = computed(() => {
    const { currentPage, lastPage } = props.pagination;
    const delta = 2; // Pages to show around current
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(lastPage - 1, currentPage + delta); i++) {
        range.push(i);
    }
    
    if (currentPage - delta > 2) range.unshift('...');
    if (currentPage + delta < lastPage - 1) range.push('...');
    
    range.unshift(1);
    if (lastPage > 1) range.push(lastPage);
    
    // Simplification: just return simple array for now to avoid complexity with ellipses in template loop
    // or just return mostly relevant pages. 
    // Let's rely on a simpler array for this iteration
    const pages = [];
     for(let i=1; i<=lastPage; i++) {
         if (i === 1 || i === lastPage || (i >= currentPage - 1 && i <= currentPage + 1)) {
             pages.push(i);
         }
     }
     // Remove duplicates within range logic if simple
     return [...new Set(pages)].sort((a,b) => a - b);
});
</script>
