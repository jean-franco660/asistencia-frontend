// src/store/auth.js
import { defineStore } from 'pinia'
import { authService } from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || '',
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isSuperAdmin: (state) => state.user?.rol === 'super_admin',
    isAdmin: (state) => state.user?.rol === 'administrador',
    isSupervisor: (state) => state.user?.rol === 'supervisor',
    canAccessAudit: (state) => state.user?.rol === 'super_admin'
  },

  actions: {
    // store/auth.js
    // store/auth.js
    async login({ email, password }) {
      try {
        const { data } = await authService.login({ email, password })

        this.token = data.token
        this.user = data.user
        this.initialized = true
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        return { success: true }
      } catch (error) {
        // Clean credentials on login failure
        this.token = ''
        this.user = null
        this.initialized = true
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')

        return {
          success: false,
          error: error.response?.data?.message || 'Credenciales incorrectas'
        }
      }
    },


    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Error al hacer logout:', error)
      } finally {
        this.token = ''
        this.user = null
        this.initialized = false
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    },

    async loadUser() {
      console.log('🔄 [AUTH] loadUser() llamado, initialized:', this.initialized)

      if (this.initialized) {
        console.log('⚠️ [AUTH] Ya inicializado, saltando loadUser')
        console.log('   Estado actual:', { user: this.user, token: !!this.token })
        return
      }

      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')

      console.log('📦 [AUTH] localStorage:', {
        hasToken: !!storedToken,
        hasUser: !!storedUser,
        userPreview: storedUser?.substring(0, 50)
      })

      if (!storedToken) {
        console.log('❌ [AUTH] No hay token, limpiando estado')
        this.user = null
        this.token = ''
        this.initialized = true
        return
      }

      // ✅ CRÍTICO: Cargar usuario desde localStorage PRIMERO (síncrono)
      // Esto evita que el router redirija mientras esperamos la respuesta del backend
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          const parsedUser = JSON.parse(storedUser)
          console.log('✅ [AUTH] Usuario parseado desde localStorage:', parsedUser)
          this.user = parsedUser
          this.token = storedToken
          this.initialized = true
        } catch (error) {
          console.error('❌ [AUTH] Error parseando usuario desde localStorage:', error)
          // Si hay error parseando, limpiar localStorage
          localStorage.removeItem('user')
        }
      } else {
        console.log('⚠️ [AUTH] storedUser inválido:', storedUser)
      }

      // Luego verificar con el backend (asíncrono)
// Luego verificar con el backend (asíncrono)
      try {
        console.log('🌐 [AUTH] Verificando con backend /me...')
        const { data } = await authService.me()
        console.log('✅ [AUTH] Respuesta del backend:', data)

        // ✅ El backend devuelve {success: true, data: {id, nombre, email, rol, ...}}
        const userData = data.data
        console.log('👤 [AUTH] Usuario extraído:', userData)

        if (!userData) {
          throw new Error('No se recibieron datos del usuario')
        }

        this.user = userData
        this.token = storedToken
        // Actualizar localStorage con datos frescos del backend
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('✅ [AUTH] Usuario actualizado desde backend')
      } catch (error) {
        console.error('❌ [AUTH] Error verificando usuario con backend:', error)
        console.error('   Response:', error.response?.data)
        // Si falla la verificación, limpiar todo
        this.user = null
        this.token = ''
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      } finally {
        this.initialized = true
        console.log('🏁 [AUTH] loadUser() finalizado, estado:', {
          user: this.user,
          hasToken: !!this.token,
          initialized: this.initialized
        })
      }
    }
  }
})
