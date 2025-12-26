<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
    :class="badgeClass"
  >
    <component :is="badgeIcon" :size="12" />
    {{ badgeText }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { CheckCircle2, Clock, XCircle } from 'lucide-vue-next';

const props = defineProps({
  asignacion: Object // { estado, fecha_inicio, fecha_fin }
});

const vigenciaStatus = computed(() => {
  if (!props.asignacion) return 'INACTIVA';
  
  const { estado, fecha_inicio, fecha_fin, vigente } = props.asignacion;
  
  // 1. Prioridad: Lo que diga el backend
  if (vigente === true) return 'VIGENTE';

  // Si es PENDIENTE (sin horario asignado)
  if (estado === 'PENDIENTE') return 'SIN_HORARIO';

  // Si estado no es ACTIVO, es INACTIVA
  if (estado !== 'ACTIVO') return 'INACTIVA';
  
  // Usar comparación de strings YYYY-MM-DD para evitar problemas de timezone
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hoyStr = `${year}-${month}-${day}`;
  
  // Verificar fecha_inicio (inclusive)
  if (fecha_inicio) {
    if (fecha_inicio > hoyStr) return 'INACTIVA'; // Aún no inicia
  }
  
  // Verificar fecha_fin (INCLUSIVA: válido hasta el final del día fecha_fin)
  // Backend: fecha_fin >= hoy es VIGENTE
  if (fecha_fin) {
    // Si fecha_fin < hoyStr, ya venció
    if (fecha_fin < hoyStr) return 'INACTIVA';
    
    // Si está próxima a vencer (dentro de 30 días)
    // Para calcular esto sí necesitamos objetos Date
    const fechaFinDate = new Date(fecha_fin + 'T00:00:00');
    const hoyDate = new Date();
    hoyDate.setHours(0, 0, 0, 0);
    
    const treintaDias = new Date(hoyDate);
    treintaDias.setDate(treintaDias.getDate() + 30);
    
    if (fechaFinDate <= treintaDias) return 'PROGRAMADA_BAJA';
  }
  
  // Si llegamos aquí, está VIGENTE
  return 'VIGENTE';
});

const badgeClass = computed(() => {
  switch (vigenciaStatus.value) {
    case 'VIGENTE':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'PROGRAMADA_BAJA':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'SIN_HORARIO':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'INACTIVA':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
});

const badgeIcon = computed(() => {
  switch (vigenciaStatus.value) {
    case 'VIGENTE':
      return CheckCircle2;
    case 'PROGRAMADA_BAJA':
      return Clock;
    case 'SIN_HORARIO':
      return Clock;
    case 'INACTIVA':
      return XCircle;
    default:
      return XCircle;
  }
});

const badgeText = computed(() => {
  switch (vigenciaStatus.value) {
    case 'VIGENTE':
      return 'VIGENTE';
    case 'PROGRAMADA_BAJA':
      return 'PROGRAMADA BAJA';
    case 'SIN_HORARIO':
      return 'SIN HORARIO';
    case 'INACTIVA':
      return 'INACTIVA';
    default:
      return 'DESCONOCIDO';
  }
});
</script>
