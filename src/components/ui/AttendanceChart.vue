<template>
  <div class="w-full h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-gray-900 dark:text-gray-100 text-lg font-semibold">Asistencias vs Faltas</h3>

      <div class="flex items-center gap-4">
        <!-- Asistencias - solo mostrar si hay datos -->
        <div v-if="hasAsistencias" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span class="text-gray-600 dark:text-gray-400 text-sm">Asistencias</span>
        </div>

        <!-- Faltas - solo mostrar si hay datos -->
        <div v-if="hasFaltas" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <span class="text-gray-600 dark:text-gray-400 text-sm">Faltas</span>
        </div>
      </div>
    </div>

    <!-- Gráfico o mensaje de sin datos -->
    <div v-if="chartData.datasets.length > 0" class="h-96">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="h-96 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-flex p-4 bg-gray-100 dark:bg-gray-700/50 rounded-2xl mb-3">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400 font-medium">No hay datos para mostrar</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Los datos aparecerán cuando haya asistencias registradas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  labels: Array,
  values: Array, // [{label, data}] → Asistencias, Faltas
});

// 🎨 Paleta de colores para barras
const colorPalette = [
  { 
    background: "rgba(16, 185, 129, 0.8)", // Verde Esmeralda
    border: "#10B981",
    hover: "rgba(16, 185, 129, 1)"
  },
  { 
    background: "rgba(239, 68, 68, 0.8)", // Rojo
    border: "#EF4444",
    hover: "rgba(239, 68, 68, 1)"
  },
];

const chartData = computed(() => {
  // Safety check: ensure values is an array
  if (!Array.isArray(props.values) || props.values.length === 0) {
    return {
      labels: props.labels || [],
      datasets: []
    };
  }

  // Filtrar y mapear datasets, excluyendo aquellos con todos los valores en 0
  const validDatasets = props.values
    .slice(0, 2)
    .map((ds, index) => {
      const color = colorPalette[index];
      const data = Array.isArray(ds.data) ? ds.data : [];

      return {
        label: ds.label || `Dataset ${index + 1}`,
        data: data,
        backgroundColor: color.background,
        borderColor: color.border,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: color.hover,
        hasData: data.some(val => val > 0), // Flag para identificar si tiene datos
      };
    })
    .filter(ds => ds.hasData); // Solo incluir datasets con datos reales

  return {
    labels: props.labels || [],
    datasets: validDatasets,
  };
});

// Computed properties para verificar si hay datos
const hasAsistencias = computed(() => {
  if (!Array.isArray(props.values) || props.values.length === 0) return false;
  const asistencias = props.values.find(v => v.label === "Asistencias");
  if (!asistencias || !Array.isArray(asistencias.data)) return false;
  return asistencias.data.some(val => val > 0);
});

const hasFaltas = computed(() => {
  if (!Array.isArray(props.values) || props.values.length === 0) return false;
  const faltas = props.values.find(v => v.label === "Faltas");
  if (!faltas || !Array.isArray(faltas.data)) return false;
  return faltas.data.some(val => val > 0);
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(255,255,255,0.98)",
      titleColor: "#111827",
      bodyColor: "#4b5563",
      borderColor: "rgba(229,231,235,1)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxWidth: 10,
      boxHeight: 10,
      callbacks: {
        label: (context) => {
          let label = `${context.dataset.label}: `;
          label += context.parsed.y;
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#6b7280",
        font: { size: 11, weight: "500" },
        padding: 8,
      },
    },
    y: {
      beginAtZero: true,
      grid: { 
        color: "rgba(229,231,235,0.6)",
        drawBorder: false,
      },
      ticks: {
        color: "#6b7280",
        font: { size: 11, weight: "500" },
        padding: 8,
        precision: 0,
      },
    },
  },
  barPercentage: 0.7,
  categoryPercentage: 0.8,
}));
</script>
