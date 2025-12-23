<template>
  <ModalComponent :model-value="show" :title="''" :hideHeader="true" :noPadding="true" @close="$emit('close')" size="xl">
    <div class="bg-white dark:bg-gray-800">
      <div
        class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 sm:px-8 py-6 relative"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
          >
            <UserPlus :size="28" class="text-white" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-white">
              {{ mode === "create" ? "Nuevo Docente" : "Editar Docente" }}
            </h3>
            <p class="text-blue-100 text-sm mt-1">
              Complete la información del docente
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 hover:scale-110 touch-target"
        >
          <X :size="24" />
        </button>
      </div>

      <form @submit.prevent="$emit('submit')" class="p-6 sm:p-8">
        <!-- SECCIÓN 1: INFORMACIÓN PERSONAL -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-4">
            <div
              class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
            >
              <User :size="18" class="text-blue-600 dark:text-blue-400" />
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">
              Información Personal
            </h4>
          </div>

          <div class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Apellido Paterno *
                </label>
                <InputField
                  v-model="form.apellido_paterno"
                  type="text"
                  placeholder="García"
                  :required="mode === 'create'"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-lg hover:!border-blue-400 focus:!border-blue-600 focus:!ring-4 focus:!ring-blue-500/20 transition-all shadow-sm"
                />
              </div>

              <div>
                <label
                  class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Apellido Materno *
                </label>
                <InputField
                  v-model="form.apellido_materno"
                  type="text"
                  placeholder="López"
                  :required="mode === 'create'"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-lg hover:!border-blue-400 focus:!border-blue-600 focus:!ring-4 focus:!ring-blue-500/20 transition-all shadow-sm"
                />
              </div>

              <div>
                <label
                  class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Nombres *
                </label>
                <InputField
                  v-model="form.nombres"
                  type="text"
                  placeholder="Juan Carlos"
                  :required="mode === 'create'"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-lg hover:!border-blue-400 focus:!border-blue-600 focus:!ring-4 focus:!ring-blue-500/20 transition-all shadow-sm"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  <div class="flex items-center gap-2">
                    <Hash :size="14" class="text-purple-600" />
                    Código Modular *
                  </div>
                </label>
                <InputField
                  v-model="form.codigo_modular"
                  type="text"
                  placeholder="DOC001"
                  :required="mode === 'create'"
                  maxlength="20"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-lg hover:!border-purple-400 focus:!border-purple-600 focus:!ring-4 focus:!ring-purple-500/20 transition-all shadow-sm"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Identificador único del docente
                </p>
              </div>

              <div>
                <label
                  class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  DNI *
                </label>
                <InputField
                  v-model="form.dni"
                  type="text"
                  placeholder="12345678"
                  :required="mode === 'create'"
                  maxlength="15"
                  pattern="[0-9]*"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-lg hover:!border-blue-400 focus:!border-blue-600 focus:!ring-4 focus:!ring-blue-500/20 transition-all shadow-sm"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Documento de identidad
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Sexo
                </label>
                <select
                  v-model="form.sexo"
                  class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
                >
                  <option :value="null">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Teléfono
                </label>
                <InputField
                  v-model="form.telefono"
                  type="tel"
                  placeholder="987654321"
                  maxlength="20"
                  pattern="[0-9]*"
                  class="!border-2 !border-gray-200 dark:!border-gray-600 !rounded-lg hover:!border-blue-400 focus:!border-blue-600 focus:!ring-4 focus:!ring-blue-500/20 transition-all shadow-sm"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Número de contacto (opcional)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 my-8"></div>

        <!-- SECCIÓN 2: SEGURIDAD -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-4">
            <div
              class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
            >
              <Lock :size="18" class="text-red-600 dark:text-red-400" />
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">Seguridad</h4>
          </div>

          <div>
            <label
              class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
            >
              {{ mode === "create" ? "Contraseña *" : "Nueva Contraseña" }}
            </label>
            <input
              v-model="form.password"
              type="password"
              :placeholder="
                mode === 'create'
                  ? 'Ingrese la contraseña'
                  : 'Dejar vacío para mantener la actual'
              "
              :required="mode === 'create'"
              class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-400 focus:border-red-600 focus:ring-4 focus:ring-red-500/20 transition-all shadow-sm"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              {{
                mode === "create"
                  ? "Mínimo 8 caracteres recomendados"
                  : "Solo completar si desea cambiar la contraseña"
              }}
            </p>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 my-8"></div>

        <!-- SECCIÓN 3: ASIGNACIONES -->
        <div>
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 flex items-center justify-center shadow-lg"
              >
                <Building2 :size="20" class="text-white" />
              </div>
              <div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                  Instituciones Asignadas
                </h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Gestiona las instituciones del usuario
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="$emit('addAssignment')"
              class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <Plus :size="18" />
              Asignar Institución
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(asignacion, index) in form.asignaciones"
              :key="index"
              class="group relative p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg"
            >
              <!-- Header de la Tarjeta -->
              <div class="flex justify-between items-center mb-5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {{ index + 1 }}
                  </div>
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Asignación #{{ index + 1 }}
                  </span>
                  <span
                    v-if="asignacion.institucion_id"
                    class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                  >
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Configurada
                  </span>
                </div>
                <button
                  type="button"
                  @click="$emit('removeAssignment', index)"
                  class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Eliminar asignación"
                >
                  <Trash2 :size="18" />
                </button>
              </div>

              <div class="space-y-5">
                <!-- Buscador de Institución -->
                <div>
                  <label
                    class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Institución <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="relative">
                      <input
                        type="text"
                        v-model="asignacion.institucion_search"
                        @input="$emit('searchInstitution', index)"
                        @focus="$emit('searchInstitution', index)"
                        @blur="$emit('hideDropdown', index)"
                        @keydown.enter.prevent
                        placeholder="Buscar por nombre o código modular..."
                        class="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                        :class="{
                          '!border-green-400 dark:!border-green-600 !bg-green-50/50 dark:!bg-green-900/10 focus:!ring-green-500/10':
                            asignacion.institucion_id,
                        }"
                      />
                      <Search
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        :size="18"
                      />
                      
                      <div class="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 
                          v-if="asignacion.loading_instituciones"
                          :size="18" 
                          class="animate-spin text-blue-500" 
                        />
                        <button
                          v-else-if="asignacion.institucion_id"
                          type="button"
                          @click="$emit('clearInstitution', index)"
                          class="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <!-- Dropdown de resultados -->
                    <div
                      v-if="asignacion.show_dropdown && asignacion.filtered_instituciones?.length"
                      class="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl max-h-72 overflow-y-auto"
                    >
                      <button
                        type="button"
                        v-for="inst in asignacion.filtered_instituciones"
                        :key="inst.id"
                        @mousedown.prevent="$emit('selectInstitution', index, inst)"
                        class="w-full px-4 py-3.5 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-center gap-3 transition-colors group"
                      >
                        <div
                          class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                        >
                          <Building2 :size="18" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                           <span class="text-blue-600 dark:text-blue-400 font-semibold text-xs">I.E.</span> {{ inst.nombre }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {{ inst.codigo_modular_ie }} • {{ inst.distrito }}
                          </p>
                        </div>
                        <svg class="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>

                    <!-- No hay resultados -->
                    <div
                      v-if="asignacion.show_dropdown && asignacion.filtered_instituciones?.length === 0 && asignacion.institucion_search"
                      class="absolute z-10 w-full mt-2 p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-xl text-center"
                    >
                      <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Search :size="20" class="text-gray-400" />
                      </div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        No se encontraron resultados
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Intenta con otro término de búsqueda
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Cargo y Estado -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Cargo <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="asignacion.cargo"
                      type="text"
                      placeholder="Ej: DOCENTE, DIRECTOR..."
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Estado
                    </label>
                    <select
                      v-model="asignacion.estado"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer"
                    >
                      <option value="ACTIVO">✓ ACTIVO</option>
                      <option value="INACTIVO">✕ INACTIVO</option>
                    </select>
                  </div>
                </div>
                
                <!-- Fechas (Información Automática) -->
                <div v-if="asignacion.fecha_inicio || asignacion.fecha_fin" 
                    class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-500 dark:bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                        Vigencia Automática
                      </p>
                      <p class="text-xs text-blue-700 dark:text-blue-300 mb-2">
                        Las fechas se gestionan automáticamente por el sistema:
                      </p>
                      <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1 mb-3">
                        <li class="flex items-start gap-2">
                          <svg class="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                          </svg>
                          <span><strong>Inicio:</strong> Al asignar horario</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <svg class="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                          </svg>
                          <span><strong>Fin:</strong> Al inhabilitar usuario</span>
                        </li>
                      </ul>
                      <div v-if="asignacion.fecha_inicio || asignacion.fecha_fin" 
                          class="flex flex-wrap gap-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                        <div v-if="asignacion.fecha_inicio" class="flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                          <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <div>
                            <span class="text-xs font-semibold text-blue-900 dark:text-blue-100">Inicio:</span>
                            <span class="text-xs text-blue-700 dark:text-blue-300 ml-1">{{ formatDate(asignacion.fecha_inicio) }}</span>
                          </div>
                        </div>
                        <div v-if="asignacion.fecha_fin" class="flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                          <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <div>
                            <span class="text-xs font-semibold text-blue-900 dark:text-blue-100">Fin:</span>
                            <span class="text-xs text-blue-700 dark:text-blue-300 ml-1">{{ formatDate(asignacion.fecha_fin) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div
              v-if="form.asignaciones.length === 0"
              class="text-center py-16 px-4 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800/30 dark:via-gray-700/30 dark:to-gray-800/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
            >
              <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center shadow-lg">
                <Building2 :size="36" class="text-gray-400 dark:text-gray-500" />
              </div>
              <p class="text-base font-bold text-gray-700 dark:text-gray-300 mb-2">
                No hay instituciones asignadas
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Comienza asignando una institución educativa
              </p>
              <button
                type="button"
                @click="$emit('addAssignment')"
                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus :size="18" />
                Agregar Primera Asignación
              </button>
            </div>
          </div>
        </div>

        <!-- BOTONES -->
        <div
          class="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-8 border-t-2 border-gray-200 dark:border-gray-700"
        >
          <ButtonComponent
            variant="secondary"
            @click="$emit('close')"
            type="button"
            class="px-6 py-3 rounded-xl font-semibold border-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all order-2 sm:order-1"
          >
            Cancelar
          </ButtonComponent>

          <ButtonComponent
            variant="primary"
            type="submit"
            :disabled="submitting"
            class="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl transform hover:scale-105 transition-all order-1 sm:order-2"
          >
            <span v-if="!submitting">
              {{ mode === "create" ? "✓ Crear Docente" : "✓ Guardar Cambios" }}
            </span>
            <span v-else class="flex items-center gap-2">
              <Loader2 :size="18" class="animate-spin" />
              Guardando...
            </span>
          </ButtonComponent>
        </div>
      </form>
    </div>
  </ModalComponent>
</template>

<script setup>
import { 
  UserPlus, User, Hash, Lock, Building2, Plus, 
  Trash2, Search, Loader2, X
} from 'lucide-vue-next';
import ModalComponent from "@/components/ui/ModalComponent.vue";
import InputField from "@/components/ui/InputField.vue";
import ButtonComponent from "@/components/ui/ButtonComponent.vue";
import { formatDate } from "@/utils/formatters";

defineProps({
  show: Boolean,
  mode: String,
  form: Object,
  submitting: Boolean
});

defineEmits([
  'close', 
  'submit',
  'addAssignment',
  'removeAssignment',
  'searchInstitution',
  'selectInstitution',
  'clearInstitution',
  'hideDropdown'
]);
</script>
