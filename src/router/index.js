import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false, layout: 'empty' }
  },

  {
    path: '/dashboard',
    name: 'DashboardAdmin',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true, roles: ['super_admin', 'administrador'] }
  },

  {
    path: '/supervisor/dashboard',
    name: 'DashboardSupervisor',
    component: () => import('@/views/dashboard/SupervisorDashboard.vue'),
    meta: { requiresAuth: true, roles: ['supervisor'] }
  },

  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('@/views/usuarios/UsuariosView.vue'),
    meta: { requiresAuth: true, roles: ['super_admin', 'administrador', 'supervisor'] }
  },

  {
    path: '/instituciones',
    name: 'Instituciones',
    component: () => import('@/views/instituciones/InstitucionesView.vue'),
    meta: { requiresAuth: true, roles: ['super_admin', 'administrador'] }
  },

  {
    path: '/horarios',
    name: 'HorariosInstitucion',
    component: () => import('@/views/horarios/HorariosView.vue'),
    meta: { requiresAuth: true, roles: ['super_admin', 'administrador', 'supervisor'] }
  },

  {
    path: '/feriados',
    name: 'feriados',
    component: () => import('@/views/feriados/Feriados.vue'),
    meta: { requiresAuth: true, roles: ['super_admin', 'administrador', 'supervisor'] }
  },

  {
    path: '/justificaciones',
    name: 'Justificaciones',
    component: () => import('@/views/justificaciones/JustificacionesView.vue'),
    meta: { requiresAuth: true, roles: ['super_admin', 'administrador', 'supervisor'] }
  },

  {
    path: '/supervisores',
    name: 'Supervisores',
    component: () => import('@/views/supervisores/SupervisoresListView.vue'),
    meta: { requiresAuth: true, roles: ['super_admin', 'administrador'] }
  },

  // ✅ CAMBIO: Solo super_admin puede acceder
  {
    path: '/administradores',
    name: 'Administradores',
    component: () => import('@/views/usuarios/AdministradoresView.vue'),
    meta: { requiresAuth: true, roles: ['super_admin'] }  // ✅ Solo super_admin
  },

  {
    path: '/asistencias',
    name: 'Asistencias',
    component: () => import('@/views/asistencias/AsistenciasView.vue'),
    meta: { requiresAuth: true, roles: ['super_admin', 'administrador', 'supervisor'] }
  },

  // ----- AUDITORÍA (Solo Super Admin) -----
  {
    path: '/audit-logs',
    name: 'AuditLogs',
    component: () => import('@/views/audit/AuditLogsView.vue'),
    meta: { requiresAuth: true, roles: ['super_admin'], requiresSuperAdmin: true }
  },

  // ----- ERRORES -----
  {
    path: '/acceso-denegado',
    name: 'AccesoDenegado',
    component: () => import('@/views/errors/AccesoDenegado.vue'),
    meta: { requiresAuth: true }
  },

  // Default
  { 
    path: '/:pathMatch(.*)*', 
    redirect: (to) => {
      const auth = useAuthStore()
      if (!auth.isAuthenticated) return '/login'
      if (auth.user?.rol === 'supervisor') return '/supervisor/dashboard'
      return '/dashboard'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ===== Guards de seguridad =====
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  console.log('🔒 [ROUTER] Navegación:', {
    desde: from.path,
    hacia: to.path,
    initialized: auth.initialized,
    isAuthenticated: auth.isAuthenticated
  })

  if (!auth.initialized) {
    console.log('⏳ [ROUTER] Cargando usuario...')
    await auth.loadUser()
    console.log('✅ [ROUTER] Usuario cargado:', {
      user: auth.user,
      rol: auth.user?.rol,
      isAuthenticated: auth.isAuthenticated
    })
  }

  const requiresAuth = to.meta.requiresAuth
  const allowedRoles = to.meta.roles || []

  console.log('🔍 [ROUTER] Verificando permisos:', {
    requiresAuth,
    allowedRoles,
    userRole: auth.user?.rol,
    userName: auth.user?.nombre
  })

  // No autenticado y requiere auth
  if (requiresAuth && !auth.isAuthenticated) {
    console.log('❌ [ROUTER] No autenticado, redirigiendo a /login')
    return next('/login')
  }

  // Si está logueado y va a login, redirige según rol
  if (to.path === '/login' && auth.isAuthenticated) {
    // Si viene de login mismo, no redirigir (prevenir loop)
    if (from.path === '/login') {
      return next(false)
    }

    // Redirigir según jerarquía de roles
    if (auth.user?.rol === 'super_admin') {
      return next('/dashboard')
    }
    if (auth.user?.rol === 'administrador') {
      return next('/dashboard')
    }
    if (auth.user?.rol === 'supervisor') {
      return next('/supervisor/dashboard')
    }
  }

  // Validación de rol
  const userRole = auth.user?.rol
  if (requiresAuth && allowedRoles.length && !allowedRoles.includes(userRole)) {
    console.log('🚫 [ROUTER] ACCESO DENEGADO:', {
      userRole,
      allowedRoles,
      ruta: to.path
    })
    return next('/acceso-denegado')
  }

  console.log('✅ [ROUTER] Acceso permitido a', to.path)
  next()
})

export default router