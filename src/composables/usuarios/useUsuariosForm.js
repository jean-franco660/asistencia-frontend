import { ref, reactive } from 'vue';
import { useAlert } from '@/utils/sweetalert';
import { usuariosService, institucionesService } from '@/services/api';

export function useUsuariosForm(onSuccess) {
    const alert = useAlert();

    const showModal = ref(false);
    const modalMode = ref("create"); // "create" | "edit"
    const submitting = ref(false);

    const form = reactive({
        id: null,
        apellido_paterno: "",
        apellido_materno: "",
        nombres: "",
        codigo_modular: "",
        dni: "",
        sexo: null,
        acceso_habilitado: true,
        password: "",
        asignaciones: [],
    });

    const openCreateModal = () => {
        Object.assign(form, {
            id: null,
            apellido_paterno: "",
            apellido_materno: "",
            nombres: "",
            codigo_modular: "",
            dni: "",
            sexo: null,
            acceso_habilitado: true,
            password: "",
            asignaciones: [],
        });
        modalMode.value = "create";
        showModal.value = true;
    };

    const openEditModal = (u) => {
        Object.assign(form, {
            id: u.id,
            // En modo edición, los campos vacios indican "no cambiar"
            apellido_paterno: "",
            apellido_materno: "",
            nombres: "",
            codigo_modular: "",
            dni: "",
            sexo: null,
            acceso_habilitado: u.acceso_habilitado ?? true,
            password: "",
            asignaciones: (u.instituciones || [])
                // .filter(inst => inst.pivot?.estado === 'ACTIVO') // REMOVED: Mostrar todas las asignaciones
                .map((inst) => ({
                    institucion_id: inst.id,
                    institucion_search: inst.nombre || "",
                    show_dropdown: false,
                    filtered_instituciones: [],
                    cargo: inst.pivot?.cargo || "",
                    estado: inst.pivot?.estado || "ACTIVO",
                    fecha_inicio: inst.pivot?.fecha_inicio || null,
                    fecha_fin: inst.pivot?.fecha_fin || null,

                    loading_instituciones: false,
                    _debounce: null,
                    _abort: null,

                    _institucion_nombre: inst.nombre || null,
                    _institucion_codigo: inst.codigo_modular_ie || null,
                })),
        });
        modalMode.value = "edit";
        showModal.value = true;
    };

    const closeModal = () => {
        // cancelar requests de asignaciones si se estuvieran ejecutando
        form.asignaciones.forEach((a) => {
            if (a?._abort) a._abort.abort();
            if (a?._debounce) clearTimeout(a._debounce);
        });

        showModal.value = false;
    };

    const handleSubmit = async () => {
        // Validación condicional: solo requeridos en CREATE
        if (modalMode.value === "create") {
            if (!form.apellido_paterno || !form.apellido_materno || !form.nombres) {
                alert.error("Validación", "Los apellidos y nombres son obligatorios");
                return;
            }

            if (!form.codigo_modular) {
                alert.error("Validación", "El código modular es obligatorio");
                return;
            }

            if (!form.dni) {
                alert.error("Validación", "El DNI es obligatorio");
                return;
            }
        }

        if (form.asignaciones.length === 0) {
            alert.error("Validación", "Debe asignar al menos una institución");
            return;
        }

        for (let i = 0; i < form.asignaciones.length; i++) {
            const asig = form.asignaciones[i];
            if (!asig.institucion_id) {
                alert.error("Validación", `La asignación ${i + 1} debe tener una institución`);
                return;
            }
            if (!asig.cargo || asig.cargo.trim() === "") {
                alert.error("Validación", `La asignación ${i + 1} debe tener un cargo`);
                return;
            }
            if (asig.fecha_inicio && asig.fecha_fin && asig.fecha_fin < asig.fecha_inicio) {
                alert.error(
                    "Validación",
                    `En la asignación ${i + 1}, la fecha fin debe ser posterior a la fecha inicio`
                );
                return;
            }
        }

        // Validar duplicados de institución
        const institucionesIds = form.asignaciones.map(a => a.institucion_id);
        const uniqueIds = new Set(institucionesIds);
        if (uniqueIds.size !== institucionesIds.length) {
            alert.error("Validación", "No puede asignar la misma institución más de una vez a un mismo usuario.");
            return;
        }

        submitting.value = true;

        try {
            const payload = {
                acceso_habilitado: form.acceso_habilitado,
                asignaciones: form.asignaciones.map((asig) => ({
                    institucion_id: asig.institucion_id,
                    cargo: asig.cargo,
                    estado: asig.estado,
                    fecha_inicio: asig.fecha_inicio,
                    fecha_fin: asig.fecha_fin,
                })),
            };

            // Solo enviar campos si tienen valor
            if (form.apellido_paterno) payload.apellido_paterno = form.apellido_paterno;
            if (form.apellido_materno) payload.apellido_materno = form.apellido_materno;
            if (form.nombres) payload.nombres = form.nombres;
            if (form.codigo_modular) payload.codigo_modular = form.codigo_modular;
            if (form.dni) payload.dni = form.dni;
            if (form.sexo) payload.sexo = form.sexo;

            if (form.password && form.password.trim() !== "") {
                payload.password = form.password;
                payload.password_confirmation = form.password;
            }

            if (modalMode.value === "create") {
                await usuariosService.create(payload);
                closeModal();
                alert.toastSuccess("Docente creado correctamente");
            } else {
                await usuariosService.update(form.id, payload);
                closeModal();
                alert.toastSuccess("Docente actualizado correctamente");
            }

            if (onSuccess) await onSuccess();
        } catch (err) {
            console.error("Error al guardar docente:", err);
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                let errorMsg = "Errores de validación:\n";
                Object.keys(errors).forEach((key) => {
                    errorMsg += `- ${errors[key][0]}\n`;
                });
                alert.error("Error de validación", errorMsg);
            } else {
                alert.error(
                    "Error",
                    err.response?.data?.message || "No se pudo guardar el docente"
                );
            }
        } finally {
            submitting.value = false;
        }
    };

    // =========================
    // LOGICA DE ASIGNACIONES
    // =========================
    const agregarAsignacion = () => {
        form.asignaciones.push({
            institucion_id: null,
            institucion_search: "",
            show_dropdown: false,
            filtered_instituciones: [],
            cargo: "",
            estado: "INACTIVO",
            fecha_inicio: null,
            fecha_fin: null,
            loading_instituciones: false,
            _debounce: null,
            _abort: null,
        });
    };

    const eliminarAsignacion = (index) => {
        const a = form.asignaciones[index];
        if (a?._abort) a._abort.abort();
        if (a?._debounce) clearTimeout(a._debounce);
        form.asignaciones.splice(index, 1);
    };

    const buscarInstitucionAsignacion = (index) => {
        const asignacion = form.asignaciones[index];
        const term = (asignacion.institucion_search || "").trim();

        asignacion.show_dropdown = true;

        if (!term) {
            asignacion.filtered_instituciones = [];
            return;
        }

        if (asignacion._debounce) clearTimeout(asignacion._debounce);

        asignacion._debounce = setTimeout(async () => {
            if (asignacion._abort) asignacion._abort.abort();
            asignacion._abort = new AbortController();

            asignacion.loading_instituciones = true;

            try {
                let r;
                let instituciones = [];

                try {
                    r = await institucionesService.searchMias(term, 10, {
                        signal: asignacion._abort.signal,
                    });
                } catch (e) {
                    if (e.response?.status === 404) {
                        try {
                            r = await institucionesService.getAll({ buscar: term, limit: 10 });
                        } catch (e2) {
                            try {
                                r = await institucionesService.search(term, 10);
                            } catch (e3) {
                                throw e;
                            }
                        }
                    } else {
                        throw e;
                    }
                }

                if (r.data) {
                    if (Array.isArray(r.data)) {
                        instituciones = r.data;
                    } else if (r.data.data && Array.isArray(r.data.data)) {
                        instituciones = r.data.data;
                    } else if (r.data.instituciones && Array.isArray(r.data.instituciones)) {
                        instituciones = r.data.instituciones;
                    } else if (r.data.data && r.data.data.data && Array.isArray(r.data.data.data)) {
                        instituciones = r.data.data.data;
                    }
                }

                asignacion.filtered_instituciones = instituciones;
            } catch (e) {
                if (e?.name !== "AbortError" && e?.code !== "ERR_CANCELED") {
                    asignacion.filtered_instituciones = [];
                }
            } finally {
                asignacion.loading_instituciones = false;
            }
        }, 300);
    };

    const seleccionarInstitucionAsignacion = (index, institucion) => {
        const asignacion = form.asignaciones[index];
        asignacion.institucion_id = institucion.id;
        asignacion.institucion_search = institucion.nombre;
        // Si tiene horarios (horarios_count > 0), estado ACTIVO, sino INACTIVO
        asignacion.estado = (institucion.horarios_count && institucion.horarios_count > 0) ? "ACTIVO" : "INACTIVO";
        asignacion.show_dropdown = false;
    };

    const limpiarInstitucionAsignacion = (index) => {
        const asignacion = form.asignaciones[index];
        if (asignacion._abort) asignacion._abort.abort();
        if (asignacion._debounce) clearTimeout(asignacion._debounce);

        asignacion.institucion_id = null;
        asignacion.institucion_search = "";
        asignacion.show_dropdown = false;
        asignacion.filtered_instituciones = [];
        asignacion.loading_instituciones = false;
    };

    const hideDropdown = (index) => {
        setTimeout(() => {
            if (form.asignaciones[index]) {
                form.asignaciones[index].show_dropdown = false;
            }
        }, 200);
    }

    return {
        form,
        showModal,
        modalMode,
        submitting,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        agregarAsignacion,
        eliminarAsignacion,
        buscarInstitucionAsignacion,
        seleccionarInstitucionAsignacion,
        limpiarInstitucionAsignacion,
        hideDropdown
    };
}
