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
            Gestión de Supervisores
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            Administra los Supervisores registrados en el sistema
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
            />
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
                />
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
          <div ref="estadoFilterRef" class="relative w-full md:w-64">
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <i class="fas fa-filter text-purple-500 mr-2"></i> Estado
            </label>
            <button
              type="button"
              @click="showEstadoDropdown = !showEstadoDropdown"
              class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white text-left flex items-center justify-between"
            >
              <span>
                <i
                  v-if="filterEstado === 'pendiente'"
                  class="fas fa-hourglass-half text-yellow-500 mr-2"
                ></i>
                <i
                  v-else-if="filterEstado === 'autorizado'"
                  class="fas fa-check-circle text-green-500 mr-2"
                ></i>
                <i
                  v-else-if="filterEstado === 'rechazado'"
                  class="fas fa-times-circle text-red-500 mr-2"
                ></i>
                {{ filterEstado ? capitalizeEstado(filterEstado) : "Todos los estados" }}
              </span>
              <i class="fas fa-chevron-down"></i>
            </button>

            <div
              v-if="showEstadoDropdown"
              class="absolute z-10 mt-2 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg"
            >
              <ul class="divide-y divide-gray-100 dark:divide-gray-600">
                <li>
                  <button
                    type="button"
                    @click="setEstadoFilter('')"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <i class="fas fa-list mr-2 text-gray-400"></i> Todos los estados
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    @click="setEstadoFilter('pendiente')"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <i class="fas fa-hourglass-half text-yellow-500 mr-2"></i> Pendientes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    @click="setEstadoFilter('autorizado')"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <i class="fas fa-check-circle text-green-500 mr-2"></i> Autorizados
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    @click="setEstadoFilter('rechazado')"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <i class="fas fa-times-circle text-red-500 mr-2"></i> Rechazados
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Botón Nuevo Supervisor -->
          <div class="flex items-end">
            <button
              @click="openCreateModal"
              class="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Supervisor
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
                />
              </svg>
            </div>
            Supervisores Registrados
            <span v-if="loading" class="animate-spin">⏳</span>
          </h2>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"
          ></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">Cargando Supervisores...</p>
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
                  Supervisor
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
                v-for="Supervisor in paginatedSupervisores"
                :key="Supervisor.id"
                class="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md"
                    >
                      <span class="text-white font-bold text-lg">{{
                        Supervisor.nombre.charAt(0).toUpperCase()
                      }}</span>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-gray-100">
                        {{ Supervisor.nombre }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ Supervisor.email }}
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
                      />
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">
                      {{ Supervisor.institucion_nombre || "Sin asignar" }}
                    </span>
                  </div>
                </td>

                <td class="px-6 py-4 text-center">
                  <span
                    :class="getEstadoClass(Supervisor.estado)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                  >
                    <span v-if="Supervisor.estado === 'pendiente'">⏳</span>
                    <span v-else-if="Supervisor.estado === 'autorizado'">✅</span>
                    <span v-else>❌</span>
                    {{ Supervisor.estado }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      v-if="Supervisor.estado === 'pendiente'"
                      @click="autorizarSupervisor(Supervisor)"
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
                        />
                      </svg>
                    </button>

                    <button
                      v-if="Supervisor.estado === 'pendiente'"
                      @click="rechazarSupervisor(Supervisor)"
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
                        />
                      </svg>
                    </button>

                    <button
                      @click="openEditModal(Supervisor)"
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
                        />
                      </svg>
                    </button>

                    <button
                      @click="confirmDelete(Supervisor)"
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
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!paginatedSupervisores.length">
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
                        />
                      </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium">
                      No hay Supervisores registrados
                    </p>
                    <p class="text-gray-400 dark:text-gray-500 text-sm">
                      Comienza creando un nuevo Supervisor
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
                    />
                  </svg>
                </div>
                {{ modalMode === "create" ? "Nuevo Supervisor" : "Editar Supervisor" }}
              </h3>
              <button
                @click="closeModal"
                class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all"
                :disabled="submitting"
                type="button"
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
                  />
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
                {{
                  modalMode === "create" ? "Contraseña *" : "Nueva contraseña (opcional)"
                }}
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
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
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
                    />
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
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
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
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Institución (server-side + debounce + abort + click-outside robusto) -->
            <div ref="institucionPickerRef" class="relative">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Institución *
              </label>

              <div class="relative">
                <svg
                  class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  v-model="institucionSearchQuery"
                  @focus="openInstitucionDropdown"
                  @input="onInstitucionInput"
                  type="text"
                  :placeholder="
                    form.institucion_id
                      ? getInstitucionNombre(form.institucion_id)
                      : 'Buscar institución por nombre o código...'
                  "
                  class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 pl-9 pr-10 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autocomplete="off"
                />

                <div
                  v-if="institucionesLoading"
                  class="absolute right-10 top-1/2 -translate-y-1/2"
                >
                  <div
                    class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"
                  ></div>
                </div>

                <button
                  v-if="form.institucion_id"
                  type="button"
                  @click="clearInstitucionSelection"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  title="Quitar selección"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Dropdown -->
              <div
                v-if="showInstitucionDropdown"
                ref="institucionDropdownRef"
                class="absolute z-20 mt-2 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden"
              >
                <template v-if="instituciones.length">
                  <button
                    v-for="inst in instituciones"
                    :key="inst.id"
                    type="button"
                    @click="selectInstitucion(inst)"
                    class="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-start gap-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    :class="
                      String(form.institucion_id) === String(inst.id)
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : ''
                    "
                  >
                    <div
                      class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>

                    <div class="flex-1 min-w-0">
                      <p
                        class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                      >
                        {{ inst.nombre }}
                      </p>
                      <div class="flex items-center gap-2 mt-1">
                        <span
                          v-if="inst.codigo_modular_ie"
                          class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                        >
                          {{ inst.codigo_modular_ie }}
                        </span>
                        <span
                          v-if="inst.distrito"
                          class="text-xs text-gray-500 dark:text-gray-400 truncate"
                        >
                          {{ inst.distrito }}
                        </span>
                      </div>
                    </div>

                    <div
                      v-if="String(form.institucion_id) === String(inst.id)"
                      class="flex-shrink-0 mt-2"
                    >
                      <div
                        class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                      >
                        <svg
                          class="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                </template>

                <div v-else class="p-4">
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    No se encontraron instituciones
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Intenta con otro término de búsqueda
                  </p>
                </div>
              </div>

              <!-- Selected pill -->
              <div
                v-if="form.institucion_id"
                class="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <p
                      class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                    >
                      {{ getInstitucionNombre(form.institucion_id) }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {{ getInstitucionCodigo(form.institucion_id) }}
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="clearInstitucionSelection"
                    class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-all"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>

            <!-- Estado (solo en edición) -->
            <div v-if="modalMode === 'edit'" ref="estadoModalRef" class="relative">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <i class="fas fa-flag text-purple-500 mr-2"></i> Estado
              </label>
              <button
                type="button"
                @click="showEstadoModalDropdown = !showEstadoModalDropdown"
                class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white text-left flex items-center justify-between"
              >
                <span class="flex items-center">
                  <i
                    v-if="form.estado === 'pendiente'"
                    class="fas fa-hourglass-half text-yellow-500 mr-2"
                  ></i>
                  <i
                    v-else-if="form.estado === 'autorizado'"
                    class="fas fa-check-circle text-green-600 mr-2"
                  ></i>
                  <i v-else class="fas fa-times-circle text-red-600 mr-2"></i>
                  {{ capitalizeEstado(form.estado) }}
                </span>
                <i class="fas fa-chevron-down"></i>
              </button>

              <div
                v-if="showEstadoModalDropdown"
                class="absolute z-10 mt-2 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg"
              >
                <ul class="divide-y divide-gray-100 dark:divide-gray-600">
                  <li>
                    <button
                      type="button"
                      @click="setEstadoForm('pendiente')"
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                    >
                      <i class="fas fa-hourglass-half text-yellow-500 mr-2"></i> Pendiente
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      @click="setEstadoForm('autorizado')"
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                    >
                      <i class="fas fa-check-circle text-green-600 mr-2"></i> Autorizado
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      @click="setEstadoForm('rechazado')"
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                    >
                      <i class="fas fa-times-circle text-red-600 mr-2"></i> Rechazado
                    </button>
                  </li>
                </ul>
              </div>
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
                  />
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
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import api, { usuariosWebService } from "@/services/api";
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
const Supervisores = ref([]);
const showEstadoDropdown = ref(false);
const showEstadoModalDropdown = ref(false);

// ---------- Instituciones (server-side) ----------
const instituciones = ref([]);
const institucionesLoading = ref(false);
const institucionSearchQuery = ref("");
const showInstitucionDropdown = ref(false);

// Abort + debounce
const institucionesAbort = ref(null); // AbortController
let institucionesDebounceTimer = null;

// Refs para click-outside robusto
const institucionPickerRef = ref(null);
const institucionDropdownRef = ref(null);
const estadoFilterRef = ref(null);
const estadoModalRef = ref(null);

const form = reactive({
  id: null,
  nombre: "",
  email: "",
  password: "",
  password_confirmation: "",
  institucion_id: "",
  estado: "pendiente",
});

const flattenSupervisor = (d) => ({
  ...d,
  institucion_id: d.instituciones?.[0]?.id || null,
  institucion_nombre: d.instituciones?.[0]?.nombre || null,
});

const loadSupervisores = async () => {
  loading.value = true;
  const params = {
    rol: "supervisor",
    search: searchQuery.value.trim() || undefined,
    estado: filterEstado.value || undefined,
  };

  try {
    const r = await usuariosWebService.getAll(params);
    const supervisoresData = r.data?.data?.data || r.data?.data || [];
    Supervisores.value = Array.isArray(supervisoresData)
      ? supervisoresData.map(flattenSupervisor)
      : [];
  } catch (error) {
    console.error("Error cargando supervisores:", error);
    Supervisores.value = [];
    alert.error("Error", "No se pudieron cargar los supervisores");
  } finally {
    loading.value = false;
  }
};

// GET /instituciones/mias (server-side search)
const fetchInstituciones = async (search = "") => {
  // Cancelar request anterior
  if (institucionesAbort.value) {
    institucionesAbort.value.abort();
    institucionesAbort.value = null;
  }

  institucionesAbort.value = new AbortController();
  institucionesLoading.value = true;

  try {
    const r = await api.get("/instituciones/mias", {
      params: {
        search: search?.trim() || undefined,
        per_page: 10,
      },
      signal: institucionesAbort.value.signal,
    });

    const data = r.data?.data?.data || r.data?.data || r.data || [];
    instituciones.value = Array.isArray(data) ? data : [];
  } catch (error) {
    // Abort no es error funcional
    if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") return;
    if (error?.name === "AbortError") return;

    console.error("Error cargando instituciones (/instituciones/mias):", error);
    instituciones.value = [];
  } finally {
    institucionesLoading.value = false;
  }
};

const openInstitucionDropdown = async () => {
  showInstitucionDropdown.value = true;
  // Primera carga (si aún no hay data) o refrescar con el término actual
  await fetchInstituciones(institucionSearchQuery.value);
};

const onInstitucionInput = () => {
  showInstitucionDropdown.value = true;

  // Debounce
  if (institucionesDebounceTimer) clearTimeout(institucionesDebounceTimer);
  institucionesDebounceTimer = setTimeout(() => {
    fetchInstituciones(institucionSearchQuery.value);
  }, 350);
};

const selectInstitucion = (inst) => {
  form.institucion_id = inst.id;
  institucionSearchQuery.value = inst.nombre || "";
  showInstitucionDropdown.value = false;
};

const clearInstitucionSelection = () => {
  form.institucion_id = "";
  institucionSearchQuery.value = "";
  showInstitucionDropdown.value = false;
  instituciones.value = [];
};

const getInstitucionNombre = (id) => {
  const inst = instituciones.value.find((i) => String(i.id) === String(id));
  return inst?.nombre || "Institución seleccionada";
};

const getInstitucionCodigo = (id) => {
  const inst = instituciones.value.find((i) => String(i.id) === String(id));
  return inst?.codigo_modular_ie ? `Código: ${inst.codigo_modular_ie}` : "";
};

// ---------- Modal ----------
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

const openCreateModal = async () => {
  resetForm();
  modalMode.value = "create";
  showModal.value = true;

  // Preparar buscador
  institucionSearchQuery.value = "";
  instituciones.value = [];
  await nextTick();
  await fetchInstituciones("");
  showInstitucionDropdown.value = false;
};

const openEditModal = async (d) => {
  Object.assign(form, {
    id: d.id,
    nombre: d.nombre,
    email: d.email,
    institucion_id: d.institucion_id || "",
    estado: d.estado,
    password: "",
    password_confirmation: "",
  });

  modalMode.value = "edit";
  showModal.value = true;

  // En edición: precargar lista para que el nombre/código se resuelva visualmente.
  // Si el backend filtra por search, intentamos por nombre conocido (si vino en tabla).
  institucionSearchQuery.value = d.institucion_nombre || "";
  instituciones.value = [];
  await nextTick();
  await fetchInstituciones(institucionSearchQuery.value || "");
  showInstitucionDropdown.value = false;
};

const closeModal = () => {
  showModal.value = false;
  showInstitucionDropdown.value = false;
  showEstadoModalDropdown.value = false;

  // Cancelar request instituciones si sigue vivo
  if (institucionesAbort.value) {
    institucionesAbort.value.abort();
    institucionesAbort.value = null;
  }
};

const validateForm = () => {
  if (!form.nombre || !form.email || !form.institucion_id) {
    alert.error("Error", "Complete los campos obligatorios");
    return false;
  }

  if (modalMode.value === "create") {
    if (!form.password || form.password.length < 8) {
      alert.error("Error", "Contraseña mínima 8 caracteres");
      return false;
    }
    if (form.password !== form.password_confirmation) {
      alert.error("Error", "Contraseñas no coinciden");
      return false;
    }
  }

  if (modalMode.value === "edit" && form.password) {
    if (form.password.length < 8) {
      alert.error("Error", "Contraseña mínima 8 caracteres");
      return false;
    }
    if (form.password !== form.password_confirmation) {
      alert.error("Error", "Contraseñas no coinciden");
      return false;
    }
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
      rol: "supervisor",
      estado: form.estado,
    };

    // ✅ CORRECCIÓN: Enviar instituciones como array
    if (form.institucion_id) {
      payload.instituciones = [
        {
          id: form.institucion_id,
          fecha_inicio: new Date().toISOString().split("T")[0],
          fecha_fin: null,
        },
      ];
    }

    // 🔍 LOG 1: Ver payload antes de enviar
    console.log("📤 PAYLOAD A ENVIAR:", JSON.stringify(payload, null, 2));

    if (modalMode.value === "create") {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;

      console.log("📤 Creando supervisor...");
      const response = await usuariosWebService.create(payload);
      console.log("✅ Respuesta del servidor:", response.data);
    } else {
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      console.log("📤 Actualizando supervisor...");
      await usuariosWebService.update(form.id, payload);
    }

    await loadSupervisores();
    closeModal();

    alert.toastSuccess(
      modalMode.value === "create" ? "Supervisor creado" : "Supervisor actualizado"
    );
  } catch (err) {
    console.error("❌ ERROR AL GUARDAR:", err);
    console.error("❌ Respuesta del servidor:", err.response?.data);
    alert.error("Error", err.response?.data?.message || "Error al guardar");
  } finally {
    submitting.value = false;
  }
};

// ---------- Acciones ----------
const autorizarSupervisor = async (d) => {
  const r = await alert.confirm("¿Autorizar Supervisor?", `Supervisor: ${d.nombre}`);
  if (!r.isConfirmed) return;

  await usuariosWebService.autorizar(d.id);
  await loadSupervisores();
  alert.toastSuccess("Supervisor autorizado");
};

const rechazarSupervisor = async (d) => {
  const r = await alert.confirm("¿Rechazar Supervisor?", `Supervisor: ${d.nombre}`);
  if (!r.isConfirmed) return;

  await usuariosWebService.rechazar(d.id);
  await loadSupervisores();
  alert.toastSuccess("Supervisor rechazado");
};

const confirmDelete = async (d) => {
  const r = await alert.confirmDelete(
    "¿Eliminar Supervisor?",
    `Se eliminará a ${d.nombre}`
  );
  if (!r.isConfirmed) return;

  await usuariosWebService.delete(d.id);
  await loadSupervisores();
  alert.toastSuccess("Supervisor eliminado");
};

// ---------- Estados ----------
const setEstadoForm = (estado) => {
  form.estado = estado;
  showEstadoModalDropdown.value = false;
};

const setEstadoFilter = (estado) => {
  filterEstado.value = estado;
  showEstadoDropdown.value = false;
  loadSupervisores();
};

const capitalizeEstado = (estado) => estado.charAt(0).toUpperCase() + estado.slice(1);

const getEstadoClass = (estado) => {
  const classes = {
    pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    autorizado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    rechazado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return classes[estado] || "bg-gray-100 text-gray-800";
};

// ---------- Paginación local ----------
const currentPage = ref(1);
const itemsPerPage = 10;
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const paginatedSupervisores = computed(() =>
  Supervisores.value.slice(startIndex.value, startIndex.value + itemsPerPage)
);

const handleSearch = () => loadSupervisores();

// ---------- Click-outside robusto ----------
const onGlobalPointerDown = (e) => {
  const t = e.target;

  // Estado filter dropdown
  if (showEstadoDropdown.value) {
    const el = estadoFilterRef.value;
    if (el && !el.contains(t)) showEstadoDropdown.value = false;
  }

  // Estado modal dropdown
  if (showEstadoModalDropdown.value) {
    const el = estadoModalRef.value;
    if (el && !el.contains(t)) showEstadoModalDropdown.value = false;
  }

  // Instituciones dropdown
  if (showInstitucionDropdown.value) {
    const picker = institucionPickerRef.value;
    const drop = institucionDropdownRef.value;
    const inside = (picker && picker.contains(t)) || (drop && drop.contains(t));
    if (!inside) showInstitucionDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("pointerdown", onGlobalPointerDown, { capture: true });
  loadSupervisores();
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onGlobalPointerDown, { capture: true });
  if (institucionesAbort.value) institucionesAbort.value.abort();
  if (institucionesDebounceTimer) clearTimeout(institucionesDebounceTimer);
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
