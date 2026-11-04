/**
 * SUPUESTO DE LA DEMO (Jorge, 2026-11-04): todas las mediciones de la tabla se dan por registrables, salvo las que
 * César dijo que faltan (cuerpo técnico, amonestación de balonmano, «conducta violenta»). El resto estaba por confirmar.
 *
 * Tablas de juego limpio de los siete deportes de conjunto (reglamentos 2026 y Excel de PROD-39) y qué
 * de eso puede registrar hoy la digitación, según César Meneses (2026-11-04). El contador solo suma
 * lo que está en la tabla de su deporte (DIG-CT-01).
 */

const FALTA_TECNICO = 'Aún no se puede registrar: solo se atribuye a jugadores de la nómina'
const FALTA_TIPO = 'Falta el tipo en la digitación: hoy queda como texto libre'

const futbol = (azul) => [
  { estado: 'si', etiqueta: 'Tarjeta amarilla', id: 'amarilla', puntos: 10 },
  ...(azul
    ? [{ estado: 'si', etiqueta: 'Tarjeta azul', id: 'azul', puntos: 15 }]
    : [
        { derivadaDe: 'amarilla', estado: 'si', etiqueta: 'Roja por doble amarilla', id: 'doble', puntos: 15 }
      ]),
  {
    estado: 'si',
    etiqueta: azul ? 'Tarjeta roja, expulsión o descalificación' : 'Tarjeta roja directa',
    expulsa: true,
    id: 'roja',
    puntos: 30
  },
  {
    estado: 'falta',
    etiqueta: 'Expulsión de cuerpo técnico',
    id: 'tecnico',
    nota: FALTA_TECNICO,
    puntos: 80
  },
  {
    estado: 'si',
    etiqueta: 'Agresión física o terminación del encuentro',
    id: 'agresion',
    puntos: 100
  }
]

const DEPORTES = [
  {
    desempate: 'Primer criterio, después del enfrentamiento directo',
    estadisticas: ['Faltas', 'Tiro de esquina', 'Tiro libre', 'Tiro penal'],
    id: 'futbol',
    mediciones: futbol(false),
    nombre: 'Fútbol',
    tabla: 'futbol'
  },
  {
    desempate: 'Primer criterio, después del enfrentamiento directo',
    estadisticas: ['Faltas', 'Tiro libre', 'Tiro penal'],
    id: 'futbol-sala',
    mediciones: futbol(false),
    nombre: 'Fútbol sala',
    tabla: 'futbol'
  },
  {
    desempate: 'Primer criterio, después del enfrentamiento directo',
    estadisticas: ['Faltas', 'Tiro libre', 'Tiro penal'],
    id: 'futbol-salon',
    mediciones: futbol(true),
    nombre: 'Fútbol de salón',
    tabla: 'futbol'
  },
  {
    desempate: 'Primer criterio, después del enfrentamiento directo',
    estadisticas: ['Faltas', 'Tiros libres', 'Triples'],
    id: 'baloncesto',
    mediciones: [
      {
        estado: 'si',
        etiqueta: 'Expulsión por acumulación de faltas',
        expulsa: true,
        id: 'acumulacion',
        puntos: 10
      },
      { estado: 'si', etiqueta: 'Falta técnica', id: 'tecnica', puntos: 20 },
      { estado: 'si', etiqueta: 'Falta antideportiva', id: 'antideportiva', puntos: 30 },
      { estado: 'si', etiqueta: 'Falta descalificadora', expulsa: true, id: 'descalificadora', puntos: 50 },
      {
        estado: 'si',
        etiqueta: 'Descalificación de cuerpo técnico',
        id: 'tecnico',
        puntos: 80
      },
      {
        estado: 'falta',
        etiqueta: 'Conducta violenta o terminación del encuentro',
        id: 'agresion',
        nota: FALTA_TIPO,
        puntos: 100
      }
    ],
    nombre: 'Baloncesto',
    tabla: 'baloncesto'
  },
  {
    desempate: 'Después de «más puntos anotados en promedio»',
    estadisticas: ['Faltas', 'Tiros libres'],
    id: 'baloncesto-3x3',
    mediciones: [
      { estado: 'si', etiqueta: 'Falta antideportiva', id: 'antideportiva', puntos: 20 },
      { estado: 'si', etiqueta: 'Falta descalificadora', expulsa: true, id: 'descalificadora', puntos: 30 },
      {
        estado: 'si',
        etiqueta: 'Descalificación por acumulación de antideportivas',
        expulsa: true,
        id: 'acumulacion',
        puntos: 50
      },
      {
        estado: 'falta',
        etiqueta: 'Conducta violenta o terminación del encuentro',
        id: 'agresion',
        nota: FALTA_TIPO,
        puntos: 100
      }
    ],
    nombre: 'Baloncesto 3x3',
    tabla: 'baloncesto'
  },
  {
    desempate: 'Primer criterio, después del enfrentamiento directo',
    estadisticas: ['Tiros', 'Paradas', 'Pérdidas'],
    id: 'balonmano',
    mediciones: [
      {
        estado: 'falta',
        etiqueta: 'Tarjeta amarilla de jugador',
        id: 'amarilla',
        nota: FALTA_TIPO,
        puntos: 10
      },
      { estado: 'si', etiqueta: 'Exclusión de jugador (2 minutos)', id: 'exclusion', puntos: 15 },
      { estado: 'si', etiqueta: 'Descalificación de jugador (roja)', expulsa: true, id: 'roja', puntos: 25 },
      {
        estado: 'si',
        etiqueta: 'Tarjeta azul de jugador',
        expulsa: true,
        id: 'azul',
        puntos: 40
      },
      {
        estado: 'falta',
        etiqueta: 'Tarjeta amarilla de cuerpo técnico',
        id: 'amarillaTecnico',
        nota: FALTA_TIPO,
        puntos: 60
      },
      {
        estado: 'si',
        etiqueta: 'Descalificación de cuerpo técnico',
        id: 'tecnico',
        puntos: 100
      }
    ],
    nombre: 'Balonmano',
    tabla: 'futbol'
  },
  {
    desempate: 'Quinto criterio, antes del sorteo',
    estadisticas: ['Aces', 'Bloqueos', 'Errores de saque'],
    id: 'voleibol',
    mediciones: [
      {
        estado: 'si',
        etiqueta: 'Tarjeta amarilla',
        id: 'amarilla',
        puntos: 10
      },
      { estado: 'si', etiqueta: 'Tarjeta roja', id: 'roja', puntos: 30 },
      {
        estado: 'si',
        etiqueta: 'Expulsión',
        expulsa: true,
        id: 'expulsion',
        puntos: 80
      },
      {
        estado: 'si',
        etiqueta: 'Descalificación',
        expulsa: true,
        id: 'descalificacion',
        puntos: 90
      },
      {
        estado: 'si',
        etiqueta: 'Agresión o terminación (incluye barras y padres)',
        id: 'agresion',
        puntos: 100
      }
    ],
    nombre: 'Voleibol',
    tabla: 'voleibol'
  }
]

window.DEPORTES = DEPORTES
