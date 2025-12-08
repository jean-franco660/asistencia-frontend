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
