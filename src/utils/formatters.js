/**
 * Utilidades de formateo para fechas, tiempos y archivos
 * Configurado para zona horaria de Lima (America/Lima) y locale es-PE
 */

/**
 * Formatea una fecha en español (Perú)
 * @param {string|Date} date - Fecha a formatear
 * @param {object} options - Opciones adicionales de formato
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, options = {}) => {
    if (!date) return ''

    try {
        return new Date(date).toLocaleDateString('es-PE', {
            timeZone: 'America/Lima',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        })
    } catch (error) {
        console.error('Error formateando fecha:', error)
        return ''
    }
}

/**
 * Formatea una fecha y hora en español (Perú)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (date) => {
    if (!date) return ''

    try {
        return new Date(date).toLocaleString('es-PE', {
            timeZone: 'America/Lima',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    } catch (error) {
        console.error('Error formateando fecha/hora:', error)
        return ''
    }
}

/**
 * Formatea solo la hora desde un string de tiempo o fecha
 * @param {string} time - Tiempo en formato HH:MM:SS o fecha completa
 * @returns {string} Hora formateada HH:MM
 */
export const formatTime = (time) => {
    if (!time) return ''

    try {
        // Si es solo tiempo (HH:MM:SS), extraer HH:MM
        if (time.length <= 8 && time.includes(':')) {
            return time.substring(0, 5)
        }

        // Si es una fecha completa, extraer la hora
        const date = new Date(time)
        return date.toLocaleTimeString('es-PE', {
            timeZone: 'America/Lima',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    } catch (error) {
        console.error('Error formateando hora:', error)
        return ''
    }
}

/**
 * Convierte un archivo a Base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} Promesa con el string Base64
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No se proporcionó archivo'))
            return
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

/**
 * Formatea un tamaño de archivo en bytes a formato legible
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} Tamaño formateado (ej: "1.5 MB")
 */
export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Formatea una fecha en formato corto (DD/MM/YYYY)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDateShort = (date) => {
    if (!date) return ''

    try {
        return new Date(date).toLocaleDateString('es-PE', {
            timeZone: 'America/Lima',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    } catch (error) {
        console.error('Error formateando fecha corta:', error)
        return ''
    }
}

/**
 * Formatea una fecha relativa (hace X días, hace X horas, etc.)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha relativa
 */
export const formatRelativeTime = (date) => {
    if (!date) return ''

    try {
        const now = new Date()
        const past = new Date(date)
        const diffMs = now - past
        const diffSecs = Math.floor(diffMs / 1000)
        const diffMins = Math.floor(diffSecs / 60)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffSecs < 60) return 'Hace un momento'
        if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
        if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`

        return formatDateShort(date)
    } catch (error) {
        console.error('Error formateando fecha relativa:', error)
        return ''
    }
}
