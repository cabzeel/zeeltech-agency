import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Helmet } from 'react-helmet-async'
import { FiSearch, FiClock, FiEye, FiArrowRight } from 'react-icons/fi'
import { format } from 'date-fns'
import PageWrapper from '../components/ui/PageWrapper'
import SectionHeader from '../components/ui/SectionHeader'
import api from '../utils/api'

export default function Blog() {
  const [posts, setPosts]           = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [total, setTotal]           = useState(0)
  const [page, setPage]             = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()

  const search   = searchParams.get('search')   || ''
  const category = searchParams.get('category') || ''

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ status: 'published', limit: 9, page })
      if (search)   params.set('search', search)
      if (category) params.set('category', category)
      const r = await api.get(`/blogs?${params}`)
      setPosts(page === 1 ? r.data.data : prev => [...prev, ...r.data.data])
      setTotal(r.data.total)
    } catch (e) {}
    setLoading(false)
  }, [search, category, page])

  useEffect(() => { setPage(1); setPosts([]) }, [search, category])
  useEffect(() => { fetchPosts() }, [fetchPosts])

  useEffect(() => {
    api.get('/categories?type=blog').then(r => setCategories(r.data.data)).catch(() => {})
  }, [])

  const setFilter = (key, val) => {
    setSearchParams(prev => {
      if (val) prev.set(key, val); else prev.delete(key)
      return prev
    })
  }

  const featured = posts.find(p => p.isFeatured)
  const rest     = posts.filter(p => p._id !== featured?._id)

  return (
    <PageWrapper>
      <Helmet>
        <title>Blog – Zeeltech Agency</title>
        <meta name="description" content="Insights, tutorials, and industry deep-dives from the Zeeltech team on web development, design, and digital growth." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '5rem 0 3rem', position: 'relative' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,180,41,0.07) 0%, transparent 70%)' }} />
        <div className="container" style={{ position:'relative',textAlign:'center' }}>
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }}>
            <span className="section-label" style={{ justifyContent:'center' }}>The Blog</span>
            <h1 style={{ maxWidth:600,margin:'0 auto 1.5rem' }}>
              Ideas, Insights &amp; <span className="gold-gradient">Deep Dives</span>
            </h1>
            <p style={{ maxWidth:480,margin:'0 auto 2.5rem',fontSize:'1.05rem' }}>
              Practical writing on web development, design trends, digital marketing, and building products that matter.
            </p>

            {/* Search */}
            <div style={{ maxWidth:520,margin:'0 auto',position:'relative' }}>
              <FiSearch style={{ position:'absolute',left:'1rem',top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none' }} />
              <input
                placeholder="Search articles..."
                value={search}
                onChange={e => setFilter('search', e.target.value)}
                style={{ paddingLeft:'2.75rem',borderRadius:100 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <div className="container" style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex',gap:'0.5rem',flexWrap:'wrap',justifyContent:'center' }}>
          {[{ _id:'',name:'All' },...categories].map(cat => (
            <button key={cat._id} onClick={() => setFilter('category', cat._id)}
              style={{
                padding:'0.35rem 1rem',borderRadius:100,border:'1px solid',cursor:'pointer',
                fontFamily:'var(--font-mono)',fontSize:'0.8rem',fontWeight:500,
                transition:'var(--transition)',
                background: category === cat._id ? 'var(--gold)' : 'transparent',
                borderColor: category === cat._id ? 'var(--gold)' : 'var(--border)',
                color: category === cat._id ? '#080808' : 'var(--text-muted)',
              }}
            >{cat.name}</button>
          ))}
        </div>
      </div>

      <section style={{ paddingBottom:'5rem' }}>
        <div className="container">
          {/* Featured */}
          {featured && page === 1 && !search && !category && (
            <FeaturedPost post={featured} />
          )}

          {/* Grid */}
          {loading && posts.length === 0 ? (
            <div className="grid-3">{Array(6).fill(0).map((_,i)=><PostSkeleton key={i}/>)}</div>
          ) : rest.length === 0 && !loading ? (
            <div style={{ textAlign:'center',padding:'4rem',color:'var(--text-muted)' }}>
              <div style={{ fontSize:'3rem',marginBottom:'1rem' }}>✍️</div>
              <p>No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid-3" style={{ gap:'1.5rem' }}>
              {rest.map((post, i) => <PostCard key={post._id} post={post} index={i} />)}
            </div>
          )}

          {/* Load more */}
          {posts.length < total && (
            <div style={{ textAlign:'center',marginTop:'3rem' }}>
              <button onClick={() => setPage(p => p + 1)} className="btn btn-outline" disabled={loading}>
                {loading ? 'Loading...' : 'Load More Articles'}
              </button>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  )
}

function FeaturedPost({ post }) {
  return (
    <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }}
      style={{ marginBottom:'3rem' }}>
      <Link to={`/blog/${post.slug}`} style={{ display:'grid',gridTemplateColumns:'1.3fr 1fr',borderRadius:'var(--radius-lg)',overflow:'hidden',border:'1px solid var(--border-gold)',background:'var(--bg-2)',transition:'var(--transition)' }}
        onMouseOver={e => e.currentTarget.style.boxShadow='var(--shadow-gold)'}
        onMouseOut={e => e.currentTarget.style.boxShadow='none'}
      >
        <div style={{ position:'relative',height:360,overflow:'hidden' }}>
          <img src={post.coverImage} alt={post.title} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s ease' }}
            onMouseOver={e=>e.target.style.transform='scale(1.05)'} onMouseOut={e=>e.target.style.transform='scale(1)'}
          />
          <div style={{ position:'absolute',top:'1.25rem',left:'1.25rem' }}>
            <span className="tag" style={{ background:'var(--gold)',color:'#080808',border:'none',fontWeight:700 }}>Featured</span>
          </div>
        </div>
        <div style={{ padding:'2.5rem',display:'flex',flexDirection:'column',justifyContent:'center' }}>
          <div style={{ display:'flex',gap:'1rem',marginBottom:'1.25rem',fontSize:'0.8rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)' }}>
            <span style={{ display:'flex',alignItems:'center',gap:'0.3rem' }}><FiClock size={12}/>{post.readTime} min read</span>
            <span style={{ display:'flex',alignItems:'center',gap:'0.3rem' }}><FiEye size={12}/>{post.views} views</span>
          </div>
          <h2 style={{ fontSize:'clamp(1.4rem,2.5vw,2rem)',marginBottom:'1rem',color:'var(--text)',lineHeight:1.3 }}>{post.title}</h2>
          <p style={{ fontSize:'0.92rem',lineHeight:1.8,marginBottom:'1.5rem' }}>{post.excerpt}</p>
          <div style={{ display:'flex',alignItems:'center',gap:'0.75rem' }}>
            {post.author?.username && (
              <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.8rem',color:'var(--text-muted)' }}>
                By <span style={{ color:'var(--gold)' }}>{post.author.username}</span>
              </div>
            )}
            {post.publishedAt && (
              <div style={{ fontSize:'0.8rem',color:'var(--text-dim)' }}>
                {format(new Date(post.publishedAt),'MMM d, yyyy')}
              </div>
            )}
          </div>
          <div style={{ marginTop:'1.5rem',display:'flex',alignItems:'center',gap:'0.4rem',color:'var(--gold)',fontFamily:'var(--font-mono)',fontSize:'0.85rem',fontWeight:500 }}>
            Read Article <FiArrowRight size={14}/>
          </div>
        </div>
      </Link>
      <style>{`@media(max-width:768px){a[style*="grid-template-columns"]{grid-template-columns:1fr!important}}`}</style>
    </motion.div>
  )
}

function PostCard({ post, index }) {
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.08 })
  return (
    <motion.div ref={ref} initial={{ opacity:0,y:30 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.5,delay:(index%3)*0.1 }}>
      <Link to={`/blog/${post.slug}`} className="card" style={{ display:'flex',flexDirection:'column',height:'100%' }}>
        <div style={{ position:'relative',height:200,overflow:'hidden' }}>
          <img src={post.coverImage} alt={post.title}
            style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s ease' }}
            onMouseOver={e=>e.target.style.transform='scale(1.06)'} onMouseOut={e=>e.target.style.transform='scale(1)'}
          />
          {post.category?.name && (
            <div style={{ position:'absolute',bottom:'0.75rem',left:'0.75rem' }}>
              <span className="tag">{post.category.name}</span>
            </div>
          )}
        </div>
        <div style={{ padding:'1.5rem',display:'flex',flexDirection:'column',flex:1 }}>
          <div style={{ display:'flex',gap:'1rem',marginBottom:'0.75rem',fontSize:'0.75rem',color:'var(--text-dim)',fontFamily:'var(--font-mono)' }}>
            <span style={{ display:'flex',alignItems:'center',gap:'0.3rem' }}><FiClock size={11}/>{post.readTime} min</span>
            <span style={{ display:'flex',alignItems:'center',gap:'0.3rem' }}><FiEye size={11}/>{post.views}</span>
            {post.publishedAt && <span>{format(new Date(post.publishedAt),'MMM d, yyyy')}</span>}
          </div>
          <h3 style={{ fontFamily:'var(--font-mono)',fontSize:'1rem',fontWeight:600,color:'var(--text)',marginBottom:'0.6rem',lineHeight:1.5 }}>{post.title}</h3>
          <p style={{ fontSize:'0.85rem',lineHeight:1.7,flex:1 }}>{post.excerpt}</p>
          <div style={{ marginTop:'1.25rem',display:'flex',gap:'0.4rem',flexWrap:'wrap' }}>
            {post.tags?.slice(0,3).map(t => <span key={t} className="tag" style={{ fontSize:'0.7rem' }}>{t}</span>)}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function PostSkeleton() {
  return (
    <div className="card">
      <div className="skeleton" style={{ height:200 }}/>
      <div style={{ padding:'1.5rem' }}>
        <div className="skeleton" style={{ height:12,width:'40%',marginBottom:'0.75rem' }}/>
        <div className="skeleton" style={{ height:18,marginBottom:'0.5rem' }}/>
        <div className="skeleton" style={{ height:14,width:'90%',marginBottom:'0.4rem' }}/>
        <div className="skeleton" style={{ height:14,width:'75%' }}/>
      </div>
    </div>
  )
}
