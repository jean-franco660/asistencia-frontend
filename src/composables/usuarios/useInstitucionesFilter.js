import { ref, onUnmounted } from 'vue';
import { institucionesService } from '@/services/api';

export function useInstitucionesFilter(onFilterChange) {
    const institucionSearchQuery = ref("");
    const filteredInstituciones = ref([]);
    const loadingInstitucionesFiltro = ref(false);
    const showInstitucionDropdown = ref(false);
    const filterInstitucion = ref("");
    const selectedFilterInstitucionNombre = ref(null);
    const selectedFilterInstitucionCodigo = ref(null);

    let filtroDebounce = null;
    let filtroAbort = null;

    const onFocusInstitucionFiltro = () => {
        showInstitucionDropdown.value = true;
        if ((institucionSearchQuery.value || "").trim()) {
            buscarInstitucionFiltro();
        }
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
                console.log(`🔍 [FILTRO] Buscando instituciones con: "${term}"`);

                let r;
                let instituciones = [];

                // Intento 1: Usar endpoint /mias
                try {
                    r = await institucionesService.searchMias(term, 10, {
                        signal: filtroAbort.signal,
                    });
                } catch (e) {
                    // Si el endpoint /mias no existe (404), intentar alternativa
                    if (e.response?.status === 404) {
                        console.warn(
                            "⚠️ [FILTRO] Endpoint /mias no disponible, probando alternativa..."
                        );

                        // Intento 2: Usar endpoint genérico
                        try {
                            r = await institucionesService.getAll({
                                buscar: term,
                                limit: 10,
                            });
                        } catch (e2) {
                            // Intento 3: Usar endpoint /buscar
                            try {
                                r = await institucionesService.search(term, 10);
                            } catch (e3) {
                                throw e; // Si todo falla, lanzar el error original
                            }
                        }
                    } else {
                        throw e;
                    }
                }

                // Extraer instituciones de diferentes estructuras posibles
                if (r.data) {
                    if (Array.isArray(r.data)) {
                        instituciones = r.data;
                    } else if (r.data.data && Array.isArray(r.data.data)) {
                        instituciones = r.data.data;
                    } else if (r.data.instituciones && Array.isArray(r.data.instituciones)) {
                        instituciones = r.data.instituciones;
                    } else if (r.data.success && r.data.data) {
                        if (Array.isArray(r.data.data)) {
                            instituciones = r.data.data;
                        } else if (r.data.data.data && Array.isArray(r.data.data.data)) {
                            instituciones = r.data.data.data;
                        }
                    } else if (
                        r.data.data &&
                        typeof r.data.data === "object" &&
                        Array.isArray(r.data.data.data)
                    ) {
                        instituciones = r.data.data.data;
                    }
                }

                filteredInstituciones.value = instituciones;
            } catch (e) {
                if (e?.name !== "AbortError" && e?.code !== "ERR_CANCELED") {
                    console.error("❌ [FILTRO] Error buscando instituciones:", e);
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

        if (onFilterChange) onFilterChange();
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

        if (onFilterChange) onFilterChange();
    };

    const handleClickOutsideValues = (event) => {
        const insideFilterSearch = event.target.closest(".inst-search-filter");
        const insideFilterDropdown = event.target.closest(".inst-dropdown-filter");
        if (!insideFilterSearch && !insideFilterDropdown) {
            showInstitucionDropdown.value = false;
        }
    };


    onUnmounted(() => {
        if (filtroDebounce) clearTimeout(filtroDebounce);
        if (filtroAbort) filtroAbort.abort();
    });

    return {
        institucionSearchQuery,
        filteredInstituciones,
        loadingInstitucionesFiltro,
        showInstitucionDropdown,
        filterInstitucion,
        selectedFilterInstitucionNombre,
        selectedFilterInstitucionCodigo,
        onFocusInstitucionFiltro,
        buscarInstitucionFiltro,
        seleccionarInstitucionFiltro,
        limpiarFiltroInstitucion,
        handleClickOutsideValues
    };
}
