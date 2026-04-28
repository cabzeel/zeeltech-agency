import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowRight, FiHome } from 'react-icons/fi'
import PageWrapper from '../components/ui/PageWrapper'

export default function NotFound() {
  return (
    <PageWrapper>
      <Helmet><title>404 – Page Not Found – Zeeltech</title></Helmet>
      <div style={{ minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(240,180,41,0.06) 0%, transparent 70%)' }}/>
        <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }} style={{ position:'relative',zIndex:1 }}>
          <div style={{ fontFamily:'var(--font-display)',fontSize:'clamp(6rem,20vw,14rem)',fontWeight:600,lineHeight:1,color:'transparent',WebkitTextStroke:'2px var(--border-gold)',marginBottom:'1rem',userSelect:'none' }}>
            404
          </div>
          <h2 style={{ marginBottom:'1rem',color:'var(--text)' }}>Page Not Found</h2>
          <p style={{ maxWidth:400,margin:'0 auto 2.5rem',fontSize:'1rem' }}>
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div style={{ display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap' }}>
            <Link to="/" className="btn btn-gold"><FiHome/> Back Home</Link>
            <Link to="/contact" className="btn btn-outline">Contact Us <FiArrowRight/></Link>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
