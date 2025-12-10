<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Gestión de Horarios</h1>

    <CardComponent>
      <!-- Filtro por institución -->
      <div class="mb-4">
        <label class="label">Filtrar por Institución</label>
        <select v-model="filtroInstitucion" @change="loadHorarios" class="input-field">
          <option value="">Todas las instituciones</option>
          <option v-for="inst in instituciones" :key="inst.id" :value="inst.id">
            {{ inst.nombre }}
          </option>
        </select>
      </div>

      <ButtonComponent variant="primary" @click="openModal('create')">
        + Nuevo Horario
      </ButtonComponent>

      <!-- Tabla -->
      <LoadingSpinner v-if="loading" />

      <div v-else-if="horarios.length === 0" class="text-center py-8 text-gray-500">
        No hay horarios registrados
      </div>

      <div v-else class="mt-4 overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-2 text-left">Institución</th>
              <th class="px-4 py-2 text-left">Turno</th>
              <th class="px-4 py-2 text-left">Entrada</th>
              <th class="px-4 py-2 text-left">Salida</th>
              <th class="px-4 py-2 text-left">Tolerancia</th>
              <th class="px-4 py-2 text-left">Días</th>
              <th class="px-4 py-2 text-center">Estado</th>
              <th class="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="horario in horarios"
              :key="horario.id"
              class="border-b dark:border-gray-700"
            >
              <td class="px-4 py-2">{{ horario.institucion?.nombre }}</td>
              <td class="px-4 py-2">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="getTurnoClass(horario.nombre_turno)"
                >
                  {{ capitalize(horario.nombre_turno) }}
                </span>
              </td>
              <td class="px-4 py-2 font-mono">
                {{ format24to12(horario.hora_entrada) }}
              </td>
              <td class="px-4 py-2 font-mono">{{ format24to12(horario.hora_salida) }}</td>
              <td class="px-4 py-2">{{ horario.tolerancia_minutos }} min</td>
              <td class="px-4 py-2">
                <div class="flex gap-1">
                  <span
                    v-for="dia in horario.dias_semana"
                    :key="dia"
                    class="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded text-xs"
                  >
                    {{ dia }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2 text-center">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="
                    horario.activo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  "
                >
                  {{ horario.activo ? "Activo" : "Inactivo" }}
                </span>
              </td>
              <td class="px-4 py-2">
                <div class="flex gap-2 justify-center">
                  <button
                    @click="openModal('edit', horario)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>

                  <button
                    @click="deleteHorario(horario)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardComponent>

    <!-- Modal -->
    <ModalComponent v-model="showModal" :title="modalTitle">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <AlertMessage v-if="error" type="error" :message="error" @close="error = ''" />

        <!-- Institución -->
        <div>
          <label class="label">Institución *</label>
          <select v-model="form.institucion_id" class="input-field" required>
            <option value="">Seleccionar institución</option>
            <option v-for="inst in instituciones" :key="inst.id" :value="inst.id">
              {{ inst.nombre }}
            </option>
          </select>
          <p v-if="errors.institucion_id" class="text-red-500 text-sm mt-1">
            {{ errors.institucion_id }}
          </p>
        </div>

        <!-- Turno -->
        <div>
          <label class="label">Turno *</label>
          <select
            v-model="form.nombre_turno"
            @change="onTurnoChange"
            class="input-field"
            :class="{ 'border-red-500': errors.nombre_turno }"
            required
          >
            <option value="">Seleccionar turno</option>
            <option value="mañana">{{ rangosTurnos.mañana.descripcion }}</option>
            <option value="tarde">{{ rangosTurnos.tarde.descripcion }}</option>
            <option value="noche">{{ rangosTurnos.noche.descripcion }}</option>
          </select>
          <p v-if="errors.nombre_turno" class="text-red-500 text-sm mt-1">
            {{ errors.nombre_turno }}
          </p>
        </div>

        <!-- Hora de Entrada -->
        <div>
          <label class="label">Hora de Entrada *</label>
          <select
            v-model="form.hora_entrada"
            class="input-field"
            :class="{ 'border-red-500': errors.hora_entrada }"
            :disabled="!form.nombre_turno"
            required
          >
            <option value="">Seleccionar hora</option>
            <option
              v-for="opcion in opcionesEntrada"
              :key="opcion.value"
              :value="opcion.value"
            >
              {{ opcion.label }}
            </option>
          </select>
          <p v-if="errors.hora_entrada" class="text-red-500 text-sm mt-1">
            {{ errors.hora_entrada }}
          </p>
        </div>

        <!-- Hora de Salida -->
        <div>
          <label class="label">Hora de Salida *</label>
          <select
            v-model="form.hora_salida"
            class="input-field"
            :class="{ 'border-red-500': errors.hora_salida }"
            :disabled="!form.nombre_turno"
            required
          >
            <option value="">Seleccionar hora</option>
            <option
              v-for="opcion in opcionesSalida"
              :key="opcion.value"
              :value="opcion.value"
            >
              {{ opcion.label }}
            </option>
          </select>
          <p v-if="errors.hora_salida" class="text-red-500 text-sm mt-1">
            {{ errors.hora_salida }}
          </p>
        </div>

        <!-- Tolerancia -->
        <div>
          <label class="label">Tolerancia (minutos) *</label>
          <input
            v-model.number="form.tolerancia_minutos"
            type="number"
            min="0"
            max="60"
            class="input-field"
            required
          />
        </div>

        <!-- Días de la semana -->
        <div>
          <label class="label">Días Laborales *</label>
          <div class="flex gap-2 flex-wrap">
            <label
              v-for="dia in diasSemana"
              :key="dia.value"
              class="flex items-center gap-2 px-3 py-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              :class="{
                'bg-blue-50 border-blue-500': form.dias_semana.includes(dia.value),
              }"
            >
              <input type="checkbox" :value="dia.value" v-model="form.dias_semana" />
              <span>{{ dia.label }}</span>
            </label>
          </div>
          <p v-if="errors.dias_semana" class="text-red-500 text-sm mt-1">
            {{ errors.dias_semana }}
          </p>
        </div>

        <!-- Activo -->
        <div v-if="mode === 'edit'">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="form.activo" />
            <span>Horario activo</span>
          </label>
        </div>

        <!-- Botones -->
        <div class="flex gap-3 justify-end">
          <ButtonComponent variant="secondary" type="button" @click="closeModal">
            Cancelar
          </ButtonComponent>
          <ButtonComponent variant="primary" type="submit" :loading="submitting">
            {{ mode === "create" ? "Crear" : "Actualizar" }}
          </ButtonComponent>
        </div>
      </form>
    </ModalComponent>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { horariosService, institucionesService } from "@/services/api";
import CardComponent from "@/components/ui/UiCard.vue";
import ButtonComponent from "@/components/ui/ButtonComponent.vue";
import ModalComponent from "@/components/ui/ModalComponent.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import AlertMessage from "@/components/ui/AlertMessage.vue";
import {
  format24to12,
  getRangosTurnos12h,
  generarOpcionesHorasPorTurno,
} from "@/utils/timeFormat";

const horarios = ref([]);
const instituciones = ref([]);
const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const mode = ref("create");
const error = ref("");
const filtroInstitucion = ref("");

const rangosTurnos = getRangosTurnos12h();

const diasSemana = [
  { value: "L", label: "Lunes" },
  { value: "M", label: "Martes" },
  { value: "X", label: "Miércoles" },
  { value: "J", label: "Jueves" },
  { value: "V", label: "Viernes" },
  { value: "S", label: "Sábado" },
  { value: "D", label: "Domingo" },
];

const form = reactive({
  id: null,
  institucion_id: "",
  nombre_turno: "",
  hora_entrada: "",
  hora_salida: "",
  tolerancia_minutos: 15,
  dias_semana: ["L", "M", "X", "J", "V"],
  activo: true,
});

const errors = reactive({
  institucion_id: "",
  nombre_turno: "",
  hora_entrada: "",
  hora_salida: "",
  dias_semana: "",
});

const modalTitle = computed(() =>
  mode.value === "create" ? "Nuevo Horario" : "Editar Horario"
);

const opcionesEntrada = computed(() =>
  generarOpcionesHorasPorTurno(form.nombre_turno, 15)
);

const opcionesSalida = computed(() =>
  generarOpcionesHorasPorTurno(form.nombre_turno, 15)
);

const onTurnoChange = () => {
  // Resetear horas cuando cambia el turno
  form.hora_entrada = "";
  form.hora_salida = "";
  errors.hora_entrada = "";
  errors.hora_salida = "";
};

const getTurnoClass = (turno) => {
  const classes = {
    mañana: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
    tarde: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
    noche: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  };
  return classes[turno] || "bg-gray-100 text-gray-700";
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const resetForm = () => {
  form.id = null;
  form.institucion_id = "";
  form.nombre_turno = "";
  form.hora_entrada = "";
  form.hora_salida = "";
  form.tolerancia_minutos = 15;
  form.dias_semana = ["L", "M", "X", "J", "V"];
  form.activo = true;
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  error.value = "";
};

const openModal = (action, horario = null) => {
  resetForm();
  mode.value = action;

  if (action === "edit" && horario) {
    Object.assign(form, {
      id: horario.id,
      institucion_id: horario.institucion_id,
      nombre_turno: horario.nombre_turno,
      hora_entrada: horario.hora_entrada, // Ya viene en formato 24h
      hora_salida: horario.hora_salida,
      tolerancia_minutos: horario.tolerancia_minutos,
      dias_semana: horario.dias_semana,
      activo: horario.activo,
    });
  }

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const handleSubmit = async () => {
  submitting.value = true;
  error.value = "";

  try {
    const payload = {
      institucion_id: form.institucion_id,
      nombre_turno: form.nombre_turno,
      hora_entrada: form.hora_entrada, // Se envía en 24h
      hora_salida: form.hora_salida,
      tolerancia_minutos: form.tolerancia_minutos,
      dias_semana: form.dias_semana,
    };

    if (mode.value === "edit") {
      payload.activo = form.activo;
      await horariosService.update(form.id, payload);
    } else {
      await horariosService.create(payload);
    }

    closeModal();
    await loadHorarios();
  } catch (err) {
    error.value = err.response?.data?.message || "Error al guardar";
    if (err.response?.data?.errors) {
      Object.assign(errors, err.response.data.errors);
    }
  }

  submitting.value = false;
};

const deleteHorario = async (horario) => {
  if (!confirm(`¿Eliminar el horario ${horario.nombre_turno}?`)) return;

  try {
    await horariosService.delete(horario.id);
    await loadHorarios();
  } catch (err) {
    alert("Error al eliminar");
  }
};

const loadHorarios = async () => {
  loading.value = true;
  try {
    const params = filtroInstitucion.value
      ? { institucion_id: filtroInstitucion.value }
      : {};
    const res = await horariosService.getAll(params);
    horarios.value = res.data;
  } catch (err) {
    console.error(err);
  }
  loading.value = false;
};

const loadInstituciones = async () => {
  try {
    const res = await institucionesService.getAll();
    instituciones.value = res.data?.data || res.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  loadHorarios();
  loadInstituciones();
});
</script>
