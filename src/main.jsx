import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { DarkModeProvider } from './context/DarkModeContext';
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <DarkModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DarkModeProvider>
  </StrictMode>
  </BrowserRouter>
);
