import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static routes that are always prerendered
// Dynamic routes (/blog/:slug, /services/:slug, /projects/:slug)
// are added at build time by scripts/prerender-routes.mjs
// which fetches all published slugs from the live API.
const STATIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/pricing',
  '/contact',
  '/projects',
  '/blog',
]

// vite-plugin-prerender is loaded conditionally so `vite dev` is unaffected.
// The PRERENDER env var is set to "1" only in the production build command.
async function getPrerenderPlugin() {
  if (process.env.PRERENDER !== '1') return null
  const { default: prerender } = await import('vite-plugin-prerender')

  // Pull dynamic routes written by scripts/prerender-routes.mjs
  let dynamicRoutes = []
  try {
    const fs = await import('fs')
    const raw = fs.readFileSync('scripts/dynamic-routes.json', 'utf-8')
    dynamicRoutes = JSON.parse(raw)
  } catch {
    console.warn('[prerender] No dynamic-routes.json found — skipping dynamic routes.')
  }

  const routes = [...STATIC_ROUTES, ...dynamicRoutes]
  console.log(`[prerender] Rendering ${routes.length} routes:`, routes)

  return prerender({
    staticDir: 'dist',
    routes,
    renderer: new prerender.PuppeteerRenderer({
      // Wait until the React tree has settled before snapshotting HTML
      renderAfterDocumentEvent: 'render-event',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }),
  })
}

export default defineConfig(async () => {
  const prerenderPlugin = await getPrerenderPlugin()

  return {
    plugins: [react(), prerenderPlugin].filter(Boolean),
    server: {
      proxy: {
        '/api': {
          target: 'https://zeeltech.vercel.app',
          changeOrigin: true,
        },
      },
    },
    build: {
      // Inline assets under 4 KB so prerendered HTML is more self-contained
      assetsInlineLimit: 4096,
    },
  }
})
