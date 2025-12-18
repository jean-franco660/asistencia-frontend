<template>
  <div class="form-group">
    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :required="required"
      class="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    >
      <option value="">{{ placeholder }}</option>
      <option value="administrador">👑 Administrador</option>
      <option value="supervisor">📋 Supervisor</option>
    </select>
  </div>
</template>

<script setup>
import { ROLES } from '@/constants/roles'

defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Rol' },
  placeholder: { type: String, default: 'Seleccione un rol' },
  required: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>
