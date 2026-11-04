import '@naowee-tech/sdk-frontend-foundations'
import '@naowee-tech/sdk-frontend-foundations/components'
import '@naowee-tech/sdk-frontend-foundations/icons'
import './styles.css'

import { NwtApplication } from '@naowee-tech/sdk-react-components'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NwtApplication>
      <HashRouter>
        <App />
      </HashRouter>
    </NwtApplication>
  </StrictMode>
)
