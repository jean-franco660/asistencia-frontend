<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Header (mantener igual) -->
      <header class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Reportes Avanzados
              </h1>
              <p class="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Generación de reportes detallados en formato Excel
              </p>
            </div>
          </div>
        </div>
      </header>

      <!-- Grid de Reportes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- 1. Asistencias por Período -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800">
            <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Asistencias por Período</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Detalle diario de asistencias, tardanzas y faltas.</p>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Date Pickers Mejorados -->
            <div class="grid grid-cols-2 gap-4">
              <div class="date-picker-group">
                <label class="date-picker-label">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Desde
                </label>
                <div class="date-picker-wrapper">
                  <input 
                    type="date" 
                    v-model="filters.periodo.inicio" 
                    class="date-picker-input"
                  >
                  <div class="date-picker-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="date-picker-group">
                <label class="date-picker-label">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Hasta
                </label>
                <div class="date-picker-wrapper">
                  <input 
                    type="date" 
                    v-model="filters.periodo.fin" 
                    class="date-picker-input"
                  >
                  <div class="date-picker-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              @click="downloadReport('periodo')" 
              :disabled="loading.periodo"
              class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm active:transform active:scale-95 transition-all flex justify-center items-center gap-2"
            >
              <span v-if="loading.periodo" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ loading.periodo ? 'Generando...' : 'Descargar Excel' }}
            </button>
          </div>
        </div>

        <!-- 2. Historial Docente -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-white dark:from-green-900/10 dark:to-gray-800">
            <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Historial Docente</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Resumen de asignaciones y desempeño histórico.</p>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Dropdown Mejorado -->
            <div class="select-group">
              <label class="select-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Seleccionar Docente
              </label>
              <div class="select-wrapper">
                <select 
                  v-model="filters.historial.usuario_id" 
                  class="custom-select-input"
                >
                  <option value="">Todos los docentes</option>
                  <option v-for="doc in docentes" :key="doc.id" :value="doc.id">
                    {{ doc.nombre_completo }}
                  </option>
                </select>
                <div class="select-icon">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button 
              @click="downloadReport('historial')"
              :disabled="loading.historial"
              class="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-sm active:transform active:scale-95 transition-all flex justify-center items-center gap-2"
            >
              <span v-if="loading.historial" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ loading.historial ? 'Generando...' : 'Descargar Excel' }}
            </button>
          </div>
        </div>

        <!-- 3. Consolidado Institución -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/10 dark:to-gray-800">
            <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Consolidado por Institución</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Resumen global de métricas por escuela.</p>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Dropdown Mejorado -->
            <div class="select-group">
              <label class="select-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Seleccionar Institución
              </label>
              <div class="select-wrapper">
                <select 
                  v-model="filters.consolidado.institucion_id" 
                  class="custom-select-input"
                >
                  <option value="">Todas las instituciones</option>
                  <option v-for="inst in instituciones" :key="inst.id" :value="inst.id">
                    {{ inst.nombre }}
                  </option>
                </select>
                <div class="select-icon">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button 
              @click="downloadReport('consolidado')"
              :disabled="loading.consolidado"
              class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm active:transform active:scale-95 transition-all flex justify-center items-center gap-2"
            >
              <span v-if="loading.consolidado" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ loading.consolidado ? 'Generando...' : 'Descargar Excel' }}
            </button>
          </div>
        </div>

        <!-- 4. Reporte Mensual -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800">
            <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Reporte Mensual</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Estadísticas agregadas mes a mes.</p>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Month Picker Mejorado -->
            <div class="date-picker-group">
              <label class="date-picker-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Seleccionar Mes
              </label>
              <div class="date-picker-wrapper">
                <input 
                  type="month" 
                  v-model="filters.mensual.mes" 
                  class="date-picker-input"
                >
                <div class="date-picker-icon">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button 
              @click="downloadReport('mensual')"
              :disabled="loading.mensual"
              class="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-sm active:transform active:scale-95 transition-all flex justify-center items-center gap-2"
            >
              <span v-if="loading.mensual" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ loading.mensual ? 'Generando...' : 'Descargar Excel' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import api from '@/services/api';
import { useAlert } from '@/utils/sweetalert';

const alert = useAlert();

const loading = reactive({
  periodo: false,
  historial: false,
  consolidado: false,
  mensual: false
});

const filters = reactive({
  periodo: {
    inicio: new Date().toISOString().substr(0, 10),
    fin: new Date().toISOString().substr(0, 10)
  },
  historial: {
    usuario_id: ''
  },
  consolidado: {
    institucion_id: ''
  },
  mensual: {
    mes: new Date().toISOString().substr(0, 7)
  }
});

const instituciones = ref([]);
const docentes = ref([]);

const cargarInstituciones = async () => {
  try {
    const response = await api.get('/instituciones');
    const data = response.data.data || response.data;
    instituciones.value = Array.isArray(data) ? data.filter(i => i) : [];
  } catch (error) {
    console.error('Error cargando instituciones:', error);
    alert.error('Error', 'No se pudieron cargar las instituciones');
  }
};

const cargarDocentes = async () => {
  try {
    const response = await api.get('/usuarios-app'); 
    const data = response.data.data || response.data;
    docentes.value = Array.isArray(data) ? data.filter(d => d) : [];
  } catch (error) {
    console.error('Error cargando docentes:', error);
    alert.error('Error', 'No se pudieron cargar los docentes');
  }
};

import { onMounted } from 'vue';

