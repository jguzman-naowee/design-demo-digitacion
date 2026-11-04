# design-demo-digitacion

Demo de diseño de la **digitación de resultados** (Naowee · Ministerio del Deporte). Muestra cambios sobre la pantalla real de `suite-web-v2` (`features/digitacion`) y no consulta ningún servicio: los datos son de ejemplo.

Estático: HTML, CSS y JS planos, sin build. Funciona en GitHub Pages (`.nojekyll` incluido). Usa los estilos de `@naowee-tech/sdk-frontend-foundations` (MIT) copiados a `_assets/`, con el mismo marcado `nwt-*` del SDK.

## Caso: juego limpio (PROD-39, JIN 2026)

El contador se suma a lo que la digitación ya muestra. Selector de los 7 deportes de conjunto, cada uno con su tabla de puntos. Lo que la digitación aún no registra queda como «Falta construir» o «Por confirmar». Spec: `nao-spec-design/specs/deporte/digitacion`.

- `?rol=digitador|coordinador`: el coordinador ve «Corregir resultado».
- `?deporte=<id>`: `futbol`, `futbol-sala`, `futbol-salon`, `baloncesto`, `baloncesto-3x3`, `balonmano`, `voleibol`.
- `window.DEMO.restablecer()`: vuelve al estado inicial (lo usa el marco `design-layouts-demos`).

## Correr en local

```bash
python3 -m http.server 8780   # http://localhost:8780
```

Para refrescar los estilos del SDK: `NPM_TOKEN=$(gh auth token) npm install && npm run foundations`.
