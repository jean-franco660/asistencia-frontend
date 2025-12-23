<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <UsuariosHeader />

    <main class="flex-1 px-4 sm:px-6 py-6 overflow-y-auto custom-scrollbar">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Stats Section -->
        <UsuariosStats
          :estadisticas-importacion="estadisticasImportacion"
          :is-polling-stats="isPollingStats"
          :descargando-errores="descargandoErrores"
          @stop-polling="stopStatsPolling"
          @descargar-reporte="descargarReporteErrores"
        />

        <!-- Main Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 overflow-hidden">
          <!-- Filter Section -->
          <UsuariosFilter
            :search-query="filterState.searchQuery"
            :sorting="sorting"
            :filter-status="filterState.status"
            :institucion-search-query="institucionSearchQuery"
            :show-institucion-dropdown="showInstitucionDropdown"
            :filtered-instituciones="filteredInstituciones"
            :filter-institucion="filterInstitucion"
            :selected-ids="selectedIds"
            :selected-institucion-nombre="selectedFilterInstitucionNombre"
            :selected-institucion-codigo="selectedFilterInstitucionCodigo"
            
            @update:search-query="filterState.searchQuery = $event"
            @update:sort-by="(val) => { sorting.sortBy = val; loadUsuarios(); }"
            @toggle-sort-order="handleSort(sorting.sortBy)"
            @update:filter-status="handleStatusChange"
            @update:institucion-search-query="institucionSearchQuery = $event; buscarInstitucionFiltro()"
            @focus-institucion="onFocusInstitucionFiltro"
            @seleccionar-institucion="seleccionarInstitucionFiltro($event); handleInstitucionChange($event)"
            @limpiar-institucion="limpiarFiltroInstitucion(); handleInstitucionChange(null)"
            @open-import-modal="showImportModal = true"
            @open-create-modal="openCreateModal"
            @confirm-bulk-delete="confirmBulkDelete"
          />

          <!-- Table Section -->
          <UsuariosTable
            :usuarios="usuarios"
            :loading="loading"
            :selected-ids="selectedIds"
            :pagination="pagination"
            :is-all-selected="isAllSelected"
            :sorting="sorting"
            
            @toggle-selection="toggleSelection"
            @toggle-select-all="toggleSelectAll"
            @edit="openEditModal"
            @inactivate="openInactivarModal"
            @delete="confirmDelete"
            @page-change="handlePageChange"
            @update:sort-by="handleSort"
            @view-detail="openDetailModal"
          />
        </div>
      </div>
    </main>

    <!-- Modals -->
    <UsuariosImportModal
      v-model="showImportModal"
      :import-function="handleImportDocentes"
      :status-function="handleStatusDocentes"
      :download-template-function="handleDownloadTemplate"
      :download-error-report-function="handleDownloadErroresDocentes"
      @import-success="onImportSuccess"
    />

    <UsuariosForm
      :show="showModal"
      :mode="modalMode"
      :form="form"
      :submitting="submitting"
      @close="closeModal"
      @submit="handleSubmit"
      @add-assignment="agregarAsignacion"
      @remove-assignment="eliminarAsignacion"
      @search-institution="buscarInstitucionAsignacion"
      @select-institution="seleccionarInstitucionAsignacion"
      @clear-institution="limpiarInstitucionAsignacion"
      @hide-dropdown="hideDropdown"
    />

    <UsuarioDetailModal
      :is-open="showDetailModal"
      :usuario-id="selectedUsuarioId"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useAlert } from '@/utils/sweetalert';
import { useImportacionDocentes } from '@/composables/usuarios/useImportacionDocentes';
import { useInstitucionesFilter } from '@/composables/usuarios/useInstitucionesFilter';
import { useUsuariosList } from '@/composables/usuarios/useUsuariosList';
import { useUsuariosForm } from '@/composables/usuarios/useUsuariosForm';
import { usuariosService } from '@/services/api';

// Import Feature Components
import UsuariosHeader from '@/components/features/usuarios/UsuariosHeader.vue';
import UsuariosStats from '@/components/features/usuarios/UsuariosStats.vue';
import UsuariosFilter from '@/components/features/usuarios/UsuariosFilter.vue';
import UsuariosTable from '@/components/features/usuarios/UsuariosTable.vue';
import UsuariosForm from '@/components/features/usuarios/UsuariosForm.vue';
import UsuariosImportModal from '@/components/features/usuarios/UsuariosImportModal.vue';
import UsuarioDetailModal from '@/components/features/usuarios/UsuarioDetailModal.vue';

const alert = useAlert();

// Modal de detalle
const showDetailModal = ref(false);
const selectedUsuarioId = ref(null);

const openDetailModal = (id) => {
  selectedUsuarioId.value = id;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedUsuarioId.value = null;
};

// --- 1. Filter State (Shared) ---
const filterState = reactive({
  searchQuery: "",
  status: "",
  institucionId: null
});

// --- 2. Composables ---

// Importacion
const {
  estadisticasImportacion,
  isPollingStats,
  descargandoErrores,
  loadEstadisticasImportacion,
  startStatsPolling,
  stopStatsPolling,
  descargarReporteErrores,
  handleImportDocentes,
  handleStatusDocentes,
  handleDownloadTemplate,
  handleDownloadErroresDocentes
} = useImportacionDocentes(onImportSuccessCallback);

