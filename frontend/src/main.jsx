import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import "@fontsource/quicksand/500.css"; // Medium
import "@fontsource/quicksand/700.css"; // Bold

import "@fontsource-variable/nunito-sans/wght.css";

if (typeof window !== 'undefined') {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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

  window.addEventListener('load', () => {
    setTimeout(() => {
      document.dispatchEvent(new Event('render-event'))
    }, 500)
  })
}


export async function prerender(data) {
  const { default: ReactDOMServer } = await import('react-dom/server')
  const { StaticRouter } = await import('react-router-dom/server')
  const { HelmetProvider } = await import('react-helmet-async')

  const helmetContext = {}

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={data.url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  )

  const { helmet } = helmetContext

  return {
    html,
    head: helmet
      ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
      : '',
    links: new Set(),
  }
}