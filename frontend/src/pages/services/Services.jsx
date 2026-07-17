import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Helmet } from 'react-helmet-async'
import { FiArrowRight, FiCode, FiSmartphone, FiLayout, FiTrendingUp, FiCheck, FiMapPin } from 'react-icons/fi'
import PageWrapper from '../../components/ui/PageWrapper'
import SectionHeader from '../../components/ui/SectionHeader'
import api from '../../utils/api'

const iconMap = {
  'credibility-website': <FiLayout />,
  'quote-generation': <FiTrendingUp />,
  'local-seo': <FiMapPin />,
  // legacy slugs kept for any older DB entries
  'web-development': <FiCode />,
  'mobile-app-development': <FiSmartphone />,
  'ui-ux-design': <FiLayout />,
  'digital-marketing': <FiTrendingUp />,
}

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
        <title>Services | Websites, Local SEO & Quote Funnels for Service Contractors</title>
        <meta name="description" content="ZeelTech builds credibility-first websites, local SEO, and quote request systems for commercial service contractors — fire protection, commercial cleaning, and facility service companies." />
        <link rel="canonical" href="https://zeeltechsolutions.com/services" />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '5rem 0 4rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,180,41,0.07) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>What We Build</span>
            <h1 style={{ maxWidth: 680, margin: '0 auto 1.5rem' }}>
              Get Found. <span className="gold-gradient">Get Trusted.</span> Get the Call.
            </h1>
            <p style={{ maxWidth: 540, margin: '0 auto', fontSize: '1.1rem' }}>
              Three services, one outcome — more qualified quote requests. Built specifically for commercial service contractors, not tech startups.
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
              { title: 'No Handoffs, No Lost Details', desc: 'One person builds your design, code, and SEO together — not a designer, a developer, and an SEO vendor who\'ve never spoken.' },
              { title: 'A Prototype in Two Weeks', desc: 'You see real progress fast, not a black box until launch day. Most projects go live in 4–8 weeks total.' },
              { title: 'Measured by Quote Requests', desc: 'We track the same number you do: how many quote requests the site generates. That is the actual measure of success.' },
              { title: 'Support After You Go Live', desc: 'Hosting, updates, and fixes do not stop at launch — your site keeps working while you are out on jobs.' },
              { title: 'Local SEO Baked In', desc: 'Service-area pages, structured data, and Google Business integration ship with every site, not sold as an upsell later.' },
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