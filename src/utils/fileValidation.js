/**
 * Validación de archivos para importación
 */

// Tipos MIME permitidos
const ALLOWED_MIME_TYPES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel' // .xls
];

// Extensiones permitidas (solo Excel)
const ALLOWED_EXTENSIONS = ['.xlsx', '.xls'];

// Tamaño máximo en bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * Valida un archivo para importación
 * @param {File} file - Archivo a validar
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateImportFile = (file) => {
    const errors = []

    if (!file) {
        errors.push('No se ha seleccionado ningún archivo')
        return { isValid: false, errors }
    }

    // Validar tipo MIME
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        // Fallback: validar por extensión si el MIME type no es reconocido
        const extension = '.' + file.name.split('.').pop().toLowerCase()
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            errors.push('Formato de archivo no válido. Use Excel (.xlsx, .xls)')
        }
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
        errors.push(`El archivo es demasiado grande. Máximo permitido: ${formatFileSize(MAX_FILE_SIZE)}`)
    }

    // Validar que tiene extensión
    if (!file.name.includes('.')) {
        errors.push('El archivo debe tener una extensión válida')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Formatea el tamaño de archivo a formato legible
 * @param {number} bytes - Tamaño en bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Verifica si un archivo es Excel o CSV
 * @param {File} file 
 * @returns {boolean}
 */
export const isExcelOrCSV = (file) => {
    if (!file) return false

    const extension = '.' + file.name.split('.').pop().toLowerCase()
    return ALLOWED_EXTENSIONS.includes(extension) || ALLOWED_MIME_TYPES.includes(file.type)
}

/**
 * Obtiene información del archivo
 * @param {File} file 
 * @returns {Object}
 */
export const getFileInfo = (file) => {
    if (!file) return null

    return {
        name: file.name,
        size: file.size,
        type: file.type,
        extension: '.' + file.name.split('.').pop().toLowerCase(),
        sizeFormatted: formatFileSize(file.size),
        lastModified: new Date(file.lastModified)
    }
}
