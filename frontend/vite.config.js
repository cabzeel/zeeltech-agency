import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'
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

function getRoutes() {
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
  return routes
}

export default defineConfig(() => {
  const isPrerenderBuild = process.env.PRERENDER === '1'

  return {
    plugins: [
      react(),
      // vitePrerenderPlugin uses Node/ReactDOMServer — no Chrome, no Puppeteer
      isPrerenderBuild && vitePrerenderPlugin({
        prerenderScript: resolve(__dirname, 'src/main.jsx'),
        renderTarget: '#root',
        additionalPrerenderRoutes: getRoutes(),
      }),
    ].filter(Boolean),

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
            'vendor-react':  ['react', 'react-dom'],
            'vendor-router': ['react-router-dom'],
            'vendor-motion': ['framer-motion'],
            'vendor-icons':  ['react-icons'],
            'vendor-misc':   ['axios', 'date-fns', 'react-helmet-async', 'react-hot-toast', 'react-intersection-observer'],
          },
        },
      },
    },
  }
})