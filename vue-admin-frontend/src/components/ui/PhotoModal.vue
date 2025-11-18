<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <img
      :src="photoUrl(asistencia?.foto)"
      class="max-h-[90vh] rounded-xl shadow-2xl object-contain"
      @click.stop
    />
  </div>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  asistencia: Object
})

const photoUrl = (path) =>
  path
    ? `${import.meta.env.VITE_API_BASE_URL.replace('/api/v1/web', '')}/storage/${path}`
    : null
</script>
