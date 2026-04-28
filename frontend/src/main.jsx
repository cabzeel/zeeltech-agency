import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#f0f0f0',
              border: '1px solid rgba(240,180,41,0.3)',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#F0B429', secondary: '#080808' } },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
