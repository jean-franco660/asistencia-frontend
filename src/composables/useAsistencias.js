import { ref } from 'vue'
import api from '@/services/api'

/**
 * Composable para manejo de asistencias
 * @returns {object} Estado y métodos para asistencias
 */
export function useAsistencias() {
    const asistencias = ref([])
    const loading = ref(false)
    const error = ref(null)

    /**
     * Obtiene lista de asistencias con filtros
     * @param {object} filters - Filtros de búsqueda
     * @returns {Promise<object>} Datos paginados de asistencias
     */
    const fetchAsistencias = async (filters = {}) => {
        loading.value = true
        error.value = null

        try {
            const { data } = await api.get('/asistencias', { params: filters })
            asistencias.value = data.data || []
            return data
        } catch (err) {
            error.value = err.response?.data?.message || 'Error al cargar asistencias'
            console.error('Error fetchAsistencias:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Exporta asistencias a Excel
     * @param {object} filters - Filtros para exportación
     * @returns {Promise<void>}
     */
    const exportarAsistencias = async (filters = {}) => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get('/asistencias/exportar', {
                params: filters,
                responseType: 'blob',
                headers: {
                    Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            })

            // Crear URL del blob y descargar
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url

            // Generar nombre de archivo con fecha
            const fecha = new Date().toISOString().split('T')[0]
            link.setAttribute('download', `asistencias_${fecha}.xlsx`)

            document.body.appendChild(link)
            link.click()
            link.remove()

            // Limpiar URL del blob
            window.URL.revokeObjectURL(url)
        } catch (err) {
            error.value = 'Error al exportar asistencias'
            console.error('Error exportarAsistencias:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Obtiene la URL de la foto de una asistencia
     * Maneja tanto URLs de S3 (temporales) como storage local
     * @param {number} id - ID de la asistencia
     * @returns {Promise<string>} URL de la foto
     */
    const getFoto = async (id) => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get(`/asistencia/foto/${id}`)

            // Si la respuesta es JSON, contiene una URL temporal de S3
            if (response.headers['content-type']?.includes('application/json')) {
                return response.data.url
            }

            // Si es una imagen directa (storage local), crear blob URL
            const blob = new Blob([response.data], { type: 'image/jpeg' })
            return window.URL.createObjectURL(blob)
        } catch (err) {
            error.value = 'Error al cargar foto'
            console.error('Error getFoto:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Obtiene datos para gráfico mensual
     * @param {object} params - Parámetros (mes, año)
     * @returns {Promise<object>} Datos del gráfico
     */
    const getMesGrafico = async (params = {}) => {
        loading.value = true
        error.value = null

        try {
            const { data } = await api.get('/asistencias/mes-grafico', { params })
            return data
        } catch (err) {
            error.value = 'Error al cargar gráfico mensual'
            console.error('Error getMesGrafico:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Obtiene resumen semanal de asistencias
     * @returns {Promise<object>} Datos del resumen semanal
     */
    const getResumenSemanal = async () => {
        loading.value = true
        error.value = null

        try {
            const { data } = await api.get('/asistencias/semana')
            return data
        } catch (err) {
            error.value = 'Error al cargar resumen semanal'
            console.error('Error getResumenSemanal:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        // Estado
        asistencias,
        loading,
        error,

        // Métodos
        fetchAsistencias,
        exportarAsistencias,
        getFoto,
        getMesGrafico,
        getResumenSemanal
    }
}
