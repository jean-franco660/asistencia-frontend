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
    isAuthenticated: (state) => !!state.token
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
      } catch (_) { }
      this.token = ''
      this.user = null
      this.initialized = false
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    },

    async loadUser() {
      if (this.initialized) return

      const storedToken = localStorage.getItem('auth_token')

      if (!storedToken) {
        this.user = null
        this.token = ''
        this.initialized = true
        return
      }

      try {
        const { data } = await authService.me()
        this.user = data
        this.token = storedToken
      } catch (error) {
        this.user = null
        this.token = ''
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      } finally {
        this.initialized = true
      }
    }
  }
})
