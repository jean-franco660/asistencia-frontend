// Tipos de Justificación
export const TIPOS_JUSTIFICACION = {
    ENFERMEDAD: 'ENFERMEDAD',
    PERMISO_PERSONAL: 'PERMISO_PERSONAL',
    LICENCIA: 'LICENCIA',
    COMISION_SERVICIO: 'COMISION_SERVICIO',
    CAPACITACION: 'CAPACITACION',
    DUELO: 'DUELO',
    MATERNIDAD: 'MATERNIDAD',
    PATERNIDAD: 'PATERNIDAD',
    OLVIDO_MARCACION: 'OLVIDO_MARCACION',
    OTRO: 'OTRO'
}

// Labels con iconos para UI
export const LABELS_TIPOS = {
    ENFERMEDAD: '🏥 Enfermedad',
    PERMISO_PERSONAL: '🙋 Permiso Personal',
    LICENCIA: '📋 Licencia',
    COMISION_SERVICIO: '💼 Comisión de Servicio',
    CAPACITACION: '📚 Capacitación',
    DUELO: '🕊️ Duelo',
    MATERNIDAD: '👶 Maternidad',
    PATERNIDAD: '👨‍👶 Paternidad',
    OLVIDO_MARCACION: '🔔 Olvido de Marcación',
    OTRO: '📌 Otro'
}

// Estados de Justificación
export const ESTADOS_JUSTIFICACION = {
    PENDIENTE: 'PENDIENTE',
    APROBADO: 'APROBADO',
    RECHAZADO: 'RECHAZADO'
}

// Configuración de colores para badges
export const ESTADO_COLORS = {
    PENDIENTE: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: '⏳'
    },
    APROBADO: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-300',
        icon: '✅'
    },
    RECHAZADO: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300',
        icon: '❌'
    }
}

// Helper para obtener el label de un tipo
export const getTipoLabel = (tipo) => {
    return LABELS_TIPOS[tipo] || tipo
}

// Helper para obtener config de color de estado
export const getEstadoConfig = (estado) => {
    return ESTADO_COLORS[estado] || ESTADO_COLORS.PENDIENTE
}

// Array de opciones para select
export const TIPOS_OPTIONS = Object.keys(TIPOS_JUSTIFICACION).map(key => ({
    value: key,
    label: LABELS_TIPOS[key]
}))
