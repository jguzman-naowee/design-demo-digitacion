# design-demo-digitacion

Demo de diseño de la **digitación de resultados** (Naowee · Ministerio del Deporte). Muestra cambios sobre la pantalla real de `suite-web-v2` (`features/digitacion`) y no consulta ningún servicio: los datos son de ejemplo.

Estático: HTML, CSS y JS planos, sin build. Funciona en GitHub Pages (`.nojekyll` incluido). Usa los estilos de `@naowee-tech/sdk-frontend-foundations` (MIT) con el mismo marcado `nwt-*` del SDK.

## Cómo se usa

La portada es el marco de demos (el de `design-layouts-demos/web`): el diseño a pantalla completa y un botón **Configuraciones** (o ⌘/Ctrl+Shift+L) con:

- **Escenario:** los casos son los 7 deportes de conjunto (fútbol, fútbol sala, fútbol de salón, baloncesto, baloncesto 3x3, balonmano y voleibol), cada uno con su tabla de puntos de juego limpio.
- **Ver como:** digitador (anota el partido en curso) o coordinador (además puede corregir el resultado).
- **Restablecer datos** de la demo.

El modal de anotación no se cierra. Las pestañas Marcador y Descalificaciones no son accionables.

## Caso: juego limpio (PROD-39, JIN 2026)

El contador se suma a lo que la digitación ya muestra. Lo que la digitación aún no registra queda como «Falta construir» o «Por confirmar». Spec: `nao-spec-design/specs/deporte/digitacion`.

## Estructura

- `index.html`, `web.js`, `web.css`, `shared/`: el marco. `apps/index.js` registra la demo.
- `apps/digitacion/`: la demo (`index.html`, `app.json`, `_assets/`). Recibe `?rol=` y `?deporte=` y expone `window.DEMO.restablecer()`.

## Correr en local

```bash
python3 -m http.server 8780   # http://localhost:8780
```

Para refrescar los estilos del SDK: `NPM_TOKEN=$(gh auth token) npm install && npm run foundations`.
