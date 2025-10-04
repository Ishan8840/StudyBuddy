import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CamFeed from './CamFeed.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CamFeed />
  </StrictMode>,
)
