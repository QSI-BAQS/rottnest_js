import { App } from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

(async() => {
  let mod = await import('/home/ahto/Projects/work/uts/rottnest/build/tscheduler/src/t_scheduler/ui/js/Superconducting.mjs');
  let schema = mod.Superconducting2DSchema;

})();


/**
 * Initial starting point for the react application
 * which will then attach the element to the root
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <App />
  </StrictMode>,
)
