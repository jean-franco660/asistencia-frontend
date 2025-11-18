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
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  {
    path: '/director/dashboard',
    name: 'DashboardDirector',
    component: () => import('@/views/dashboard/DirectorDashboard.vue'),
    meta: { requiresAuth: true, roles: ['director'] }
  },

  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('@/views/usuarios/UsuariosView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'director'] }
  },

  {
    path: '/instituciones',
    name: 'Instituciones',
    component: () => import('@/views/instituciones/InstitucionesView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  {
    path: '/horarios',
    name: 'HorariosInstitucion',
    component: () => import('@/views/horarios/HorariosView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'director'] }
  },

  {
    path: '/feriados',
    name: 'feriados',
    component: () => import('@/views/feriados/Feriados.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'director'] }
  },

  {
    path: '/directores',
    name: 'Directores',
    component: () => import('@/views/directores/DirectoresListView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  {
    path: '/administradores',
    name: 'Administradores',
    component: () => import('@/views/usuarios/AdministradoresView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  {
    path: '/asistencias',
    name: 'Asistencias',
    component: () => import('@/views/asistencias/AsistenciasView.vue'),
    meta: { requiresAuth: true, roles: ['director' , 'admin'] }
  },

  // ----- ERRORES -----
  {
    path: '/acceso-denegado',
    name: 'AccesoDenegado',
    component: () => import('@/views/errors/AccesoDenegado.vue'),
    meta: { requiresAuth: true }
  },

  // Default
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ===== Guards de seguridad =====
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (!auth.initialized) await auth.loadUser()

  const requiresAuth = to.meta.requiresAuth
  const allowedRoles = to.meta.roles || []

  // No autenticado
  if (requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  // Si está logueado y va a login, redirige según rol
  if (to.name === 'Login' && auth.isAuthenticated) {
    if (auth.user?.rol === 'admin') return next('/dashboard')
    if (auth.user?.rol === 'director') return next('/director/dashboard')
  }

  // Validación de rol
  const userRole = auth.user?.rol
  if (requiresAuth && allowedRoles.length && !allowedRoles.includes(userRole)) {
    return next('/acceso-denegado')
  }

  next()
})


export default router
