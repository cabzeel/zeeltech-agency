import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FiClock, FiEye, FiArrowLeft, FiSend } from "react-icons/fi";
import { format } from "date-fns";
import toast from "react-hot-toast";
import PageWrapper from "../../components/ui/PageWrapper";
import api from "../../utils/api";
import "./BlogPost.css";

const SITE_URL      = "https://zeeltechsolutions.com";
const FALLBACK_IMAGE = `${SITE_URL}/og-image.png`;

export default function BlogPost() {
  const { slug }                    = useParams();
  const [post, setPost]             = useState(null);
  const [related, setRelated]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [comment, setComment]       = useState({ guestName: "", guestEmail: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/blogs/slug/${slug}`)
      .then((r) => {
        setPost(r.data.data);
        if (r.data.data.category?._id) {
          api.get(`/blogs?status=published&category=${r.data.data.category._id}&limit=3`)
            .then((r2) => setRelated(r2.data.data.filter((p) => p.slug !== slug)))
            .catch(() => {});
        }
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.guestName || !comment.guestEmail || !comment.content) {
      toast.error("Please fill in all fields"); return;
    }
    setSubmitting(true);
    try {
      await api.post("/comments", { ...comment, post: post._id });
      toast.success("Comment submitted! It will appear after review.");
      setComment({ guestName: "", guestEmail: "", content: "" });
    } catch {
      toast.error("Failed to submit comment. Please try again.");
    }
    setSubmitting(false);
  };

  /* ── Loading state ─────────────────────────────────────────────── */
  if (loading) return (
    <PageWrapper>
      <div className="container bp-skeleton-wrap">
        <div className="skeleton bp-skeleton-hero" />
        <div className="skeleton bp-skeleton-title" />
        <div className="skeleton bp-skeleton-sub" />
        {[1, 2, 3].map((i) => <div key={i} className="skeleton bp-skeleton-line" />)}
      </div>
    </PageWrapper>
  );

  /* ── Not found ─────────────────────────────────────────────────── */
  if (!post) return (
    <PageWrapper>
      <Helmet>
        <title>Article Not Found – Zeeltech Blog</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="error-block">
        <div className="error-block__icon">📭</div>
        <h2>Article Not Found</h2>
        <p style={{ marginBottom: "2rem" }}>This article doesn't exist or may have been removed.</p>
        <Link to="/blog" className="btn btn-gold">Back to Blog</Link>
      </div>
    </PageWrapper>
  );

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImage      = post.coverImage || FALLBACK_IMAGE;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: ogImage,
    url: canonicalUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author?.username || "ZeelTech Team",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "ZeelTech Web Solutions",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  const approvedComments = post.comments?.filter((c) => c.status === "approved") ?? [];

  return (
    <PageWrapper>
      <Helmet>
        <title>{post.title} – Zeeltech Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type"        content="article" />
        <meta property="og:title"       content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url"         content={canonicalUrl} />
        <meta property="og:image"       content={ogImage} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name"   content="ZeelTech Web Solutions" />
        {post.publishedAt && <meta property="article:published_time" content={post.publishedAt} />}
        {post.updatedAt   && <meta property="article:modified_time"  content={post.updatedAt} />}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image"       content={ogImage} />
        <script type="application/ld+json">{JSON.stringify(blogPostingSchema)}</script>
      </Helmet>

      {/* ── Hero image ────────────────────────────────────────────── */}
      <div className="bp-hero">
        <img src={post.coverImage} alt={post.title} className="bp-hero__img" />
        <div className="bp-hero__overlay" />
        <div className="container bp-hero__content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {post.category?.name && (
              <span className="tag" style={{ marginBottom: "1rem", display: "inline-block" }}>
                {post.category.name}
              </span>
            )}
            <h1 className="bp-hero__title">{post.title}</h1>
            <div className="bp-hero__meta">
              {post.author?.username && (
                <span>By <span style={{ color: "var(--gold)" }}>{post.author.username}</span></span>
              )}
              {post.publishedAt && <span>{format(new Date(post.publishedAt), "MMMM d, yyyy")}</span>}
              <span className="bp-hero__meta-item"><FiClock size={12} />{post.readTime} min read</span>
              <span className="bp-hero__meta-item"><FiEye size={12} />{post.views} views</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Article content ───────────────────────────────────────── */}
      <div className="container bp-content">
        <Link to="/blog" className="back-link"><FiArrowLeft /> Back to Blog</Link>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="bp-tags">
              {post.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          )}

          {/* Body */}
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ marginBottom: "3rem" }}
          />

          <div className="divider" />

          {/* Comments */}
          <section className="bp-comments">
            <h3 className="bp-comments__heading">Leave a Comment</h3>

            {approvedComments.length > 0 && (
              <div className="bp-comments__list">
                {approvedComments.map((c) => (
                  <div key={c._id} className="glass bp-comment">
                    <div className="comment-header">
                      <span className="comment-author">{c.guestName}</span>
                      <span className="comment-date">{format(new Date(c.createdAt), "MMM d, yyyy")}</span>
                    </div>
                    <p className="comment-body">{c.content}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={submitComment} className="glass bp-comment-form">
              <div className="bp-form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    value={comment.guestName}
                    onChange={(e) => setComment((p) => ({ ...p, guestName: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={comment.guestEmail}
                    onChange={(e) => setComment((p) => ({ ...p, guestEmail: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Comment *</label>
                <textarea
                  rows={4}
                  value={comment.content}
                  onChange={(e) => setComment((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Share your thoughts..."
                />
              </div>
              <p className="bp-comment-notice">Comments are reviewed before being published.</p>
              <button type="submit" className="btn btn-gold" disabled={submitting}>
                {submitting ? "Submitting..." : <><FiSend /> Submit Comment</>}
              </button>
            </form>
          </section>
        </motion.div>
      </div>

      {/* ── Related posts ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bp-related">
          <div className="container">
            <h3 className="bp-related__heading">Related Articles</h3>
            <div className="grid-3" style={{ gap: "1.25rem" }}>
              {related.map((p) => (
                <Link key={p._id} to={`/blog/${p.slug}`} className="card">
                  <div className="bp-related-card__img">
                    <img src={p.coverImage} alt={p.title} className="img-zoom" />
                  </div>
                  <div className="bp-related-card__body">
                    <div className="bp-related-card__meta">
                      <FiClock size={11} />{p.readTime} min
                    </div>
                    <h4 className="bp-related-card__title">{p.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageWrapper>
  );
}