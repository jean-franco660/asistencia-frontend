<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-full sm:max-w-2xl transform transition-all mx-4"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-3xl">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-white flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            Importar {{ tipo }}
          </h3>
          <button
            @click="closeModal"
            class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all"
            :disabled="uploading"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <!-- Upload Area -->
        <div
          @drop.prevent="handleDrop"
          @dragover.prevent
          @dragenter.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          :class="[
            'border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
            dragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500',
          ]"
          @click="$refs.fileInput.click()"
        >
          <input
            type="file"
            ref="fileInput"
            accept=".xlsx,.xls"
            @change="handleFileSelect"
            class="hidden"
          />

          <svg
            class="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <p class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Arrastra el archivo aquí
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            o haz clic para seleccionar
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500">
            Formatos: Excel (.xlsx, .xls) | Máximo: 10MB
          </p>
        </div>

        <!-- Selected File -->
        <div
          v-if="selectedFile"
          class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
        >
          <svg
            class="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div class="flex-1">
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ selectedFile.name }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
          <button
            @click="clearFile"
            :disabled="uploading"
            class="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Download Template Button -->
        <button
          @click="handleDownloadTemplate"
          :disabled="uploading"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all disabled:opacity-50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Descargar Plantilla
        </button>

        <!-- Progress Bar -->
        <div v-if="uploading" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">
              {{
                importId
                  ? `Procesando importación (ID: ${importId})...`
                  : "Cargando archivo..."
              }}
            </span>
            <span class="font-semibold text-blue-600 dark:text-blue-400"
              >{{ progress }}%</span
            >
          </div>
          <div
            class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden"
          >
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>

        <!-- Result -->
        <div v-if="result" class="space-y-4">
          <div
            class="rounded-xl p-4"
            :class="
              result.success
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            "
          >
            <div class="flex items-start gap-3">
              <svg
                v-if="result.success"
                class="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <svg
                v-else
                class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <div class="flex-1">
                <h4
                  class="font-semibold mb-2"
                  :class="
                    result.success
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-red-900 dark:text-red-100'
                  "
                >
                  {{ result.message }}
                </h4>

                <!-- Alerta de errores -->
                <div
                  v-if="result.errores > 0"
                  class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3"
                >
                  <div class="flex items-start gap-2">
                    <svg
                      class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div class="flex-1">
                      <p
                        class="font-semibold text-yellow-900 dark:text-yellow-100 text-sm mb-1"
                      >
                        Algunos registros no pudieron ser importados
                      </p>
                      <p class="text-xs text-yellow-800 dark:text-yellow-200">
                        Revisa el reporte de errores.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Botón de descarga de errores (por importId) -->
                <button
                  v-if="
                    result.errores > 0 && props.downloadErrorReportFunction && importId
                  "
                  @click="handleDownloadErrorReport"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-all"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Descargar Reporte de Errores
                </button>
                <p
                  v-if="result.errores > 0 && importId"
                  class="text-xs text-gray-600 dark:text-gray-400 text-center mt-2"
                >
                  Descarga el archivo, corrige los errores y vuelve a importar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-3xl flex flex-col sm:flex-row justify-end gap-3"
      >
        <button
          @click="closeModal"
          :disabled="uploading"
          class="px-6 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          @click="handleImport"
          :disabled="!selectedFile || uploading"
          class="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
        >
          <svg
            v-if="uploading"
            class="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{{ uploading ? "Importando..." : "Importar" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeUnmount } from "vue";
import { validateImportFile, formatFileSize } from "@/utils/fileValidation";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  tipo: { type: String, required: true },
  importFunction: { type: Function, required: true },
  statusFunction: { type: Function, required: true },
  downloadTemplateFunction: { type: Function, required: true },
  downloadErrorReportFunction: { type: Function, required: false },
});

const emit = defineEmits(["update:modelValue", "import-success"]);

const selectedFile = ref(null);
const dragging = ref(false);
const uploading = ref(false);
const progress = ref(0);
const result = ref(null);
const importId = ref(null);

let pollTimer = null;
let retryCount = 0; // ⭐ NUEVO
const MAX_RETRIES = 3; // ⭐ NUEVO
let currentInterval = 3000; // ⭐ NUEVO - Empezar con 3 segundos

const clearPoll = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  retryCount = 0; // ⭐ NUEVO
  currentInterval = 3000; // ⭐ NUEVO - Reset
};

onBeforeUnmount(() => {
  clearPoll();
});

const normalizeStatusPayload = (payload) => {
  const data = payload?.data ?? payload ?? {};
  const inner = data?.data ?? data;

  const estado = inner?.estado || inner?.status || inner?.state || null;
  const isDone =
    estado === "completed" ||
    estado === "completada" || // ⭐ Agregar español
    estado === "finalizado" ||
    estado === "done" ||
    estado === "failed" ||
    estado === "fallida" || // ⭐ Agregar español
    estado === "error" ||
    inner?.completed === true;

  const success =
    inner?.success === true ||
    estado === "completed" ||
    estado === "completada" || // ⭐ Agregar español
    estado === "finalizado" ||
    (inner?.errores_count ?? inner?.errores ?? 0) === 0;

  return {
    done: isDone,
    success: success,
    message:
      inner?.message || (success ? "Importación finalizada" : "Importación con errores"),
    total: inner?.total ?? 0,
    importados: inner?.importados ?? inner?.procesados ?? inner?.exitosos ?? 0,
    errores: inner?.errores ?? inner?.errores_count ?? 0,
  };
};

