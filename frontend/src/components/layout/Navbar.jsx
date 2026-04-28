import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

const links = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Work' },
  { to: '/blog',     label: 'Blog' },
  { to: '/pricing',  label: 'Pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const location                = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '0.75rem 0' : '1.25rem 0',
        background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #F0B429, #B8860B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#080808',
          }}>Z</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1.1rem', letterSpacing: '0.05em' }}>
            ZEEL<span style={{ color: 'var(--gold)' }}>TECH</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              style={({ isActive }) => ({
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.03em',
                color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                background: isActive ? 'var(--gold-muted)' : 'transparent',
                transition: 'all 0.2s',
              })}
            >{l.label}</NavLink>
          ))}
          <Link to="/contact" className="btn btn-gold" style={{ marginLeft: '0.75rem', padding: '0.5rem 1.25rem' }}>
            Get a Quote
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'none', fontSize: '1.5rem' }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              background: 'rgba(8,8,8,0.97)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div className="container" style={{ padding: '1rem clamp(1rem,4vw,3rem)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {links.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  style={({ isActive }) => ({
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                    background: isActive ? 'var(--gold-muted)' : 'transparent',
                  })}
                >{l.label}</NavLink>
              ))}
              <Link to="/contact" className="btn btn-gold" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </motion.header>
  )
}
