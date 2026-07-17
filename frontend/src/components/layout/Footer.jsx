import { Link } from 'react-router-dom'
import { FiLinkedin, FiInstagram, FiTwitter, FiGithub, FiMail, FiFacebook } from 'react-icons/fi'

const footerLinks = {
  Company:  [{ to: '/about', label: 'About Us' }, { to: '/projects', label: 'Our Work' }, { to: '/pricing', label: 'Pricing' }],
  Services: [{ to: '/services/credibility-website', label: 'Credibility-First Websites' }, { to: '/services/quote-generation', label: 'Quote Request Systems' }, { to: '/services/local-seo', label: 'Local SEO Foundation' }],
  Resources:[{ to: '/blog', label: 'Blog' }, { to: '/contact', label: 'Contact' }],
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ padding: '4rem 0 2rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#F0B429,#B8860B)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.1rem',color:'#080808' }}>Z</span>
              <span style={{ fontFamily:'var(--font-mono)',fontWeight:600,fontSize:'1.1rem' }}>ZEEL<span style={{ color:'var(--gold)' }}>TECH</span></span>
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, maxWidth: 280, marginBottom: '1.5rem' }}>
              Websites built for one job: more quote requests for commercial service contractors — built in Cameroon, serving the US, UK, and Canada.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: <FiLinkedin />, href: 'https://www.linkedin.com/in/timchia-cabzeel-29a101261' },
                { icon: <FiInstagram />, href: 'https://www.instagram.com/zeeltechsol_237/' },
                { icon: <FiFacebook />, href: 'https://web.facebook.com/profile.php?id=61585788879290' },
                { icon: <FiGithub />, href: 'https://github.com/cabzeel' },
                { icon: <FiMail />, href: 'mailto:cabzeel@zeeltechsolutions.com' },
              ].map((s, i) => (
                <a key={i} href={s.href} style={{
                  width:36,height:36,borderRadius:8,background:'var(--surface)',border:'1px solid var(--border)',
                  display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:'1rem',
                  transition:'var(--transition)',
                }}
                onMouseOver={e => { e.currentTarget.style.color='var(--gold)'; e.currentTarget.style.borderColor='var(--border-gold)'; }}
                onMouseOut={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border)'; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, items]) => (
            <div key={group}>
              <h4 style={{ fontFamily:'var(--font-mono)',fontSize:'0.8rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--text)',marginBottom:'1.25rem' }}>
                {group}
              </h4>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {items.map(item => (
                  <li key={item.to}>
                    <Link to={item.to} style={{ color:'var(--text-muted)',fontSize:'0.9rem',transition:'var(--transition)' }}
                      onMouseOver={e => e.target.style.color='var(--gold)'}
                      onMouseOut={e => e.target.style.color='var(--text-muted)'}
                    >{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop:'1px solid var(--border)', padding:'1.5rem 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <p style={{ fontSize:'0.82rem', color:'var(--text-dim)' }}>
            © {new Date().getFullYear()} Zeeltech Agency. All rights reserved.
          </p>
          <p style={{ fontSize:'0.82rem', color:'var(--text-dim)' }}>
            Crafted with precision in <span style={{ color:'var(--gold)' }}>Cameroon 🇨🇲</span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer .container > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          footer .container > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}