import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CombinedTracker from './components/CombinedTracker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CombinedTracker />
  </StrictMode>,
)
