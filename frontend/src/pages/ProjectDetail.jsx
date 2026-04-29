import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowLeft, FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi'
import { format } from 'date-fns'
import PageWrapper from '../components/ui/PageWrapper'
import api from '../utils/api'

export default function ProjectDetail() {
  const { slug }              = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/projects/slug/${slug}`)
      .then(r => setProject(r.data.data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <PageWrapper>
      <div className="container" style={{ maxWidth:900,paddingTop:'2rem' }}>
        <div className="skeleton" style={{ height:480,borderRadius:'var(--radius-lg)',marginBottom:'2rem' }}/>
        <div className="skeleton" style={{ height:36,width:'60%',marginBottom:'1rem' }}/>
        <div className="skeleton" style={{ height:16,width:'80%',marginBottom:'0.5rem' }}/>
        <div className="skeleton" style={{ height:16,width:'70%' }}/>
      </div>
    </PageWrapper>
  )

  if (!project) return (
    <PageWrapper>
      <div style={{ textAlign:'center',padding:'8rem 2rem' }}>
        <div style={{ fontSize:'4rem',marginBottom:'1rem' }}>🗂️</div>
        <h2>Project Not Found</h2>
        <p style={{ marginBottom:'2rem' }}>This case study doesn't exist or may have been removed.</p>
        <Link to="/projects" className="btn btn-gold">Back to Projects</Link>
      </div>
    </PageWrapper>
  )

  const p = project

  return (
    <PageWrapper>
      <Helmet>
        <title>{p.title} – Zeeltech Portfolio</title>
        <meta name="description" content={p.description} />
        <meta property="og:image" content={p.coverImage} />
      </Helmet>

      {/* Hero */}
      <div style={{ position:'relative',height:'clamp(300px,50vw,560px)',overflow:'hidden' }}>
        <img src={p.coverImage} alt={p.title} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.9) 100%)' }}/>
        <div className="container" style={{ position:'absolute',bottom:'2.5rem',left:'50%',transform:'translateX(-50%)',width:'100%' }}>
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }}>
            <div style={{ display:'flex',gap:'0.75rem',marginBottom:'1rem',flexWrap:'wrap' }}>
              {p.category?.name && <span className="tag">{p.category.name}</span>}
              <span style={{ padding:'0.2rem 0.7rem',borderRadius:100,background: p.status==='completed'?'rgba(34,197,94,0.15)':'var(--gold-muted)',color:p.status==='completed'?'#22c55e':'var(--gold)',border:`1px solid ${p.status==='completed'?'rgba(34,197,94,0.4)':'var(--border-gold)'}`,fontSize:'0.7rem',fontFamily:'var(--font-mono)' }}>
                {p.status}
              </span>
            </div>
            <h1 style={{ fontSize:'clamp(1.8rem,4vw,3.2rem)',marginBottom:'0.75rem',maxWidth:700 }}>{p.title}</h1>
            <p style={{ color:'rgba(255,255,255,0.7)',fontSize:'1.05rem',maxWidth:600 }}>{p.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ maxWidth:900,padding:'3rem clamp(1rem,4vw,3rem)' }}>
        <Link to="/projects" style={{ display:'inline-flex',alignItems:'center',gap:'0.4rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)',fontSize:'0.82rem',marginBottom:'3rem',transition:'var(--transition)' }}
          onMouseOver={e=>e.currentTarget.style.color='var(--gold)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}
        ><FiArrowLeft/> Back to Work</Link>

        {/* Meta strip */}
        <div className="glass" style={{ padding:'1.5rem 2rem',display:'flex',gap:'3rem',flexWrap:'wrap',marginBottom:'3rem' }}>
          <MetaItem icon={<FiUser/>} label="Client" value={p.clientName}/>
          <MetaItem icon={<FiCalendar/>} label="Start Date" value={p.timeline?.startDate ? format(new Date(p.timeline.startDate),'MMM yyyy') : '—'}/>
          <MetaItem icon={<FiCalendar/>} label="End Date" value={p.timeline?.endDate ? format(new Date(p.timeline.endDate),'MMM yyyy') : 'Ongoing'}/>
          {p.teamMembers?.length > 0 && (
            <div>
              <div style={{ fontSize:'0.72rem',color:'var(--text-dim)',fontFamily:'var(--font-mono)',letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:'0.35rem' }}>Team</div>
              <div style={{ display:'flex',gap:'0.5rem' }}>
                {p.teamMembers.map(m => (
                  <img key={m._id} src={m.imgUrl} alt={m.name} title={m.name} style={{ width:28,height:28,borderRadius:'50%',objectFit:'cover',border:'2px solid var(--border-gold)' }}/>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {p.results?.length > 0 && (
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.15 }}
            style={{ display:'grid',gridTemplateColumns:`repeat(${Math.min(p.results.length,3)},1fr)`,gap:'1rem',marginBottom:'3rem' }}>
            {p.results.map(r => (
              <div key={r.metric} className="glass-gold" style={{ padding:'1.75rem',textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-display)',fontSize:'2.5rem',fontWeight:600,color:'var(--gold)',marginBottom:'0.25rem' }}>{r.value}</div>
                <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.78rem',color:'var(--text-muted)',letterSpacing:'0.05em' }}>{r.metric}</div>
              </div>
            ))}
          </motion.div>
        )}

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'3rem' }}>
          {/* Problem */}
          <div className="glass" style={{ padding:'2rem' }}>
            <h4 style={{ color:'var(--text)',marginBottom:'1rem',fontFamily:'var(--font-mono)',display:'flex',alignItems:'center',gap:'0.5rem' }}>
              <span style={{ color:'var(--gold)' }}>01</span> The Challenge
            </h4>
            <p style={{ fontSize:'0.92rem',lineHeight:1.8 }}>{p.problem}</p>
          </div>
          {/* Solution */}
          <div className="glass-gold" style={{ padding:'2rem' }}>
            <h4 style={{ color:'var(--gold)',marginBottom:'1rem',fontFamily:'var(--font-mono)',display:'flex',alignItems:'center',gap:'0.5rem' }}>
              <span>02</span> Our Solution
            </h4>
            <p style={{ fontSize:'0.92rem',lineHeight:1.8 }}>{p.solution}</p>
          </div>
        </div>

        {/* Gallery */}
        {p.images?.length > 0 && (
          <div style={{ marginBottom:'3rem' }}>
            <h3 style={{ fontFamily:'var(--font-mono)',color:'var(--text)',marginBottom:'1.5rem' }}>Project Gallery</h3>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'1rem' }}>
              {p.images.map((img,i) => (
                <div key={i} style={{ borderRadius:'var(--radius)',overflow:'hidden',aspectRatio:'16/9' }}>
                  <img src={img} alt={`${p.title} screenshot ${i+1}`} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign:'center',padding:'3rem',background:'var(--bg-2)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border)' }}>
          <h3 style={{ fontFamily:'var(--font-mono)',marginBottom:'0.75rem' }}>Want Similar Results?</h3>
          <p style={{ marginBottom:'2rem',maxWidth:400,margin:'0 auto 2rem' }}>Let's discuss how we can build something this impactful for your business.</p>
          <a href={p.link} target='_blank' className="btn btn-gold">{p.cta || 'Start a Project'} <FiArrowRight/></a>
        </div>
      </div>

      <style>{`@media(max-width:640px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </PageWrapper>
  )
}

function MetaItem({ icon, label, value }) {
  return (
    <div>
      <div style={{ fontSize:'0.72rem',color:'var(--text-dim)',fontFamily:'var(--font-mono)',letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:'0.35rem',display:'flex',alignItems:'center',gap:'0.3rem' }}>
        {icon}{label}
      </div>
      <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.9rem',color:'var(--text)',fontWeight:500 }}>{value}</div>
    </div>
  )
}
