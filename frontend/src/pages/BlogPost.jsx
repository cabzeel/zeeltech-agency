import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiClock, FiEye, FiArrowLeft, FiSend } from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import PageWrapper from '../components/ui/PageWrapper'
import api from '../utils/api'

export default function BlogPost() {
  const { slug }          = useParams()
  const [post, setPost]   = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState({ guestName:'', guestEmail:'', content:'' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/blogs/slug/${slug}`)
      .then(r => {
        setPost(r.data.data)
        // Fetch related
        if (r.data.data.category?._id) {
          api.get(`/blogs?status=published&category=${r.data.data.category._id}&limit=3`)
            .then(r2 => setRelated(r2.data.data.filter(p => p.slug !== slug)))
            .catch(() => {})
        }
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false))
  }, [slug])

  const submitComment = async e => {
    e.preventDefault()
    if (!comment.guestName || !comment.guestEmail || !comment.content) {
      toast.error('Please fill in all fields'); return
    }
    setSubmitting(true)
    try {
      await api.post('/comments', { ...comment, post: post._id })
      toast.success('Comment submitted! It will appear after review.')
      setComment({ guestName:'', guestEmail:'', content:'' })
    } catch {
      toast.error('Failed to submit comment. Please try again.')
    }
    setSubmitting(false)
  }

  if (loading) return (
    <PageWrapper>
      <div className="container" style={{ maxWidth:760,paddingTop:'2rem' }}>
        <div className="skeleton" style={{ height:400,borderRadius:'var(--radius-lg)',marginBottom:'2rem' }}/>
        <div className="skeleton" style={{ height:32,width:'80%',marginBottom:'1rem' }}/>
        <div className="skeleton" style={{ height:16,width:'60%',marginBottom:'2rem' }}/>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:14,marginBottom:'0.6rem' }}/>)}
      </div>
    </PageWrapper>
  )

  if (!post) return (
    <PageWrapper>
      <div style={{ textAlign:'center',padding:'8rem 2rem' }}>
        <div style={{ fontSize:'4rem',marginBottom:'1rem' }}>📭</div>
        <h2>Article Not Found</h2>
        <p style={{ marginBottom:'2rem' }}>This article doesn't exist or may have been removed.</p>
        <Link to="/blog" className="btn btn-gold">Back to Blog</Link>
      </div>
    </PageWrapper>
  )

  return (
    <PageWrapper>
      <Helmet>
        <title>{post.title} – Zeeltech Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Hero image */}
      <div style={{ position:'relative',height:'clamp(280px,45vw,520px)',overflow:'hidden',marginBottom:'0' }}>
        <img src={post.coverImage} alt={post.title} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.85) 100%)' }}/>
        <div className="container" style={{ position:'absolute',bottom:'2.5rem',left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:760 }}>
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }}>
            {post.category?.name && <span className="tag" style={{ marginBottom:'1rem',display:'inline-block' }}>{post.category.name}</span>}
            <h1 style={{ fontSize:'clamp(1.8rem,4vw,3rem)',marginBottom:'1rem',lineHeight:1.2 }}>{post.title}</h1>
            <div style={{ display:'flex',gap:'1.5rem',flexWrap:'wrap',fontSize:'0.82rem',color:'rgba(255,255,255,0.7)',fontFamily:'var(--font-mono)' }}>
              {post.author?.username && <span>By <span style={{ color:'var(--gold)' }}>{post.author.username}</span></span>}
              {post.publishedAt && <span>{format(new Date(post.publishedAt),'MMMM d, yyyy')}</span>}
              <span style={{ display:'flex',alignItems:'center',gap:'0.3rem' }}><FiClock size={12}/>{post.readTime} min read</span>
              <span style={{ display:'flex',alignItems:'center',gap:'0.3rem' }}><FiEye size={12}/>{post.views} views</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ maxWidth:760,padding:'3rem clamp(1rem,4vw,3rem)' }}>
        <Link to="/blog" style={{ display:'inline-flex',alignItems:'center',gap:'0.4rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)',fontSize:'0.82rem',marginBottom:'2.5rem',transition:'var(--transition)' }}
          onMouseOver={e=>e.currentTarget.style.color='var(--gold)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}
        ><FiArrowLeft/> Back to Blog</Link>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2,duration:0.6 }}>
          {/* Tags */}
          <div style={{ display:'flex',gap:'0.4rem',flexWrap:'wrap',marginBottom:'2.5rem' }}>
            {post.tags?.map(t => <span key={t} className="tag">{t}</span>)}
          </div>

          {/* Article body */}
          <article className="prose" dangerouslySetInnerHTML={{ __html: post.content }} style={{ marginBottom:'3rem' }}/>

          {/* Divider */}
          <div style={{ height:1,background:'var(--border)',margin:'3rem 0' }}/>

          {/* Comments section */}
          <div>
            <h3 style={{ fontFamily:'var(--font-mono)',marginBottom:'2rem',color:'var(--text)' }}>
              Leave a Comment
            </h3>

            {/* Approved comments */}
            {post.comments?.filter(c => c.status === 'approved').length > 0 && (
              <div style={{ marginBottom:'2.5rem',display:'flex',flexDirection:'column',gap:'1rem' }}>
                {post.comments.filter(c => c.status === 'approved').map(c => (
                  <div key={c._id} className="glass" style={{ padding:'1.25rem' }}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'0.5rem' }}>
                      <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.85rem',color:'var(--text)',fontWeight:600 }}>{c.guestName}</span>
                      <span style={{ fontSize:'0.75rem',color:'var(--text-dim)' }}>{format(new Date(c.createdAt),'MMM d, yyyy')}</span>
                    </div>
                    <p style={{ fontSize:'0.9rem',margin:0 }}>{c.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Comment form */}
            <form onSubmit={submitComment} className="glass" style={{ padding:'2rem' }}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
                <div className="form-group">
                  <label>Name *</label>
                  <input value={comment.guestName} onChange={e=>setComment(p=>({...p,guestName:e.target.value}))} placeholder="John Doe"/>
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={comment.guestEmail} onChange={e=>setComment(p=>({...p,guestEmail:e.target.value}))} placeholder="john@example.com"/>
                </div>
              </div>
              <div className="form-group">
                <label>Comment *</label>
                <textarea rows={4} value={comment.content} onChange={e=>setComment(p=>({...p,content:e.target.value}))} placeholder="Share your thoughts..."/>
              </div>
              <p style={{ fontSize:'0.78rem',color:'var(--text-dim)',marginBottom:'1.25rem' }}>Comments are reviewed before being published.</p>
              <button type="submit" className="btn btn-gold" disabled={submitting}>
                {submitting ? 'Submitting...' : <><FiSend/> Submit Comment</>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section style={{ background:'var(--bg-1)',padding:'4rem 0' }}>
          <div className="container">
            <h3 style={{ fontFamily:'var(--font-mono)',marginBottom:'2rem',color:'var(--text)' }}>Related Articles</h3>
            <div className="grid-3" style={{ gap:'1.25rem' }}>
              {related.map(p => (
                <Link key={p._id} to={`/blog/${p.slug}`} className="card" style={{ display:'block' }}>
                  <div style={{ height:160,overflow:'hidden' }}>
                    <img src={p.coverImage} alt={p.title} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s' }}
                      onMouseOver={e=>e.target.style.transform='scale(1.06)'} onMouseOut={e=>e.target.style.transform='scale(1)'}
                    />
                  </div>
                  <div style={{ padding:'1.25rem' }}>
                    <div style={{ fontSize:'0.75rem',color:'var(--text-dim)',fontFamily:'var(--font-mono)',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.3rem' }}><FiClock size={11}/>{p.readTime} min</div>
                    <h4 style={{ fontFamily:'var(--font-mono)',fontSize:'0.9rem',color:'var(--text)',lineHeight:1.5 }}>{p.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageWrapper>
  )
}
