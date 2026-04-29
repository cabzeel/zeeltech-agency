import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Helmet } from 'react-helmet-async'
import { FiLinkedin, FiInstagram } from 'react-icons/fi'
import PageWrapper from '../components/ui/PageWrapper'
import SectionHeader from '../components/ui/SectionHeader'
import api from '../utils/api'

const values = [
  { title: 'Craftsmanship', desc: 'We treat every project as a work of craft — obsessing over the details that make the difference between good and exceptional.' },
  { title: 'Transparency', desc: 'No surprises. We communicate openly about timelines, costs, and challenges throughout every engagement.' },
  { title: 'Innovation', desc: 'We stay ahead of the curve, adopting emerging technologies and design trends to give our clients a competitive edge.' },
  { title: 'Partnership', desc: 'We are not just vendors — we are invested partners in your success, thinking about your goals as if they were our own.' },
]

export default function About() {
  const [team, setTeam] = useState([])
  useEffect(() => { api.get('/team?isVisible=true').then(r => setTeam(r.data.data)).catch(() => {}) }, [])

  return (
    <PageWrapper>
      <Helmet>
        <title>About Us – Zeeltech Agency</title>
        <meta name="description" content="Learn about Zeeltech Agency — our story, our values, and the talented team behind our digital products." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,180,41,0.07) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>Our Story</span>
            <h1 style={{ maxWidth: 700, margin: '0 auto 1.5rem' }}>
              Built by Builders,<br /><span className="gold-gradient">For Builders</span>
            </h1>
            <p style={{ maxWidth: 580, margin: '0 auto', fontSize: '1.1rem' }}>
              Zeeltech started from a simple belief: great digital products should be accessible to businesses of every size. Founded in Cameroon, we've grown into a team that serves clients across Africa and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section" style={{ background: 'var(--bg-1)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="section-label">Our Mission</span>
              <h2 style={{ marginBottom: '1.5rem' }}>Turning Vision Into <span className="gold-gradient">Reality</span></h2>
              <p style={{ marginBottom: '1rem' }}>
                We founded Zeeltech with a clear mission: help ambitious businesses leverage technology to grow faster, serve customers better, and build lasting digital assets.
              </p>
              <p style={{ marginBottom: '2rem' }}>
                Every project we take on is an opportunity to do something excellent. We don't ship mediocre work — we craft solutions that stand the test of time and drive measurable results.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[['20+', 'Projects'], ['5+', 'Years'], ['4', 'Countries']].map(([n, l]) => (
                  <div key={l} className="glass-gold" style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--gold)' }}>{n}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/5' }}>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700" alt="Team working" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.6) 0%, transparent 50%)' }} />
                <div className="glass" style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', padding: '1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.25rem' }}>Bamenda, Cameroon 🇨🇲</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Serving clients across Africa & beyond</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <style>{`@media(max-width:768px){section .container>div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <SectionHeader label="Our Values" title="The Principles That |Guide Us|" center />
          <div className="grid-2" style={{ gap: '1.25rem' }}>
            {values.map((v, i) => {
              const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
              return (
                <motion.div key={v.title} ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass" style={{ padding: '2rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>{v.title}</h4>
                  <p style={{ fontSize: '0.9rem' }}>{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'var(--bg-1)' }}>
        <div className="container">
          <SectionHeader label="The Team" title="Meet the People Behind |Zeeltech|" subtitle="A small, focused team of designers, engineers, and strategists dedicated to your success." center />
          <div className="grid-4" style={{ gap: '1.5rem' }}>
            {(team.length ? team : Array(4).fill(null)).map((m, i) => (
              <TeamCard key={m?._id || i} member={m} index={i} />
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

function TeamCard({ member, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const isLoading = !member
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }}>
      {isLoading ? (
        <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem' }} />
          <div className="skeleton" style={{ height: 16, width: '60%', margin: '0 auto 0.5rem' }} />
          <div className="skeleton" style={{ height: 12, width: '80%', margin: '0 auto' }} />
        </div>
      ) : (
        <div className="glass" style={{ padding: '1.5rem', textAlign: 'center', transition: 'var(--transition)' }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-gold)'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <img src={member.imgUrl} alt={member.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-gold)', margin: '0 auto 1rem' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>{member.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>{member.position}</div>
          {member.bio && <p style={{ fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '1rem' }}>{member.bio.slice(0, 100)}...</p>}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {member.socialLinks?.linkedin && <a href={member.socialLinks.linkedin} style={{ color: 'var(--text-muted)', fontSize: '1rem' }} onMouseOver={e => e.target.style.color='var(--gold)'} onMouseOut={e => e.target.style.color='var(--text-muted)'}><FiLinkedin /></a>}
            {member.socialLinks?.instagram && <a href={member.socialLinks.instagram} style={{ color: 'var(--text-muted)', fontSize: '1rem' }} onMouseOver={e => e.target.style.color='var(--gold)'} onMouseOut={e => e.target.style.color='var(--text-muted)'}><FiInstagram /></a>}
          </div>
        </div>
      )}
    </motion.div>
  )
}
