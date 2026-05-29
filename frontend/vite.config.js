import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const STATIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/pricing',
  '/contact',
  '/projects',
  '/blog',
]

async function getPrerenderPlugin() {
  if (process.env.PRERENDER !== '1') return null

  // createRequire is called INSIDE this function, AFTER the PRERENDER guard.
  // This means it only runs during production builds — never during vite dev.
  // That's what prevents the "require is not defined in ES module scope" crash.
  const { createRequire } = await import('module')
  const _require = createRequire(import.meta.url)
  const prerender = _require('vite-plugin-prerender')

  const PrerenderPlugin = prerender.default ?? prerender
  const PuppeteerRenderer = prerender.PuppeteerRenderer

  let dynamicRoutes = []
  try {
    const raw = readFileSync(
      resolve(__dirname, 'scripts/dynamic-routes.json'),
      'utf-8'
    )
    dynamicRoutes = JSON.parse(raw)
  } catch {
    console.warn('[prerender] No dynamic-routes.json found — skipping dynamic routes.')
  }

  const routes = [...STATIC_ROUTES, ...dynamicRoutes]
  console.log(`[prerender] Rendering ${routes.length} routes:`, routes)

  return PrerenderPlugin({
    staticDir: resolve(__dirname, 'dist'),
    routes,
    renderer: new PuppeteerRenderer({
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
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            // React core — changes rarely, cached by browser long-term
            'vendor-react': ['react', 'react-dom'],
            // Routing — separate so route changes don't bust the react cache
            'vendor-router': ['react-router-dom'],
            // Framer Motion is huge (~150KB) — isolate it
            'vendor-motion': ['framer-motion'],
            // Icon library is large — only loaded once and cached
            'vendor-icons': ['react-icons'],
            // Remaining smaller utils bundled together
            'vendor-misc': ['axios', 'date-fns', 'react-helmet-async', 'react-hot-toast', 'react-intersection-observer'],
          },
        },
      },
    },
  }
})