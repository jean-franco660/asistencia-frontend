<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-6"
  >
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header con animación -->
      <div class="relative">
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-10 blur-3xl"
        ></div>
        <div
          class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <div
                  class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg"
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1
                    class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                  >
                    Dashboard General
                  </h1>
                  <p class="text-gray-600 dark:text-gray-400 mt-1">
                    Resumen completo del sistema · {{ currentDate }}
                  </p>
                </div>
              </div>
            </div>

            <button
              @click="loadDashboardData"
              :disabled="loading"
              class="group relative p-3 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                class="w-5 h-5 text-white transition-transform duration-500"
                :class="{ 'animate-spin': loading }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span
                class="absolute -top-8 right-0 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              >
                Actualizar
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Alerta día no laborable -->
      <transition name="slide-down">
        <div
          v-if="hoyNoLaborable"
          class="relative overflow-hidden bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-900/30 dark:to-orange-900/30 backdrop-blur-xl rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-xl"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"
          ></div>
          <div class="relative flex items-start gap-4">
            <div class="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-2xl">
              🎌
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Hoy es día laborable?
              </h3>
              <p class="text-amber-700 dark:text-amber-300">{{ motivoNoLaborable }}</p>
            </div>
          </div>
        </div>
      </transition>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="relative">
            <div
              class="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"
            ></div>
            <div
              class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"
            ></div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 font-medium">
            Cargando datos del sistema...
          </p>
        </div>
      </div>

      <!-- Contenido principal -->
      <div v-if="!loading" class="space-y-8">
        <!-- KPIs Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Docentes -->
          <div
            class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-600/20 dark:to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <div
              class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
            ></div>

            <div class="relative p-6">
              <div class="flex items-start justify-between mb-4">
                <div
                  class="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500"
                >
                  <UsersIcon class="w-6 h-6 text-white" />
                </div>
                <span
                  class="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold"
                >
                  Personal
                </span>
              </div>

              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Total Docentes
                </p>
                <h3
                  class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                >
                  {{ stats.docentes_count || 0 }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Instituciones -->
          <div
            class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-600/20 dark:to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <div
              class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"
            ></div>

            <div class="relative p-6">
              <div class="flex items-start justify-between mb-4">
                <div
                  class="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500"
                >
                  <BuildingOfficeIcon class="w-6 h-6 text-white" />
                </div>
                <span
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold"
                >
                  Red
                </span>
              </div>

              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Instituciones
                </p>
                <h3
                  class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
                >
                  {{ stats.total_instituciones || 0 }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Asistencias Hoy -->
          <div
            class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-600/20 dark:to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <div
              class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"
            ></div>

            <div class="relative p-6">
              <div class="flex items-start justify-between mb-4">
                <div
                  class="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500"
                >
                  <CheckCircleIcon class="w-6 h-6 text-white" />
                </div>
                <span
                  class="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold"
                >
                  Hoy
                </span>
              </div>

              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Asistencias Hoy
                </p>
                <h3
                  class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
                >
                  {{ stats.asistencias_hoy || 0 }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Ausencias Hoy -->
          <div
            class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-600/20 dark:to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <div
              class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-2xl"
            ></div>

            <div class="relative p-6">
              <div class="flex items-start justify-between mb-4">
                <div
                  class="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500"
                >
                  <ClockIcon class="w-6 h-6 text-white" />
                </div>
                <span
                  class="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold"
                >
                  Alertas
                </span>
              </div>

              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Ausencias Hoy
                </p>
                <h3
                  class="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent"
                >
                  {{ stats.ausencias_hoy ?? "—" }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Cards adicionales para admin -->
          <template v-if="esAdmin">
            <!-- Feriados Nacionales -->
            <div
              class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-600/20 dark:to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
              <div
                class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-violet-400/20 rounded-full blur-2xl"
              ></div>

              <div class="relative p-6">
                <div class="flex items-start justify-between mb-4">
                  <div
                    class="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500"
                  >
                    <FlagIcon class="w-6 h-6 text-white" />
                  </div>
                </div>

                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Feriados Nacionales
                  </p>
                  <h3
                    class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent"
                  >
                    {{ stats.feriados_nacionales || 0 }}
                  </h3>
                </div>
              </div>
            </div>

            <!-- Feriados Institucionales -->
            <div
              class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-blue-500/10 dark:from-sky-600/20 dark:to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
              <div
                class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-400/20 to-blue-400/20 rounded-full blur-2xl"
              ></div>

              <div class="relative p-6">
                <div class="flex items-start justify-between mb-4">
                  <div
                    class="p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500"
                  >
                    <CalendarDaysIcon class="w-6 h-6 text-white" />
                  </div>
                </div>

                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Feriados Institucionales
                  </p>
                  <h3
                    class="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent"
                  >
                    {{ stats.feriados_institucionales || 0 }}
                  </h3>
                </div>
              </div>
            </div>
          </template>

          <!-- Día No Laborable -->
          <div
            class="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-slate-500/10 dark:from-gray-600/20 dark:to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <div
              class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-400/20 to-slate-400/20 rounded-full blur-2xl"
            ></div>

            <div class="relative p-6">
              <div class="flex items-start justify-between mb-4">
                <div
                  class="p-3 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500"
                >
                  <XCircleIcon class="w-6 h-6 text-white" />
                </div>
              </div>

              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  ¿Es día no laborable?
                </p>
                <h3
                  class="text-3xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 dark:from-gray-400 dark:to-slate-400 bg-clip-text text-transparent"
                >
                  {{ hoyNoLaborable ? "Sí" : "No" }}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Asistencias Recientes + Instituciones -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Asistencias Recientes -->
          <div
            class="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50"
          >
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"
            ></div>

            <div class="relative p-8">
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl"
                >
                  <CheckCircleIcon class="w-5 h-5 text-white" />
                </div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  Asistencias Recientes
                </h2>
              </div>

              <div
                v-if="recentAttendances.length === 0"
                class="text-center py-12 text-gray-500 dark:text-gray-400"
              >
                <div
                  class="inline-flex p-4 bg-gray-100 dark:bg-gray-700/50 rounded-2xl mb-3"
                >
                  <ClockIcon class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-sm">No hay asistencias registradas hoy</p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="a in recentAttendances"
                  :key="a.id"
                  class="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-700/30 rounded-2xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    >
                      <span class="text-white font-bold text-sm">{{
                        getInitials(a.docente)
                      }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ a.docente }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ a.institucion }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {{ a.hora }}
                    </p>
                    <span
                      :class="
                        a.estado === 'Presente'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                      "
                      class="text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {{ a.estado }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Instituciones Activas -->
          <div
            class="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50"
          >
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
            ></div>

            <div class="relative p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                  <BuildingOfficeIcon class="w-5 h-5 text-white" />
                </div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  Instituciones Activas
                </h2>
              </div>

              <div
                v-if="activeInstitutions.length === 0"
                class="text-center py-12 text-gray-500 dark:text-gray-400"
              >
                <div
                  class="inline-flex p-4 bg-gray-100 dark:bg-gray-700/50 rounded-2xl mb-3"
                >
                  <BuildingOfficeIcon class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-sm">No hay instituciones registradas</p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="i in activeInstitutions"
                  :key="i.id"
                  class="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-700/30 rounded-2xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {{ i.nombre }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ i.direccion }}
                    </p>
                  </div>
                  <div class="text-right ml-4">
                    <p
                      class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
                    >
                      {{ i.docentes }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      docentes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráfico Semanal -->
        <div
          class="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50"
        >
          <div
            class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          ></div>

          <div class="relative p-8">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  Actividad Mensual (Asistencias)
                </h2>
              </div>
              <div
                v-if="monthlyAvg > 0"
                class="px-4 py-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl"
              >
                <span class="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Promedio:
                </span>
                <span class="text-sm font-bold text-purple-900 dark:text-purple-100">
                  {{ monthlyAvg }}
                </span>
              </div>
            </div>

            <AttendanceChart
              v-if="monthlyLabels && monthlyLabels.length > 0"
              :labels="monthlyLabels"
              :values="monthlyData"
            />

            <div v-else class="h-64 flex items-center justify-center">
              <div
                class="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400"
              >
                <div class="relative">
                  <div
                    class="w-12 h-12 border-4 border-purple-200 dark:border-purple-900 rounded-full"
                  ></div>
                  <div
                    class="absolute top-0 left-0 w-12 h-12 border-4 border-purple-600 dark:border-purple-400 rounded-full border-t-transparent animate-spin"
                  ></div>
                </div>
                <p class="text-sm font-medium">Cargando gráfico...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import AttendanceChart from "@/components/ui/AttendanceChart.vue";
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";
import api, { asistenciasService, institucionesService } from "@/services/api";
import {
  UsersIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  CalendarDaysIcon,
  XCircleIcon,
} from "@heroicons/vue/24/solid";

// AUTH
const auth = useAuthStore();
const { initialized, isAuthenticated, user } = storeToRefs(auth);
const esAdmin = computed(() => user.value?.rol === "administrador");

// DATA
const loading = ref(true);
const stats = ref({});
const recentAttendances = ref([]);
const activeInstitutions = ref([]);

const hoyNoLaborable = ref(false);
const motivoNoLaborable = ref("");

// === 🔹 GRÁFICO MENSUAL ===
const monthlyLabels = ref([]);
const monthlyData = ref([]);
const monthlyAvg = ref(0);
const monthlyPeriod = ref("");

// Fecha actual
const currentDate = computed(() => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("es-ES", options);
});

// Iniciales
const getInitials = (name) =>
  (name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// === 🔹 /stats ===
const fetchStats = async () => {
  console.log("📈 GET /stats");
  const { data } = await api.get("/stats");
  console.log("✅ STATS:", data);
  return data;
};

// === 🔹 GRÁFICO MENSUAL ===
const loadMonthlyChart = async () => {
  console.log("📊 [loadMonthlyChart] Iniciando → /asistencias/mes-grafico");

  try {
    const response = await api.get("/asistencias/mes-grafico");

    console.log("📩 [RESPUESTA CRUDA]", response);
    console.log("📩 [RESPUESTA DATA]", response.data);

    const data = response.data; // ← CORRECCIÓN CRÍTICA

    // === VALIDACIONES ===
    if (!Array.isArray(data.labels)) {
      console.warn("⚠️ data.labels NO es un array", data.labels);
    }

    if (!Array.isArray(data.asistencias)) {
      console.warn("⚠️ data.asistencias NO es un array", data.asistencias);
    }

    if (!Array.isArray(data.faltas)) {
      console.warn("⚠️ data.faltas NO es un array", data.faltas);
    }

    // === ASIGNACIÓN ===
    monthlyLabels.value = data.labels || [];

    monthlyData.value = [
      {
        label: "Asistencias",
        data: data.asistencias || [],
        color: "#10b981", // verde
      },
      {
        label: "Faltas",
        data: data.faltas || [],
        color: "#ef4444", // rojo
      },
    ];

    monthlyPeriod.value = data.periodo?.mes || "";

    // === LOGS POST ASIGNACIÓN ===
    console.log("📊 monthlyLabels:", monthlyLabels.value);
    console.log("📊 monthlyData:", monthlyData.value);
    console.log("📅 monthlyPeriod:", monthlyPeriod.value);
  } catch (err) {
    console.error(
      "❌ Error /asistencias/mes-grafico",
      err.response?.status,
      err.response?.data
    );

    monthlyLabels.value = [];
    monthlyData.value = [];
    monthlyPeriod.value = "";
  }
};

// === 🔹 Carga principal ===
const loadDashboardData = async () => {
  if (!initialized.value || !isAuthenticated.value) return;

  loading.value = true;

  try {
    const [s, att, inst] = await Promise.allSettled([
      fetchStats(),
      asistenciasService.getAll({ limit: 5 }),
      institucionesService.getAll({ limit: 5 }),
    ]);

    // stats
    if (s.status === "fulfilled") {
      stats.value = s.value;
      hoyNoLaborable.value = !!s.value.hoy_no_laborable;
      motivoNoLaborable.value = s.value.motivo_no_laborable || "";
    }

    // asistencias recientes
    if (att.status === "fulfilled") {
      const data = att.value.data?.data || att.value.data || [];

      recentAttendances.value = data.map((item) => {
        const usuario = item.usuario || {};
        const institucion = item.institucion || {};

        // Si falta, reemplazamos estado
        const estadoFinal = item.falta
          ? "Falta"
          : item.estado === "a_tiempo"
          ? "A Tiempo"
          : item.estado === "tarde"
          ? "Tarde"
          : item.estado === "salida_antes"
          ? "Salida antes"
          : "—";

        return {
          fecha: item.fecha_hora ?? item.fecha ?? "",
          docente: usuario.nombre || "-",
          institucion: institucion.nombre || "-",
          hora: item.fecha_hora
            ? item.fecha_hora.substring(11, 16)
            : item.entrada
            ? item.entrada.substring(0, 5)
            : "—",
          estado: estadoFinal,
        };
      });
    }

    // instituciones
    if (inst.status === "fulfilled") {
      const data = inst.value.data?.data || inst.value.data || [];
      activeInstitutions.value = data.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        direccion: item.direccion || "-",
        docentes: item.docentes_count ?? item.docentes?.length ?? 0,
      }));
    }
  } finally {
    loading.value = false;

    // cargar gráfico mensual
    setTimeout(() => {
      loadMonthlyChart();
    }, 300);
  }
};

// WATCH
watch(
  () => initialized.value,
  (ready) => {
    if (ready && isAuthenticated.value) loadDashboardData();
  }
);

// MOUNTED
onMounted(() => {
  if (initialized.value && isAuthenticated.value) loadDashboardData();
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
