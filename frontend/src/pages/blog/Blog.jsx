import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Helmet } from 'react-helmet-async'
import { FiSearch, FiClock, FiEye, FiArrowRight } from 'react-icons/fi'
import { format } from 'date-fns'
import PageWrapper from '../../components/ui/PageWrapper'
import SectionHeader from '../../components/ui/SectionHeader'
import api from '../../utils/api'
import './Blog.css'

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
      <section className="page-hero">
        <div className="page-hero__orb" />
        <div className="container page-hero__inner">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label section-label--center">The Blog</span>
            <h1 className="page-hero__h1 page-hero__h1--narrow">
              Ideas, Insights &amp; <span className="gold-gradient">Deep Dives</span>
            </h1>
            <p className="page-hero__sub page-hero__sub--narrow">
              Practical writing on web development, design trends, digital marketing,
              and building products that matter.
            </p>
            <div className="blog-search">
              <FiSearch className="blog-search__icon" />
              <input
                placeholder="Search articles..."
                value={search}
                onChange={e => setFilter('search', e.target.value)}
                className="blog-search__input"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <div className="container blog-categories">
        {[{ _id: '', name: 'All' }, ...categories].map(cat => (
          <button
            key={cat._id}
            onClick={() => setFilter('category', cat._id)}
            className={`blog-cat-pill${category === cat._id ? ' blog-cat-pill--active' : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <section className="blog-posts-section">
        <div className="container">
          {/* Featured */}
          {featured && page === 1 && !search && !category && (
            <FeaturedPost post={featured} />
          )}

          {/* Grid */}
          {loading && posts.length === 0 ? (
            <div className="grid-3">{Array(6).fill(0).map((_, i) => <PostSkeleton key={i} />)}</div>
          ) : rest.length === 0 && !loading ? (
            <div className="blog-empty">
              <div className="blog-empty__icon">✍️</div>
              <p>No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid-3 blog-grid">
              {rest.map((post, i) => <PostCard key={post._id} post={post} index={i} />)}
            </div>
          )}

          {/* Load more */}
          {posts.length < total && (
            <div className="blog-loadmore">
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
    <motion.div
      className="featured-post"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link to={`/blog/${post.slug}`} className="featured-post__card">
        <div className="featured-post__img-wrap">
          <img src={post.coverImage} alt={post.title} className="featured-post__img" />
          <div className="featured-post__badge">
            <span className="tag tag--featured">Featured</span>
          </div>
        </div>
        <div className="featured-post__body">
          <div className="featured-post__meta">
            <span className="post-meta-item"><FiClock size={12} />{post.readTime} min read</span>
            <span className="post-meta-item"><FiEye size={12} />{post.views} views</span>
          </div>
          <h2 className="featured-post__title">{post.title}</h2>
          <p className="featured-post__excerpt">{post.excerpt}</p>
          <div className="featured-post__author">
            {post.author?.username && (
              <div className="post-author-name">
                By <span className="post-author-name__gold">{post.author.username}</span>
              </div>
            )}
            {post.publishedAt && (
              <div className="post-date">{format(new Date(post.publishedAt), 'MMM d, yyyy')}</div>
            )}
          </div>
          <div className="featured-post__cta">
            Read Article <FiArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function PostCard({ post, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
    >
      <Link to={`/blog/${post.slug}`} className="card post-card">
        <div className="post-card__thumb">
          <img src={post.coverImage} alt={post.title} className="post-card__img" />
          {post.category?.name && (
            <div className="post-card__cat">
              <span className="tag">{post.category.name}</span>
            </div>
          )}
        </div>
        <div className="post-card__body">
          <div className="post-card__meta">
            <span className="post-meta-item"><FiClock size={11} />{post.readTime} min</span>
            <span className="post-meta-item"><FiEye size={11} />{post.views}</span>
            {post.publishedAt && <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>}
          </div>
          <h3 className="post-card__title">{post.title}</h3>
          <p className="post-card__excerpt">{post.excerpt}</p>
          <div className="post-card__tags">
            {post.tags?.slice(0, 3).map(t => (
              <span key={t} className="tag tag--sm">{t}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function PostSkeleton() {
  return (
    <div className="card post-skeleton">
      <div className="skeleton post-skeleton__thumb" />
      <div className="post-skeleton__body">
        <div className="skeleton post-skeleton__meta" />
        <div className="skeleton post-skeleton__title" />
        <div className="skeleton post-skeleton__line post-skeleton__line--long" />
        <div className="skeleton post-skeleton__line post-skeleton__line--short" />
      </div>
    </div>
  )
}