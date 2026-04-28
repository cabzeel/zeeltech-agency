import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiMail, FiPhone, FiMapPin, FiSend, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi'
import toast from 'react-hot-toast'
import PageWrapper from '../components/ui/PageWrapper'
import api from '../utils/api'

const services = ['Web Development','Mobile App','UI/UX Design','Digital Marketing','Other']

export default function Contact() {
  const [form, setForm]           = useState({ name:'',email:'',phone:'',subject:'',message:'',service:'' })
  const [submitting, setSubmitting]   = useState(false)
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [subscribing, setSubscribing]       = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all required fields'); return
    }
    setSubmitting(true)
    try {
      await api.post('/contacts', {
        name: form.name, email: form.email, phone: form.phone,
        subject: form.service ? `[${form.service}] ${form.subject}` : form.subject,
        message: form.message,
      })
      toast.success('Message sent! We\'ll be in touch within 24 hours.')
      setForm({ name:'',email:'',phone:'',subject:'',message:'',service:'' })
    } catch {
      toast.error('Something went wrong. Please try again or email us directly.')
    }
    setSubmitting(false)
  }

  const handleSubscribe = async e => {
    e.preventDefault()
    if (!subscribeEmail) return
    setSubscribing(true)
    try {
      await api.post('/subscribers/subscribe', { email: subscribeEmail })
      toast.success('Subscribed! Welcome to the Zeeltech newsletter.')
      setSubscribeEmail('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not subscribe. Please try again.')
    }
    setSubscribing(false)
  }

  return (
    <PageWrapper>
      <Helmet>
        <title>Contact Us – Zeeltech Agency</title>
        <meta name="description" content="Get in touch with Zeeltech Agency. Tell us about your project and we'll respond with a tailored proposal within 24 hours." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding:'5rem 0 3rem',position:'relative',textAlign:'center' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,180,41,0.07) 0%, transparent 70%)' }}/>
        <div className="container" style={{ position:'relative' }}>
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }}>
            <span className="section-label" style={{ justifyContent:'center' }}>Get In Touch</span>
            <h1 style={{ maxWidth:640,margin:'0 auto 1.25rem' }}>
              Let's Build Something <span className="gold-gradient">Together</span>
            </h1>
            <p style={{ maxWidth:500,margin:'0 auto',fontSize:'1.05rem' }}>
              Share your vision with us. We'll respond within 24 hours with insights and a tailored approach.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ paddingBottom:'6rem' }}>
        <div className="container">
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1.6fr',gap:'3rem',alignItems:'start' }}>

            {/* Left: Info */}
            <motion.div initial={{ opacity:0,x:-30 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.6 }}>
              {/* Contact info */}
              <div className="glass" style={{ padding:'2rem',marginBottom:'1.25rem' }}>
                <h3 style={{ fontFamily:'var(--font-mono)',marginBottom:'1.75rem',color:'var(--text)' }}>Contact Information</h3>
                <div style={{ display:'flex',flexDirection:'column',gap:'1.25rem' }}>
                  {[
                    { icon:<FiMail/>, label:'Email', value:'hello@zeeltech.com', href:'mailto:hello@zeeltech.com' },
                    { icon:<FiPhone/>, label:'Phone', value:'+237 6XX XXX XXX', href:'tel:+2376XXXXXXX' },
                    { icon:<FiMapPin/>, label:'Location', value:'Bamenda, North West, Cameroon 🇨🇲' },
                  ].map(item => (
                    <div key={item.label} style={{ display:'flex',gap:'1rem',alignItems:'flex-start' }}>
                      <div style={{ width:36,height:36,borderRadius:8,background:'var(--gold-muted)',border:'1px solid var(--border-gold)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)',flexShrink:0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize:'0.72rem',color:'var(--text-dim)',fontFamily:'var(--font-mono)',letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:'0.2rem' }}>{item.label}</div>
                        {item.href
                          ? <a href={item.href} style={{ color:'var(--text)',fontSize:'0.92rem',transition:'var(--transition)' }} onMouseOver={e=>e.target.style.color='var(--gold)'} onMouseOut={e=>e.target.style.color='var(--text)'}>{item.value}</a>
                          : <div style={{ color:'var(--text)',fontSize:'0.92rem' }}>{item.value}</div>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="glass" style={{ padding:'1.75rem',marginBottom:'1.25rem' }}>
                <h4 style={{ fontFamily:'var(--font-mono)',fontSize:'0.85rem',color:'var(--text)',marginBottom:'1rem' }}>Follow Us</h4>
                <div style={{ display:'flex',gap:'0.75rem' }}>
                  {[{ icon:<FiLinkedin/>,label:'LinkedIn' },{ icon:<FiTwitter/>,label:'Twitter' },{ icon:<FiInstagram/>,label:'Instagram' }].map(s => (
                    <a key={s.label} href="#" style={{ width:40,height:40,borderRadius:8,background:'var(--surface)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:'1.1rem',transition:'var(--transition)' }}
                      onMouseOver={e=>{ e.currentTarget.style.color='var(--gold)'; e.currentTarget.style.borderColor='var(--border-gold)' }}
                      onMouseOut={e=>{ e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border)' }}
                      aria-label={s.label}
                    >{s.icon}</a>
                  ))}
                </div>
              </div>

              {/* Business hours */}
              <div className="glass" style={{ padding:'1.75rem',marginBottom:'1.25rem' }}>
                <h4 style={{ fontFamily:'var(--font-mono)',fontSize:'0.85rem',color:'var(--text)',marginBottom:'1rem' }}>Business Hours</h4>
                {[['Mon – Fri','8:00 AM – 6:00 PM WAT'],['Saturday','10:00 AM – 2:00 PM WAT'],['Sunday','Closed']].map(([day,hours]) => (
                  <div key={day} style={{ display:'flex',justifyContent:'space-between',padding:'0.4rem 0',borderBottom:'1px solid var(--border)',fontSize:'0.82rem' }}>
                    <span style={{ color:'var(--text-muted)',fontFamily:'var(--font-mono)' }}>{day}</span>
                    <span style={{ color: hours==='Closed'?'var(--text-dim)':'var(--gold)',fontFamily:'var(--font-mono)' }}>{hours}</span>
                  </div>
                ))}
              </div>

              {/* Newsletter */}
              <div className="glass-gold" style={{ padding:'1.75rem' }}>
                <h4 style={{ fontFamily:'var(--font-mono)',fontSize:'0.85rem',color:'var(--gold)',marginBottom:'0.5rem' }}>Newsletter</h4>
                <p style={{ fontSize:'0.82rem',marginBottom:'1rem' }}>Get our latest insights delivered to your inbox.</p>
                <form onSubmit={handleSubscribe} style={{ display:'flex',gap:'0.5rem' }}>
                  <input type="email" value={subscribeEmail} onChange={e=>setSubscribeEmail(e.target.value)} placeholder="your@email.com" style={{ flex:1,fontSize:'0.85rem',padding:'0.6rem 0.9rem' }}/>
                  <button type="submit" className="btn btn-gold" style={{ padding:'0.6rem 1rem',flexShrink:0 }} disabled={subscribing}>
                    {subscribing ? '...' : <FiSend/>}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.6,delay:0.1 }}>
              <div className="glass" style={{ padding:'2.5rem' }}>
                <h3 style={{ fontFamily:'var(--font-mono)',marginBottom:'0.5rem',color:'var(--text)' }}>Send Us a Message</h3>
                <p style={{ fontSize:'0.88rem',marginBottom:'2rem' }}>We'll get back to you within 24 hours, guaranteed.</p>

                <form onSubmit={handleSubmit}>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"/>
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@company.com"/>
                    </div>
                  </div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
                    <div className="form-group">
                      <label>Phone (Optional)</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890"/>
                    </div>
                    <div className="form-group">
                      <label>Service Interested In</label>
                      <select name="service" value={form.service} onChange={handleChange}>
                        <option value="">Select a service</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject *</label>
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?"/>
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea rows={6} name="message" value={form.message} onChange={handleChange}
                      placeholder="Tell us about your project — goals, timeline, budget, and anything else that's relevant..."/>
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width:'100%',justifyContent:'center',padding:'0.9rem',fontSize:'0.95rem' }} disabled={submitting}>
                    {submitting ? 'Sending...' : <><FiSend/> Send Message</>}
                  </button>

                  <p style={{ textAlign:'center',fontSize:'0.75rem',color:'var(--text-dim)',marginTop:'1rem' }}>
                    By submitting you agree to our Privacy Policy. We never share your data.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
        <style>{`@media(max-width:900px){section .container>div[style*="grid-template-columns: 1fr 1.6fr"]{grid-template-columns:1fr!important}} @media(max-width:540px){form>div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
      </section>
    </PageWrapper>
  )
}
