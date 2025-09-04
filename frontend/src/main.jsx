import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppSimple from './App-Simple.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppSimple />
  </StrictMode>,
)
