import { Link } from 'react-router-dom'
import { FiLinkedin, FiInstagram, FiTwitter, FiGithub, FiMail } from 'react-icons/fi'

const footerLinks = {
  Company:  [{ to: '/about', label: 'About Us' }, { to: '/projects', label: 'Our Work' }, { to: '/pricing', label: 'Pricing' }],
  Services: [{ to: '/services/web-development', label: 'Web Development' }, { to: '/services/mobile-app-development', label: 'Mobile Apps' }, { to: '/services/ui-ux-design', label: 'UI/UX Design' }, { to: '/services/digital-marketing', label: 'Digital Marketing' }],
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
              A full-service digital agency crafting exceptional web, mobile, and marketing experiences for ambitious brands.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: <FiLinkedin />, href: '#' },
                { icon: <FiInstagram />, href: '#' },
                { icon: <FiTwitter />, href: '#' },
                { icon: <FiGithub />, href: '#' },
                { icon: <FiMail />, href: 'mailto:hello@zeeltech.com' },
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
