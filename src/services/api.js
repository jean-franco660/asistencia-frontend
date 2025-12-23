// src/services/api.js
import axios from 'axios'
import { useAlert } from '@/utils/sweetalert'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not defined')
}

/**
 * VITE_API_BASE_URL debe apuntar a:
 *   http(s)://<host>/api/v1/web
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Request interceptor: Bearer token + FormData handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  },
  (error) => Promise.reject(error)
)

// =======================
// Auth
// =======================
export const authService = {
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
}

// =======================
// Usuarios Web
// =======================
export const usuariosWebService = {
  getAll: (params) => api.get('/usuarios-web', { params }),
  getPendientes: () => api.get('/usuarios-web/pendientes'),
  create: (data) => api.post('/usuarios-web', data),

  update: (id, data) =>
    api.put(`/usuarios-web/${id}`, {
      ...data,
      rol: data.rol || 'supervisor',
    }),

  delete: (id) => api.delete(`/usuarios-web/${id}`),
  autorizar: (id) => api.post(`/usuarios-web/autorizar/${id}`),
  rechazar: (id) => api.post(`/usuarios-web/rechazar/${id}`),
}

export const provisioningService = {
  search: (query) => api.get('/supervisores/provisioning/search', { params: { search: query } }),
  getUsuarioApp: (id) => api.get(`/supervisores/provisioning/usuario-app/${id}`),
  provision: (data) => api.post('/supervisores/provisioning', data),
}

// =======================
// Usuarios App (Docentes)
// =======================
export const usuariosService = {
  getAll: (params) => api.get('/usuarios-app', { params }),
  getById: (id) => api.get(`/usuarios-app/${id}`),
  create: (data) => api.post('/usuarios-app', data),
  update: (id, data) => api.put(`/usuarios-app/${id}`, data),

  // ⭐ DELETE individual - Usa DELETE directo
  delete: (id) => api.delete(`/usuarios-app/${id}`),

  // ⭐ DELETE múltiple - Usa DELETE con data (NO POST)
  deleteMultiple: (ids) => api.delete('/usuarios-app/delete-multiple', { data: { ids } }),

  importar: (file) => {
    const formData = new FormData()
    formData.append('archivo', file)
    return api.post('/usuarios-app/importar', formData)
  },

  estadoImportacion: (importId) =>
    api.get(`/usuarios-app/importacion/${importId}`),

  descargarErroresXlsx: (importId) =>
    api.get(`/usuarios-app/importacion/${importId}/errores.xlsx`, {
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }),

  descargarTemplate: () =>
    api.get('/usuarios-app/template', {
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }),

  getEstadisticasImportacion: () =>
    api.get('/usuarios-app/import/stats'),

  // Inactivar asignación
  inactivarAsignacion: (asignacionId, data) =>
    api.post(`/usuario-app-institucion/${asignacionId}/inactivar`, data),
}

// =======================
// Instituciones
// =======================
// SOLUCIÓN PARA EL PROBLEMA DE DELETE
// Copia esta parte en tu archivo src/services/api.js

export const institucionesService = {
  // CRUD/listado general
  getAll: (params, config = {}) => api.get('/instituciones', { params, ...config }),

  // Get single institution by ID
  getById: (id) => api.get(`/instituciones/${id}`),

  // ✅ ÚNICO endpoint recomendado para dropdowns:
  // super_admin/admin => todas, supervisor => solo propias
  getMias: (params = {}, config = {}) =>
    api.get('/instituciones/mias', { params, ...config }),

  // ✅ Autocomplete basado en /mias
  searchMias: (term, limit = 10, config = {}) =>
    api.get('/instituciones/mias', { params: { search: term, limit }, ...config }),

  create: (data) => {
    if (data instanceof FormData) return api.post('/instituciones', data)
    return api.post('/instituciones', data)
  },

  update: (id, data) => {
    if (data instanceof FormData) {
      if (!data.has('_method')) data.append('_method', 'PUT')
      return api.post(`/instituciones/${id}`, data)
    }
    return api.put(`/instituciones/${id}`, data)
  },

  delete: (id) => api.delete(`/instituciones/${id}`),

  deleteMultiple: (ids) =>
    api.delete('/instituciones/delete-multiple', { data: { ids } }),

  importar: (file) => {
    const formData = new FormData()
    formData.append('archivo', file)
    return api.post('/instituciones/importar', formData)
  },

  getLogo: (filename) => api.get(`/logos/${filename}`, { responseType: 'blob' }),

  estadoImportacion: (importId) =>
    api.get(`/instituciones/importacion/${importId}`),

  descargarErroresXlsx: (importId) =>
    api.get(`/instituciones/importacion/${importId}/errores.xlsx`, {
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }),

  descargarTemplate: () =>
    api.get('/instituciones/template', {
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }),

  getEstadisticasImportacion: () => api.get('/instituciones/import/stats'),
}


// =======================
// Importación (wrapper opcional)
// =======================
// Si tus vistas ya usan importService, aquí lo alineamos al backend real.
export const importService = {
  importInstituciones: (file) => institucionesService.importar(file),
  downloadInstitucionesTemplate: () => institucionesService.descargarTemplate(),
  estadoInstituciones: (importId) => institucionesService.estadoImportacion(importId),
  downloadInstitucionesErrores: (importId) => institucionesService.descargarErroresXlsx(importId),

  importDocentes: (file) => usuariosService.importar(file),
  downloadDocentesTemplate: () => usuariosService.descargarTemplate(),
  estadoDocentes: (importId) => usuariosService.estadoImportacion(importId),
  downloadDocentesErrores: (importId) => usuariosService.descargarErroresXlsx(importId),
}

// =======================
// Asistencias
// =======================
export const asistenciasService = {
  getAll: (params) => api.get('/asistencias', { params }),
  getCabeceras: (params) => api.get('/asistencias/cabeceras', { params }), // ⭐ NUEVO - Fase 5
  getById: (id) => api.get(`/asistencias/${id}`), // Para cabeceras diarias
  getMarcacionById: (id) => api.get(`/asistencias/marcaciones/${id}`), // ⭐ NUEVO - Para marcaciones individuales
  getFoto: (id) => api.get(`/asistencia/foto/${id}`, { responseType: 'blob' }),
  resumenSemanal: () => api.get('/asistencias/semana'),
  exportar: (params) =>
    api.get('/asistencias/exportar', {
      params,
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }),
  exportarInstitucion: (id, params) =>
    api.get(`/asistencias/exportar-institucion/${id}`, {
      params,
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }),
  updateReview: (id, data) => api.put(`/asistencias/marcaciones/${id}/review`, data), // ⭐ NUEVO - Fase 6
}

// =======================
// Horarios
// =======================
export const horariosService = {
  getAll: (params) => api.get('/horarios', { params }),
  create: (data) => api.post('/horarios', data),
  update: (id, data) => api.put(`/horarios/${id}`, data),
  delete: (id) => api.delete(`/horarios/${id}`),
}

// =======================
// Feriados
// =======================
export const feriadosService = {
  getAll: (params) => api.get('/feriados', { params }),
  create: (data) => api.post('/feriados', data),
  update: (id, data) => api.put(`/feriados/${id}`, data),
  delete: (id) => api.delete(`/feriados/${id}`),
  actualizarAuto: () => api.post('/feriados/actualizar-automatico'),
}

// =======================
// Justificaciones
// =======================
export const justificacionesService = {
  getAll: (params) => api.get('/justificaciones', { params }),
  getById: (id) => api.get(`/justificaciones/${id}`),
  create: (data) => api.post('/justificaciones', data),
  aprobar: (id, data = {}) => api.post(`/justificaciones/${id}/aprobar`, data),
  rechazar: (id, data) => api.post(`/justificaciones/${id}/rechazar`, data),
  delete: (id) => api.delete(`/justificaciones/${id}`),
  // Nota: El endpoint para ver documento no existe en el backend actual
  // Se omite temporalmente hasta que se agregue al backend
}

// =======================
// Estadísticas
// =======================
export const statsService = {
  getGeneral: (params) => api.get('/stats', { params }),  // Acepta institucion_id opcional
  getSupervisorDashboard: () => api.get('/supervisor/dashboard'),
  getSemana: () => api.get('/asistencias/semana'),
  getMesGrafico: (params) => api.get('/asistencias/mes-grafico', { params }),
}

// =======================
// Auditoría
// =======================
export const auditLogsService = {
  getAll: (params) => api.get('/audit-logs', { params }),
  getById: (id) => api.get(`/audit-logs/${id}`),
  getStats: (params) => api.get('/audit-logs/stats', { params }),
}

// =======================
// Global response error handling
// =======================
const alert = useAlert()

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const isLoginPage = window.location.pathname.includes('/login')

    if (status === 401) {
      if (!isLoginPage) {
        alert.error('Sesión expirada', 'Por favor inicia sesión nuevamente')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    } else if (status === 403) {
      alert.error('Acceso denegado', 'No tienes permisos para realizar esta acción')
    } else if (status === 422) {
      console.warn('Errores de validación:', error.response?.data?.errors)
    } else if (status === 429) {
      console.warn('Rate limit excedido:', error.response?.data?.message)
    } else if (status >= 500) {
      alert.error('Error en servidor', 'Estamos trabajando para solucionarlo')
    } else if (!navigator.onLine) {
      alert.error('Sin conexión', 'Por favor verifica tu internet')
    }

    return Promise.reject(error)
  }
)

export default api
