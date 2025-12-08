<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-900">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {{ column.label }}
          </th>
          <th
            v-if="$slots.actions"
            scope="col"
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Acciones
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <tr
          v-for="(row, index) in Array.isArray(data) ? data : []"
          :key="index"
          class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <td
            v-for="column in Array.isArray(columns) ? columns : []"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>

          <td
            v-if="$slots.actions"
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <slot name="actions" :row="row" :index="index"></slot>
          </td>
        </tr>

        <!-- fila vacío -->
        <tr v-if="!(Array.isArray(data) && data.length)">
          <td
            :colspan="
              (Array.isArray(columns) ? columns.length : 0) + ($slots.actions ? 1 : 0)
            "
            class="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
          >
            <slot name="empty">No hay datos disponibles</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
});
</script>
