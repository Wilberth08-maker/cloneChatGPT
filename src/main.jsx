import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { DarkModeProvider } from './context/DarkModeContext';
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </StrictMode>
  </BrowserRouter>
);
