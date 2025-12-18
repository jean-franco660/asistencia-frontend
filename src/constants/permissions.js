import { ROLES } from './roles'

// Definición de permisos por funcionalidad
export const PERMISSIONS = {
    // Importación
    IMPORT_INSTITUCIONES: [ROLES.ADMINISTRADOR],
    IMPORT_DOCENTES: [ROLES.ADMINISTRADOR],

    // Vistas
    VIEW_INSTITUCIONES: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR],
    VIEW_DOCENTES: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR],
    VIEW_ASISTENCIAS: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR],
    VIEW_HORARIOS: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR],
    VIEW_FERIADOS: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR],
    VIEW_SUPERVISORES: [ROLES.ADMINISTRADOR],
    VIEW_ADMINISTRADORES: [ROLES.ADMINISTRADOR],

    // Edición
    EDIT_INSTITUCIONES: [ROLES.ADMINISTRADOR],
    EDIT_DOCENTES: [ROLES.ADMINISTRADOR],
    EDIT_SUPERVISORES: [ROLES.ADMINISTRADOR],
    EDIT_ADMINISTRADORES: [ROLES.ADMINISTRADOR],
    EDIT_HORARIOS: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR],
    EDIT_FERIADOS: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR],

    // Administración
    MANAGE_USUARIOS: [ROLES.ADMINISTRADOR],
    SYNC_FERIADOS: [ROLES.ADMINISTRADOR],
}

/**
 * Verifica si un usuario tiene permiso para realizar una acción
 * @param {Object} user - Usuario con propiedad 'rol'
 * @param {string} permission - Nombre del permiso (de PERMISSIONS)
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
    if (!user || !user.rol) return false
    const allowedRoles = PERMISSIONS[permission]
    return allowedRoles ? allowedRoles.includes(user.rol) : false
}

/**
 * Verifica si un usuario puede acceder a una ruta
 * @param {Object} user - Usuario con propiedad 'rol'
 * @param {Array} allowedRoles - Array de roles permitidos
 * @returns {boolean}
 */
export const canAccessRoute = (user, allowedRoles = []) => {
    if (!user || !user.rol) return false
    if (allowedRoles.length === 0) return true
    return allowedRoles.includes(user.rol)
}
