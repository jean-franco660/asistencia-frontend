import { ref } from 'vue'

/**
 * Composable para manejo de estado de rate limiting
 * @returns {object} Estado y métodos de rate limiting
 */
export function useRateLimiting() {
    const isRateLimited = ref(false)
    const countdown = ref(0)
    let countdownInterval = null

    /**
     * Inicia el countdown de rate limiting
     * @param {number} seconds - Segundos a esperar
     */
    const startCountdown = (seconds) => {
        isRateLimited.value = true
        countdown.value = seconds

        // Limpiar intervalo anterior si existe
        if (countdownInterval) {
            clearInterval(countdownInterval)
        }

        // Iniciar countdown
        countdownInterval = setInterval(() => {
            countdown.value--

            if (countdown.value <= 0) {
                resetRateLimit()
            }
        }, 1000)
    }

    /**
     * Resetea el estado de rate limiting
     */
    const resetRateLimit = () => {
        isRateLimited.value = false
        countdown.value = 0

        if (countdownInterval) {
            clearInterval(countdownInterval)
            countdownInterval = null
        }
    }

    /**
     * Maneja un error 429 de rate limiting
     * @param {object} error - Error de axios
     * @returns {number} Segundos a esperar
     */
    const handleRateLimitError = (error) => {
        // Intentar obtener el tiempo de espera del header Retry-After
        const retryAfter = error.response?.headers?.[' retry-after'] ||
            error.response?.headers?.['retry-after']

        // Si no hay header, usar 60 segundos por defecto
        const waitSeconds = retryAfter ? parseInt(retryAfter) : 60

        startCountdown(waitSeconds)

        return waitSeconds
    }

    return {
        // Estado
        isRateLimited,
        countdown,

        // Métodos
        startCountdown,
        resetRateLimit,
        handleRateLimitError
    }
}