// Instituciones Filter
const {
  institucionSearchQuery,
  filteredInstituciones,
  showInstitucionDropdown,
  filterInstitucion,
  selectedFilterInstitucionNombre,
  selectedFilterInstitucionCodigo,
  onFocusInstitucionFiltro,
  buscarInstitucionFiltro,
  seleccionarInstitucionFiltro,
  limpiarFiltroInstitucion,
  handleClickOutsideValues
} = useInstitucionesFilter(handleInstitucionChangeCallback); 
// Note: handleInstitucionChangeCallback is defined below, but circular ref might be issue if passed directly.
// useInstitucionesFilter calls the callback when filter changes. I'll pass a lambda wrapper or define it earlier.

// Usuarios List
const {
  usuarios,
  loading,
  selectedIds,
  pagination,
  sorting,
  loadUsuarios,
  handlePageChange,
  handleSort,
  toggleSelection,
  toggleSelectAll,
  isAllSelected,
  confirmBulkDelete: deleteAll
} = useUsuariosList(filterState);

// Usuarios Form
const {
  form,
  showModal,
  modalMode,
  submitting,
  openCreateModal,
  openEditModal,
  closeModal,
  handleSubmit,
  agregarAsignacion,
  eliminarAsignacion,
  buscarInstitucionAsignacion,
  seleccionarInstitucionAsignacion,
  limpiarInstitucionAsignacion,
  hideDropdown
} = useUsuariosForm(loadUsuarios);

// --- 3. Integration Logic ---

const showImportModal = ref(false);
const showInactivarModal = ref(false);
const selectedAsignacion = ref(null);

function handleStatusChange(val) {
  filterState.status = val;
  // loadUsuarios triggered by some mechanism? 
  // useUsuariosList does NOT watch filterState.status automatically (based on my reading of Step 144, it ONLY watches searchQuery).
  // I need to trigger load manually.
  pagination.currentPage = 1;
  loadUsuarios();
}

function handleInstitucionChange(inst) {
   // inst is the object or null. 
   // This method is called by template events @seleccionar-institucion and @limpiar-institucion.
   // It is ALSO used as callback for useInstitucionesFilter?
   // Actually, useInstitucionesFilter logic (Step 141) calls `onFilterChange` when selection happens.
   // I passed `handleInstitucionChangeCallback` to it.
   
   // logic is simpler:
   // When useInstitucionesFilter updates `filterInstitucion` ref, I should sync it to `filterState.institucionId`.
   // useInstitucionesFilter updates `filterInstitucion` ref internally.
   
   filterState.institucionId = filterInstitucion.value;
   // Trigger load
   pagination.currentPage = 1;
   loadUsuarios();
}

// Callback passed to composable
function handleInstitucionChangeCallback() {
    handleInstitucionChange(null); // The argument doesn't matter much as we read `filterInstitucion.value` inside.
}

async function onImportSuccessCallback() {
  await loadUsuarios();
  await loadEstadisticasImportacion();
}

function onImportSuccess() {
  onImportSuccessCallback();
}

async function confirmDelete(docente) {
    const r = await alert.confirmDelete(
        "Eliminar Docente", 
        `¿Estás seguro de eliminar a ${docente.nombre_completo}?`
    );
    if(r.isConfirmed) {
        try {
            await usuariosService.delete(docente.id);
            alert.toastSuccess("Docente eliminado");
            loadUsuarios();
        } catch(e) {
            alert.error("Error", "No se pudo eliminar el docente");
        }
    }
}

function confirmBulkDelete() {
    deleteAll();
}

// Click outside handler for filters
onMounted(() => {
    loadEstadisticasImportacion();
    loadUsuarios();
    
    document.addEventListener('click', handleClickOutsideValues);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutsideValues);
});

// --- 4.// Inactivar asignación (inmediato, sin modal)
async function openInactivarModal(docente) {
    // Buscar en instituciones donde el pivot tenga estado ACTIVO
    const activeInst = docente.instituciones?.find(i => i.pivot?.estado === 'ACTIVO');
    
    if (activeInst) {
        const confirmed = await alert.confirm(
            '¿Inhabilitar usuario?',
            `Se inhabilitará a ${docente.nombre_completo} en ${activeInst.nombre}. La fecha de fin se establecerá automáticamente a hoy.`,
            'warning'
        );
        
        if (confirmed.isConfirmed) {
            try {
                // Solo cambiar estado a INACTIVO - Observer establece fecha_fin automáticamente
                // Usamos activeInst.pivot.id que es el ID de la asignación (UsuarioAppInstitucion)
                await usuariosService.inactivarAsignacion(activeInst.pivot.id);
                alert.toastSuccess('Usuario inhabilitado correctamente');
                await loadUsuarios();
            } catch (e) {
                console.error('Error inhabilitando usuario:', e);
                alert.error('Error', e.response?.data?.message || 'No se pudo inhabilitar el usuario');
            }
        }
    } else {
        alert.warning('Sin asignaciones activas', 'Este docente no tiene asignaciones activas para inhabilitar');
    }
}
</script>
