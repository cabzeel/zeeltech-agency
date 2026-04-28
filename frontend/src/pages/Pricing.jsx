import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Helmet } from 'react-helmet-async'
import { FiCheck, FiArrowRight, FiZap } from 'react-icons/fi'
import PageWrapper from '../components/ui/PageWrapper'
import SectionHeader from '../components/ui/SectionHeader'
import api from '../utils/api'

const faq = [
  { q: 'Are these prices fixed?', a: 'The ranges are starting points. Your final quote depends on project scope, integrations needed, and timeline. We always provide a detailed proposal before any commitment.' },
  { q: 'Do you offer payment plans?', a: 'Yes. We typically structure projects as 40% upfront, 30% at midpoint, and 30% on delivery. Flexible arrangements are available for larger engagements.' },
  { q: 'What happens after launch?', a: 'Every plan includes post-launch support. We monitor performance, fix any issues, and ensure your product runs smoothly. Extended maintenance plans are available.' },
  { q: 'Can I start with a smaller plan and upgrade?', a: 'Absolutely. We often start clients on a Basic or Pro build and scale up as their needs grow. Our code is built to be extended.' },
]

export default function Pricing() {
  const [plans, setPlans]     = useState([])
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    api.get('/pricing?status=active')
      .then(r => setPlans(r.data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      <Helmet>
        <title>Pricing – Zeeltech Agency</title>
        <meta name="description" content="Transparent pricing for web development, mobile apps, and digital services. Find the plan that fits your budget." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '5rem 0 4rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,180,41,0.07) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>Transparent Pricing</span>
            <h1 style={{ maxWidth: 680, margin: '0 auto 1.5rem' }}>
              Invest in <span className="gold-gradient">Digital Excellence</span>
            </h1>
            <p style={{ maxWidth: 520, margin: '0 auto', fontSize: '1.1rem' }}>
              No hidden fees, no vague quotes. Choose the tier that fits your stage and scale as you grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ paddingBottom: '6rem' }}>
        <div className="container">
          {loading ? (
            <div className="grid-4">{Array(4).fill(0).map((_, i) => <div key={i} className="card" style={{ height: 480 }}><div className="skeleton" style={{ height: '100%' }} /></div>)}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', alignItems: 'start' }}>
              {plans.map((plan, i) => <PricingCard key={plan._id} plan={plan} index={i} />)}
            </div>
          )}
          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            All prices in USD. Custom enterprise quotes available — <Link to="/contact" style={{ color: 'var(--gold)' }}>contact us</Link>.
          </p>
        </div>
        <style>{`
          @media(max-width:1024px){.container>div[style*="repeat(4"]{grid-template-columns:repeat(2,1fr)!important}}
          @media(max-width:640px){.container>div[style*="repeat(4"]{grid-template-columns:1fr!important}}
        `}</style>
      </section>

      {/* Comparison Table */}
      <section className="section" style={{ background: 'var(--bg-1)', paddingTop: '4rem' }}>
        <div className="container">
          <SectionHeader label="Compare" title="What's |Included|" center />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>Feature</th>
                  {['Basic', 'Pro', 'Advanced', 'Premium'].map(n => (
                    <th key={n} style={{ padding: '1rem', textAlign: 'center', color: n === 'Pro' ? 'var(--gold)' : 'var(--text)', fontWeight: 600 }}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Responsive Design', true, true, true, true],
                  ['CMS / Blog', false, true, true, true],
                  ['Custom Backend API', false, false, true, true],
                  ['Mobile App', false, false, false, true],
                  ['Admin Dashboard', false, false, true, true],
                  ['SEO Optimization', false, true, true, true],
                  ['CI/CD Pipeline', false, false, false, true],
                  ['Priority Support', false, false, false, true],
                ].map(([feature, ...vals]) => (
                  <tr key={feature} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)' }}>{feature}</td>
                    {vals.map((v, i) => (
                      <td key={i} style={{ padding: '0.9rem 1rem', textAlign: 'center', color: v ? 'var(--gold)' : 'var(--text-dim)' }}>
                        {v ? '✓' : '–'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <SectionHeader label="FAQ" title="Common |Questions|" center />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faq.map((item, i) => (
              <div key={i} className="glass" style={{ overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1.25rem 1.5rem', background: 'none', border: 'none', color: 'var(--text)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                }}>
                  {item.q}
                  <span style={{ color: 'var(--gold)', fontSize: '1.2rem', transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                <motion.div initial={{ height: 0 }} animate={{ height: openFaq === i ? 'auto' : 0 }} style={{ overflow: 'hidden' }}>
                  <p style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.9rem' }}>{item.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', textAlign: 'center', background: 'var(--bg-1)' }}>
        <div className="container">
          <FiZap style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Not Sure Which Plan? <span className="gold-gradient">Talk to Us</span></h2>
          <p style={{ maxWidth: 480, margin: '0 auto 2rem' }}>Every project is different. Share your goals and we'll recommend the right approach and budget.</p>
          <Link to="/contact" className="btn btn-gold">Get a Custom Quote <FiArrowRight /></Link>
        </div>
      </section>
    </PageWrapper>
  )
}

function PricingCard({ plan, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const popular = plan.isPopular

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius)',
        padding: '2rem',
        border: `1px solid ${popular ? 'var(--gold)' : 'var(--border)'}`,
        background: popular ? 'rgba(240,180,41,0.06)' : 'var(--bg-2)',
        transform: popular ? 'scale(1.04)' : 'scale(1)',
        transition: 'var(--transition)',
        boxShadow: popular ? '0 0 40px rgba(240,180,41,0.15)' : 'none',
      }}
    >
      {popular && (
        <div style={{
          position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
          color: '#080808', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
          letterSpacing: '0.1em', padding: '0.25rem 1rem', borderRadius: '0 0 8px 8px',
        }}>
          MOST POPULAR
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ color: popular ? 'var(--gold)' : 'var(--text)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>{plan.name}</h4>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
          ${plan.priceRange.min.toLocaleString()}
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}> – ${plan.priceRange.max.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>Starting from</div>
      </div>

      <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {plan.features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <FiCheck style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.15rem' }} />
            {f}
          </li>
        ))}
      </ul>

      <Link to="/contact" className={`btn ${popular ? 'btn-gold' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'center' }}>
        {plan.cta}
      </Link>
    </motion.div>
  )
}
