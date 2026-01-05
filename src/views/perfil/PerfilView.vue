<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mi Perfil
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Información personal y configuración de cuenta
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="user" class="space-y-6">
        <!-- Personal Information Card -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-6">
          <div class="flex items-center space-x-4 mb-6">
            <!-- Avatar -->
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {{ userInitials }}
            </div>
            
            <!-- Name and Role -->
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ user.nombre }}
              </h2>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 mt-1">
                {{ getRoleLabel(user.rol) }}
              </span>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="grid md:grid-cols-2 gap-4">
            <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.email }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Código Modular</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.codigo || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Institutions Card -->
        <div v-if="user.instituciones && user.instituciones.length > 0" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-6 4h1m4 0h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Instituciones Asignadas
          </h3>
          
          <div class="space-y-3">
            <div 
              v-for="inst in user.instituciones" 
              :key="inst.id"
              class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <div class="flex-1">
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ inst.nombre }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Código: {{ inst.codigo_modular_ie }}
                </p>
              </div>
              <div class="ml-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                  Activo
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <strong>Total:</strong> {{ user.instituciones.length }} institución{{ user.instituciones.length !== 1 ? 'es' : '' }}
            </p>
          </div>
        </div>

        <!-- Account Info -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Información de Cuenta
          </h3>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Estado de cuenta</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                Activo
              </span>
            </div>
            
            <div v-if="user.created_at" class="flex items-center justify-between py-2">
              <span class="text-gray-600 dark:text-gray-400">Fecha de registro</span>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ formatDate(user.created_at) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Security Settings Card -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Seguridad
          </h3>
          
          <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Mantén tu cuenta segura actualizando tu contraseña periódicamente
          </p>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="showEmailModal = true"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Cambiar Email</span>
            </button>
            
            <button
              @click="showPasswordModal = true"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>Cambiar Contraseña</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Password Change Modal -->
      <Transition name="modal">
        <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            @click.self="closePasswordModal"
            class="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-200 dark:border-gray-700 overflow-hidden"
          >
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-white flex items-center">
                  <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Cambiar Contraseña
                </h3>
                <button
                  @click="closePasswordModal"
                  class="text-white/80 hover:text-white transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="handlePasswordChange" class="p-6 space-y-4">
              <!-- Current Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contraseña Actual
                </label>
                <div class="relative">
                  <input
                    v-model="passwordForm.current_password"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    :class="{ 'border-red-500': passwordErrors.current_password }"
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg v-if="!showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <p v-if="passwordErrors.current_password" class="text-red-500 text-sm mt-1">
                  {{ Array.isArray(passwordErrors.current_password) ? passwordErrors.current_password[0] : passwordErrors.current_password }}
                </p>
              </div>

              <!-- New Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nueva Contraseña
                </label>
                <div class="relative">
                  <input
                    v-model="passwordForm.new_password"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    :class="{ 'border-red-500': passwordErrors.new_password }"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <p v-if="passwordErrors.new_password" class="text-red-500 text-sm mt-1">
                  {{ Array.isArray(passwordErrors.new_password) ? passwordErrors.new_password[0] : passwordErrors.new_password }}
                </p>
                <p v-else class="text-gray-500 text-xs mt-1">
                  Debe contener al menos 8 caracteres
                </p>
              </div>

              <!-- Confirm New Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <div class="relative">
                  <input
                    v-model="passwordForm.new_password_confirmation"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    :class="{ 'border-red-500': passwordErrors.new_password_confirmation }"
                    placeholder="Repite la nueva contraseña"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <p v-if="passwordErrors.new_password_confirmation" class="text-red-500 text-sm mt-1">
                  {{ Array.isArray(passwordErrors.new_password_confirmation) ? passwordErrors.new_password_confirmation[0] : passwordErrors.new_password_confirmation }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-3 pt-4">
                <button
                  type="button"
                  @click="closePasswordModal"
                  class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  :disabled="passwordLoading"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  :disabled="passwordLoading"
                >
                  <svg v-if="passwordLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ passwordLoading ? 'Cambiando...' : 'Cambiar Contraseña' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>

      <!-- Email Change Modal -->
      <Transition name="modal">
        <div v-if="showEmailModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            @click.self="closeEmailModal"
            class="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-200 dark:border-gray-700 overflow-hidden"
          >
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-white flex items-center">
                  <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Cambiar Email
                </h3>
                <button
                  @click="closeEmailModal"
                  class="text-white/80 hover:text-white transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="handleEmailChange" class="p-6 space-y-4">
              <!-- Current Email (Read-only) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Actual
                </label>
                <input
                  :value="user?.email"
                  type="text"
                  disabled
                  class="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <!-- New Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nuevo Email
                </label>
                <input
                  v-model="emailForm.new_email"
                  type="email"
                  class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                  :class="{ 'border-red-500': emailErrors.new_email }"
                  placeholder="ejemplo@correo.com"
                />
                <p v-if="emailErrors.new_email" class="text-red-500 text-sm mt-1">
                  {{ Array.isArray(emailErrors.new_email) ? emailErrors.new_email[0] : emailErrors.new_email }}
                </p>
              </div>

              <!-- Current Password Confirmation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contraseña Actual (para confirmar)
                </label>
                <div class="relative">
                  <input
                    v-model="emailForm.current_password"
                    :type="showEmailPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    :class="{ 'border-red-500': emailErrors.current_password }"
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <button
                    type="button"
                    @click="showEmailPassword = !showEmailPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg v-if="!showEmailPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <p v-if="emailErrors.current_password" class="text-red-500 text-sm mt-1">
                  {{ Array.isArray(emailErrors.current_password) ? emailErrors.current_password[0] : emailErrors.current_password }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeEmailModal"
                  class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  :disabled="emailLoading"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  :disabled="emailLoading"
                >
                  <svg v-if="emailLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ emailLoading ? 'Cambiando...' : 'Cambiar Email' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { usePasswordChange } from '@/composables/usePasswordChange';
import { useEmailChange } from '@/composables/useEmailChange';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(true);

const user = computed(() => authStore.user);

// Password Change
const showPasswordModal = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const { formData: passwordForm, errors: passwordErrors, loading: passwordLoading, resetForm, submitPasswordChange } = usePasswordChange();

const closePasswordModal = () => {
  showPasswordModal.value = false;
  resetForm();
  showCurrentPassword.value = false;
  showNewPassword.value = false;
  showConfirmPassword.value = false;
};

const handlePasswordChange = async () => {
  const success = await submitPasswordChange();
  if (success) {
    closePasswordModal();
  }
};

// Email Change
const showEmailModal = ref(false);
const showEmailPassword = ref(false);

const { formData: emailForm, errors: emailErrors, loading: emailLoading, resetForm: resetEmailForm, submitEmailChange } = useEmailChange();

const closeEmailModal = () => {
  showEmailModal.value = false;
  resetEmailForm();
  showEmailPassword.value = false;
};

const handleEmailChange = async () => {
  const success = await submitEmailChange();
  if (success) {
    closeEmailModal();
  }
};

const userInitials = computed(() => {
  const nombre = user.value?.nombre || '';
  return nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
});

const getRoleLabel = (rol) => {
  const roles = {
    super_admin: 'Super Administrador',
    administrador: 'Administrador',
    supervisor: 'Supervisor',
  };
  return roles[rol] || rol;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

onMounted(() => {
  loading.value = false;
});
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
