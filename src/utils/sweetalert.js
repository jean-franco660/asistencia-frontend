import Swal from 'sweetalert2'

export function useAlert() {
  return {
    success(title = 'Éxito', text = '') {
      return Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonColor: '#10B981',
        background: 'rgba(255,255,255,0.95)',
      })
    },

    error(title = 'Error', text = '') {
      return Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonColor: '#EF4444',
        background: 'rgba(255,255,255,0.95)',
      })
    },

    warning(title = 'Advertencia', text = '') {
      return Swal.fire({
        title,
        text,
        icon: 'warning',
        confirmButtonColor: '#F59E0B',
        background: 'rgba(255,255,255,0.95)',
      })
    },

    toastSuccess(message = 'Operación exitosa') {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      })
    },

    confirm(title = '¿Estás seguro?', text = '', confirmText = 'Aceptar', cancelText = 'Cancelar') {
      return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: '#2563EB',
        cancelButtonColor: '#6B7280',
        background: 'rgba(255,255,255,0.95)',
      })
    },

    async confirmDelete(msg = '¿Seguro de eliminar este registro?') {
      return Swal.fire({
        title: 'Confirmar eliminación',
        text: msg,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#DC2626',
        cancelButtonColor: '#6B7280',
      })
    },

    // ✅ Prompt para solicitar texto con MEJOR DISEÑO
    prompt(title = 'Ingrese un valor', text = '', input = 'text', confirmText = 'Aceptar', cancelText = 'Cancelar') {
      return Swal.fire({
        title: `<h3 class="text-xl font-bold text-gray-800 dark:text-white">${title}</h3>`,
        html: `<p class="text-sm text-gray-600 dark:text-gray-300 mb-4">${text}</p>`,
        input,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: '#3B82F6', // Blue-500
        cancelButtonColor: '#6B7280', // Gray-500
        background: '#ffffff', // Se puede ajustar para modo oscuro dinámicamente si se intecepta el tema
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800',
          input: 'rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
          confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-transform hover:scale-105',
          cancelButton: 'px-5 py-2.5 rounded-xl font-bold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-transform hover:scale-105'
        },
        buttonsStyling: false, // Importante para usar las clases de Tailwind en los botones
        inputValidator: (value) => {
          if (!value) {
            return 'Este campo es requerido'
          }
        }
      })
    },

    // ✅ Loading para procesos largos (logout, fetch, submit)
    loading(message = 'Procesando...') {
      return Swal.fire({
        title: message,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: 'rgba(255,255,255,0.95)',
      });
    },

    // ✅ Cerrar cualquier Swal abierto
    close() {
      return Swal.close();
    },
  }
}
