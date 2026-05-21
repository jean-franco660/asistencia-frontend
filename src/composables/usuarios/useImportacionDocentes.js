import { ref, onUnmounted } from 'vue';
import { useAlert } from '@/utils/sweetalert';
import { usuariosService } from '@/services/api';
import { useAuthStore } from '@/store/auth';

export function useImportacionDocentes(onImportCompleta) {
    const alert = useAlert();
    const authStore = useAuthStore();
    const estadisticasImportacion = ref(null);
    const isPollingStats = ref(false);
    const descargandoErrores = ref(false);

    const handleImportDocentes = (file) => usuariosService.importar(file);

    const handleStatusDocentes = (importId) => usuariosService.estadoImportacion(importId);

    const handleDownloadTemplate = async () => {
        try {
            const response = await usuariosService.descargarTemplate();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "plantilla_docentes.xlsx");
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

    const handleDownloadErroresDocentes = async (importId) => {
        try {
            const response = await usuariosService.descargarErroresXlsx(importId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `errores_docentes_${importId}.xlsx`);
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
            const response = await usuariosService.descargarErroresXlsx(importId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `errores_docentes_${importId}.xlsx`);
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
        // ✅ No cargar stats para supervisores (no tienen permisos de importación)
        if (authStore.user?.rol === 'supervisor') {
            estadisticasImportacion.value = null;
            return;
        }

        try {
            const { data } = await usuariosService.getEstadisticasImportacion();
            const nuevasEstadisticas = data.data || data;

            const estadoAnterior = estadisticasImportacion.value?.ultima_importacion?.estado;
            const estadoNuevo = nuevasEstadisticas?.ultima_importacion?.estado;

            if (estadoAnterior === "processing" && estadoNuevo === "completada") {
                const exitosos = nuevasEstadisticas.ultima_importacion?.exitosos || 0;
                const errores = nuevasEstadisticas.ultima_importacion?.errores_count || 0;

                alert.toastSuccess(
                    `Importación completada: ${exitosos} docentes importados${errores > 0 ? `, ${errores} con errores` : ""
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
        if (isPollingStats.value) return;
        isPollingStats.value = true;

        const userId = authStore.user?.id;
        if (!userId || !window.Echo) return;

        window.Echo.private(`importacion.${userId}`)
            .listen('.progreso', async (data) => {
                await loadEstadisticasImportacion();
            });
    };

    const stopStatsPolling = () => {
        const userId = authStore.user?.id;
        if (userId && window.Echo) {
            window.Echo.leave(`importacion.${userId}`);
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
        handleImportDocentes,
        handleStatusDocentes,
        handleDownloadTemplate,
        handleDownloadErroresDocentes,
        descargarReporteErrores,
    };
}
