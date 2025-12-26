import { ref, reactive, computed, watch, onUnmounted } from 'vue';
import { useAlert } from '@/utils/sweetalert';
import { usuariosService } from '@/services/api';

export function useUsuariosList(filterState) {
    const alert = useAlert();

    const usuarios = ref([]);
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
        sortOrder: "asc", // Orden ascendente por defecto (1, 2, 3...)
    });

    let searchDebounce = null;

    const loadUsuarios = async () => {
        loading.value = true;
        try {
            const params = {
                page: pagination.currentPage,
                buscar: filterState.searchQuery || undefined,
                sort_by: sorting.sortBy,
                sort_order: sorting.sortOrder,
                estado:
                    filterState.status === "activo"
                        ? "ACTIVO"
                        : filterState.status === "inactivo"
                            ? "INACTIVO"
                            : filterState.status === "pendiente"
                                ? "PENDIENTE"
                                : undefined,
                institucion_id: filterState.institucionId || undefined,
                activo:
                    filterState.status === "activo"
                        ? true
                        : filterState.status === "inactivo"
                            ? false
                            : undefined,
            };

            const r = await usuariosService.getAll(params);

            let data = [];
            let paginationData = {};

            // Normalización de respuesta (mantiene la lógica robusta original)
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
                // ✅ FILTRO FRONTEND: Mostrar ACTIVO y PENDIENTE (Ocultar solo INACTIVO)
                instituciones: (docente.instituciones || []).filter(inst => ['ACTIVO', 'PENDIENTE'].includes(inst.pivot?.estado))
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

    const handleFilterChange = () => {
        pagination.currentPage = 1;
        loadUsuarios();
    };

    const handleSort = (column) => {
        if (sorting.sortBy === column) {
            sorting.sortOrder = sorting.sortOrder === "asc" ? "desc" : "asc";
        } else {
            sorting.sortBy = column;
            sorting.sortOrder = "asc";
        }
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
        } catch (error) {
            console.error("Error eliminando docentes:", error);
            alert.error("Error", error.response?.data?.message || "No se pudieron eliminar");
        }
    };

    // Watchers for implementation of search debounce
    watch(
        () => filterState.searchQuery,
        () => {
            if (searchDebounce) clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                pagination.currentPage = 1;
                loadUsuarios();
            }, 300);
        }
    );

    onUnmounted(() => {
        if (searchDebounce) clearTimeout(searchDebounce);
    });


    return {
        usuarios,
        loading,
        selectedIds,
        pagination,
        sorting,
        loadUsuarios,
        handlePageChange,
        handleFilterChange,
        handleSort,
        isAllSelected,
        toggleSelection,
        toggleSelectAll,
        confirmBulkDelete
    };
}