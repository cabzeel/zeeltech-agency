import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi'
import PageWrapper from '../components/ui/PageWrapper'
import api from '../utils/api'

export default function ServiceDetail() {
  const { slug }              = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/services/slug/${slug}`)
      .then(r => setService(r.data.data))
      .catch(() => setService(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <PageWrapper>
      <div className="container" style={{ maxWidth:860,paddingTop:'2rem' }}>
        <div className="skeleton" style={{ height:56,width:'60%',marginBottom:'1rem' }}/>
        <div className="skeleton" style={{ height:20,width:'80%',marginBottom:'3rem' }}/>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:14,marginBottom:'0.6rem' }}/>)}
      </div>
    </PageWrapper>
  )

  if (!service) return (
    <PageWrapper>
      <div style={{ textAlign:'center',padding:'8rem 2rem' }}>
        <div style={{ fontSize:'4rem',marginBottom:'1rem' }}>🔧</div>
        <h2>Service Not Found</h2>
        <p style={{ marginBottom:'2rem' }}>This service doesn't exist or may have been removed.</p>
        <Link to="/services" className="btn btn-gold">Back to Services</Link>
      </div>
    </PageWrapper>
  )

  const s = service

  return (
    <PageWrapper>
      <Helmet>
        <title>{s.title} – Zeeltech Agency</title>
        <meta name="description" content={s.subDescription} />
      </Helmet>

      {/* Hero */}
      <section style={{ padding:'5rem 0 4rem',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(240,180,41,0.07) 0%, transparent 60%)' }}/>
        <div style={{ position:'absolute',right:'-5%',top:'50%',transform:'translateY(-50%)',width:'45%',height:'80%',borderRadius:'var(--radius-xl)',overflow:'hidden',opacity:0.35 }}>
          <img src={s.imgUrl} alt={s.title} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
        </div>
        <div className="container" style={{ position:'relative',maxWidth:860 }}>
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }}>
            <Link to="/services" style={{ display:'inline-flex',alignItems:'center',gap:'0.4rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)',fontSize:'0.82rem',marginBottom:'2rem',transition:'var(--transition)' }}
              onMouseOver={e=>e.currentTarget.style.color='var(--gold)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}
            ><FiArrowLeft/> All Services</Link>
            <span className="section-label">Service</span>
            <h1 style={{ maxWidth:600,marginBottom:'1.25rem' }}>{s.title}</h1>
            <p style={{ fontSize:'1.1rem',maxWidth:540,marginBottom:'2rem' }}>{s.subDescription}</p>
            <Link to="/contact" className="btn btn-gold">{s.cta} <FiArrowRight/></Link>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="section" style={{ background:'var(--bg-1)',paddingTop:'4rem' }}>
        <div className="container" style={{ maxWidth:860 }}>
          <div style={{ display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:'4rem',alignItems:'start' }}>
            <div>
              <span className="section-label">Overview</span>
              <h2 style={{ marginBottom:'1.5rem' }}>What We <span className="gold-gradient">Deliver</span></h2>
              <p style={{ fontSize:'1rem',lineHeight:1.9 }}>{s.fullDescription}</p>
            </div>
            <div>
              <h4 style={{ color:'var(--text)',marginBottom:'1.25rem',fontFamily:'var(--font-mono)' }}>Tools & Technologies</h4>
              <div style={{ display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'2rem' }}>
                {s.tools?.map(t => (
                  <span key={t} className="tag" style={{ fontSize:'0.82rem',padding:'0.3rem 0.85rem' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){section .container>div[style*="grid-template-columns"]{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* Process */}
      {s.process?.length > 0 && (
        <section className="section">
          <div className="container" style={{ maxWidth:860 }}>
            <span className="section-label">How We Work</span>
            <h2 style={{ marginBottom:'3rem' }}>Our <span className="gold-gradient">Process</span></h2>
            <div style={{ display:'flex',flexDirection:'column',gap:'0' }}>
              {s.process.map((step, i) => (
                <motion.div key={i} initial={{ opacity:0,x:-30 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.1,duration:0.5 }}
                  style={{ display:'grid',gridTemplateColumns:'80px 1fr',gap:'1.5rem',paddingBottom:'2.5rem',position:'relative' }}>
                  {/* Timeline line */}
                  {i < s.process.length - 1 && (
                    <div style={{ position:'absolute',left:39,top:56,bottom:0,width:2,background:'linear-gradient(to bottom, var(--gold), transparent)' }}/>
                  )}
                  {/* Step number */}
                  <div style={{ width:56,height:56,borderRadius:'50%',background:'var(--gold-muted)',border:'2px solid var(--border-gold)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)',fontWeight:700,color:'var(--gold)',fontSize:'1.1rem',flexShrink:0 }}>
                    {String(i+1).padStart(2,'0')}
                  </div>
                  <div style={{ paddingTop:'0.75rem' }}>
                    <h4 style={{ color:'var(--text)',marginBottom:'0.5rem' }}>{step.title}</h4>
                    <p style={{ fontSize:'0.92rem',lineHeight:1.8 }}>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {s.relatedProjects?.length > 0 && (
        <section className="section" style={{ background:'var(--bg-1)' }}>
          <div className="container" style={{ maxWidth:860 }}>
            <h3 style={{ fontFamily:'var(--font-mono)',color:'var(--text)',marginBottom:'2rem' }}>Related Projects</h3>
            <div className="grid-3" style={{ gap:'1.25rem' }}>
              {s.relatedProjects.map(proj => (
                <Link key={proj._id} to={`/projects/${proj.slug}`} className="card" style={{ display:'block' }}>
                  <div style={{ height:160,overflow:'hidden' }}>
                    <img src={proj.coverImage} alt={proj.title} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s' }}
                      onMouseOver={e=>e.target.style.transform='scale(1.06)'} onMouseOut={e=>e.target.style.transform='scale(1)'}
                    />
                  </div>
                  <div style={{ padding:'1.25rem' }}>
                    <h4 style={{ fontFamily:'var(--font-mono)',fontSize:'0.9rem',color:'var(--text)' }}>{proj.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding:'5rem 0',textAlign:'center' }}>
        <div className="container">
          <h2 style={{ marginBottom:'1rem' }}>Ready to Get <span className="gold-gradient">Started?</span></h2>
          <p style={{ maxWidth:460,margin:'0 auto 2rem' }}>Tell us about your project and we'll put together a tailored proposal.</p>
          <div style={{ display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap' }}>
            <Link to="/contact" className="btn btn-gold">{s.cta} <FiArrowRight/></Link>
            <Link to="/pricing" className="btn btn-outline">View Pricing</Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
