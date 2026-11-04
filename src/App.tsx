import { NwtCard, NwtTag } from '@naowee-tech/sdk-react-components'
import { useState } from 'react'

import { PartidoModal } from '@/components/PartidoModal'
import { type FilaGrupo, TablaGrupo } from '@/components/TablaGrupo'
import { type Equipo, resumen, type Tarjeta } from '@/lib/juegoLimpio'

const jugadores = (pref: string, nombres: string[]) =>
  nombres.map((nombre, i) => ({ id: `${pref}${i + 1}`, nombre, numero: i + 1 }))

const EQUIPOS: [Equipo, Equipo] = [
  {
    depto: 'Antioquia',
    id: 'ant',
    jugadores: jugadores('a', ['Santiago Ríos', 'Mateo Cano', 'Juan Gómez', 'Luis Tobón', 'David Muñoz']),
    nombre: 'Colegio Demo Antioquia'
  },
  {
    depto: 'Valle',
    id: 'val',
    jugadores: jugadores('v', ['Nicolás Prado', 'Samuel Vega', 'Andrés Cruz', 'Felipe Mejía', 'Tomás Rojas']),
    nombre: 'Colegio Demo Valle'
  }
]

const GRUPO: FilaGrupo[] = [
  {
    dif: '+4',
    e: 0,
    equipo: 'Colegio Demo Antioquia',
    g: 1,
    gc: 1,
    gf: 5,
    jlPrevio: 10,
    p: 0,
    pj: 1,
    pts: 3
  },
  { dif: '+0', e: 0, equipo: 'Colegio Demo Valle', g: 0, gc: 2, gf: 2, jlPrevio: 15, p: 1, pj: 1, pts: 0 },
  { dif: '+2', e: 0, equipo: 'Colegio Demo Bogotá', g: 1, gc: 1, gf: 3, jlPrevio: 0, p: 0, pj: 1, pts: 3 },
  { dif: '-6', e: 0, equipo: 'Colegio Demo Atlántico', g: 0, gc: 4, gf: 0, jlPrevio: 20, p: 1, pj: 1, pts: 0 }
]

export function App() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([
    { equipoId: 'ant', id: 1, jugadorId: 'a2', tipo: 'amarilla' },
    { equipoId: 'val', id: 2, jugadorId: 'v3', tipo: 'amarilla' },
    { equipoId: 'val', id: 3, jugadorId: 'v3', tipo: 'amarilla' }
  ])
  const jlPartido = Object.fromEntries(EQUIPOS.map((e) => [e.nombre, resumen(tarjetas, e.id).total]))

  return (
    <main className="inicio">
      <header>
        <h1 className="nwt-h3-font">Demo de digitación</h1>
        <p className="nwt-body-font-regular">
          Prototipo de la pantalla de anotación de Mi digitación, con el contador de juego limpio sumado
          (PROD-39, JIN 2026). Las tarjetas son de ejemplo.
        </p>
        <NwtTag nwtSize="small" nwtTheme="neutral">
          Caso: Juego limpio · fútbol sala
        </NwtTag>
      </header>

      <NwtCard nwtSize="medium" nwtVariant="quiet">
        <PartidoModal equipos={EQUIPOS} marcador={[2, 1]} onTarjetas={setTarjetas} tarjetas={tarjetas} />
      </NwtCard>

      <TablaGrupo filas={GRUPO} jlPartido={jlPartido} />
    </main>
  )
}
