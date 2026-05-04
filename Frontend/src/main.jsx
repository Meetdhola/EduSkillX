import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import UserContext from './context/userContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContext>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </UserContext>
  </StrictMode>,
)
