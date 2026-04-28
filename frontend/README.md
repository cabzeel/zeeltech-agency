# Zeeltech Agency – Frontend

A fully responsive React + Vite frontend for the Zeeltech Agency website. Built with modern design aesthetics including glassmorphism, smooth animations, and a dark + gold color palette.

## Tech Stack

- **Framework**: React 18 + Vite 5
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **SEO**: React Helmet Async
- **Notifications**: React Hot Toast
- **Icons**: React Icons (Feather)
- **Date Formatting**: date-fns
- **Fonts**: Cormorant Garamond · Inter · Space Grotesk (Google Fonts)

## Design System

| Token | Value |
|-------|-------|
| Primary accent | `#F0B429` (Gold) |
| Background | `#080808` |
| Surface | `rgba(255,255,255,0.04)` |
| Font (Display) | Cormorant Garamond |
| Font (Body) | Inter |
| Font (Mono/UI) | Space Grotesk |

## Setup

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Edit VITE_API_URL in .env to point to your backend
# Development (with Vite proxy — no env change needed if backend runs on :5000)
npm run dev

# Production build
npm run build
npm run preview
```

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, stats, services, featured work, testimonials, blog preview, CTA |
| `/about` | About | Story, mission, values, team grid |
| `/services` | Services | Full listing with alternating layout |
| `/services/:slug` | ServiceDetail | Full service page with process timeline |
| `/projects` | Projects | Portfolio with category + status filters |
| `/projects/:slug` | ProjectDetail | Full case study with results, gallery, CTA |
| `/blog` | Blog | Listing with search, category filter, pagination |
| `/blog/:slug` | BlogPost | Full article with comments form |
| `/pricing` | Pricing | Tier cards, comparison table, FAQ |
| `/contact` | Contact | Form, info, newsletter subscribe |
| `*` | NotFound | 404 page |

## API Integration

All data is fetched from the backend via `/src/utils/api.js` (Axios instance).

The Vite dev server proxies `/api` → `http://localhost:5000`, so you don't need CORS config during development. For production, set `VITE_API_URL` to your deployed API URL.

## Features

- ✅ Fully SEO-optimized with React Helmet Async (per-page title + meta)
- ✅ Smooth page transitions (Framer Motion `AnimatePresence`)
- ✅ Scroll-triggered entrance animations
- ✅ Glassmorphism cards and navbar
- ✅ Responsive — mobile-first, works on all screen sizes
- ✅ Skeleton loaders for async data
- ✅ Contact form → POST `/api/v1/contacts`
- ✅ Comment form on blog posts → POST `/api/v1/comments`
- ✅ Newsletter subscribe → POST `/api/v1/subscribers/subscribe`
- ✅ View counter on blog posts (incremented by backend)
- ✅ Dynamic categories/status filters on projects + blog
- ✅ Related posts on blog detail
- ✅ Floating particles hero animation
- ✅ Animated stat counters
- ✅ Gold gradient text utility
- ✅ Custom scrollbar styled to gold

## Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── ui/
│       ├── PageWrapper.jsx     ← framer-motion page transitions
│       └── SectionHeader.jsx   ← animated section headers
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── ServiceDetail.jsx
│   ├── Projects.jsx
│   ├── ProjectDetail.jsx
│   ├── Blog.jsx
│   ├── BlogPost.jsx
│   ├── Pricing.jsx
│   ├── Contact.jsx
│   └── NotFound.jsx
├── utils/
│   └── api.js                  ← Axios instance
├── App.jsx                     ← Route definitions
├── main.jsx                    ← Entry point
└── index.css                   ← Global styles & design tokens
```
