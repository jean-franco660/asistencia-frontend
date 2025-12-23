import { ref, reactive, computed, watch, onUnmounted } from 'vue';
import { useAlert } from '@/utils/sweetalert';
import { institucionesService } from '@/services/api';

export function useInstitucionesList(filterState) {
    const alert = useAlert();

    const instituciones = ref([]);
    const loading = ref(false);
    const selectedIds = ref([]);

    const pagination = reactive({
        currentPage: 1,
        lastPage: 1,
        perPage: 20,
        total: 0,
    });

    const sorting = reactive({
        sortBy: "id",
        sortOrder: "asc",
    });

    let searchDebounce = null;

    const loadInstituciones = async () => {
        loading.value = true;
        try {
            const params = {
                page: pagination.currentPage,
                search: filterState.searchQuery || undefined,
                sort_by: sorting.sortBy,
                sort_order: sorting.sortOrder,
            };

            const response = await institucionesService.getAll(params);

            // Normalizar respuesta
            let data = [];
            let paginationData = {};

            if (response.data.data) {
                data = response.data.data;
                paginationData = response.data;
            } else if (Array.isArray(response.data)) {
                data = response.data;
                paginationData = {
                    current_page: 1,
                    last_page: 1,
                    per_page: data.length,
                    total: data.length,
                };
            }

            pagination.currentPage = paginationData.current_page || 1;
            pagination.lastPage = paginationData.last_page || 1;
            pagination.perPage = paginationData.per_page || 20;
            pagination.total = paginationData.total || 0;

            instituciones.value = data;
            selectedIds.value = [];
        } catch (error) {
            console.error("Error cargando instituciones:", error);
            instituciones.value = [];
            pagination.total = 0;
        } finally {
            loading.value = false;
        }
    };

    const handlePageChange = (page) => {
        pagination.currentPage = page;
        loadInstituciones();
    };

    const handleSort = (column) => {
        if (sorting.sortBy === column) {
            sorting.sortOrder = sorting.sortOrder === "asc" ? "desc" : "asc";
        } else {
            sorting.sortBy = column;
            sorting.sortOrder = "asc";
        }
        pagination.currentPage = 1;
        loadInstituciones();
    };

    const isAllSelected = computed(() => {
        return instituciones.value.length > 0 && selectedIds.value.length === instituciones.value.length;
    });

    const toggleSelection = (id) => {
        const index = selectedIds.value.indexOf(id);
        if (index > -1) selectedIds.value.splice(index, 1);
        else selectedIds.value.push(id);
    };

    const toggleSelectAll = () => {
        if (isAllSelected.value) selectedIds.value = [];
        else selectedIds.value = instituciones.value.map((inst) => inst.id);
    };

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
            alert.toastSuccess(`${count} ${count === 1 ? "institución eliminada" : "instituciones eliminadas"}`);
        } catch (error) {
            console.error("Error eliminando instituciones:", error);
            alert.error("Error", error.response?.data?.message || "No se pudieron eliminar algunas instituciones");
        }
    };

    // Watch for search query changes with debounce
    watch(
        () => filterState.searchQuery,
        () => {
            if (searchDebounce) clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                pagination.currentPage = 1;
                loadInstituciones();
            }, 300);
        }
    );

    onUnmounted(() => {
        if (searchDebounce) clearTimeout(searchDebounce);
    });

    return {
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
        confirmBulkDelete
    };
}
