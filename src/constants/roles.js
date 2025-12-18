// Constantes de Roles del Sistema
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMINISTRADOR: 'administrador',
    SUPERVISOR: 'supervisor'
}

// Estados de usuarios web
export const ESTADOS_USUARIO = {
    PENDIENTE: 'pendiente',
    AUTORIZADO: 'autorizado',
    RECHAZADO: 'rechazado'
}

// Helper functions
export const isSuperAdmin = (user) => user?.rol === ROLES.SUPER_ADMIN
export const isAdmin = (user) => user?.rol === ROLES.ADMINISTRADOR
export const isSupervisor = (user) => user?.rol === ROLES.SUPERVISOR

// Labels de roles para UI
export const ROLE_LABELS = {
    [ROLES.SUPER_ADMIN]: 'Super Administrador',
    [ROLES.ADMINISTRADOR]: 'Administrador',
    [ROLES.SUPERVISOR]: 'Supervisor'
}

// Colores para badges de roles
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