const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const validation = validateImportFile(file);
  if (!validation.isValid) {
    alert(validation.errors.join("\n"));
    return;
  }

  selectedFile.value = file;
  result.value = null;
  importId.value = null;
  clearPoll();
};

const handleDrop = (event) => {
  dragging.value = false;
  const file = event.dataTransfer.files?.[0];
  if (!file) return;

  const validation = validateImportFile(file);
  if (!validation.isValid) {
    alert(validation.errors.join("\n"));
    return;
  }

  selectedFile.value = file;
  result.value = null;
  importId.value = null;
  clearPoll();
};

const clearFile = () => {
  selectedFile.value = null;
  result.value = null;
  importId.value = null;
  progress.value = 0;
  clearPoll();
};

const bumpProgressUntil = (max = 90) => {
  if (progress.value < max) progress.value = Math.min(max, progress.value + 5);
};

// ⭐ NUEVA FUNCIÓN DE POLLING CON BACKOFF
const checkImportStatus = async () => {
  try {
    bumpProgressUntil(90);
    const statusResp = await props.statusFunction(importId.value);
    const normalized = normalizeStatusPayload(statusResp);

    // Reset retry count en éxito
    retryCount = 0;
    currentInterval = 3000; // Reset interval

    // Mostrar avances parciales
    result.value = {
      success: normalized.success,
      message: normalized.done ? normalized.message : "Procesando importación...",
      total: normalized.total,
      importados: normalized.importados,
      errores: normalized.errores,
    };

    if (normalized.done) {
      clearPoll();
      progress.value = 100;
      uploading.value = false;

      emit("import-success", {
        data: { import_id: importId.value },
        result: result.value,
      });
    }
  } catch (error) {
    console.error("Error en polling:", error);

    // ⭐ MANEJO ESPECIAL DE 429
    if (error.response?.status === 429) {
      retryCount++;

      if (retryCount >= MAX_RETRIES) {
        console.error("Máximo de reintentos alcanzado");
        clearPoll();
        result.value = {
          success: false,
          message:
            "Se alcanzó el límite de consultas. Por favor, recarga la página en unos segundos.",
          total: 0,
          importados: 0,
          errores: 0,
        };
        uploading.value = false;
        progress.value = 0;
        return;
      }

      // Aumentar intervalo exponencialmente: 3s → 5s → 8s → 10s (max)
      currentInterval = Math.min(currentInterval * 1.67, 10000);
      console.warn(
        `Rate limit detectado (intento ${retryCount}/${MAX_RETRIES}), aumentando intervalo a ${currentInterval}ms`
      );

      // Reiniciar polling con nuevo intervalo
      clearPoll();
      pollTimer = setInterval(checkImportStatus, currentInterval);
    } else {
      // Otros errores - continuar intentando pero no aumentar tanto
      console.warn("Error temporal en polling, continuando...");
    }
  }
};

const handleImport = async () => {
  if (!selectedFile.value) return;

  uploading.value = true;
  progress.value = 10;
  result.value = null;
  importId.value = null;
  clearPoll();

  try {
    // 1) Disparar importación
    const resp = await props.importFunction(selectedFile.value);
    const import_id =
      resp?.data?.data?.import_id ??
      resp?.data?.import_id ??
      resp?.data?.data?.id ??
      resp?.data?.id;

    if (!import_id) {
      result.value = {
        success: false,
        message:
          "No se recibió import_id del servidor. No puedo consultar el estado de la importación.",
        total: 0,
        importados: 0,
        errores: 0,
      };
      uploading.value = false;
      progress.value = 0;
      return;
    }

    importId.value = import_id;
    progress.value = 25;

    // ⭐ 2) Iniciar polling con intervalo adaptativo (empieza en 3 segundos)
    currentInterval = 3000;
    retryCount = 0;

    // Primera llamada inmediata
    checkImportStatus();

    // Luego cada X segundos
    pollTimer = setInterval(checkImportStatus, currentInterval);
  } catch (error) {
    clearPoll();
    result.value = {
      success: false,
      message: error.response?.data?.message || "Error al iniciar la importación",
      total: 0,
      importados: 0,
      errores: 0,
    };
    uploading.value = false;
    progress.value = 0;
  }
};

const handleDownloadTemplate = async () => {
  try {
    await props.downloadTemplateFunction();
  } catch (error) {
    alert("Error al descargar la plantilla");
  }
};

const handleDownloadErrorReport = async () => {
  if (!props.downloadErrorReportFunction) return;
  if (!importId.value) return;

  try {
    await props.downloadErrorReportFunction(importId.value);
  } catch (error) {
    alert("Error al descargar el reporte de errores");
  }
};

const closeModal = () => {
  if (uploading.value) return;
  clearFile();
  emit("update:modelValue", false);
};
</script>
