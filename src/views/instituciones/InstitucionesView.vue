<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <InstitucionesHeader />

      <!-- Stats -->
      <InstitucionesStats
        :estadisticas-importacion="estadisticasImportacion"
        :is-polling-stats="isPollingStats"
        :descargando-errores="descargandoErrores"
        @stop-polling="stopStatsPolling"
        @descargar-reporte="descargarReporteErrores"
      />

      <!-- Main Card -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <!-- Filter -->
        <InstitucionesFilter
          :search-query="filterState.searchQuery"
          :sorting="sorting"
          :selected-ids="selectedIds"
          @update:search-query="filterState.searchQuery = $event"
          @update:sort-by="handleSort"
          @toggle-sort-order="handleSort(sorting.sortBy)"
          @open-import-modal="showImportModal = true"
          @open-create-modal="openCreateModal"
          @confirm-bulk-delete="confirmBulkDelete"
        />

        <!-- Table -->
        <InstitucionesTable
          :instituciones="instituciones"
          :loading="loading"
          :selected-ids="selectedIds"
          :pagination="pagination"
          :is-all-selected="isAllSelected"
          @toggle-selection="toggleSelection"
          @toggle-select-all="toggleSelectAll"
          @edit="openEditModal"
          @delete="confirmDelete"
          @view-detail="openDetailModal"
          @page-change="handlePageChange"
        />
      </div>

      <!-- Form Modal -->
      <InstitucionesForm
        :show="showModal"
        :mode="modalMode"
        :form="form"
        :submitting="submitting"
        :logo-preview="logoPreview"
        @close="closeModal"
        @submit="handleSubmit"
        @logo-change="handleLogoChange"
        @remove-logo="removeLogo"
      />

      <!-- Import Modal -->
      <ImportFileModal
        v-model="showImportModal"
        tipo="Instituciones"
        :import-function="handleImportInstituciones"
        :status-function="handleStatusInstituciones"
        :download-template-function="handleDownloadTemplate"
        :download-error-report-function="handleDownloadErroresInstituciones"
        @import-success="handleImportSuccess"
      />

      <!-- Detail Modal -->
      <InstitucionDetailModal
        :is-open="showDetailModal"
        :institucion-id="selectedInstitucionId"
        @close="closeDetailModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useInstitucionesList } from '@/composables/instituciones/useInstitucionesList';
import { useInstitucionesForm } from '@/composables/instituciones/useInstitucionesForm';
import { useImportacionInstituciones } from '@/composables/instituciones/useImportacionInstituciones';

import InstitucionesHeader from '@/components/features/instituciones/InstitucionesHeader.vue';
import InstitucionesStats from '@/components/features/instituciones/InstitucionesStats.vue';
import InstitucionesFilter from '@/components/features/instituciones/InstitucionesFilter.vue';
import InstitucionesTable from '@/components/features/instituciones/InstitucionesTable.vue';
import InstitucionesForm from '@/components/features/instituciones/InstitucionesForm.vue';
import ImportFileModal from '@/components/ui/ImportFileModal.vue';
import InstitucionDetailModal from '@/components/features/instituciones/InstitucionDetailModal.vue';

// Filter state (shared between composables)
const filterState = reactive({
  searchQuery: "",
});

// Composables
const {
  instituciones,
  loading,
  selectedIds,
  pagination,
  sorting,
  loadInstituciones,
  handlePageChange,
  handleSort,
  isAllSelected,
  toggleSelection,
  toggleSelectAll,
  confirmBulkDelete,
} = useInstitucionesList(filterState);

const {
  form,
  showModal,
  modalMode,
  submitting,
  logoPreview,
  logoFile,
  openCreateModal,
  openEditModal,
  closeModal,
  handleSubmit,
  handleLogoChange,
  removeLogo,
} = useInstitucionesForm(loadInstituciones);

const {
  estadisticasImportacion,
  isPollingStats,
  descargandoErrores,
  loadEstadisticasImportacion,
  stopStatsPolling,
  handleImportInstituciones,
  handleStatusInstituciones,
  handleDownloadTemplate,
  handleDownloadErroresInstituciones,
  descargarReporteErrores,
} = useImportacionInstituciones(loadInstituciones);

// Detail modal state
const showDetailModal = ref(false);
const selectedInstitucionId = ref(null);
const showImportModal = ref(false);

const openDetailModal = (id) => {
  selectedInstitucionId.value = id;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedInstitucionId.value = null;
};

// Delete confirmation
const confirmDelete = async (institucion) => {
  const { useAlert } = await import('@/utils/sweetalert');
  const alert = useAlert();
  
  const r = await alert.confirmDelete(
    `Eliminar "${institucion.nombre}"`,
    "Esta acción no se puede deshacer"
  );

  if (!r.isConfirmed) return;

  try {
    const { institucionesService } = await import('@/services/api');
    await institucionesService.delete(institucion.id);
    await loadInstituciones();
    await loadEstadisticasImportacion();
    alert.toastSuccess("Institución eliminada");
  } catch (error) {
    console.error("Error al eliminar:", error);
    alert.error("Error", error.response?.data?.message || "No se pudo eliminar");
  }
};

// Import success handler
const handleImportSuccess = async () => {
  showImportModal.value = false;
  await loadInstituciones();
  await loadEstadisticasImportacion();
};

// Lifecycle
onMounted(() => {
  loadInstituciones();
  loadEstadisticasImportacion();
});

onUnmounted(() => {
  stopStatsPolling();
});
</script>
