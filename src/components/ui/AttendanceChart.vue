<template>
  <div class="w-full h-full bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-gray-900 text-lg font-semibold">Asistencias vs Faltas</h3>

      <div class="flex items-center gap-4">
        <!-- Asistencias -->
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span class="text-gray-600 text-sm">Asistencias</span>
        </div>

        <!-- Faltas -->
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <span class="text-gray-600 text-sm">Faltas</span>
        </div>
      </div>

      <span class="text-gray-900 text-3xl font-bold">Resumen</span>
    </div>

    <div class="h-96">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

const props = defineProps({
  labels: Array,
  values: Array, // [{label, data}] → Asistencias, Faltas
});

// 🎨 Nueva paleta profesional
const colorPalette = [
  { line: "#10B981", gradient: "rgba(16, 185, 129, 0.15)" }, // Verde Esmeralda
  { line: "#EF4444", gradient: "rgba(239, 68, 68, 0.15)" }, // Rojo Carmesí
];

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.values.slice(0, 2).map((ds, index) => {
    const color = colorPalette[index];

    return {
      label: ds.label,
      data: ds.data,
      borderColor: color.line,
      backgroundColor: color.gradient,
      borderWidth: 4,
      tension: 0.45,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color.line,
      pointHoverBorderColor: "#fff",
      fill: true,
    };
  }),
}));

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
      grid: { color: "rgba(229,231,235,0.6)" },
      ticks: {
        color: "#6b7280",
        font: { size: 11, weight: "500" },
        padding: 8,
      },
    },
  },
  elements: {
    line: {
      borderCapStyle: "round",
      borderJoinStyle: "round",
    },
  },
}));
</script>
