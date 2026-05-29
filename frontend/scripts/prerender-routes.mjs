#!/usr/bin/env node
/**
 * scripts/prerender-routes.mjs
 *
 * Fetches all published slugs from the ZeelTech API and writes
 * scripts/dynamic-routes.json so vite.config.js can include them
 * in the prerender pass.
 *
 * Run automatically by the build command in package.json:
 *   "build": "node scripts/prerender-routes.mjs && PRERENDER=1 vite build"
 *
 * The script is safe to run in CI — if the API is unreachable it
 * warns and writes an empty array so the build still succeeds with
 * only the static routes prerendered.
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Use the production backend URL. In CI set VITE_BACKEND_URL in your
// Vercel environment variables; locally it falls back to localhost.
const BASE_URL =
  process.env.VITE_BACKEND_URL?.replace(/\/$/, '') ||
  'https://zeeltech.vercel.app'

const API = `${BASE_URL}/api/v1`

async function fetchSlugs(endpoint) {
  try {
    const res = await fetch(`${API}/${endpoint}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    // Support both { data: [...] } and plain array responses
    const items = Array.isArray(json) ? json : json.data ?? json[endpoint] ?? []
    return items.map((item) => item.slug).filter(Boolean)
  } catch (err) {
    console.warn(`[prerender-routes] Could not fetch /${endpoint}: ${err.message}`)
    return []
  }
}

async function main() {
  console.log(`[prerender-routes] Fetching slugs from ${API} …`)

  const [blogSlugs, serviceSlugs, projectSlugs] = await Promise.all([
    fetchSlugs('blogs'),
    fetchSlugs('services'),
    fetchSlugs('projects'),
  ])

  const routes = [
    ...blogSlugs.map((s) => `/blog/${s}`),
    ...serviceSlugs.map((s) => `/services/${s}`),
    ...projectSlugs.map((s) => `/projects/${s}`),
  ]

  console.log(`[prerender-routes] Found ${routes.length} dynamic routes:`)
  routes.forEach((r) => console.log(`  ${r}`))

  const outPath = join(__dirname, 'dynamic-routes.json')
  writeFileSync(outPath, JSON.stringify(routes, null, 2))
  console.log(`[prerender-routes] Written to ${outPath}`)
}

main()
