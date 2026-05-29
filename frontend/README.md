# ZeelTech SEO — Phase 1: Prerender + Meta Tag Fixes

## What's in this package

| File | What it does |
|------|-------------|
| `vite.config.js` | Enables prerender only during production builds (`PRERENDER=1`) |
| `package.json` | New `build` script: fetches slugs → prerender build |
| `scripts/prerender-routes.mjs` | Hits your live API, collects all blog/service/project slugs, writes `scripts/dynamic-routes.json` |
| `src/main.jsx` | Dispatches `render-event` after React mounts — tells Puppeteer when to snapshot |
| `vercel.json` | Adds proper cache headers; keeps the SPA rewrite fallback |
| `src/pages/BlogPost.jsx` | Fixed: canonical, og:url, og:image fallback, Twitter card, BlogPosting JSON-LD |
| `src/pages/ServiceDetail.jsx` | Fixed: full Helmet (was missing canonical, OG, Twitter, schema) |
| `src/pages/ProjectDetail.jsx` | Fixed: full Helmet (was missing canonical, og:title, og:url, Twitter, schema) |

---

## Integration steps

### 1. Copy files into your project

```
frontend/
  vite.config.js          ← replace existing
  package.json            ← replace existing
  vercel.json             ← replace existing
  scripts/
    prerender-routes.mjs  ← new file
  src/
    main.jsx              ← replace existing
    pages/
      BlogPost.jsx        ← replace existing
      ServiceDetail.jsx   ← replace existing
      ProjectDetail.jsx   ← replace existing
```

### 2. Set your backend URL in Vercel

In your Vercel dashboard → Project → Settings → Environment Variables, add:

```
VITE_BACKEND_URL = https://zeeltech.vercel.app
```

This is already your production URL. The prerender script uses this to fetch slugs at build time.

### 3. Move your OG image off Imgur

Your `og:image` in `index.html` currently points to `https://i.imgur.com/sGLcsrY.png`.

1. Save that image as `frontend/public/og-image.png`
2. Update `index.html`:
   ```html
   <!-- Before -->
   <meta property="og:image" content="https://i.imgur.com/sGLcsrY.png" />
   <!-- After -->
   <meta property="og:image" content="https://zeeltechsolutions.com/og-image.png" />
   ```
3. Do the same for `<link rel="icon">` — save as `frontend/public/favicon.png` and update the tag.

### 4. Test locally

```bash
cd frontend
npm install
npm run build
npm run preview
```

During the build you'll see output like:
```
[prerender-routes] Found 12 dynamic routes:
  /blog/chiropractor-website-tips
  /services/web-design
  ...
[prerender] Rendering 19 routes: [ '/', '/about', '/services', ... ]
```

Check `dist/` — you should see actual HTML files:
```
dist/
  index.html          ← home page, full HTML
  about/index.html
  blog/
    index.html
    chiropractor-website-tips/index.html   ← dynamic route, prerendered!
  services/
    web-design/index.html
  ...
```

Open `dist/index.html` in a text editor — you should see your page content and meta tags in the HTML source, not just `<div id="root"></div>`.

### 5. Verify with Google

After deploying to Vercel:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Use the URL Inspection tool on `https://zeeltechsolutions.com`
3. Click "Test Live URL" → "View Tested Page" → "HTML" tab
4. You should now see your actual page content in the HTML — not a blank div

---

## How the prerender works

```
npm run build
    │
    ├── node scripts/prerender-routes.mjs
    │       Hits: GET https://zeeltech.vercel.app/api/v1/blogs
    │             GET https://zeeltech.vercel.app/api/v1/services
    │             GET https://zeeltech.vercel.app/api/v1/projects
    │       Writes: scripts/dynamic-routes.json
    │
    └── PRERENDER=1 vite build
            Bundles app normally
            Launches Puppeteer (headless Chrome)
            Visits each route on a local server
            Waits for your "render-event" dispatch (500ms after load)
            Snapshots the fully-rendered HTML
            Writes each route as dist/route-path/index.html
```

Vercel serves these static HTML files directly for crawlers.
Real users still get the full React SPA experience.

---

## Troubleshooting

**"Puppeteer not found" error**
`vite-plugin-prerender` bundles Puppeteer. If it errors, run:
```bash
npm install vite-plugin-prerender --save-dev
```

**Dynamic routes not prerendering**
Check that `scripts/dynamic-routes.json` was created after running the build.
If the API was unreachable, it will be an empty array `[]` — only static routes render.
Ensure `VITE_BACKEND_URL` is set correctly in your environment.

**Pages look blank after prerender**
Increase the render delay in `main.jsx` from `500` to `1500`:
```js
setTimeout(() => {
  document.dispatchEvent(new Event('render-event'))
}, 1500)  // give slow API calls more time
```

**Build works locally but fails on Vercel**
Vercel's build environment doesn't have Puppeteer's system dependencies by default.
Add this to your Vercel project settings → Build Command:
```
npx puppeteer browsers install chrome && npm run build
```
Or use the `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` env var and supply the executable path — see `vite-plugin-prerender` docs for the `executablePath` option.
