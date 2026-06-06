import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet-async";
import { FiSearch, FiClock, FiEye, FiArrowRight } from "react-icons/fi";
import { format } from "date-fns";
import PageWrapper from "../../components/ui/PageWrapper";
import SectionHeader from "../../components/ui/SectionHeader";
import api from "../../utils/api";
import "./Blog.css";

export default function Blog() {
  const [posts, setPosts]               = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const search   = searchParams.get("search")   || "";
  const category = searchParams.get("category") || "";

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "published", limit: 9, page });
      if (search)   params.set("search", search);
      if (category) params.set("category", category);
      const r = await api.get(`/blogs?${params}`);
      setPosts(page === 1 ? r.data.data : (prev) => [...prev, ...r.data.data]);
      setTotal(r.data.total);
    } catch (e) {}
    setLoading(false);
  }, [search, category, page]);

  useEffect(() => { setPage(1); setPosts([]); }, [search, category]);
  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    api.get("/categories?type=blog").then((r) => setCategories(r.data.data)).catch(() => {});
  }, []);

  const setFilter = (key, val) => {
    setSearchParams((prev) => {
      if (val) prev.set(key, val); else prev.delete(key);
      return prev;
    });
  };

  const featured = posts.find((p) => p.isFeatured);
  const rest     = posts.filter((p) => p._id !== featured?._id);

  return (
    <PageWrapper>
      <Helmet>
        <title>Blog – Zeeltech Agency</title>
        <meta name="description" content="Insights, tutorials, and industry deep-dives from the Zeeltech team on web development, design, and digital growth." />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="page-hero page-hero--sm">
        <div className="page-hero__glow" />
        <div className="container page-hero__inner">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label" style={{ justifyContent: "center" }}>The Blog</span>
            <h1 style={{ maxWidth: 600, margin: "0 auto 1.5rem" }}>
              Ideas, Insights &amp; <span className="gold-gradient">Deep Dives</span>
            </h1>
            <p style={{ maxWidth: 480, margin: "0 auto 2.5rem", fontSize: "1.05rem" }}>
              Practical writing on web development, design trends, digital marketing, and building products that matter.
            </p>
            <div className="search-wrap">
              <FiSearch className="search-wrap__icon" />
              <input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setFilter("search", e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Category filter ───────────────────────────────────────────── */}
      <div className="container">
        <div className="filter-bar">
          {[{ _id: "", name: "All" }, ...categories].map((cat) => (
            <button
              key={cat._id}
              className={`filter-btn${category === cat._id ? " active" : ""}`}
              onClick={() => setFilter("category", cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Posts ────────────────────────────────────────────────────── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="container">
          {featured && page === 1 && !search && !category && (
            <FeaturedPost post={featured} />
          )}

          {loading && posts.length === 0 ? (
            <div className="grid-3">
              {Array(6).fill(0).map((_, i) => <PostSkeleton key={i} />)}
            </div>
          ) : rest.length === 0 && !loading ? (
            <div className="empty-state">
              <div className="empty-state__icon">✍️</div>
              <p>No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: "1.5rem" }}>
              {rest.map((post, i) => <PostCard key={post._id} post={post} index={i} />)}
            </div>
          )}

          {posts.length < total && (
            <div className="load-more-row">
              <button onClick={() => setPage((p) => p + 1)} className="btn btn-outline" disabled={loading}>
                {loading ? "Loading..." : "Load More Articles"}
              </button>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

/* ── FeaturedPost ────────────────────────────────────────────────────── */
function FeaturedPost({ post }) {
  return (
    <motion.div
      className="featured-post-wrap"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link to={`/blog/${post.slug}`} className="featured-post">
        <div className="featured-post__img-wrap">
          <img src={post.coverImage} alt={post.title} className="img-zoom" />
          <div className="featured-post__badge-wrap">
            <span className="tag featured-post__badge">Featured</span>
          </div>
        </div>
        <div className="featured-post__body">
          <div className="featured-post__meta">
            <span className="featured-post__meta-item"><FiClock size={12} />{post.readTime} min read</span>
            <span className="featured-post__meta-item"><FiEye size={12} />{post.views} views</span>
          </div>
          <h2 className="featured-post__title">{post.title}</h2>
          <p className="featured-post__excerpt">{post.excerpt}</p>
          <div className="featured-post__byline">
            {post.author?.username && (
              <span className="featured-post__author">
                By <span style={{ color: "var(--gold)" }}>{post.author.username}</span>
              </span>
            )}
            {post.publishedAt && (
              <span className="featured-post__date">
                {format(new Date(post.publishedAt), "MMM d, yyyy")}
              </span>
            )}
          </div>
          <div className="featured-post__read-link">
            Read Article <FiArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── PostCard ────────────────────────────────────────────────────────── */
function PostCard({ post, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
    >
      <Link to={`/blog/${post.slug}`} className="card post-card">
        <div className="post-card__img-wrap">
          <img src={post.coverImage} alt={post.title} className="img-zoom" />
          {post.category?.name && (
            <div className="post-card__cat-wrap">
              <span className="tag">{post.category.name}</span>
            </div>
          )}
        </div>
        <div className="post-card__body">
          <div className="post-card__meta">
            <span className="post-card__meta-item"><FiClock size={11} />{post.readTime} min</span>
            <span className="post-card__meta-item"><FiEye size={11} />{post.views}</span>
            {post.publishedAt && <span>{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>}
          </div>
          <h3 className="post-card__title">{post.title}</h3>
          <p className="post-card__excerpt">{post.excerpt}</p>
          <div className="post-card__tags">
            {post.tags?.slice(0, 3).map((t) => (
              <span key={t} className="tag post-card__tag">{t}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── PostSkeleton ────────────────────────────────────────────────────── */
function PostSkeleton() {
  return (
    <div className="card">
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: "1.5rem" }}>
        <div className="skeleton" style={{ height: 12, width: "40%", marginBottom: "0.75rem" }} />
        <div className="skeleton" style={{ height: 18, marginBottom: "0.5rem" }} />
        <div className="skeleton" style={{ height: 14, width: "90%", marginBottom: "0.4rem" }} />
        <div className="skeleton" style={{ height: 14, width: "75%" }} />
      </div>
    </div>
  );
}