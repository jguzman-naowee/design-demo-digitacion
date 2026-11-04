/* Demo de digitación · juego limpio (PROD-39, JIN 2026). Estático: sin servicios ni build. Los datos son de ejemplo.
   Recibe ?rol=digitador|coordinador y ?deporte=<id> (lo usa el marco design-layouts-demos). */
;(function () {
  'use strict'
  var D = window.DEPORTES
  var P = new URLSearchParams(location.search)

  var EQUIPOS = [
    {
      id: 'ant',
      nombre: 'Colegio Demo Antioquia',
      depto: 'ANTIOQUIA',
      jugadores: ['Santiago Ríos', 'Mateo Cano', 'Juan Gómez', 'Luis Tobón', 'David Muñoz']
    },
    {
      id: 'val',
      nombre: 'Colegio Demo Valle',
      depto: 'VALLE',
      jugadores: ['Nicolás Prado', 'Samuel Vega', 'Andrés Cruz', 'Felipe Mejía', 'Tomás Rojas']
    }
  ]
  var TABLAS = {
    futbol: {
      cols: ['PJ', 'G', 'E', 'P', 'GF', 'GC', 'Dif', 'Pts'],
      filas: [
        ['Colegio Demo Antioquia', 1, 1, 0, 0, 5, 1, '+4', 3, 10],
        ['Colegio Demo Valle', 1, 0, 0, 1, 2, 2, '+0', 0, 15],
        ['Colegio Demo Bogotá', 1, 1, 0, 0, 3, 1, '+2', 3, 0],
        ['Colegio Demo Atlántico', 1, 0, 0, 1, 0, 4, '-4', 0, 20]
      ]
    },
    baloncesto: {
      cols: ['PJ', 'G', 'P', 'PF', 'PC', 'Dif', 'Pts'],
      filas: [
        ['Colegio Demo Antioquia', 1, 1, 0, 68, 55, '+13', 3, 10],
        ['Colegio Demo Valle', 1, 0, 1, 55, 68, '-13', 0, 20],
        ['Colegio Demo Bogotá', 1, 1, 0, 72, 60, '+12', 3, 0],
        ['Colegio Demo Atlántico', 1, 0, 1, 60, 72, '-12', 0, 30]
      ]
    },
    voleibol: {
      cols: ['PJ', 'G', 'P', 'SG', 'SP', 'Dif', 'Pts'],
      filas: [
        ['Colegio Demo Antioquia', 1, 1, 0, 3, 0, '+3', 3, 0],
        ['Colegio Demo Valle', 1, 0, 1, 0, 3, '-3', 0, 10],
        ['Colegio Demo Bogotá', 1, 1, 0, 3, 1, '+2', 3, 10],
        ['Colegio Demo Atlántico', 1, 0, 1, 1, 3, '-2', 0, 0]
      ]
    }
  }
  var TIPS = {
    PJ: 'Partidos jugados',
    G: 'Partidos ganados',
    E: 'Partidos empatados',
    P: 'Partidos perdidos',
    GF: 'Goles a favor',
    GC: 'Goles en contra',
    PF: 'Puntos a favor',
    PC: 'Puntos en contra',
    SG: 'Sets ganados',
    SP: 'Sets perdidos',
    Dif: 'Diferencia: a favor menos en contra',
    Pts: 'Puntos de la tabla',
    JL: 'Juego limpio: puntos por tarjetas y sanciones. Menos puntos es mejor y desempata'
  }

  var S = {}
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
    })
  }
  function dep() {
    return D.filter(function (d) {
      return d.id === S.deporte
    })[0]
  }
  function reg(d) {
    return d.mediciones.filter(function (m) {
      return m.estado === 'si' && !m.derivadaDe
    })
  }

  function semilla(d) {
    var r = reg(d),
      t = [],
      id = 1
    function add(eq, j, m) {
      t.push({ id: id++, eq: eq, j: j, m: m })
    }
    if (r[0]) add('ant', 1, r[0].id)
    var base = d.mediciones.filter(function (m) {
      return m.derivadaDe
    })[0]
    if (base) {
      add('val', 2, base.derivadaDe)
      add('val', 2, base.derivadaDe)
    } else if (r[1] || r[0]) add('val', 2, (r[1] || r[0]).id)
    return t
  }
  function inicio() {
    var id = D.some(function (d) {
      return d.id === P.get('deporte')
    })
      ? P.get('deporte')
      : D[0].id
    S = {
      deporte: id,
      rol: P.get('rol') === 'digitador' ? 'digitador' : 'coordinador',
      modal: true,
      tab: 'statistics',
      estado: 'enCurso',
      menu: null,
      tarjetas: [],
      otras: {}
    }
    S.tarjetas = semilla(dep())
  }

  function cuenta(eq, m) {
    return S.tarjetas.filter(function (t) {
      return t.eq === eq && t.m === m
    }).length
  }
  function dobles(eq, m) {
    var c = {},
      out = []
    S.tarjetas.forEach(function (t) {
      if (t.eq === eq && t.m === m.derivadaDe) c[t.j] = (c[t.j] || 0) + 1
    })
    Object.keys(c).forEach(function (j) {
      for (var i = 0; i < Math.floor(c[j] / 2); i++) out.push(j)
    })
    return out
  }
  function expulsado(eq, j) {
    var d = dep(),
      p = S.tarjetas.filter(function (t) {
        return t.eq === eq && t.j === j
      })
    if (
      p.some(function (t) {
        return d.mediciones.filter(function (m) {
          return m.id === t.m
        })[0].expulsa
      })
    )
      return true
    var b = d.mediciones.filter(function (m) {
      return m.derivadaDe
    })[0]
    return (
      !!b &&
      p.filter(function (t) {
        return t.m === b.derivadaDe
      }).length >= 2
    )
  }
  function total(eq) {
    var d = dep()
    return d.mediciones.reduce(function (s, m) {
      if (m.estado !== 'si') return s
      return s + (m.derivadaDe ? dobles(eq, m).length : cuenta(eq, m.id)) * m.puntos
    }, 0)
  }
  function editable() {
    return S.estado !== 'finalizado'
  }

  /* —— marcado de componentes del SDK (mismas clases y atributos que emite sdk-react-components) —— */
  function icono(n) {
    return '<div class="nwt-icon"><i class="naotech-icon-' + n + '"></i></div>'
  }
  function tag(t, tema) {
    return (
      '<span class="nwt-tag" nwt-theme="' + (tema || 'informative') + '" nwt-size="small">' + t + '</span>'
    )
  }
  function boton(txt, acc, o) {
    o = o || {}
    return (
      '<button class="nwt-button" nwt-variant="' +
      (o.v || 'loud') +
      '" nwt-size="medium" data-acc="' +
      acc +
      '"' +
      (o.dis ? ' disabled' : '') +
      '><span class="nwt-button__content">' +
      (o.ico
        ? '<div class="nwt-icon nwt-button__icon"><i class="naotech-icon-' + o.ico + '"></i></div>'
        : '') +
      txt +
      '</span></button>'
    )
  }
  function ib(ico, label, acc, dis) {
    return (
      '<span class="nwt-icon-button' +
      (dis ? ' nwt-icon-button--disabled' : '') +
      '" nwt-variant="mute" nwt-size="small"><button class="nwt-icon-button__content" aria-label="' +
      esc(label) +
      '" data-acc="' +
      acc +
      '"' +
      (dis ? ' disabled' : '') +
      '>' +
      icono(ico) +
      '</button></span>'
    )
  }
  function alerta(txt, tema, ico) {
    return (
      '<div class="nwt-alert nwt-alert--visible" nwt-theme="' +
      tema +
      '" nwt-variant="quiet"><div class="nwt-alert__content"><div class="nwt-alert__icon">' +
      icono(ico) +
      '</div><span class="nwt-alert__label">' +
      txt +
      '</span></div></div>'
    )
  }
  function avatar(t, tema) {
    return (
      '<div class="nwt-avatar" nwt-theme="' +
      tema +
      '" nwt-size="medium" nwt-variant="loud"><div class="nwt-avatar__content">' +
      esc(t) +
      '</div></div>'
    )
  }

  /* —— modal —— */
  function contador(eq, etiqueta, m, simple) {
    var e = EQUIPOS.filter(function (x) {
      return x.id === eq
    })[0]
    var n = simple ? S.otras[eq + '|' + m] || 0 : cuenta(eq, m)
    var bloq = !editable()
    var pls = []
    if (!simple) {
      var por = {}
      S.tarjetas.forEach(function (t) {
        if (t.eq === eq && t.m === m) por[t.j] = (por[t.j] || 0) + 1
      })
      Object.keys(por).forEach(function (j) {
        pls.push('<li>' + esc(e.jugadores[j - 1]) + (por[j] > 1 ? ' ×' + por[j] : '') + '</li>')
      })
    }
    var menu = ''
    if (!simple && S.menu && S.menu.eq === eq && S.menu.m === m) {
      menu =
        '<ul class="dg-menu" role="menu">' +
        e.jugadores
          .map(function (nm, i) {
            var x = expulsado(eq, i + 1)
            return (
              '<li role="none"><button class="dg-menu__item" role="menuitem" data-acc="asignar" data-eq="' +
              eq +
              '" data-m="' +
              m +
              '" data-j="' +
              (i + 1) +
              '"' +
              (x ? ' disabled' : '') +
              '>' +
              (i + 1) +
              ' · ' +
              esc(nm) +
              (x ? ' (expulsado)' : '') +
              '</button></li>'
            )
          })
          .join('') +
        '</ul>'
    }
    return (
      '<td class="dg-celda"><div class="dg-cnt">' +
      ib(
        'minus',
        'Quitar ' + etiqueta + ' de ' + e.nombre,
        'quitar|' + eq + '|' + m + '|' + (simple ? 1 : 0),
        bloq || n === 0
      ) +
      '<span class="dg-val" role="status" aria-live="polite">' +
      n +
      '</span>' +
      ib(
        'plus',
        'Agregar ' + etiqueta + ' a ' + e.nombre,
        'mas|' + eq + '|' + m + '|' + (simple ? 1 : 0),
        bloq
      ) +
      '</div>' +
      menu +
      (pls.length ? '<ul class="dg-quien">' + pls.join('') + '</ul>' : '') +
      '</td>'
    )
  }
  function cabeza() {
    return (
      '<thead><tr><th scope="col">Métrica</th>' +
      EQUIPOS.map(function (e) {
        return '<th scope="col">' + esc(e.nombre) + ' – ' + e.depto + '</th>'
      }).join('') +
      '</tr></thead>'
    )
  }
  function modal() {
    var d = dep(),
      a = EQUIPOS[0],
      b = EQUIPOS[1]
    var tabs = [
      ['scoring', 'Marcador'],
      ['disqualifications', 'Descalificaciones'],
      ['statistics', 'Estadísticas']
    ]
    var h =
      '<div class="nwt-tabs"><div class="nwt-tabs__list" role="tablist"><div class="nwt-tabs__divider"></div>' +
      tabs
        .map(function (t) {
          var act = S.tab === t[0]
          return (
            '<button class="nwt-tabs__tab' +
            (act ? ' nwt-tabs__tab--active' : '') +
            '" role="tab" aria-selected="' +
            act +
            '" data-acc="tab|' +
            t[0] +
            '"><span class="nwt-tabs__label"><span class="nwt-tabs__label-text">' +
            t[1] +
            '</span></span>' +
            (act ? '<div class="nwt-tabs__indicator"></div>' : '') +
            '</button>'
          )
        })
        .join('') +
      '</div></div>'
    var cuerpo = ''
    if (S.estado === 'finalizado' && S.rol === 'digitador')
      cuerpo += alerta(
        'Partido finalizado: se ve y no se edita. Un coordinador puede corregir el resultado.',
        'informative',
        'lock'
      )
    if (S.estado === 'finalizado' && S.rol === 'coordinador')
      cuerpo += alerta(
        'Partido finalizado. Usa «Corregir resultado» para cambiar las tarjetas.',
        'informative',
        'lock'
      )
    if (S.estado === 'corrigiendo')
      cuerpo += alerta(
        'Corrigiendo el resultado. Al guardar, el juego limpio se recalcula solo.',
        'warning',
        'info-circle'
      )
    if (S.tab !== 'statistics') {
      cuerpo +=
        '<p class="dg-nota">Esta pestaña no cambia en este caso. El juego limpio se suma en Estadísticas.</p>'
    } else {
      cuerpo +=
        '<h3 class="nwt-subtitle-font-bold dg-seccion">Estadísticas de juego</h3><div class="dg-scroll"><table class="dg-tabla">' +
        cabeza() +
        '<tbody>' +
        d.estadisticas
          .map(function (s) {
            return (
              '<tr><th scope="row">' +
              esc(s) +
              '</th>' +
              EQUIPOS.map(function (e) {
                return contador(e.id, s.toLowerCase(), s, true)
              }).join('') +
              '</tr>'
            )
          })
          .join('') +
        '</tbody></table></div>'
      cuerpo +=
        '<h3 class="nwt-subtitle-font-bold dg-seccion">Incidencias</h3><div class="dg-scroll"><table class="dg-tabla">' +
        cabeza() +
        '<tbody>' +
        d.mediciones
          .map(function (m) {
            var rot = esc(m.etiqueta) + ' ' + tag('JL +' + m.puntos)
            var fila =
              '<tr><th scope="row">' +
              rot +
              (m.estado !== 'si' ? '<span class="dg-nota">' + esc(m.nota) + '</span>' : '') +
              '</th>'
            if (m.estado !== 'si')
              return (
                fila +
                '<td class="dg-celda dg-celda--off" colspan="2">' +
                tag(
                  m.estado === 'falta' ? 'Falta construir' : 'Por confirmar',
                  m.estado === 'falta' ? 'warning' : 'neutral'
                ) +
                '</td></tr>'
              )
            if (m.derivadaDe)
              return (
                fila +
                EQUIPOS.map(function (e) {
                  return (
                    '<td class="dg-celda"><span class="dg-val" role="status">' +
                    dobles(e.id, m).length +
                    '</span><span class="dg-nota">Se deriva de dos amarillas del mismo jugador</span></td>'
                  )
                }).join('') +
                '</tr>'
              )
            return (
              fila +
              EQUIPOS.map(function (e) {
                return contador(e.id, m.etiqueta.toLowerCase(), m.id, false)
              }).join('') +
              '</tr>'
            )
          })
          .join('') +
        '<tr class="dg-total"><th scope="row">' +
        tag('JL') +
        ' Juego limpio del partido</th>' +
        EQUIPOS.map(function (e) {
          return (
            '<td class="dg-celda"><strong class="dg-jl" role="status" aria-live="polite">' +
            total(e.id) +
            '</strong><span class="dg-nota">Menos es mejor</span></td>'
          )
        }).join('') +
        '</tr></tbody></table></div>'
    }
    var pie = ''
    if (S.estado === 'enCurso') pie += boton('Finalizar partido', 'finalizar')
    else if (S.estado === 'corrigiendo') pie += boton('Guardar corrección', 'guardar')
    else if (S.rol === 'coordinador')
      pie += boton('Corregir resultado', 'corregir', { v: 'quiet', ico: 'edit' })
    pie += boton('Cerrar', 'cerrar', { v: 'mute' })
    return (
      '<div class="nwt-modal nwt-modal--visible dg-modal"><div class="nwt-modal__content"><div class="nwt-modal__header"><div class="nwt-modal__header__description"><span class="nwt-subtitle-font-bold">Juegos Intercolegiados 2026 – ' +
      esc(d.nombre) +
      '</span><span class="nwt-smalltext-font-medium">Fase de grupos · Grupo A · ' +
      esc(a.nombre) +
      ' vs ' +
      esc(b.nombre) +
      '</span></div><span class="nwt-modal__close" data-acc="cerrar">' +
      icono('close') +
      '</span></div><div class="nwt-modal__component">' +
      h +
      '<div class="dg-cuerpo">' +
      cuerpo +
      '</div><div class="dg-pie">' +
      pie +
      '</div></div></div><div class="nwt-modal__backdrop" data-acc="cerrar"></div></div>'
    )
  }

  /* —— página —— */
  function tablaGrupo() {
    var d = dep(),
      T = TABLAS[d.tabla],
      ult = T.cols.length
    return (
      '<section class="dg-card" aria-label="Resultados del grupo"><h2 class="nwt-subtitle-font-bold">Resultados · Grupo A</h2><div class="dg-scroll"><table class="dg-tabla dg-tabla--grupo"><thead><tr><th scope="col">#</th><th scope="col">Equipo</th><th scope="col" title="' +
      esc(TIPS.JL) +
      '">' +
      tag('JL') +
      '</th>' +
      T.cols
        .map(function (c) {
          return '<th scope="col" title="' + esc(TIPS[c]) + '">' + c + '</th>'
        })
        .join('') +
      '</tr></thead><tbody>' +
      T.filas
        .map(function (f, i) {
          var nom = f[0],
            jl =
              f[f.length - 1] +
              (EQUIPOS.filter(function (e) {
                return e.nombre === nom
              }).length
                ? total(
                    EQUIPOS.filter(function (e) {
                      return e.nombre === nom
                    })[0].id
                  )
                : 0)
          return (
            '<tr><td>' +
            (i + 1) +
            '</td><th scope="row">' +
            esc(nom) +
            '</th><td>' +
            jl +
            '</td>' +
            f
              .slice(1, f.length - 1)
              .map(function (v, k) {
                return '<td>' + (k === ult - 1 ? '<strong>' + v + '</strong>' : v) + '</td>'
              })
              .join('') +
            '</tr>'
          )
        })
        .join('') +
      '</tbody></table></div><p class="dg-nota">JL va primero entre los datos. Se actualiza con las tarjetas del partido. Desempate: ' +
      esc(d.desempate.toLowerCase()) +
      '.</p></section>'
    )
  }
  function pagina() {
    var d = dep(),
      a = EQUIPOS[0],
      b = EQUIPOS[1]
    var sel =
      '<div class="nwt-tabs dg-deportes"><div class="nwt-tabs__list" role="tablist" aria-label="Deporte"><div class="nwt-tabs__divider"></div>' +
      D.map(function (x) {
        var act = x.id === S.deporte
        return (
          '<button class="nwt-tabs__tab' +
          (act ? ' nwt-tabs__tab--active' : '') +
          '" role="tab" aria-selected="' +
          act +
          '" data-acc="deporte|' +
          x.id +
          '"><span class="nwt-tabs__label"><span class="nwt-tabs__label-text">' +
          esc(x.nombre) +
          '</span></span>' +
          (act ? '<div class="nwt-tabs__indicator"></div>' : '') +
          '</button>'
        )
      }).join('') +
      '</div></div>'
    var h =
      '<header class="dg-top"><span class="nwt-subtitle-font-bold">SUID · Digitación</span><span class="dg-rol">' +
      tag(S.rol === 'coordinador' ? 'Coordinador' : 'Digitador', 'primary') +
      '</span></header>'
    h +=
      '<main class="dg-main"><div><h1 class="nwt-h4-font">Juego limpio en la digitación</h1><p class="nwt-body-font-regular dg-sub">Elige un deporte para ver cómo se comporta el contador. Las tarjetas son de ejemplo.</p></div>' +
      sel
    h +=
      '<section class="dg-card" aria-label="Partido"><div class="dg-partido"><div class="dg-lado">' +
      avatar(a.nombre[0], 'primary') +
      '<span><strong>' +
      esc(a.nombre) +
      '</strong><small>' +
      a.depto +
      '</small></span></div><div class="dg-marc">2 – 1</div><div class="dg-lado dg-lado--der">' +
      avatar(b.nombre[0], 'secondary') +
      '<span><strong>' +
      esc(b.nombre) +
      '</strong><small>' +
      b.depto +
      '</small></span></div></div>' +
      '<div class="dg-acciones">' +
      (S.estado === 'enCurso'
        ? tag('EN JUEGO', 'informative')
        : tag(
            S.estado === 'corrigiendo' ? 'CORRIGIENDO' : 'FINALIZADO',
            S.estado === 'corrigiendo' ? 'warning' : 'positive'
          )) +
      boton('Estadísticas', 'abrir', { v: 'quiet' }) +
      '</div></section>'
    h += tablaGrupo() + '</main>'
    return h + (S.modal ? modal() : '')
  }

  function pintar() {
    var f =
      document.activeElement &&
      document.activeElement.getAttribute &&
      document.activeElement.getAttribute('data-acc')
    document.getElementById('app').innerHTML = pagina()
    if (f) {
      var n = document.querySelector('[data-acc="' + f + '"]')
      if (n && !n.disabled) n.focus()
    }
  }

  document.addEventListener('click', function (ev) {
    var n = ev.target.closest('[data-acc]')
    if (!n || n.disabled) return
    var p = n.getAttribute('data-acc').split('|'),
      a = p[0]
    if (a === 'deporte') {
      S.deporte = p[1]
      S.tarjetas = semilla(dep())
      S.otras = {}
      S.menu = null
      S.estado = 'enCurso'
    } else if (a === 'tab') S.tab = p[1]
    else if (a === 'abrir') S.modal = true
    else if (a === 'cerrar') {
      S.modal = false
      S.menu = null
    } else if (a === 'corregir') S.estado = 'corrigiendo'
    else if (a === 'finalizar') {
      S.estado = 'finalizado'
      S.menu = null
    } else if (a === 'guardar') {
      S.estado = 'finalizado'
      S.menu = null
    } else if (a === 'mas') {
      if (p[3] === '1') S.otras[p[1] + '|' + p[2]] = (S.otras[p[1] + '|' + p[2]] || 0) + 1
      else S.menu = S.menu && S.menu.eq === p[1] && S.menu.m === p[2] ? null : { eq: p[1], m: p[2] }
    } else if (a === 'quitar') {
      if (p[3] === '1') S.otras[p[1] + '|' + p[2]] = Math.max(0, (S.otras[p[1] + '|' + p[2]] || 0) - 1)
      else {
        for (var i = S.tarjetas.length - 1; i >= 0; i--)
          if (S.tarjetas[i].eq === p[1] && S.tarjetas[i].m === p[2]) {
            S.tarjetas.splice(i, 1)
            break
          }
      }
    } else if (a === 'asignar') {
      S.tarjetas.push({
        id: Date.now(),
        eq: n.getAttribute('data-eq'),
        j: +n.getAttribute('data-j'),
        m: n.getAttribute('data-m')
      })
      S.menu = null
    }
    pintar()
  })

  window.DEMO = {
    restablecer: function () {
      inicio()
      pintar()
    }
  }
  inicio()
  pintar()
})()
