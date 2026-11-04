import { NwtTag } from '@naowee-tech/sdk-react-components'

export interface FilaGrupo {
  dif: string
  e: number
  equipo: string
  gc: number
  gf: number
  g: number
  /** JL de los partidos anteriores; el del partido en pantalla se suma aparte. */
  jlPrevio: number
  p: number
  pj: number
  pts: number
}

const COLUMNAS: [string, string][] = [
  ['PJ', 'Partidos jugados'],
  ['G', 'Partidos ganados'],
  ['E', 'Partidos empatados'],
  ['P', 'Partidos perdidos'],
  ['GF', 'Goles a favor'],
  ['GC', 'Goles en contra'],
  ['Dif', 'Diferencia: a favor menos en contra'],
  ['Pts', 'Puntos de la tabla']
]

interface Props {
  filas: FilaGrupo[]
  jlPartido: Record<string, number>
}

export function TablaGrupo({ filas, jlPartido }: Props) {
  return (
    <section aria-label="Resultados del grupo" className="grupo">
      <h3 className="nwt-subtitle-font">Resultados · Grupo A</h3>
      <div className="stat__scroll">
        <table className="stat grupo__tabla">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Equipo</th>
              <th
                scope="col"
                title="Juego limpio: puntos por tarjetas y sanciones. Menos puntos es mejor y desempata"
              >
                <NwtTag nwtSize="small" nwtTheme="informative">
                  JL
                </NwtTag>
              </th>
              {COLUMNAS.map(([c, t]) => (
                <th key={c} scope="col" title={t}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={f.equipo}>
                <td>{i + 1}</td>
                <th scope="row">{f.equipo}</th>
                <td>{f.jlPrevio + (jlPartido[f.equipo] ?? 0)}</td>
                <td>{f.pj}</td>
                <td>{f.g}</td>
                <td>{f.e}</td>
                <td>{f.p}</td>
                <td>{f.gf}</td>
                <td>{f.gc}</td>
                <td>{f.dif}</td>
                <td>
                  <strong>{f.pts}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="nwt-caption-font-regular modal__nota">
        JL es la primera columna de datos. Se actualiza con las tarjetas del partido de arriba.
      </p>
    </section>
  )
}
