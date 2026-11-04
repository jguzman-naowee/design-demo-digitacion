import {
  NwtAlert,
  NwtAvatar,
  NwtButton,
  NwtIconButton,
  NwtTabs,
  NwtTag
} from '@naowee-tech/sdk-react-components'
import { useState } from 'react'

import { dobles, type Equipo, PUNTOS, resumen, type Tarjeta, type TipoTarjeta } from '@/lib/juegoLimpio'

type Estado = 'abierto' | 'cerrado' | 'reabierto'

const TABS = [
  { id: 'scoring', label: 'Marcador', value: 'scoring' },
  { id: 'penalties', label: 'Penalizaciones', value: 'penalties' },
  { id: 'disqualifications', label: 'Descalificaciones', value: 'disqualifications' },
  { id: 'statistics', label: 'Estadísticas', value: 'statistics' }
]

interface Props {
  equipos: [Equipo, Equipo]
  marcador: [number, number]
  onTarjetas: (t: Tarjeta[]) => void
  tarjetas: Tarjeta[]
}

export function PartidoModal({ equipos, marcador, onTarjetas, tarjetas }: Props) {
  const [tab, setTab] = useState('statistics')
  const [estado, setEstado] = useState<Estado>('abierto')
  const [menu, setMenu] = useState<{ equipoId: string; tipo: TipoTarjeta } | null>(null)
  const soloLectura = estado === 'cerrado'

  const agregar = (equipoId: string, jugadorId: string, tipo: TipoTarjeta) => {
    onTarjetas([
      ...tarjetas,
      { equipoId, id: Math.max(0, ...tarjetas.map((t) => t.id)) + 1, jugadorId, tipo }
    ])
    setMenu(null)
  }
  const quitar = (equipoId: string, tipo: TipoTarjeta) => {
    const i = tarjetas.map((t) => t.equipoId === equipoId && t.tipo === tipo).lastIndexOf(true)
    if (i >= 0) onTarjetas(tarjetas.filter((_, k) => k !== i))
  }

  /** Un jugador expulsado (dos amarillas o una roja directa) no recibe más tarjetas. */
  const expulsado = (equipoId: string, jugadorId: string) => {
    const propias = tarjetas.filter((t) => t.equipoId === equipoId && t.jugadorId === jugadorId)
    return (
      propias.some((t) => t.tipo === 'rojaDirecta') ||
      propias.filter((t) => t.tipo === 'amarilla').length >= 2
    )
  }

  const nombre = (e: Equipo, id: string) => e.jugadores.find((j) => j.id === id)?.nombre ?? ''

  const conteo = (e: Equipo, tipo: TipoTarjeta) => {
    const por = new Map<string, number>()
    for (const t of tarjetas)
      if (t.equipoId === e.id && t.tipo === tipo) por.set(t.jugadorId, (por.get(t.jugadorId) ?? 0) + 1)
    return [...por.entries()]
  }

  const contador = (e: Equipo, tipo: TipoTarjeta, etiqueta: string) => {
    const lista = conteo(e, tipo)
    const total = lista.reduce((s, [, n]) => s + n, 0)
    const abierto = menu?.equipoId === e.id && menu.tipo === tipo
    return (
      <td className="stat__celda" key={e.id}>
        <div className="stat__contador">
          <NwtIconButton
            ariaLabel={`Quitar ${etiqueta} de ${e.nombre}`}
            disabled={soloLectura || total === 0}
            icon="minus"
            nwtSize="small"
            nwtVariant="mute"
            onClick={() => quitar(e.id, tipo)}
          />
          <span aria-atomic="true" aria-live="polite" className="stat__valor" role="status">
            {total}
          </span>
          <NwtIconButton
            ariaLabel={`Agregar ${etiqueta} a ${e.nombre}`}
            disabled={soloLectura}
            icon="plus"
            nwtSize="small"
            nwtVariant="mute"
            onClick={() => setMenu(abierto ? null : { equipoId: e.id, tipo })}
          />
        </div>
        {abierto && (
          <ul className="stat__menu" role="menu">
            {e.jugadores.map((j) => (
              <li key={j.id} role="none">
                <button
                  className="stat__item"
                  disabled={expulsado(e.id, j.id)}
                  onClick={() => agregar(e.id, j.id, tipo)}
                  role="menuitem"
                  type="button"
                >
                  {j.numero} · {j.nombre}
                  {expulsado(e.id, j.id) ? ' (expulsado)' : ''}
                </button>
              </li>
            ))}
          </ul>
        )}
        {lista.length > 0 && (
          <ul className="stat__quienes">
            {lista.map(([id, n]) => (
              <li key={id}>
                {nombre(e, id)}
                {n > 1 ? ` ×${n}` : ''}
                {tipo === 'amarilla' && n >= 2 && (
                  <span className="stat__nota"> · expulsado por doble amarilla</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </td>
    )
  }

  const derivada = (e: Equipo) => {
    const lista = dobles(tarjetas, e.id)
    return (
      <td className="stat__celda" key={e.id}>
        <div className="stat__contador">
          <span className="stat__valor" role="status">
            {lista.length}
          </span>
        </div>
        <span className="stat__nota">Se deriva de dos amarillas del mismo jugador</span>
      </td>
    )
  }

  const jl = (p: number) => (
    <NwtTag nwtSize="small" nwtTheme="informative">
      JL +{p}
    </NwtTag>
  )

  return (
    <section aria-label="Anotación del partido" className="modal">
      <header className="modal__cabeza">
        <h2 className="nwt-h5-font">Anotar el partido</h2>
        <p className="nwt-caption-font-regular modal__sub">
          Fútbol sala · Fase de grupos · Grupo A · Partido 3
        </p>
        <NwtTabs items={TABS} onChange={setTab} value={tab} />
      </header>

      <div className="modal__cuerpo">
        {estado === 'cerrado' && (
          <NwtAlert icon="lock" nwtTheme="informative" nwtVariant="quiet" visible>
            Partido cerrado: se ve y no se edita. Un coordinador puede reabrirlo.
          </NwtAlert>
        )}
        {estado === 'reabierto' && (
          <NwtAlert icon="info-circle" nwtTheme="warning" nwtVariant="quiet" visible>
            Reabierto por un coordinador. Corrige las tarjetas y vuelve a cerrar: el juego limpio se recalcula
            solo.
          </NwtAlert>
        )}

        <div className="marcador">
          <div className="marcador__lado">
            <NwtAvatar nwtSize="medium" nwtTheme="primary">
              {equipos[0].nombre[0]}
            </NwtAvatar>
            <span>
              <strong>{equipos[0].nombre}</strong>
              <small>{equipos[0].depto}</small>
            </span>
          </div>
          <div aria-hidden="true" className="marcador__centro">
            {marcador[0]} – {marcador[1]}
          </div>
          <div className="marcador__lado marcador__lado--der">
            <NwtAvatar nwtSize="medium" nwtTheme="secondary">
              {equipos[1].nombre[0]}
            </NwtAvatar>
            <span>
              <strong>{equipos[1].nombre}</strong>
              <small>{equipos[1].depto}</small>
            </span>
          </div>
        </div>

        {tab !== 'statistics' && (
          <p className="nwt-caption-font-regular modal__nota">
            Esta pestaña no cambia en este caso. El contador de juego limpio se suma en Estadísticas.
          </p>
        )}

        {tab === 'statistics' && (
          <div className="stat__scroll">
            <table className="stat">
              <thead>
                <tr>
                  <th scope="col">Métrica</th>
                  {equipos.map((e) => (
                    <th key={e.id} scope="col">
                      {e.nombre}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Tarjeta amarilla {jl(PUNTOS.amarilla)}</th>
                  {equipos.map((e) => contador(e, 'amarilla', 'tarjeta amarilla'))}
                </tr>
                <tr>
                  <th scope="row">Roja por doble amarilla {jl(PUNTOS.dobleAmarilla)}</th>
                  {equipos.map((e) => derivada(e))}
                </tr>
                <tr>
                  <th scope="row">Tarjeta roja directa {jl(PUNTOS.rojaDirecta)}</th>
                  {equipos.map((e) => contador(e, 'rojaDirecta', 'tarjeta roja directa'))}
                </tr>
                <tr>
                  <th scope="row">Expulsión de cuerpo técnico {jl(PUNTOS.cuerpoTecnico)}</th>
                  {equipos.map((e) => (
                    <td className="stat__celda" key={e.id}>
                      <span className="stat__nota">
                        Aún no se puede registrar: solo se atribuye a jugadores de la nómina
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="stat__total">
                  <th scope="row">
                    <NwtTag nwtSize="small" nwtTheme="informative">
                      JL
                    </NwtTag>{' '}
                    Juego limpio del partido
                  </th>
                  {equipos.map((e) => (
                    <td className="stat__celda" key={e.id}>
                      <strong aria-live="polite" className="stat__jl" role="status">
                        {resumen(tarjetas, e.id).total}
                      </strong>
                      <span className="stat__nota">Menos es mejor</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="modal__pie">
        {estado === 'abierto' || estado === 'reabierto' ? (
          <NwtButton nwtSize="medium" nwtVariant="loud" onClick={() => setEstado('cerrado')}>
            Cerrar partido
          </NwtButton>
        ) : (
          <NwtButton
            icon="lock-open"
            nwtSize="medium"
            nwtVariant="quiet"
            onClick={() => setEstado('reabierto')}
          >
            Reabrir partido (coordinador)
          </NwtButton>
        )}
      </footer>
    </section>
  )
}
