import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Helmet } from 'react-helmet-async'
import { FiArrowRight, FiCode, FiSmartphone, FiLayout, FiTrendingUp, FiStar, FiChevronRight } from 'react-icons/fi'
import PageWrapper from '../components/ui/PageWrapper'
import SectionHeader from '../components/ui/SectionHeader'
import api from '../utils/api'

/* ─── Animated counter ───────────────────────────────────────────────── */
function Counter({ end, suffix = '', label }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / 60
    const t = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(t) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(t)
  }, [inView, end])

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 600, color: 'var(--gold)' }}>
        {count}{suffix}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
        {label}
      </div>
    </div>
  )
}

/* ─── Service icon map ───────────────────────────────────────────────── */
const icons = { 'web-development': <FiCode />, 'mobile-app-development': <FiSmartphone />, 'ui-ux-design': <FiLayout />, 'digital-marketing': <FiTrendingUp /> }

/* ─── Floating particle background ──────────────────────────────────── */
function HeroParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: 'var(--gold)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.1,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const [services, setServices]         = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [blogs, setBlogs]               = useState([])
  const { scrollY }                     = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 80])

  useEffect(() => {
    api.get('/services?status=active').then(r => setServices(r.data.data)).catch(() => {})
    api.get('/testimonials?status=approved&isFeatured=true').then(r => setTestimonials(r.data.data)).catch(() => {})
    api.get('/blogs?status=published&limit=3').then(r => setBlogs(r.data.data)).catch(() => {})
  }, [])

  return (
    <PageWrapper style={{ paddingTop: 0 }}>
      <Helmet>
        <title>Zeeltech Agency – Digital Excellence</title>
        <meta name="description" content="Full-service digital agency specialising in web development, mobile apps, UI/UX design and digital marketing." />
      </Helmet>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(240,180,41,0.08) 0%, transparent 60%)' }} />
        <div className="orb" style={{ width: 600, height: 600, background: 'var(--gold)', left: '60%', top: '-10%' }} />
        <div className="orb" style={{ width: 400, height: 400, background: '#a855f7', left: '-5%', top: '40%', opacity: 0.1 }} />
        <HeroParticles />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '7rem', paddingBottom: '5rem' }}>
          <motion.div style={{ y: heroY }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', borderRadius: 100, marginBottom: '2rem' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--gold)', textTransform: 'uppercase' }}>Now accepting new clients</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              style={{ marginBottom: '1.5rem', maxWidth: 780 }}
            >
              We Build Digital<br />
              <span className="gold-gradient">Products That</span><br />
              Move Business Forward
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: '1.15rem', maxWidth: 540, marginBottom: '2.5rem' }}
            >
              Zeeltech is a full-service digital agency delivering world-class web applications, mobile apps, and growth strategies for ambitious brands worldwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <Link to="/contact" className="btn btn-gold" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                Start a Project <FiArrowRight />
              </Link>
              <Link to="/projects" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                View Our Work
              </Link>
            </motion.div>

            {/* Logos */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ marginTop: '4rem' }}
            >
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>Trusted by teams at</p>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {['ShopWave', 'TaskFlow', 'MedConnect', 'BrandBoost'].map(name => (
                  <span key={name} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.05em' }}>{name}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, var(--gold))' }} />
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
            <Counter end={50}  suffix="+" label="Projects Delivered" />
            <Counter end={30}  suffix="+"  label="Happy Clients" />
            <Counter end={8}   suffix="+"  label="Years Experience" />
            <Counter end={100} suffix="%" label="Client Satisfaction" />
          </div>
        </div>
        <style>{`@media(max-width:640px){.container>div{grid-template-columns:1fr 1fr!important}}`}</style>
      </section>

      {/* ── SERVICES ── */}
      <section className="section">
        <div className="container">
          <SectionHeader
            label="What We Do"
            title="Services Built for |Digital Growth|"
            subtitle="From concept to launch, we offer end-to-end digital services that transform your vision into a high-performing reality."
          />
          <div className="grid-2" style={{ gap: '1.25rem' }}>
            {(services.length ? services : Array(4).fill(null)).map((s, i) => (
              <ServiceCard key={s?._id || i} service={s} index={i} icon={icons[s?.slug]} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/services" className="btn btn-outline">View All Services <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED WORK ── */}
      <section className="section" style={{ background: 'var(--bg-1)' }}>
        <div className="container">
          <SectionHeader label="Featured Work" title="|Case Studies| That Speak for Themselves" subtitle="Real projects. Real results. Real clients." />
          <FeaturedProjects />
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/projects" className="btn btn-outline">View All Projects <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <SectionHeader label="Client Love" title="Words From |Our Partners|" center />
          <div className="grid-3" style={{ gap: '1.25rem', marginTop: '1rem' }}>
            {testimonials.map((t, i) => <TestimonialCard key={t._id} t={t} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      {blogs.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-1)' }}>
          <div className="container">
            <SectionHeader label="Latest Insights" title="From the |Blog|" subtitle="Tips, trends and deep-dives from our team." />
            <div className="grid-3">
              {blogs.map((b, i) => <BlogCard key={b._id} b={b} index={i} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/blog" className="btn btn-outline">Read the Blog <FiArrowRight /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(240,180,41,0.08) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="section-label" style={{ justifyContent: 'center' }}>Ready to build?</span>
          <h2 style={{ maxWidth: 600, margin: '0 auto 1.5rem' }}>
            Let's Build Something <span className="gold-gradient">Extraordinary</span>
          </h2>
          <p style={{ maxWidth: 500, margin: '0 auto 2.5rem' }}>
            Tell us about your project. We'll respond within 24 hours with a tailored proposal.
          </p>
          <Link to="/contact" className="btn btn-gold" style={{ fontSize: '1rem', padding: '0.9rem 2.25rem' }}>
            Get a Free Consultation <FiArrowRight />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </PageWrapper>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────── */
function ServiceCard({ service, index, icon }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const isLoading = !service
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {isLoading ? (
        <div className="card" style={{ padding: '2rem', height: 200 }}>
          <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, marginBottom: '1rem' }} />
          <div className="skeleton" style={{ width: '60%', height: 20, marginBottom: '0.75rem' }} />
          <div className="skeleton" style={{ width: '90%', height: 14 }} />
        </div>
      ) : (
        <Link to={`/services/${service.slug}`} className="card" style={{ padding: '2rem', display: 'block', textDecoration: 'none' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '1.3rem', marginBottom: '1.25rem' }}>
            {icon || <FiCode />}
          </div>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{service.title}</h4>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{service.subDescription}</p>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
            Learn more <FiChevronRight />
          </div>
        </Link>
      )}
    </motion.div>
  )
}

function FeaturedProjects() {
  const [projects, setProjects] = useState([])
  useEffect(() => { api.get('/projects?isFeatured=true&limit=2').then(r => setProjects(r.data.data)).catch(() => {}) }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem' }}>
      {(projects.length ? projects : Array(2).fill(null)).map((p, i) => {
        const [ref, inView] = [useState(null), { inView: true }]
        return (
          <motion.div key={p?._id || i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, duration: 0.6 }}>
            {!p ? (
              <div className="card" style={{ height: 320 }}>
                <div className="skeleton" style={{ height: '60%', borderRadius: 0 }} />
                <div style={{ padding: '1.5rem' }}>
                  <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 14, width: '90%' }} />
                </div>
              </div>
            ) : (
              <Link to={`/projects/${p.slug}`} className="card" style={{ display: 'block' }}>
                <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                  <img src={p.coverImage} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <span className="tag">{p.status}</span>
                    {p.isFeatured && <span className="tag">Featured</span>}
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>{p.title}</h4>
                  <p style={{ fontSize: '0.88rem' }}>{p.description.slice(0, 120)}...</p>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    {p.results?.slice(0, 2).map(r => (
                      <div key={r.metric}>
                        <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1.1rem' }}>{r.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.metric}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            )}
          </motion.div>
        )
      })}
      <style>{`@media(max-width:640px){div[style*="grid-template-columns: repeat(2"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}

function TestimonialCard({ t, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="glass"
      style={{ padding: '1.75rem' }}
    >
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
        {Array(t.rating).fill(0).map((_, i) => <FiStar key={i} style={{ color: 'var(--gold)', fill: 'var(--gold)' }} />)}
      </div>
      <p style={{ fontSize: '0.92rem', fontStyle: 'italic', lineHeight: 1.8, marginBottom: '1.5rem', color: 'var(--text)' }}>
        "{t.testimonialText}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img src={t.imgUrl} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-gold)' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>{t.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.position} · {t.company}</div>
        </div>
      </div>
    </motion.div>
  )
}

function BlogCard({ b, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/blog/${b.slug}`} className="card" style={{ display: 'block' }}>
        <div style={{ height: 180, overflow: 'hidden' }}>
          <img src={b.coverImage} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          />
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="tag">{b.readTime} min read</span>
          </div>
          <h4 style={{ color: 'var(--text)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', lineHeight: 1.5 }}>{b.title}</h4>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.7 }}>{b.excerpt.slice(0, 100)}...</p>
        </div>
      </Link>
    </motion.div>
  )
}
