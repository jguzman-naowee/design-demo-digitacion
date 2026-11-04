/* Copia los estilos y fuentes de sdk-frontend-foundations (MIT) a _assets/ para que la demo sea estática.
   Uso: NPM_TOKEN=$(gh auth token) npm install && npm run foundations */
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const base = 'node_modules/@naowee-tech/sdk-frontend-foundations'
const pkg = 'url(@naowee-tech/sdk-frontend-foundations/fonts/'
mkdirSync('apps/digitacion/_assets/css', { recursive: true })
mkdirSync('apps/digitacion/_assets/fonts/inter', { recursive: true })
mkdirSync('apps/digitacion/_assets/fonts/icons', { recursive: true })

for (const f of ['styles.css', 'components.min.css'])
  cpSync(`${base}/dist/${f}`, `apps/digitacion/_assets/css/${f}`)
writeFileSync(
  'apps/digitacion/_assets/css/icons.min.css',
  readFileSync(`${base}/dist/icons.min.css`, 'utf8').replaceAll(pkg, 'url(../fonts/')
)
for (const f of ['woff', 'ttf', 'eot', 'svg'])
  cpSync(`${base}/fonts/icons/naotech-icons.${f}`, `apps/digitacion/_assets/fonts/icons/naotech-icons.${f}`)
const pesos = { Light: '100 300', Regular: '400', Medium: '500', SemiBold: '600', Bold: '700' }
let css = ''
for (const [n, w] of Object.entries(pesos)) {
  cpSync(`${base}/fonts/inter/Inter-${n}.ttf`, `apps/digitacion/_assets/fonts/inter/Inter-${n}.ttf`)
  css += `@font-face{font-family:-naotech-sdk-inter;font-style:normal;font-weight:${w};src:url(../fonts/inter/Inter-${n}.ttf) format('truetype')}\n`
}
writeFileSync('apps/digitacion/_assets/css/fuentes.css', css)
console.log('Listo: apps/digitacion/_assets')
