# design-demo-digitacion

Prototipo de diseño de la **digitación de resultados** (Naowee · Ministerio del Deporte). Replica la pantalla real de `suite-web-v2` (`features/digitacion`) y muestra cambios por casos. No consulta ningún servicio.

Casos:

- **Juego limpio** (PROD-39): el contador se suma a lo que la digitación ya muestra. Spec: `nao-spec-design/specs/deporte/digitacion`.

## Correr en local

```bash
NPM_TOKEN=$(gh auth token) npm install   # los paquetes @naowee-tech son privados
npm run dev                              # http://localhost:4710
```

UI siempre con el SDK (`@naowee-tech/sdk-react-components` sobre `foundations`). Textos en español.
