import { ref, computed } from 'vue'

/**
 * Composable para manejo de paginación
 * @param {number} initialPerPage - Registros por página inicial (default: 20)
 * @returns {object} Estado y métodos de paginación
 */
export function usePagination(initialPerPage = 20) {
    const currentPage = ref(1)
    const perPage = ref(initialPerPage)
    const total = ref(0)

    const totalPages = computed(() => {
        return Math.ceil(total.value / perPage.value)
    })

    const hasNextPage = computed(() => {
        return currentPage.value < totalPages.value
    })

    const hasPrevPage = computed(() => {
        return currentPage.value > 1
    })

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
        }
    }

    const nextPage = () => {
        if (hasNextPage.value) {
            currentPage.value++
        }
    }

    const prevPage = () => {
        if (hasPrevPage.value) {
            currentPage.value--
        }
    }

    const setPerPage = (value) => {
        perPage.value = value
        currentPage.value = 1 // Reset a primera página
    }

    const setTotal = (value) => {
        total.value = value
    }

    const reset = () => {
        currentPage.value = 1
        total.value = 0
    }

    return {
        // Estado
        currentPage,
        perPage,
        total,

        // Computados
        totalPages,
        hasNextPage,
        hasPrevPage,

        // Métodos
        goToPage,
        nextPage,
        prevPage,
        setPerPage,
        setTotal,
        reset
    }
}
