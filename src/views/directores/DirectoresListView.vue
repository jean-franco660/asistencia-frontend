<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
  >
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header Premium -->
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          >
            Gestión de Directores
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            Administra los directores registrados en el sistema
          </p>
        </div>
        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Filtros y Búsqueda Premium -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm"
      >
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Búsqueda -->
          <div class="flex-1">
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              Buscar
            </label>
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Buscar por nombre o email..."
              class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Filtro por Estado -->
          <div class="w-full md:w-64">
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <svg
                class="w-4 h-4 inline mr-2 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                ></path>
              </svg>
              Estado
            </label>
            <select
              v-model="filterEstado"
              @change="handleSearch"
              class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">⏳ Pendientes</option>
              <option value="autorizado">✅ Autorizados</option>
              <option value="rechazado">❌ Rechazados</option>
            </select>
          </div>

          <!-- Botón Nuevo Director -->
          <div class="flex items-end">
            <button
              @click="openCreateModal"
              class="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Nuevo Director
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla Premium -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600"
        >
          <h2
            class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3"
          >
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            </div>
            Directores Registrados
            <span v-if="loading" class="animate-spin">⏳</span>
          </h2>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"
          ></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">Cargando directores...</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-750 dark:to-gray-700"
              >
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Director
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Institución
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="director in paginatedDirectores"
                :key="director.id"
                class="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md"
                    >
                      <span class="text-white font-bold text-lg">{{
                        director.nombre.charAt(0).toUpperCase()
                      }}</span>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-gray-100">
                        {{ director.nombre }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ director.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      ></path>
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">{{
                      director.institucion_nombre || "Sin asignar"
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="getEstadoClass(director.estado)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                  >
                    <span v-if="director.estado === 'pendiente'">⏳</span>
                    <span v-else-if="director.estado === 'autorizado'">✅</span>
                    <span v-else>❌</span>
                    {{ director.estado }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <!-- Autorizar -->
                    <button
                      v-if="director.estado === 'pendiente'"
                      @click="autorizarDirector(director)"
                      class="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-all hover:scale-110"
                      title="Autorizar"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </button>

                    <!-- Rechazar -->
                    <button
                      v-if="director.estado === 'pendiente'"
                      @click="rechazarDirector(director)"
                      class="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg transition-all hover:scale-110"
                      title="Rechazar"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </button>

                    <!-- Editar -->
                    <button
                      @click="openEditModal(director)"
                      class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all hover:scale-110"
                      title="Editar"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>

                    <!-- Eliminar -->
                    <button
                      @click="confirmDelete(director)"
                      class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all hover:scale-110"
                      title="Eliminar"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M7 7h10"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!paginatedDirectores.length">
                <td colspan="4" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div
                      class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <svg
                        class="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium">
                      No hay directores registrados
                    </p>
                    <p class="text-gray-400 dark:text-gray-500 text-sm">
                      Comienza creando un nuevo director
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Premium -->
    <transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all"
        >
          <!-- Header del Modal -->
          <div
            class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-3xl"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                {{ modalMode === "create" ? "Nuevo Director" : "Editar Director" }}
              </h3>
              <button
                @click="closeModal"
                class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all"
                :disabled="submitting"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido del Modal -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
            <!-- Nombre -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Nombre completo *
              </label>
              <input
                v-model="form.nombre"
                type="text"
                required
                class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <!-- Email -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Correo electrónico *
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <!-- Contraseña -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ modalMode === "create" ? "Contraseña *" : "Nueva contraseña (opcional)" }}
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPass ? 'text' : 'password'"
                  :required="modalMode === 'create'"
                  class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 pr-12 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  :placeholder="
                    modalMode === 'create'
                      ? 'Mínimo 8 caracteres'
                      : 'Dejar vacío si no cambia'
                  "
                />
                <button
                  type="button"
                  @click="showPass = !showPass"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    v-if="!showPass"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Confirmar Contraseña -->
            <div v-if="modalMode === 'create' || form.password">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirmar contraseña *
              </label>
              <div class="relative">
                <input
                  v-model="form.password_confirmation"
                  :type="showPassConfirm ? 'text' : 'password'"
                  required
                  class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 pr-12 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Confirmar contraseña"
                />
                <button
                  type="button"
                  @click="showPassConfirm = !showPassConfirm"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    v-if="!showPassConfirm"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Institución -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Institución *
              </label>
              <select
                v-model="form.institucion_id"
                required
                class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Seleccione una institución</option>
                <option v-for="inst in instituciones" :key="inst.id" :value="inst.id">
                  {{ inst.nombre }}
                </option>
              </select>
            </div>

            <!-- Estado (solo en edición) -->
            <div v-if="modalMode === 'edit'">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Estado
              </label>
              <select
                v-model="form.estado"
                class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="pendiente">⏳ Pendiente</option>
                <option value="autorizado">✅ Autorizado</option>
                <option value="rechazado">❌ Rechazado</option>
              </select>
            </div>

            <!-- Footer del Modal -->
            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                :disabled="submitting"
                class="px-6 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                <svg
                  v-if="submitting"
                  class="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span v-if="submitting">Guardando...</span>
                <span v-else>{{ modalMode === "create" ? "Crear" : "Actualizar" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { usuariosWebService, institucionesService } from "@/services/api";
import { useAlert } from "@/utils/sweetalert";

const alert = useAlert();

const showPass = ref(false);
const showPassConfirm = ref(false);
const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const modalMode = ref("create");
const searchQuery = ref("");
const filterEstado = ref("");
const directores = ref([]);
const instituciones = ref([]);

const form = reactive({
  id: null,
  nombre: "",
  email: "",
  password: "",
  password_confirmation: "",
  institucion_id: "",
  estado: "pendiente",
});

const flattenDirector = (d) => ({
  ...d,
  institucion_id: d.instituciones?.[0]?.id || null,
  institucion_nombre: d.instituciones?.[0]?.nombre || null,
});

const loadDirectores = async () => {
  loading.value = true;
  const params = {
    rol: "director",
    search: searchQuery.value.trim() || undefined,
    estado: filterEstado.value || undefined,
  };
  const r = await usuariosWebService.getAll(params);
  directores.value = r.data?.data?.map(flattenDirector) || [];
  loading.value = false;
};

const loadInstituciones = async () => {
  const r = await institucionesService.getAll();
  instituciones.value = r.data?.data || [];
};

const resetForm = () =>
  Object.assign(form, {
    id: null,
    nombre: "",
    email: "",
    password: "",
    password_confirmation: "",
    institucion_id: "",
    estado: "pendiente",
  });

const openCreateModal = () => {
  resetForm();
  modalMode.value = "create";
  showModal.value = true;
};

const openEditModal = (d) => {
  Object.assign(form, {
    id: d.id,
    nombre: d.nombre,
    email: d.email,
    institucion_id: d.institucion_id,
    estado: d.estado,
    password: "",
    password_confirmation: "",
  });
  modalMode.value = "edit";
  showModal.value = true;
};

const closeModal = () => (showModal.value = false);

const validateForm = () => {
  if (!form.nombre || !form.email || !form.institucion_id)
    return alert.error("Error", "Complete los campos obligatorios");
  if (modalMode.value === "create") {
    if (!form.password || form.password.length < 8)
      return alert.error("Error", "Contraseña mínima 8 caracteres");
    if (form.password !== form.password_confirmation)
      return alert.error("Error", "Contraseñas no coinciden");
  }
  if (modalMode.value === "edit" && form.password) {
    if (form.password.length < 8)
      return alert.error("Error", "Contraseña mínima 8 caracteres");
    if (form.password !== form.password_confirmation)
      return alert.error("Error", "Contraseñas no coinciden");
  }
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  submitting.value = true;
  try {
    const payload = {
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      rol: "director",
      institucion_id: form.institucion_id,
      estado: form.estado,
    };

    if (modalMode.value === "create") {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
      await usuariosWebService.create(payload);
    } else {
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      await usuariosWebService.update(form.id, payload);
    }

    await loadDirectores();
    closeModal();

    alert.toastSuccess(
      modalMode.value === "create" ? "Director creado" : "Director actualizado"
    );
  } catch (err) {
    alert.error("Error", err.response?.data?.message || "Error al guardar");
  } finally {
    submitting.value = false;
  }
};

const autorizarDirector = async (d) => {
  const r = await alert.confirm("¿Autorizar director?", `Director: ${d.nombre}`);
  if (!r.isConfirmed) return;

  await usuariosWebService.autorizar(d.id);
  await loadDirectores();

  alert.toastSuccess("Director autorizado");
};

const rechazarDirector = async (d) => {
  const r = await alert.confirm("¿Rechazar director?", `Director: ${d.nombre}`);
  if (!r.isConfirmed) return;

  await usuariosWebService.rechazar(d.id);
  await loadDirectores();

  alert.toastSuccess("Director rechazado");
};

const confirmDelete = async (d) => {
  const r = await alert.confirmDelete(
    "¿Eliminar director?",
    `Se eliminará a ${d.nombre}`
  );
  if (!r.isConfirmed) return;

  await usuariosWebService.delete(d.id);
  await loadDirectores();

  alert.toastSuccess("Director eliminado");
};

const getEstadoClass = (estado) => {
  const classes = {
    pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    autorizado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    rechazado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return classes[estado] || "bg-gray-100 text-gray-800";
};

const currentPage = ref(1);
const itemsPerPage = 10;
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const paginatedDirectores = computed(() =>
  directores.value.slice(startIndex.value, startIndex.value + itemsPerPage)
);

const handleSearch = () => loadDirectores();

onMounted(() => {
  loadInstituciones();
  loadDirectores();
});
</script>

<style scoped>
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
  transform: scale(0.9);
}
</style>
