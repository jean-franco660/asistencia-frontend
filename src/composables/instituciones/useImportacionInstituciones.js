import { ref, onUnmounted } from 'vue';
import { useAlert } from '@/utils/sweetalert';
import { institucionesService } from '@/services/api';

export function useImportacionInstituciones(onImportCompleta) {
    const alert = useAlert();
    const estadisticasImportacion = ref(null);
    const isPollingStats = ref(false);
    const descargandoErrores = ref(false);
    let statsPollingInterval = null;

    // --- Acciones de Importación ---

    const handleImportInstituciones = (file) => institucionesService.importar(file);

    const handleStatusInstituciones = (importId) => institucionesService.estadoImportacion(importId);

    const handleDownloadTemplate = async () => {
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
        } catch (error) {
            console.error("Error descargando plantilla:", error);
            alert.error("Error", "No se pudo descargar la plantilla");
        }
    };

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

    // --- Polling y Estadísticas ---

    const loadEstadisticasImportacion = async () => {
        try {
            const { data } = await institucionesService.getEstadisticasImportacion();
            const nuevasEstadisticas = data.data || data;

            const estadoAnterior = estadisticasImportacion.value?.ultima_importacion?.estado;
            const estadoNuevo = nuevasEstadisticas?.ultima_importacion?.estado;

            if (estadoAnterior === "processing" && estadoNuevo === "completada") {
                const exitosos = nuevasEstadisticas.ultima_importacion?.exitosos || 0;
                const errores = nuevasEstadisticas.ultima_importacion?.errores_count || 0;

                alert.toastSuccess(
                    `Importación completada: ${exitosos} instituciones importadas${errores > 0 ? `, ${errores} con errores` : ""
                    }`
                );
                if (onImportCompleta) await onImportCompleta();
            }

            estadisticasImportacion.value = nuevasEstadisticas;

            const ultimaImportacion = estadisticasImportacion.value?.ultima_importacion;
            const estadoEnProgreso =
                ultimaImportacion?.estado === "processing" ||
                ultimaImportacion?.estado === "pendiente" ||
                ultimaImportacion?.estado === "en_proceso";

            if (estadoEnProgreso && !isPollingStats.value) startStatsPolling();
            else if (!estadoEnProgreso && isPollingStats.value) stopStatsPolling();
        } catch (err) {
            console.error("Error cargando estadísticas:", err);
        }
    };

    const startStatsPolling = () => {
        if (statsPollingInterval) return;
        isPollingStats.value = true;
        statsPollingInterval = setInterval(async () => {
            await loadEstadisticasImportacion();
        }, 3000);
    };

    const stopStatsPolling = () => {
        if (statsPollingInterval) {
            clearInterval(statsPollingInterval);
            statsPollingInterval = null;
        }
        isPollingStats.value = false;
    };

    onUnmounted(() => {
        stopStatsPolling();
    });

    return {
        estadisticasImportacion,
        isPollingStats,
        descargandoErrores,
        loadEstadisticasImportacion,
        startStatsPolling,
        stopStatsPolling,
        handleImportInstituciones,
        handleStatusInstituciones,
        handleDownloadTemplate,
        handleDownloadErroresInstituciones,
        descargarReporteErrores,
    };
}
