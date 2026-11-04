/** Fútbol sala, reglamento 2026, art. 4, num. 4. Solo suma lo que está en esta tabla (DIG-CT-01). */
export const PUNTOS = { amarilla: 10, dobleAmarilla: 15, rojaDirecta: 30, cuerpoTecnico: 80 } as const

export interface Jugador {
  id: string
  nombre: string
  numero: number
}

export interface Equipo {
  id: string
  nombre: string
  depto: string
  jugadores: Jugador[]
}

export type TipoTarjeta = 'amarilla' | 'rojaDirecta'

export interface Tarjeta {
  id: number
  equipoId: string
  jugadorId: string
  tipo: TipoTarjeta
}

/** La roja por doble amarilla no se guarda: se deriva de dos amarillas del mismo jugador (César, 2026-11-04). */
export function dobles(tarjetas: Tarjeta[], equipoId: string): Jugador['id'][] {
  const cuenta = new Map<string, number>()
  for (const t of tarjetas) {
    if (t.equipoId === equipoId && t.tipo === 'amarilla')
      cuenta.set(t.jugadorId, (cuenta.get(t.jugadorId) ?? 0) + 1)
  }
  return [...cuenta.entries()].flatMap(([id, n]) => Array.from({ length: Math.floor(n / 2) }, () => id))
}

export function resumen(tarjetas: Tarjeta[], equipoId: string) {
  const propias = tarjetas.filter((t) => t.equipoId === equipoId)
  const amarillas = propias.filter((t) => t.tipo === 'amarilla').length
  const rojas = propias.filter((t) => t.tipo === 'rojaDirecta').length
  const doble = dobles(tarjetas, equipoId).length
  return {
    amarillas,
    rojas,
    doble,
    total: amarillas * PUNTOS.amarilla + doble * PUNTOS.dobleAmarilla + rojas * PUNTOS.rojaDirecta
  }
}
