import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/css/app.css'
import App from '@/App.tsx'
import {ThemeProvider} from "@/components/dark-mode/theme-provider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
  </StrictMode>,
)
