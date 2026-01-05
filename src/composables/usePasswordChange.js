import { ref } from 'vue';
import { cambiarPassword } from '@/services/perfilService';
import Swal from 'sweetalert2';

export function usePasswordChange() {
    const loading = ref(false);
    const formData = ref({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const errors = ref({});

    const resetForm = () => {
        formData.value = {
            current_password: '',
            new_password: '',
            new_password_confirmation: ''
        };
        errors.value = {};
    };

    const validateForm = () => {
        errors.value = {};
        let isValid = true;

        if (!formData.value.current_password) {
            errors.value.current_password = 'La contraseña actual es requerida';
            isValid = false;
        }

        if (!formData.value.new_password) {
            errors.value.new_password = 'La nueva contraseña es requerida';
            isValid = false;
        } else if (formData.value.new_password.length < 8) {
            errors.value.new_password = 'La contraseña debe tener al menos 8 caracteres';
            isValid = false;
        }

        if (formData.value.new_password !== formData.value.new_password_confirmation) {
            errors.value.new_password_confirmation = 'Las contraseñas no coinciden';
            isValid = false;
        }

        return isValid;
    };

    const submitPasswordChange = async () => {
        if (!validateForm()) {
            return false;
        }

        loading.value = true;
        errors.value = {};

        try {
            await cambiarPassword(formData.value);

            await Swal.fire({
                icon: 'success',
                title: '¡Contraseña actualizada!',
                text: 'Tu contraseña ha sido cambiada exitosamente',
                confirmButtonColor: '#4F46E5',
                timer: 3000,
                timerProgressBar: true
            });

            resetForm();
            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors || {};

                const firstError = Object.values(errors.value)[0];
                if (firstError) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de validación',
                        text: Array.isArray(firstError) ? firstError[0] : firstError,
                        confirmButtonColor: '#EF4444'
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cambiar la contraseña. Intenta nuevamente.',
                    confirmButtonColor: '#EF4444'
                });
            }
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        formData,
        errors,
        loading,
        resetForm,
        submitPasswordChange
    };
}
