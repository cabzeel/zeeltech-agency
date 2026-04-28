import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Helmet } from 'react-helmet-async'
import { FiArrowRight, FiCode, FiSmartphone, FiLayout, FiTrendingUp, FiCheck } from 'react-icons/fi'
import PageWrapper from '../components/ui/PageWrapper'
import SectionHeader from '../components/ui/SectionHeader'
import api from '../utils/api'

const iconMap = { 'web-development': <FiCode />, 'mobile-app-development': <FiSmartphone />, 'ui-ux-design': <FiLayout />, 'digital-marketing': <FiTrendingUp /> }

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/services?status=active')
      .then(r => setServices(r.data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      <Helmet>
        <title>Services – Zeeltech Agency</title>
        <meta name="description" content="Zeeltech offers web development, mobile apps, UI/UX design, and digital marketing services built for growth." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '5rem 0 4rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,180,41,0.07) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>What We Do</span>
            <h1 style={{ maxWidth: 680, margin: '0 auto 1.5rem' }}>
              End-to-End <span className="gold-gradient">Digital Services</span>
            </h1>
            <p style={{ maxWidth: 540, margin: '0 auto', fontSize: '1.1rem' }}>
              From your first idea to a live, revenue-generating product — we are the only digital partner you need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {loading ? (
            <div className="grid-2">{Array(4).fill(0).map((_, i) => <div key={i} className="card" style={{ height: 320 }}><div className="skeleton" style={{ height: '100%' }} /></div>)}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {services.map((s, i) => <ServiceRow key={s._id} service={s} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="section" style={{ background: 'var(--bg-1)' }}>
        <div className="container">
          <SectionHeader label="Why Zeeltech" title="The |Zeeltech| Advantage" center />
          <div className="grid-3" style={{ gap: '1.25rem' }}>
            {[
              { title: 'Full-Stack Capability', desc: 'One team handles design, frontend, backend, and deployment — no fragmented vendors, no communication gaps.' },
              { title: 'Agile & Transparent', desc: 'Weekly sprints, live demos, and real-time project boards so you always know where things stand.' },
              { title: 'Results-Oriented', desc: 'We measure success by your outcomes — conversions, revenue, retention — not by lines of code shipped.' },
              { title: 'Post-Launch Support', desc: 'Our relationship does not end at launch. We offer ongoing support, hosting, and iteration services.' },
              { title: 'SEO-Ready from Day One', desc: 'Every product we build is engineered with Core Web Vitals, semantic HTML, and SEO best practices baked in.' },
              { title: 'African Roots, Global Standards', desc: 'Based in Cameroon, we understand emerging markets while building to international quality benchmarks.' },
            ].map((item, i) => {
              const [ref, inView] = useInView({ triggerOnce: true })
              return (
                <motion.div key={item.title} ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="glass" style={{ padding: '1.75rem' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--gold-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', marginBottom: '1rem' }}>
                    <FiCheck />
                  </div>
                  <h4 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.88rem' }}>{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem' }}>Ready to <span className="gold-gradient">Get Started?</span></h2>
          <p style={{ maxWidth: 480, margin: '0 auto 2rem' }}>Tell us about your project and get a tailored proposal within 24 hours.</p>
          <Link to="/contact" className="btn btn-gold">Start a Project <FiArrowRight /></Link>
        </div>
      </section>
    </PageWrapper>
  )
}

function ServiceRow({ service, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const isEven = index % 2 === 0

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.08 }}
      className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isEven ? '1fr 1.2fr' : '1.2fr 1fr' }}>
        {!isEven && (
          <div style={{ background: `url(${service.imgUrl}) center/cover`, minHeight: 280 }}>
            <div style={{ width: '100%', height: '100%', background: 'rgba(8,8,8,0.4)' }} />
          </div>
        )}
        <div style={{ padding: '2.5rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '1.3rem', marginBottom: '1.25rem' }}>
            {iconMap[service.slug] || <FiCode />}
          </div>
          <h3 style={{ marginBottom: '0.75rem', color: 'var(--text)' }}>{service.title}</h3>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>{service.subDescription}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {service.tools?.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <Link to={`/services/${service.slug}`} className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>
            {service.cta} <FiArrowRight />
          </Link>
        </div>
        {isEven && (
          <div style={{ background: `url(${service.imgUrl}) center/cover`, minHeight: 280 }}>
            <div style={{ width: '100%', height: '100%', background: 'rgba(8,8,8,0.4)' }} />
          </div>
        )}
      </div>
      <style>{`@media(max-width:768px){div[style*="grid-template-columns"]{grid-template-columns:1fr!important}}`}</style>
    </motion.div>
  )
}
