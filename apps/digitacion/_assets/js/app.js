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
      jugadores: ['Santiago Ríos', 'Mateo Cano', 'Juan Gómez', 'Luis Tobón', 'David Muñoz'],
      tecnicos: ['Carlos Mora · Entrenador', 'Luis Peña · Asistente']
    },
    {
      id: 'val',
      nombre: 'Colegio Demo Valle',
      depto: 'VALLE',
      jugadores: ['Nicolás Prado', 'Samuel Vega', 'Andrés Cruz', 'Felipe Mejía', 'Tomás Rojas'],
      tecnicos: ['Julián Soto · Entrenador', 'Camilo Ríos · Asistente']
    }
  ]
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
  function equipo(id) {
    return EQUIPOS.filter(function (x) {
      return x.id === id
    })[0]
  }
  function quienes(eq, m) {
    var e = equipo(eq),
      por = {},
      orden = []
    S.tarjetas.forEach(function (t) {
      if (t.eq === eq && t.m === m) {
        if (!por[t.j]) {
          por[t.j] = 0
          orden.push(t.j)
        }
        por[t.j]++
      }
    })
    return orden.map(function (j) {
      return { nombre: j > 100 ? e.tecnicos[j - 101] : e.jugadores[j - 1], n: por[j] }
    })
  }
  /* Jugadores como chips que se acomodan en dos líneas; si son más de cuatro, tres y «+N». Alto fijo. */
  function chips(lista) {
    var todos = lista
      .map(function (x) {
        return x.nombre + (x.n > 1 ? ' ×' + x.n : '')
      })
      .join(', ')
    var ver = lista.length > 4 ? lista.slice(0, 3) : lista
    var h = ver
      .map(function (x) {
        return (
          '<li class="dg-chip"><span class="dg-chip__n">' +
          esc(x.nombre) +
          '</span>' +
          (x.n > 1 ? '<b>×' + x.n + '</b>' : '') +
          '</li>'
        )
      })
      .join('')
    if (lista.length > 4) h += '<li class="dg-chip dg-chip--mas"><b>+' + (lista.length - 3) + '</b></li>'
    return (
      '<ul class="dg-chips" aria-label="Jugadores: ' +
      esc(todos) +
      '" title="' +
      esc(todos) +
      '">' +
      h +
      '</ul>'
    )
  }
  /* Celda con contador − n +. Alto fijo: los jugadores van en chips de dos líneas como máximo. */
  function contador(eq, etiqueta, m, simple) {
    var e = equipo(eq)
    var n = simple ? S.otras[eq + '|' + m] || 0 : cuenta(eq, m)
    var bloq = !editable()
    var q = simple ? '' : chips(quienes(eq, m))
    return (
      '<div class="dg-celda" role="cell"><div class="dg-cnt">' +
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
      (simple ? '' : q) +
      '</div>'
    )
  }
  function cabeza() {
    return (
      '<div class="dg-fila dg-fila--cab" role="row"><div class="dg-rot" role="columnheader">Métrica</div>' +
      EQUIPOS.map(function (e) {
        return (
          '<div class="dg-th" role="columnheader" title="' +
          esc(e.nombre + ' – ' + e.depto) +
          '">' +
          esc(e.nombre) +
          ' – ' +
          e.depto +
          '</div>'
        )
      }).join('') +
      '</div>'
    )
  }
  function fila(clase, rot, celdas) {
    return (
      '<div class="dg-fila ' +
      clase +
      '" role="row"><div class="dg-rot" role="rowheader">' +
      rot +
      '</div>' +
      celdas +
      '</div>'
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
          var act = t[0] === 'statistics'
          return (
            '<button class="nwt-tabs__tab dg-tab-inerte' +
            (act ? ' nwt-tabs__tab--active' : '') +
            '" role="tab" aria-selected="' +
            act +
            '" aria-disabled="' +
            !act +
            '" tabindex="-1" type="button">' +
            '<span class="nwt-tabs__label"><span class="nwt-tabs__label-text">' +
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
    {
      cuerpo +=
        '<h3 class="nwt-subtitle-font-bold dg-seccion">Estadísticas de juego</h3><div class="dg-grid" role="table" aria-label="Estadísticas de juego">' +
        cabeza() +
        d.estadisticas
          .map(function (st) {
            return fila(
              'dg-fila--est',
              '<span class="dg-et">' + esc(st) + '</span>',
              EQUIPOS.map(function (e) {
                return contador(e.id, st.toLowerCase(), st, true)
              }).join('')
            )
          })
          .join('') +
        '</div>'
      cuerpo +=
        '<h3 class="nwt-subtitle-font-bold dg-seccion">Incidencias</h3><div class="dg-grid" role="table" aria-label="Incidencias y juego limpio">' +
        cabeza() +
        d.mediciones
          .map(function (m) {
            var jl = 'JL +' + m.puntos
            var rot =
              '<span class="dg-et">' +
              esc(m.etiqueta) +
              '</span>' +
              '<span class="dg-sub" title="' +
              esc(jl + (m.estado !== 'si' ? ' · ' + m.nota : '')) +
              '"><span class="dg-jl-txt">' +
              jl +
              '</span>' +
              (m.estado !== 'si' ? ' · ' + esc(m.nota) : '') +
              '</span>'
            if (m.estado !== 'si')
              return fila(
                'dg-fila--inc',
                rot,
                '<div class="dg-celda dg-celda--off" role="cell">' +
                  tag('Falta construir', 'warning') +
                  '</div>'
              )
            if (m.derivadaDe)
              return fila(
                'dg-fila--inc',
                rot,
                EQUIPOS.map(function (e) {
                  return (
                    '<div class="dg-celda" role="cell"><div class="dg-cnt dg-cnt--solo"><span class="dg-val" role="status">' +
                    dobles(e.id, m).length +
                    '</span></div><span class="dg-quien">Deriva de dos amarillas</span></div>'
                  )
                }).join('')
              )
            return fila(
              'dg-fila--inc',
              rot,
              EQUIPOS.map(function (e) {
                return contador(e.id, m.etiqueta.toLowerCase(), m.id, false)
              }).join('')
            )
          })
          .join('') +
        '</div>' +
        '<h3 class="nwt-subtitle-font-bold dg-seccion">Juego limpio</h3>' +
        '<p class="dg-explica">Suma los puntos de las mediciones de la tabla de ' +
        esc(d.nombre) +
        '. Gana el criterio quien acumula menos puntos. Cuenta solo en esta fase (Fase de grupos · Grupo A) y no se acumula a la siguiente. En el desempate: ' +
        esc(d.desempate.toLowerCase()) +
        '.</p><div class="dg-grid" role="table" aria-label="Juego limpio del partido">' +
        cabeza() +
        fila(
          'dg-fila--total',
          '<span class="dg-et">' + tag('JL') + ' Total del partido</span>',
          EQUIPOS.map(function (e) {
            return (
              '<div class="dg-celda" role="cell"><strong class="dg-jl" role="status" aria-live="polite">' +
              total(e.id) +
              '</strong><span class="dg-quien">Menos es mejor</span></div>'
            )
          }).join('')
        ) +
        '</div>'
    }
    var pie = ''
    if (S.estado === 'enCurso') pie += boton('Finalizar partido', 'finalizar')
    else if (S.estado === 'corrigiendo') pie += boton('Guardar corrección', 'guardar')
    else if (S.rol === 'coordinador')
      pie += boton('Corregir resultado', 'corregir', { v: 'quiet', ico: 'edit' })
    return (
      '<div class="nwt-modal nwt-modal--visible dg-modal"><div class="nwt-modal__content"><div class="nwt-modal__header"><div class="nwt-modal__header__description"><span class="nwt-subtitle-font-bold">Juegos Intercolegiados 2026 – ' +
      esc(d.nombre) +
      '</span><span class="nwt-smalltext-font-medium">Fase de grupos · Grupo A · ' +
      esc(a.nombre) +
      ' vs ' +
      esc(b.nombre) +
      '</span></div><span class="nwt-modal__close dg-inerte" aria-hidden="true">' +
      icono('close') +
      '</span></div><div class="nwt-modal__component">' +
      h +
      '<div class="dg-cuerpo">' +
      cuerpo +
      '</div><div class="dg-pie">' +
      pie +
      '</div></div></div><div class="nwt-modal__backdrop"></div></div>'
    )
  }

  /* —— página: solo el modal; si se cierra, queda un botón para abrirlo —— */
  function pagina() {
    if (S.modal) return modal()
    return '<main class="dg-vacio">' + boton('Abrir estadísticas', 'abrir') + '</main>'
  }

  /* —— capa flotante: popover de jugadores y badge de feedback. Fuera del modal, así no empuja ni se repinta —— */
  var fx = document.createElement('div')
  fx.id = 'dg-fx'
  document.body.appendChild(fx)
  var pop = null

  function cerrarPop(foco) {
    if (!pop) return
    var a = pop
    pop.el.remove()
    pop = null
    var b = document.querySelector('[data-acc="mas|' + a.eq + '|' + a.m + '|0"]')
    if (b) {
      b.removeAttribute('aria-expanded')
      if (foco) b.focus()
    }
  }
  function abrirPop(btn, eq, m) {
    cerrarPop()
    var e = equipo(eq),
      r = btn.getBoundingClientRect(),
      el = document.createElement('div')
    el.className = 'dg-pop'
    el.setAttribute('role', 'menu')
    var med = dep().mediciones.filter(function (x) {
      return x.id === m
    })[0]
    var staff = !!(med && med.tecnico)
    var lista = staff ? e.tecnicos : e.jugadores,
      base = staff ? 101 : 1
    el.setAttribute('aria-label', (staff ? 'Cuerpo técnico de ' : 'Jugador de ') + e.nombre)
    el.innerHTML =
      '<p class="dg-pop__tit">' +
      (staff ? '¿A qué integrante del cuerpo técnico?' : '¿A qué jugador?') +
      '</p>' +
      lista
        .map(function (nm, i) {
          var x = expulsado(eq, base + i)
          return (
            '<button type="button" class="dg-pop__item" role="menuitem" data-acc="asignar" data-j="' +
            (base + i) +
            '"' +
            (x ? ' disabled' : '') +
            '><span>' +
            (staff ? '' : i + 1 + ' · ') +
            esc(nm) +
            '</span>' +
            (x ? '<small>expulsado</small>' : '') +
            '</button>'
          )
        })
        .join('')
    fx.appendChild(el)
    var w = el.offsetWidth,
      h = el.offsetHeight
    var left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8)
    var top = r.bottom + 6
    if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6)
    el.style.left = left + 'px'
    el.style.top = top + 'px'
    pop = { el: el, eq: eq, m: m, rect: r }
    btn.setAttribute('aria-expanded', 'true')
    var primero = el.querySelector('button:not(:disabled)')
    if (primero) primero.focus()
  }
  /* Badge que sube y se desvanece junto al botón: +N JL (peor) o −N JL (mejor). */
  function flotar(r, delta) {
    if (!delta) return
    var el = document.createElement('span')
    el.className = 'dg-flota'
    el.setAttribute('aria-hidden', 'true')
    el.innerHTML = '<span class="dg-flota__tag">' + (delta > 0 ? '+' : '−') + Math.abs(delta) + ' JL</span>'
    el.style.left = r.left + r.width / 2 + 'px'
    el.style.top = r.top + 'px'
    fx.appendChild(el)
    el.addEventListener('animationend', function () {
      el.remove()
    })
    /* Respaldo: si el navegador no corre la animación (pestaña en segundo plano), no queda colgado */
    setTimeout(function () {
      el.remove()
    }, 2400)
  }

  function pintar() {
    cerrarPop()
    var f =
      document.activeElement &&
      document.activeElement.getAttribute &&
      document.activeElement.getAttribute('data-acc')
    var c = document.querySelector('.nwt-modal__component'),
      st = c ? c.scrollTop : 0
    document.getElementById('app').innerHTML = pagina()
    var c2 = document.querySelector('.nwt-modal__component')
    if (c2) c2.scrollTop = st
    if (f) {
      var n = document.querySelector('[data-acc="' + f + '"]')
      if (n && !n.disabled) n.focus()
    }
  }

  document.addEventListener('click', function (ev) {
    if (pop && !ev.target.closest('.dg-pop') && !ev.target.closest('[data-acc^="mas|"]')) cerrarPop()
    var n = ev.target.closest('[data-acc]')
    if (!n || n.disabled) return
    var p = n.getAttribute('data-acc').split('|'),
      a = p[0]
    if (a === 'mas' && p[3] !== '1') {
      if (pop && pop.eq === p[1] && pop.m === p[2]) cerrarPop(true)
      else abrirPop(n, p[1], p[2])
      return
    }
    if (a === 'asignar') {
      if (!pop) return
      var eq = pop.eq,
        m = pop.m,
        r = pop.rect,
        antes = total(eq)
      S.tarjetas.push({ id: Date.now(), eq: eq, j: +n.getAttribute('data-j'), m: m })
      var delta = total(eq) - antes
      cerrarPop()
      pintar()
      var b = document.querySelector('[data-acc="mas|' + eq + '|' + m + '|0"]')
      if (b) b.focus()
      flotar(r, delta)
      return
    }
    if (a === 'quitar') {
      var r2 = n.getBoundingClientRect(),
        eq2 = p[1],
        antes2 = total(eq2)
      if (p[3] === '1') S.otras[p[1] + '|' + p[2]] = Math.max(0, (S.otras[p[1] + '|' + p[2]] || 0) - 1)
      else
        for (var i = S.tarjetas.length - 1; i >= 0; i--)
          if (S.tarjetas[i].eq === p[1] && S.tarjetas[i].m === p[2]) {
            S.tarjetas.splice(i, 1)
            break
          }
      var d2 = total(eq2) - antes2
      pintar()
      flotar(r2, d2)
      return
    }
    if (a === 'mas') S.otras[p[1] + '|' + p[2]] = (S.otras[p[1] + '|' + p[2]] || 0) + 1
    else if (a === 'deporte') {
      S.deporte = p[1]
      S.tarjetas = semilla(dep())
      S.otras = {}
      S.estado = 'enCurso'
    } else if (a === 'tab') S.tab = p[1]
    else if (a === 'abrir') S.modal = true
    else if (a === 'cerrar') S.modal = false
    else if (a === 'corregir') S.estado = 'corrigiendo'
    else if (a === 'finalizar') S.estado = 'finalizado'
    else if (a === 'guardar') S.estado = 'finalizado'
    pintar()
  })

  document.addEventListener('keydown', function (ev) {
    if (!pop) return
    if (ev.key === 'Escape') {
      ev.preventDefault()
      cerrarPop(true)
    } else if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault()
      var its = [].slice.call(pop.el.querySelectorAll('button:not(:disabled)')),
        i = its.indexOf(document.activeElement)
      its[(i + (ev.key === 'ArrowDown' ? 1 : -1) + its.length) % its.length].focus()
    } else if (ev.key === 'Tab') cerrarPop()
  })
  document.addEventListener(
    'scroll',
    function () {
      cerrarPop()
    },
    true
  )
  window.addEventListener('resize', function () {
    cerrarPop()
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
