/**
 * Tablas de juego limpio de los siete deportes de conjunto (reglamentos 2026 y Excel de PROD-39) y qué
 * de eso puede registrar hoy la digitación, según César Meneses (2026-11-04). El contador solo suma
 * lo que está en la tabla de su deporte (DIG-CT-01).
 */

const FALTA_TECNICO = 'Aún no se puede registrar: solo se atribuye a jugadores de la nómina'
const FALTA_TIPO = 'Falta el tipo en la digitación: hoy queda como texto libre'
const SIN_CONFIRMAR = 'Por confirmar con César si la digitación lo registra'

const futbol = (azul) => [
  { estado: 'si', etiqueta: 'Tarjeta amarilla', id: 'amarilla', puntos: 10 },
  ...(azul
    ? [{ estado: 'sinConfirmar', etiqueta: 'Tarjeta azul', id: 'azul', nota: SIN_CONFIRMAR, puntos: 15 }]
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
    estado: azul ? 'si' : 'sinConfirmar',
    etiqueta: 'Agresión física o terminación del encuentro',
    id: 'agresion',
    nota: azul ? 'Se registra como descalificación del equipo, por su causa' : SIN_CONFIRMAR,
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
        estado: 'sinConfirmar',
        etiqueta: 'Expulsión por acumulación de faltas',
        expulsa: true,
        id: 'acumulacion',
        nota: SIN_CONFIRMAR,
        puntos: 10
      },
      { estado: 'si', etiqueta: 'Falta técnica', id: 'tecnica', puntos: 20 },
      { estado: 'si', etiqueta: 'Falta antideportiva', id: 'antideportiva', puntos: 30 },
      { estado: 'si', etiqueta: 'Falta descalificadora', expulsa: true, id: 'descalificadora', puntos: 50 },
      {
        estado: 'sinConfirmar',
        etiqueta: 'Descalificación de cuerpo técnico',
        id: 'tecnico',
        nota: SIN_CONFIRMAR,
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
        estado: 'sinConfirmar',
        etiqueta: 'Descalificación por acumulación de antideportivas',
        expulsa: true,
        id: 'acumulacion',
        nota: SIN_CONFIRMAR,
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
        estado: 'sinConfirmar',
        etiqueta: 'Tarjeta azul de jugador',
        expulsa: true,
        id: 'azul',
        nota: SIN_CONFIRMAR,
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
        estado: 'sinConfirmar',
        etiqueta: 'Descalificación de cuerpo técnico',
        id: 'tecnico',
        nota: SIN_CONFIRMAR,
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
        estado: 'sinConfirmar',
        etiqueta: 'Tarjeta amarilla',
        id: 'amarilla',
        nota: SIN_CONFIRMAR,
        puntos: 10
      },
      { estado: 'sinConfirmar', etiqueta: 'Tarjeta roja', id: 'roja', nota: SIN_CONFIRMAR, puntos: 30 },
      {
        estado: 'sinConfirmar',
        etiqueta: 'Expulsión',
        expulsa: true,
        id: 'expulsion',
        nota: SIN_CONFIRMAR,
        puntos: 80
      },
      {
        estado: 'sinConfirmar',
        etiqueta: 'Descalificación',
        expulsa: true,
        id: 'descalificacion',
        nota: SIN_CONFIRMAR,
        puntos: 90
      },
      {
        estado: 'sinConfirmar',
        etiqueta: 'Agresión o terminación (incluye barras y padres)',
        id: 'agresion',
        nota: SIN_CONFIRMAR,
        puntos: 100
      }
    ],
    nombre: 'Voleibol',
    tabla: 'voleibol'
  }
]

window.DEPORTES = DEPORTES
