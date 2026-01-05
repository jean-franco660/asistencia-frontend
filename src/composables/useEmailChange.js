import { ref } from 'vue';
import { cambiarEmail } from '@/services/perfilService';
import { useAuthStore } from '@/store/auth';
import Swal from 'sweetalert2';

export function useEmailChange() {
    const authStore = useAuthStore();
    const loading = ref(false);
    const formData = ref({
        current_password: '',
        new_email: ''
    });
    const errors = ref({});

    const resetForm = () => {
        formData.value = {
            current_password: '',
            new_email: ''
        };
        errors.value = {};
    };

    const validateForm = () => {
        errors.value = {};
        let isValid = true;

        if (!formData.value.current_password) {
            errors.value.current_password = 'La contraseña es requerida';
            isValid = false;
        }

        if (!formData.value.new_email) {
            errors.value.new_email = 'El nuevo email es requerido';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.new_email)) {
            errors.value.new_email = 'El email debe ser válido';
            isValid = false;
        }

        return isValid;
    };

    const submitEmailChange = async () => {
        if (!validateForm()) {
            return false;
        }

        loading.value = true;
        errors.value = {};

        try {
            const response = await cambiarEmail(formData.value);

            // Actualizar el email en el store
            if (response.user) {
                authStore.user = response.user;
            }

            await Swal.fire({
                icon: 'success',
                title: '¡Email actualizado!',
                text: 'Tu email ha sido cambiado exitosamente',
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
                    text: 'No se pudo cambiar el email. Intenta nuevamente.',
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
        submitEmailChange
    };
}
