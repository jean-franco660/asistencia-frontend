<template>
  <ModalComponent :model-value="show" title="" @close="$emit('close')" size="md">
    <div class="bg-white dark:bg-gray-800">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 px-6 sm:px-8 py-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <UserX :size="28" class="text-white" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-white">Inactivar Asignación</h3>
            <p class="text-red-100 text-sm mt-1">
              {{ asignacion?.usuario?.nombre_completo }} - {{ asignacion?.institucion?.nombre }}
            </p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 sm:p-8">
        <!-- Fecha Fin (Exclusiva) -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Fecha de Fin (Exclusiva) *
          </label>
          <input
            type="date"
            v-model="form.fecha_fin"
            :min="minFechaFin"
            required
            class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
          
          <!-- Último día válido -->
          <div v-if="form.fecha_fin" class="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p class="text-sm text-blue-800 dark:text-blue-200">
              <strong>Último día válido:</strong> {{ ultimoDiaValido }}
            </p>
            <p class="text-xs text-blue-600 dark:text-blue-300 mt-1">
              Desde {{ form.fecha_fin }} el docente ya NO podrá marcar asistencia
            </p>
          </div>

          <!-- Advertencia retroactiva -->
          <div v-if="esRetroactiva" class="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
            <AlertTriangle :size="18" class="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Baja Retroactiva
              </p>
              <p class="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                La fecha de fin es anterior o igual a hoy. Esto afectará registros pasados.
              </p>
            </div>
          </div>
        </div>

        <!-- Motivo -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Motivo *
          </label>
          <select
            v-model="form.motivo"
            required
            class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          >
            <option value="">Seleccionar motivo</option>
            <option value="FIN_CONTRATO">Fin de Contrato</option>
            <option value="RENUNCIA">Renuncia</option>
            <option value="TRASLADO">Traslado</option>
            <option value="LICENCIA">Licencia</option>
            <option value="DESTITUCION">Destitución</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <!-- Observación -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Observación (Opcional)
          </label>
          <textarea
            v-model="form.observacion"
            rows="3"
            placeholder="Detalles adicionales sobre la inactivación..."
            class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
          <ButtonComponent
            variant="secondary"
            @click="$emit('close')"
            type="button"
            class="px-6 py-3 rounded-xl font-semibold border-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all order-2 sm:order-1"
          >
            Cancelar
          </ButtonComponent>

          <ButtonComponent
            variant="danger"
            type="submit"
            :disabled="submitting"
            class="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-xl transform hover:scale-105 transition-all order-1 sm:order-2"
          >
            <span v-if="!submitting">
              ✓ Inactivar Asignación
            </span>
            <span v-else class="flex items-center gap-2">
              <Loader2 :size="18" class="animate-spin" />
              Procesando...
            </span>
          </ButtonComponent>
        </div>
      </form>
    </div>
  </ModalComponent>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { UserX, AlertTriangle, Loader2 } from 'lucide-vue-next';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';

const props = defineProps({
  show: Boolean,
  asignacion: Object // { id, usuario: {}, institucion: {}, fecha_inicio, fecha_fin }
});

const emit = defineEmits(['close', 'submit']);

const form = ref({
  fecha_fin: '',
  motivo: '',
  observacion: ''
});

const submitting = ref(false);

// Fecha mínima: mañana (para evitar confusión, aunque permitimos retroactivas)
const minFechaFin = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
});

// Último día válido (fecha_fin - 1)
const ultimoDiaValido = computed(() => {
  if (!form.value.fecha_fin) return '';
  const fechaFin = new Date(form.value.fecha_fin + 'T00:00:00');
  const ultimoDia = new Date(fechaFin);
  ultimoDia.setDate(ultimoDia.getDate() - 1);
  return ultimoDia.toLocaleDateString('es-PE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

// Verificar si es retroactiva
const esRetroactiva = computed(() => {
  if (!form.value.fecha_fin) return false;
  const fechaFin = new Date(form.value.fecha_fin + 'T00:00:00');
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return fechaFin <= hoy;
});

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    form.value = {
      fecha_fin: '',
      motivo: '',
      observacion: ''
    };
  }
});

const handleSubmit = async () => {
  submitting.value = true;
  try {
    await emit('submit', {
      asignacion_id: props.asignacion.id,
      ...form.value
    });
  } finally {
    submitting.value = false;
  }
};
</script>
