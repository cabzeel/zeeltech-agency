import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Helmet } from 'react-helmet-async'
import { FiArrowRight, FiExternalLink } from 'react-icons/fi'
import PageWrapper from '../components/ui/PageWrapper'
import SectionHeader from '../components/ui/SectionHeader'
import api from '../utils/api'

const statusColors = {
  completed: { bg:'rgba(34,197,94,0.1)', color:'#22c55e', border:'rgba(34,197,94,0.3)' },
  ongoing:   { bg:'rgba(240,180,41,0.1)',  color:'var(--gold)', border:'var(--border-gold)' },
  'on-hold': { bg:'rgba(107,114,128,0.1)', color:'#6b7280', border:'rgba(107,114,128,0.3)' },
}

export default function Projects() {
  const [projects, setProjects]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState({ category:'', status:'' })

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter.category) params.set('category', filter.category)
    if (filter.status)   params.set('status',   filter.status)
    api.get(`/projects?${params}`)
      .then(r => setProjects(r.data.data))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <PageWrapper>
      <Helmet>
        <title>Our Work – Zeeltech Agency</title>
        <meta name="description" content="Explore Zeeltech's portfolio of web apps, mobile applications, and digital platforms built for ambitious clients." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding:'5rem 0 3.5rem',position:'relative',textAlign:'center' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,180,41,0.07) 0%, transparent 70%)' }}/>
        <div className="container" style={{ position:'relative' }}>
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }}>
            <span className="section-label" style={{ justifyContent:'center' }}>Our Work</span>
            <h1 style={{ maxWidth:640,margin:'0 auto 1.5rem' }}>
              Products That <span className="gold-gradient">Drive Results</span>
            </h1>
            <p style={{ maxWidth:500,margin:'0 auto',fontSize:'1.05rem' }}>
              A curated selection of our most impactful projects — from e-commerce platforms to healthcare apps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="container" style={{ marginBottom:'2.5rem' }}>
        <div style={{ display:'flex',gap:'1rem',flexWrap:'wrap',alignItems:'center',justifyContent:'center' }}>
          <div style={{ display:'flex',gap:'0.5rem',flexWrap:'wrap',justifyContent:'center' }}>
            {[{ _id:'',name:'All Categories' },...categories].map(c => (
              <button key={c._id} onClick={() => setFilter(f => ({...f,category:c._id}))}
                style={{ padding:'0.35rem 1rem',borderRadius:100,border:'1px solid',cursor:'pointer',fontFamily:'var(--font-mono)',fontSize:'0.8rem',fontWeight:500,transition:'var(--transition)',
                  background: filter.category===c._id?'var(--gold)':'transparent',
                  borderColor: filter.category===c._id?'var(--gold)':'var(--border)',
                  color: filter.category===c._id?'#080808':'var(--text-muted)' }}
              >{c.name}</button>
            ))}
          </div>
          <div style={{ width:1,height:24,background:'var(--border)' }}/>
          <div style={{ display:'flex',gap:'0.5rem' }}>
            {[{ val:'',label:'All Status' },{ val:'completed',label:'Completed' },{ val:'ongoing',label:'Ongoing' }].map(s => (
              <button key={s.val} onClick={() => setFilter(f => ({...f,status:s.val}))}
                style={{ padding:'0.35rem 0.85rem',borderRadius:100,border:'1px solid',cursor:'pointer',fontFamily:'var(--font-mono)',fontSize:'0.78rem',transition:'var(--transition)',
                  background: filter.status===s.val?'var(--surface-2)':'transparent',
                  borderColor: filter.status===s.val?'var(--border-gold)':'var(--border)',
                  color: filter.status===s.val?'var(--gold)':'var(--text-muted)' }}
              >{s.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <section style={{ paddingBottom:'6rem' }}>
        <div className="container">
          {loading ? (
            <div className="grid-2" style={{ gap:'1.5rem' }}>
              {Array(4).fill(0).map((_,i) => <div key={i} className="card" style={{ height:360 }}><div className="skeleton" style={{ height:'100%' }}/></div>)}
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign:'center',padding:'5rem',color:'var(--text-muted)' }}>
              <div style={{ fontSize:'3rem',marginBottom:'1rem' }}>🗂️</div>
              <p>No projects found with current filters.</p>
            </div>
          ) : (
            <div className="grid-2" style={{ gap:'1.5rem' }}>
              {projects.map((p,i) => <ProjectCard key={p._id} project={p} index={i}/>)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'5rem 0',background:'var(--bg-1)',textAlign:'center' }}>
        <div className="container">
          <h2 style={{ marginBottom:'1rem' }}>Have a Project in <span className="gold-gradient">Mind?</span></h2>
          <p style={{ maxWidth:460,margin:'0 auto 2rem' }}>Let's discuss your vision and build something you'll be proud of.</p>
          <Link to="/contact" className="btn btn-gold">Start the Conversation <FiArrowRight/></Link>
        </div>
      </section>
    </PageWrapper>
  )
}

function ProjectCard({ project: p, index }) {
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.08 })
  const sc = statusColors[p.status] || statusColors.completed

  return (
    <motion.div ref={ref} initial={{ opacity:0,y:30 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.55,delay:(index%2)*0.1 }}>
      <Link to={`/projects/${p.slug}`} className="card" style={{ display:'block',overflow:'hidden' }}>
        {/* Image */}
        <div style={{ position:'relative',height:260,overflow:'hidden' }}>
          <img src={p.coverImage} alt={p.title}
            style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.6s ease' }}
            onMouseOver={e=>e.target.style.transform='scale(1.06)'} onMouseOut={e=>e.target.style.transform='scale(1)'}
          />
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(8,8,8,0.7) 0%,transparent 50%)' }}/>
          <div style={{ position:'absolute',top:'1rem',left:'1rem',display:'flex',gap:'0.5rem' }}>
            <span style={{ padding:'0.2rem 0.7rem',borderRadius:100,background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`,fontSize:'0.7rem',fontFamily:'var(--font-mono)',fontWeight:500 }}>
              {p.status}
            </span>
            {p.isFeatured && <span className="tag" style={{ background:'var(--gold)',color:'#080808',border:'none' }}>Featured</span>}
          </div>
          {p.category?.name && (
            <div style={{ position:'absolute',bottom:'1rem',left:'1rem' }}>
              <span className="tag">{p.category.name}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding:'1.75rem' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'1rem',marginBottom:'0.75rem' }}>
            <h3 style={{ fontFamily:'var(--font-mono)',fontSize:'1.05rem',color:'var(--text)',fontWeight:600,lineHeight:1.4 }}>{p.title}</h3>
            <FiExternalLink style={{ color:'var(--text-dim)',flexShrink:0,marginTop:'0.2rem' }}/>
          </div>
          <p style={{ fontSize:'0.87rem',lineHeight:1.7,marginBottom:'1.25rem' }}>{p.description.slice(0,130)}...</p>

          {/* Client */}
          <div style={{ fontSize:'0.78rem',color:'var(--text-dim)',fontFamily:'var(--font-mono)',marginBottom:'1rem' }}>
            Client: <span style={{ color:'var(--text-muted)' }}>{p.clientName}</span>
          </div>

          {/* Results */}
          {p.results?.length > 0 && (
            <div style={{ display:'flex',gap:'1.5rem',paddingTop:'1rem',borderTop:'1px solid var(--border)' }}>
              {p.results.slice(0,3).map(r => (
                <div key={r.metric}>
                  <div style={{ fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:600,color:'var(--gold)' }}>{r.value}</div>
                  <div style={{ fontSize:'0.72rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)' }}>{r.metric}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
