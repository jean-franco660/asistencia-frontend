import { ref, reactive } from 'vue';
import { useAlert } from '@/utils/sweetalert';
import { institucionesService } from '@/services/api';

export function useInstitucionesForm(onSuccess) {
    const alert = useAlert();

    const showModal = ref(false);
    const modalMode = ref("create"); // "create" | "edit"
    const submitting = ref(false);
    const logoInput = ref(null);
    const logoPreview = ref(null);
    const logoFile = ref(null);

    const form = reactive({
        id: null,
        codigo_modular_ie: "",
        nombre: "",
        nivel_educativo: "",
        tipo_gestion: "",
        departamento: "",
        provincia: "",
        distrito: "",
        centro_poblado: "",
        direccion: "",
        latitud: null,
        longitud: null,
        radio: 30,
        logo: null,
        remove_logo: false,
    });

    const errors = reactive({
        codigo_modular_ie: "",
        nombre: "",
        distrito: "",
        latitud: "",
        longitud: "",
        radio: "",
        logo: "",
    });

    const openCreateModal = () => {
        resetForm();
        modalMode.value = "create";
        showModal.value = true;
    };

    const openEditModal = (institucion) => {
        Object.assign(form, {
            id: institucion.id,
            codigo_modular_ie: institucion.codigo_modular_ie || "",
            nombre: institucion.nombre || "",
            nivel_educativo: institucion.nivel_educativo || "",
            tipo_gestion: institucion.tipo_gestion || "",
            departamento: institucion.departamento || "",
            provincia: institucion.provincia || "",
            distrito: institucion.distrito || "",
            centro_poblado: institucion.centro_poblado || "",
            direccion: institucion.direccion || "",
            latitud: institucion.latitud,
            longitud: institucion.longitud,
            radio: institucion.radio || 30,
            logo: institucion.logo_url || institucion.logo || null,
            remove_logo: false,
        });
        logoFile.value = null;
        logoPreview.value = null;
        modalMode.value = "edit";
        showModal.value = true;
    };

    const closeModal = () => {
        showModal.value = false;
        resetForm();
    };

    const handleSubmit = async () => {
        // Validación básica
        if (!form.codigo_modular_ie || !form.nombre || !form.latitud || !form.longitud) {
            alert.error("Validación", "Complete los campos obligatorios");
            return;
        }

        submitting.value = true;

        try {
            const formData = new FormData();
            formData.append("codigo_modular_ie", form.codigo_modular_ie);
            formData.append("nombre", form.nombre);
            formData.append("nivel_educativo", form.nivel_educativo || "");
            formData.append("tipo_gestion", form.tipo_gestion || "");
            formData.append("departamento", form.departamento || "");
            formData.append("provincia", form.provincia || "");
            formData.append("distrito", form.distrito || "");
            formData.append("centro_poblado", form.centro_poblado || "");
            formData.append("direccion", form.direccion || "");
            formData.append("latitud", form.latitud);
            formData.append("longitud", form.longitud);
            formData.append("radio", form.radio);

            if (logoFile.value) {
                formData.append("logo", logoFile.value);
            }

            if (form.remove_logo) {
                formData.append("remove_logo", "1");
            }

            if (modalMode.value === "create") {
                await institucionesService.create(formData);
                alert.toastSuccess("Institución creada correctamente");
            } else {
                formData.append("_method", "PUT");
                await institucionesService.update(form.id, formData);
                alert.toastSuccess("Institución actualizada correctamente");
            }

            if (onSuccess) await onSuccess();
            closeModal();
        } catch (err) {
            console.error("Error al guardar institución:", err);
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
                    err.response?.data?.message || "No se pudo guardar la institución"
                );
            }
        } finally {
            submitting.value = false;
        }
    };

    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo
        const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/svg+xml",
        ];
        if (!validTypes.includes(file.type)) {
            errors.logo = "Formato no válido";
            alert.error("Error", "Formato de imagen no válido");
            return;
        }

        logoFile.value = file;
        errors.logo = "";

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
            logoPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const removeLogo = () => {
        logoFile.value = null;
        logoPreview.value = null;
        form.logo = null;
        form.remove_logo = true;
        if (logoInput.value) {
            logoInput.value.value = "";
        }
    };

    const resetForm = () => {
        form.id = null;
        form.codigo_modular_ie = "";
        form.nombre = "";
        form.nivel_educativo = "";
        form.tipo_gestion = "";
        form.departamento = "";
        form.provincia = "";
        form.distrito = "";
        form.centro_poblado = "";
        form.direccion = "";
        form.latitud = null;
        form.longitud = null;
        form.radio = 30;
        form.logo = null;
        form.remove_logo = false;
        logoFile.value = null;
        logoPreview.value = null;
        Object.keys(errors).forEach((k) => (errors[k] = ""));
    };

    return {
        form,
        errors,
        showModal,
        modalMode,
        submitting,
        logoInput,
        logoPreview,
        logoFile,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleLogoChange,
        removeLogo,
    };
}