onMounted(() => {
  cargarInstituciones();
  cargarDocentes();
});

const downloadFile = (response, filename) => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const downloadReport = async (type) => {
  loading[type] = true;
  try {
    let endpoint = '';
    let params = {};
    let filename = '';

    switch(type) {
      case 'periodo':
        if (!filters.periodo.inicio || !filters.periodo.fin) {
          alert.warning('Atención', 'Selecciona fechas de inicio y fin');
          loading[type] = false;
          return;
        }
        endpoint = '/reportes/periodo';
        params = { fecha_inicio: filters.periodo.inicio, fecha_fin: filters.periodo.fin };
        filename = 'Reporte_Completo.xlsx'; // Nombre actualizado según backend
        break;
      case 'historial':
        endpoint = '/reportes/docente-historial';
        params = { usuario_id: filters.historial.usuario_id };
        filename = 'historial_docente.xlsx';
        break;
      case 'consolidado':
        endpoint = '/reportes/institucion-consolidado';
        params = { institucion_id: filters.consolidado.institucion_id };
        filename = 'consolidado_institucion.xlsx';
        break;
      case 'mensual':
        if (!filters.mensual.mes) {
          alert.warning('Atención', 'Selecciona un mes válido');
          loading[type] = false;
          return;
        }
        endpoint = '/reportes/mensual';
        params = { mes: filters.mensual.mes };
        filename = 'reporte_mensual.xlsx';
        break;
    }

    const response = await api.get(endpoint, {
      params,
      responseType: 'blob'
    });

    downloadFile(response, filename);
    alert.toastSuccess('Reporte descargado correctamente');

  } catch (error) {
    console.error('Error descargando reporte:', error);
    alert.error('Error', 'Error al generar el reporte');
  } finally {
    loading[type] = false;
  }
};
</script>

<style scoped>
/* ==========================================
   DATE PICKER STYLES
   ========================================== */

.date-picker-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-picker-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .date-picker-label {
  color: #d1d5db;
}

.date-picker-wrapper {
  position: relative;
}

.date-picker-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  background-color: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  transition: all 0.2s;
  cursor: pointer;
  outline: none;
}

.dark .date-picker-input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.date-picker-input:hover {
  border-color: #d1d5db;
}

.dark .date-picker-input:hover {
  border-color: #6b7280;
}

.date-picker-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.dark .date-picker-input:focus {
  border-color: #60a5fa;
}

.date-picker-input::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 0.75rem;
  cursor: pointer;
  opacity: 0;
  width: 2.5rem;
  height: 2.5rem;
}

.date-picker-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  transition: color 0.2s;
}

.dark .date-picker-icon {
  color: #6b7280;
}

.date-picker-wrapper:hover .date-picker-icon {
  color: #4b5563;
}

.dark .date-picker-wrapper:hover .date-picker-icon {
  color: #d1d5db;
}

.date-picker-input:focus ~ .date-picker-icon {
  color: #3b82f6;
}

.dark .date-picker-input:focus ~ .date-picker-icon {
  color: #60a5fa;
}

/* ==========================================
   SELECT/DROPDOWN STYLES
   ========================================== */

.select-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.select-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .select-label {
  color: #d1d5db;
}

.select-wrapper {
  position: relative;
}

.custom-select-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  background-color: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  transition: all 0.2s;
  cursor: pointer;
  appearance: none;
  outline: none;
}

.dark .custom-select-input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.custom-select-input:hover {
  border-color: #d1d5db;
}

.dark .custom-select-input:hover {
  border-color: #6b7280;
}

.custom-select-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.dark .custom-select-input:focus {
  border-color: #34d399;
}

.select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  transition: all 0.2s;
}

.dark .select-icon {
  color: #6b7280;
}

.select-wrapper:hover .select-icon {
  color: #4b5563;
}

.dark .select-wrapper:hover .select-icon {
  color: #d1d5db;
}

.custom-select-input:focus ~ .select-icon {
  color: #10b981;
  transform: translateY(-50%) rotate(180deg);
}

.dark .custom-select-input:focus ~ .select-icon {
  color: #34d399;
}

/* Estilos para opciones del select */
.custom-select-input option {
  background-color: #ffffff;
  color: #111827;
  padding: 0.5rem 1rem;
}

.dark .custom-select-input option {
  background-color: #374151;
  color: #f3f4f6;
}

.custom-select-input option:hover {
  background-color: #f3f4f6;
}

.dark .custom-select-input option:hover {
  background-color: #4b5563;
}

/* ==========================================
   RESPONSIVE ADJUSTMENTS
   ========================================== */

@media (max-width: 640px) {
  .date-picker-input,
  .custom-select-input {
    padding: 0.625rem 2.5rem 0.625rem 1rem;
    font-size: 0.875rem;
  }
  
  .date-picker-icon,
  .select-icon {
    transform: translateY(-50%) scale(0.9);
  }
  
  .custom-select-input:focus ~ .select-icon {
    transform: translateY(-50%) scale(0.9) rotate(180deg);
  }
}

/* ==========================================
   DARK MODE CALENDAR ICON FIX
   ========================================== */

@media (prefers-color-scheme: dark) {
  .date-picker-input::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
}

/* ==========================================
   ANIMATIONS
   ========================================== */

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.date-picker-group,
.select-group {
  animation: slideDown 0.3s ease-out;
}

/* ==========================================
   LOADER SPINNER ANIMATION
   ========================================== */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>