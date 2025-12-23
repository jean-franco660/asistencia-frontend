// Helper para formatear nombres de instituciones con el prefijo I.E.
export const formatInstitucionNombre = (nombre) => {
    if (!nombre) return '';
    return `I.E. ${nombre}`;
};

// Helper para obtener las iniciales de una institución
export const getInstitucionIniciales = (nombre) => {
    if (!nombre) return '';
    const palabras = nombre.split(' ').filter(p => p.length > 0);
    return palabras.slice(0, 2).map(p => p[0].toUpperCase()).join('.');
};
