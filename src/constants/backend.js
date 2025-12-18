// ============================================
// CONSTANTES DEL BACKEND - Sistema de Asistencias
// ============================================
// Estas constantes deben coincidir EXACTAMENTE con los valores del backend

// =======================
// ROLES DE USUARIO WEB
// =======================
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMINISTRADOR: 'administrador',
    SUPERVISOR: 'supervisor'
}

// =======================
// ESTADOS DE USUARIO WEB
// =======================
export const ESTADOS_USUARIO = {
    PENDIENTE: 'pendiente',
    AUTORIZADO: 'autorizado',
    RECHAZADO: 'rechazado'
}

// =======================
// TIPOS DE ASISTENCIA
// =======================
export const TIPOS_ASISTENCIA = {
    ENTRADA: 'ENTRADA',
    SALIDA: 'SALIDA'
}

// =======================
// RESULTADOS DE ASISTENCIA
// =======================
export const RESULTADOS_ASISTENCIA = {
    A_TIEMPO: 'A_TIEMPO',
    TARDE: 'TARDE',
    SALIDA_ANTES: 'SALIDA_ANTES'
}

// =======================
// SITUACIONES DE ASISTENCIA
// =======================
export const SITUACIONES_ASISTENCIA = {
    NORMAL: 'NORMAL',
    FALTA: 'FALTA',
    JUSTIFICADO: 'JUSTIFICADO'
}

// =======================
// TURNOS DE HORARIO
// =======================
// IMPORTANTE: "MAÑANA" lleva tilde
export const TURNOS = {
    MANANA: 'MAÑANA',  // Con tilde
    TARDE: 'TARDE',
    NOCHE: 'NOCHE'
}

// =======================
// TIPOS DE FERIADO
// =======================
// IMPORTANTE: Estos valores van en minúscula
export const TIPOS_FERIADO = {
    NACIONAL: 'nacional',      // minúscula
    INSTITUCIONAL: 'institucional'  // minúscula
}

// =======================
// ESTADOS DE JUSTIFICACIÓN
// =======================
export const ESTADOS_JUSTIFICACION = {
    PENDIENTE: 'PENDIENTE',
    APROBADO: 'APROBADO',
    RECHAZADO: 'RECHAZADO'
}

// =======================
// TIPOS DE JUSTIFICACIÓN
// =======================
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

// =======================
// ESTADOS DE DOCENTE EN INSTITUCIÓN
// =======================
export const ESTADOS_DOCENTE = {
    ACTIVO: 'ACTIVO',
    INACTIVO: 'INACTIVO'
}

// =======================
// SEXO
// =======================
export const SEXO = {
    MASCULINO: 'M',
    FEMENINO: 'F'
}

// =======================
// FORMATOS DE EXPORTACIÓN
// =======================
export const FORMATOS_EXPORTACION = {
    DETALLE: 'detalle',
    RESUMEN: 'resumen',
    POR_DOCENTE: 'por_docente'
}

// =======================
// DÍAS LABORALES
// =======================
export const DIAS_LABORALES = [
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
    'domingo'
]

// =======================
// NIVELES EDUCATIVOS
// =======================
export const NIVELES_EDUCATIVOS = [
    'Inicial',
    'Primaria',
    'Secundaria'
]

// =======================
// LABELS PARA UI
// =======================
export const ROLE_LABELS = {
    [ROLES.SUPER_ADMIN]: 'Super Administrador',
    [ROLES.ADMINISTRADOR]: 'Administrador',
    [ROLES.SUPERVISOR]: 'Supervisor'
}

export const ESTADO_USUARIO_LABELS = {
    [ESTADOS_USUARIO.PENDIENTE]: 'Pendiente',
    [ESTADOS_USUARIO.AUTORIZADO]: 'Autorizado',
    [ESTADOS_USUARIO.RECHAZADO]: 'Rechazado'
}

export const TIPO_ASISTENCIA_LABELS = {
    [TIPOS_ASISTENCIA.ENTRADA]: 'Entrada',
    [TIPOS_ASISTENCIA.SALIDA]: 'Salida'
}

