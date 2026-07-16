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

  // IMPORTANT: vite-prerender-plugin expects `head` as an object —
  // { title: string, lang?: string, elements: Set<{ type, props }> } —
  // NOT an HTML string. Passing a string here means `head.title` and
  // `head.elements` are both `undefined` inside the plugin, so the
  // injection silently no-ops and every route keeps the base
  // index.html's static <title>/<meta> tags forever. toComponent()
  // (rather than toString()) gives us real {type, props} objects that
  // match what the plugin's serializer expects.
  const head = { elements: new Set() }

  if (helmet) {
    const titleNode = helmet.title.toComponent()[0]
    if (titleNode) {
      const children = titleNode.props?.children
      head.title = Array.isArray(children) ? children.join('') : (children || '')
    }

    for (const el of [...helmet.meta.toComponent(), ...helmet.link.toComponent()]) {
      // Drop react-helmet-async's internal `data-rh` boolean marker and
      // coerce every remaining value to a string — the plugin's enc()
      // calls .replace() directly on each prop value, which throws on
      // non-strings like the boolean `data-rh: true`.
      const { 'data-rh': _rh, ...rest } = el.props || {}
      const props = Object.fromEntries(
        Object.entries(rest).map(([k, v]) => [k, String(v)])
      )
      head.elements.add({ type: el.type, props })
    }
  }

  return { html, head, links: new Set() }
}