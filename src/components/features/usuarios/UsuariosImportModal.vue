<template>
  <ImportFileModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    tipo="Docentes"
    :import-function="importFunction"
    :status-function="statusFunction"
    :download-template-function="downloadTemplateFunction"
    :download-error-report-function="downloadErrorReportFunction"
    @import-success="$emit('importSuccess')"
  />
</template>

<script setup>
import ImportFileModal from "@/components/ui/ImportFileModal.vue";

defineProps({
  modelValue: Boolean,
  importFunction: Function,
  statusFunction: Function,
  downloadTemplateFunction: Function,
  downloadErrorReportFunction: Function
});

defineEmits(['update:modelValue', 'importSuccess']);
</script>
