/**
 * Convierte hora en formato 24h (HH:mm) a formato 12h (hh:mm AM/PM)
 */
export const format24to12 = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, '0')}:${minutes} ${suffix}`;
};

/**
 * Convierte hora en formato 12h (hh:mm AM/PM) a formato 24h (HH:mm)
 */
export const format12to24 = (time12) => {
  if (!time12) return '';
  const [time, period] = time12.split(' ');
  const [hours, minutes] = time.split(':');
  let h = parseInt(hours, 10);

  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;

  return `${h.toString().padStart(2, '0')}:${minutes}`;
};

/**
 * Retorna los rangos de turnos con sus descripciones
 */
export function getRangosTurnos12h() {
  return {
    mañana: {
      descripcion: 'Mañana (06:00 AM - 11:59 AM)',
      inicio: '06:00',
      fin: '11:59'
    },
    tarde: {
      descripcion: 'Tarde (12:00 PM - 05:59 PM)',
      inicio: '12:00',
      fin: '17:59'
    },
    noche: {
      descripcion: 'Noche (06:00 PM - 11:59 PM)',
      inicio: '18:00',
      fin: '23:59'
    }
  };
}

/**
 * Genera opciones de horas para un turno específico con intervalos de X minutos
 */
export function generarOpcionesHorasPorTurno(turno, intervaloMinutos = 15) {
  const rangos = getRangosTurnos12h();
  const rango = rangos[turno];

  if (!rango) return [];

  const opciones = [];
  const [horaInicio, minInicio] = rango.inicio.split(':').map(Number);
  const [horaFin, minFin] = rango.fin.split(':').map(Number);

  let horaActual = horaInicio;
  let minActual = minInicio;

  while (horaActual < horaFin || (horaActual === horaFin && minActual <= minFin)) {
    const time24 = `${horaActual.toString().padStart(2, '0')}:${minActual.toString().padStart(2, '0')}`;
    const time12 = format24to12(time24);

    opciones.push({
      value: time24,
      label: time12
    });

    minActual += intervaloMinutos;
    if (minActual >= 60) {
      minActual = 0;
      horaActual++;
    }
  }

  return opciones;
}
