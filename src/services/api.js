import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not defined')
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error)
)

// Auth
export const authService = {
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me')
}

// Usuarios Web
export const usuariosWebService = {
  getAll: (params) => api.get('/usuarios-web', { params }),
  getPendientes: () => api.get('/usuarios-web/pendientes'),
  create: (data) => api.post('/usuarios-web', data),

  update: (id, data) => api.put(`/usuarios-web/${id}`, {
    ...data,
    // aseguramos rol siempre
    rol: data.rol || 'director'
  }),

  delete: (id) => api.delete(`/usuarios-web/${id}`),

  autorizar: (id) => api.post(`/usuarios-web/autorizar/${id}`),
  rechazar: (id) => api.post(`/usuarios-web/rechazar/${id}`)
}


// Docentes (usuarios_app)
export const usuariosService = {
  getAll: (params) => api.get('/usuarios-app', { params }),
  create: (data) => api.post('/usuarios-app', data),
  update: (id, data) => api.put(`/usuarios-app/${id}`, data),
  delete: (id) => api.delete(`/usuarios-app/${id}`),
  importar: (data) => api.post('/usuarios-app/importar', data, { headers: { 'Content-Type': 'multipart/form-data' } })
}

// Instituciones
export const institucionesService = {
  getAll: (params) => api.get('/instituciones', { params }),
  create: (data) => api.post('/instituciones', data),
  update: (id, data) => api.put(`/instituciones/${id}`, data),
  delete: (id) => api.delete(`/instituciones/${id}`),
  getMias: () => api.get('/instituciones/mias'),
}

// Asistencias
export const asistenciasService = {
  getAll: (params) => api.get('/asistencias', { params }),
  getById: (id) => api.get(`/asistencias/${id}`),
  getStats: () => api.get('/asistencias/stats'),
  resumenSemanal: () => api.get('/asistencias/semana')
}

// Horarios de institución
export const horariosService = {
  getAll: () => api.get('/horarios'),
  create: (data) => api.post('/horarios', data),
  update: (id, data) => api.put(`/horarios/${id}`, data),
  delete: (id) => api.delete(`/horarios/${id}`)
}

// Feriados nacionales + Feriados instituciónales
export const feriadosService = {
  getAll: (params) => api.get('/feriados', { params }),
  create: (data) => api.post('/feriados', data),
  update: (id, data) => api.put(`/feriados/${id}`, data),
  delete: (id) => api.delete(`/feriados/${id}`),
  actualizarAuto: () => api.post('/feriados/actualizar-automatico')
}


// SweetAlert
import { useAlert } from '@/utils/sweetalert'
const alert = useAlert()

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    const isLoginPage = window.location.pathname.includes('/login')

    if (status === 401) {
      if (!isLoginPage) {
        alert.error('Sesión expirada', 'Por favor inicia sesión nuevamente')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    else if (status === 403) {
      alert.error('Acceso denegado', 'No tienes permisos para realizar esta acción')
    }
    else if (status >= 500) {
      alert.error('Error en servidor', 'Estamos trabajando para solucionarlo')
    }
    else if (!navigator.onLine) {
      alert.error('Sin conexión', 'Por favor verifica tu internet')
    }

    return Promise.reject(error)
  }
)

export default api
