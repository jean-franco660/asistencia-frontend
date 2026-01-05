import api from './api';

/**
 * Cambiar contraseña del usuario autenticado
 */
export const cambiarPassword = async (data) => {
    const response = await api.post('/perfil/cambiar-password', data);
    return response.data;
};

/**
 * Cambiar email del usuario autenticado
 */
export const cambiarEmail = async (data) => {
    const response = await api.post('/perfil/cambiar-email', data);
    return response.data;
};
