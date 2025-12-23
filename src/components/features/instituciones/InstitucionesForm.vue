<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')"
      >
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-3xl sticky top-0 z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">
                {{ mode === "create" ? "Nueva Institución" : "Editar Institución" }}
              </h3>
              <button
                @click="$emit('close')"
                class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all"
                type="button"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form @submit.prevent="$emit('submit')" class="p-6 space-y-5">
      <!-- Logo Upload -->
      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <div class="flex items-center gap-2">
            <Building2 :size="18" class="text-blue-600" />
            Logo de la Institución
          </div>
        </label>

        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div
              v-if="logoPreview || form.logo"
              class="w-24 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-600"
            >
              <img
                :src="logoPreview || form.logo"
                alt="Logo preview"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
            >
              <Building2 :size="32" class="text-white" />
            </div>
          </div>

          <div class="flex-1">
            <input
              ref="logoInputRef"
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
              @change="$emit('logoChange', $event)"
              class="hidden"
            />
            <button
              type="button"
              @click="$refs.logoInputRef.click()"
              class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              <div class="flex items-center justify-center gap-2">
                <Upload :size="20" />
                <span>{{ form.logo || logoPreview ? "Cambiar logo" : "Subir logo" }}</span>
              </div>
            </button>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Formatos: JPG, PNG, GIF, SVG. Máx: 2MB
            </p>

            <button
              v-if="form.logo || logoPreview"
              type="button"
              @click="$emit('removeLogo')"
              class="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Eliminar logo
            </button>
          </div>
        </div>
      </div>

      <!-- Grid 2 columnas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Código Modular IE -->
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Código Modular IE *
          </label>
          <input
            v-model="form.codigo_modular_ie"
            type="text"
            required
            placeholder="Ej: 0123456"
            class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>

        <!-- Nombre -->
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nombre *
          </label>
          <input
            v-model="form.nombre"
            type="text"
            required
            placeholder="Ej: Instituto Técnico Central"
            class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>

        <!-- Nivel Educativo -->
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nivel Educativo
          </label>
          <input
            v-model="form.nivel_educativo"
            type="text"
            placeholder="Ej: Secundaria"
            class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>

        <!-- Distrito -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Distrito *
          </label>
          <input
            v-model="form.distrito"
            type="text"
            required
            placeholder="Ej: Lima"
            class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>

        <!-- Centro Poblado -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Centro Poblado
          </label>
          <input
            v-model="form.centro_poblado"
            type="text"
            placeholder="Ej: San Juan"
            class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>

        <!-- Dirección -->
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Dirección
          </label>
          <input
            v-model="form.direccion"
            type="text"
            placeholder="Ej: Calle Principal 123"
            class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>

        <!-- Latitud -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Latitud *
          </label>
          <input
            v-model="form.latitud"
            type="number"
            step="0.0000001"
            required
            placeholder="-12.123456"
            min="-90"
            max="90"
            class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>

        <!-- Longitud -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Longitud *
          </label>
          <input
            v-model="form.longitud"
            type="number"
            step="0.0000001"
            required
            placeholder="-76.123456"
            min="-180"
            max="180"
            class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>

        <!-- Radio -->
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Radio de cobertura (metros)
          </label>
          <div class="flex items-center gap-3">
            <input
              v-model="form.radio"
              type="number"
              required
              min="10"
              max="1000"
              placeholder="50"
              class="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
            />
            <div class="text-right">
              <div class="text-2xl font-bold text-orange-600">{{ form.radio }}</div>
              <div class="text-xs text-gray-500">m</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="$emit('close')"
          class="px-6 py-2.5 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Loader2 v-if="submitting" :size="18" class="animate-spin" />
          {{ submitting ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar" }}
        </button>
      </div>
      </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { Building2, Upload, Loader2 } from 'lucide-vue-next';

const props = defineProps({
  show: Boolean,
  mode: String,
  form: Object,
  submitting: Boolean,
  logoPreview: String,
});

const emit = defineEmits(['close', 'submit', 'logoChange', 'removeLogo']);

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.show) {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
