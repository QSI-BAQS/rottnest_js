import { App } from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

/**
 * Initial starting point for the react application
 * which will then attach the element to the root
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <App />
  </StrictMode>,
)