export const RESULTADO_ASISTENCIA_LABELS = {
    [RESULTADOS_ASISTENCIA.A_TIEMPO]: 'A Tiempo',
    [RESULTADOS_ASISTENCIA.TARDE]: 'Tarde',
    [RESULTADOS_ASISTENCIA.SALIDA_ANTES]: 'Salida Antes'
}

export const SITUACION_ASISTENCIA_LABELS = {
    [SITUACIONES_ASISTENCIA.NORMAL]: 'Normal',
    [SITUACIONES_ASISTENCIA.FALTA]: 'Falta',
    [SITUACIONES_ASISTENCIA.JUSTIFICADO]: 'Justificado'
}

export const TURNO_LABELS = {
    [TURNOS.MANANA]: 'Mañana',
    [TURNOS.TARDE]: 'Tarde',
    [TURNOS.NOCHE]: 'Noche'
}

export const TIPO_FERIADO_LABELS = {
    [TIPOS_FERIADO.NACIONAL]: 'Nacional',
    [TIPOS_FERIADO.INSTITUCIONAL]: 'Institucional'
}

export const ESTADO_JUSTIFICACION_LABELS = {
    [ESTADOS_JUSTIFICACION.PENDIENTE]: 'Pendiente',
    [ESTADOS_JUSTIFICACION.APROBADO]: 'Aprobado',
    [ESTADOS_JUSTIFICACION.RECHAZADO]: 'Rechazado'
}

export const TIPO_JUSTIFICACION_LABELS = {
    [TIPOS_JUSTIFICACION.ENFERMEDAD]: 'Enfermedad',
    [TIPOS_JUSTIFICACION.PERMISO_PERSONAL]: 'Permiso Personal',
    [TIPOS_JUSTIFICACION.LICENCIA]: 'Licencia',
    [TIPOS_JUSTIFICACION.COMISION_SERVICIO]: 'Comisión de Servicio',
    [TIPOS_JUSTIFICACION.CAPACITACION]: 'Capacitación',
    [TIPOS_JUSTIFICACION.DUELO]: 'Duelo',
    [TIPOS_JUSTIFICACION.MATERNIDAD]: 'Maternidad',
    [TIPOS_JUSTIFICACION.PATERNIDAD]: 'Paternidad',
    [TIPOS_JUSTIFICACION.OLVIDO_MARCACION]: 'Olvido de Marcación',
    [TIPOS_JUSTIFICACION.OTRO]: 'Otro'
}

export const SEXO_LABELS = {
    [SEXO.MASCULINO]: 'Masculino',
    [SEXO.FEMENINO]: 'Femenino'
}

// =======================
// COLORES PARA BADGES
// =======================
export const ROLE_COLORS = {
    [ROLES.SUPER_ADMIN]: {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-800 dark:text-purple-200',
        gradient: 'from-purple-500 to-purple-600'
    },
    [ROLES.ADMINISTRADOR]: {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-200',
        gradient: 'from-red-500 to-red-600'
    },
    [ROLES.SUPERVISOR]: {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-800 dark:text-blue-200',
        gradient: 'from-blue-500 to-blue-600'
    }
}

export const ESTADO_USUARIO_COLORS = {
    [ESTADOS_USUARIO.PENDIENTE]: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-300'
    },
    [ESTADOS_USUARIO.AUTORIZADO]: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-300'
    },
    [ESTADOS_USUARIO.RECHAZADO]: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300'
    }
}

export const RESULTADO_ASISTENCIA_COLORS = {
    [RESULTADOS_ASISTENCIA.A_TIEMPO]: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-300'
    },
    [RESULTADOS_ASISTENCIA.TARDE]: {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-800 dark:text-orange-300'
    },
    [RESULTADOS_ASISTENCIA.SALIDA_ANTES]: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-300'
    }
}

export const SITUACION_ASISTENCIA_COLORS = {
    [SITUACIONES_ASISTENCIA.NORMAL]: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-800 dark:text-blue-300'
    },
    [SITUACIONES_ASISTENCIA.FALTA]: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300'
    },
    [SITUACIONES_ASISTENCIA.JUSTIFICADO]: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-800 dark:text-purple-300'
    }
}

export const ESTADO_JUSTIFICACION_COLORS = {
    [ESTADOS_JUSTIFICACION.PENDIENTE]: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: '⏳'
    },
    [ESTADOS_JUSTIFICACION.APROBADO]: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-300',
        icon: '✅'
    },
    [ESTADOS_JUSTIFICACION.RECHAZADO]: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300',
        icon: '❌'
    }
}

// =======================
// HELPER FUNCTIONS
// =======================
export const getRoleLabel = (rol) => ROLE_LABELS[rol] || rol
export const getEstadoUsuarioLabel = (estado) => ESTADO_USUARIO_LABELS[estado] || estado
export const getTipoAsistenciaLabel = (tipo) => TIPO_ASISTENCIA_LABELS[tipo] || tipo
export const getResultadoAsistenciaLabel = (resultado) => RESULTADO_ASISTENCIA_LABELS[resultado] || resultado
export const getSituacionAsistenciaLabel = (situacion) => SITUACION_ASISTENCIA_LABELS[situacion] || situacion
export const getTurnoLabel = (turno) => TURNO_LABELS[turno] || turno
export const getTipoFeriadoLabel = (tipo) => TIPO_FERIADO_LABELS[tipo] || tipo
export const getEstadoJustificacionLabel = (estado) => ESTADO_JUSTIFICACION_LABELS[estado] || estado
export const getTipoJustificacionLabel = (tipo) => TIPO_JUSTIFICACION_LABELS[tipo] || tipo
export const getSexoLabel = (sexo) => SEXO_LABELS[sexo] || sexo

export const getRoleColor = (rol) => ROLE_COLORS[rol] || ROLE_COLORS[ROLES.SUPERVISOR]
export const getEstadoUsuarioColor = (estado) => ESTADO_USUARIO_COLORS[estado] || ESTADO_USUARIO_COLORS[ESTADOS_USUARIO.PENDIENTE]
export const getResultadoAsistenciaColor = (resultado) => RESULTADO_ASISTENCIA_COLORS[resultado] || RESULTADO_ASISTENCIA_COLORS[RESULTADOS_ASISTENCIA.A_TIEMPO]
export const getSituacionAsistenciaColor = (situacion) => SITUACION_ASISTENCIA_COLORS[situacion] || SITUACION_ASISTENCIA_COLORS[SITUACIONES_ASISTENCIA.NORMAL]
export const getEstadoJustificacionColor = (estado) => ESTADO_JUSTIFICACION_COLORS[estado] || ESTADO_JUSTIFICACION_COLORS[ESTADOS_JUSTIFICACION.PENDIENTE]

// =======================
// OPCIONES PARA SELECTS
// =======================
export const ROLE_OPTIONS = Object.values(ROLES).map(rol => ({
    value: rol,
    label: ROLE_LABELS[rol]
}))

export const TURNO_OPTIONS = Object.values(TURNOS).map(turno => ({
    value: turno,
    label: TURNO_LABELS[turno]
}))

export const TIPO_FERIADO_OPTIONS = Object.values(TIPOS_FERIADO).map(tipo => ({
    value: tipo,
    label: TIPO_FERIADO_LABELS[tipo]
}))

export const TIPO_JUSTIFICACION_OPTIONS = Object.values(TIPOS_JUSTIFICACION).map(tipo => ({
    value: tipo,
    label: TIPO_JUSTIFICACION_LABELS[tipo]
}))

export const ESTADO_JUSTIFICACION_OPTIONS = Object.values(ESTADOS_JUSTIFICACION).map(estado => ({
    value: estado,
    label: ESTADO_JUSTIFICACION_LABELS[estado]
}))

export const SEXO_OPTIONS = Object.values(SEXO).map(sexo => ({
    value: sexo,
    label: SEXO_LABELS[sexo]
}))

export const NIVEL_EDUCATIVO_OPTIONS = NIVELES_EDUCATIVOS.map(nivel => ({
    value: nivel,
    label: nivel
}))

export const DIA_LABORAL_OPTIONS = DIAS_LABORALES.map(dia => ({
    value: dia,
    label: dia.charAt(0).toUpperCase() + dia.slice(1)
}))
