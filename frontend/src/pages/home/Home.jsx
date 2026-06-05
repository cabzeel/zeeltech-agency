import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCode,
  FiLayout,
  FiTrendingUp,
  FiShield,
  FiCheckCircle,
  FiChevronDown,
  FiPhone,
  FiMapPin,
  FiZap,
} from "react-icons/fi";

import "./Home.css";
import PageWrapper from "../../components/ui/PageWrapper";
import api from "../../utils/api";
import { TRUST_ITEMS, TICKER_ITEMS, PROOF_STATS, PROBLEM_ITEMS, AUDIT_ITEMS } from "../../data/home.data";
import { FAQ_DATA, INDUSTRIES, SERVICE_FALLBACKS, ICON_MAP } from "../../data/home.data";


/* ─── SECTION HEADER ─────────────────────────────────────────────────── */
function SectionHead({ num, label, title, serif, subtitle, center }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div
      ref={ref}
      className={`section-head${center ? " section-head--center" : ""}`}
    >
      <div className="rule-divider">
        <div className="bracket-label">{label}</div>
        {num && (
          <span className="section-num">{num}</span>
        )}
      </div>
      <motion.h2
        className={`section-head__h2${subtitle ? " section-head__h2--with-sub" : ""}`}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {title}
        {serif && (
          <em className="section-head__serif"> {serif}</em>
        )}
      </motion.h2>
      {subtitle && (
        <p className={`section-head__sub${center ? " section-head__sub--center" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ─── FAQ ACCORDION ──────────────────────────────────────────────────── */
function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-border">
      {FAQ_DATA.map((item, i) => (
        <div key={i} className="faq-item">
          <button
            className="faq-trigger"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.q}</span>
            <FiChevronDown
              className={`faq-chevron${open === i ? " faq-chevron--open" : ""}`}
            />
          </button>
          <div className={`faq-body${open === i ? " open" : ""}`}>{item.a}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function Home() {
  const [services, setServices]         = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [projects, setProjects]         = useState([]);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 70]);

  useEffect(() => {
    api.get("/services?status=active&limit=3").then((r) => setServices(r.data.data)).catch(() => {});
    api.get("/testimonials?status=approved&isFeatured=true").then((r) => setTestimonials(r.data.data)).catch(() => {});
    api.get("/projects?isFeatured=true&limit=2").then((r) => setProjects(r.data.data)).catch(() => {});
  }, []);

  const displayServices = services.length ? services.slice(0, 3) : SERVICE_FALLBACKS;

  return (
    <PageWrapper className="home-page">
      <Helmet>
        <title>Contractor Website Design That Generates Leads | ZeelTech Solutions</title>
        <meta name="description" content="ZeelTech builds lead-generating websites for fire protection, commercial cleaning, and facility service companies. Custom sites with local SEO, quote funnels, and credibility-first design. Free website audit." />
        <link rel="canonical" href="https://zeeltechsolutions.com/" />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__grid-bg" />
        <div className="hero__vignette" />
        <div className="hero__orb" />

        <span className="hero-mark hero__mark--tl">x: 0.00</span>
        <span className="hero-mark hero__mark--tr">y: 0.00</span>
        <span className="hero-mark hero__mark--bl">ZT.2026</span>

        <div className="hero__corner hero__corner--tl" />
        <div className="hero__corner hero__corner--tr" />
        <div className="hero__corner hero__corner--bl" />
        <div className="hero__corner hero__corner--br" />

        <div className="container hero__inner">
          <motion.div style={{ y: heroY }}>
            {/* Badge */}
            <motion.div
              className="hero__badge"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="hero__badge-text">
                <span className="hero__badge-dot" />
                Specializing in commercial service contractors
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="hero__h1"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Websites That
              <br />
              <em className="hero__h1-serif">Win Contracts</em>
              <br />
              For Your Service Business
            </motion.h1>

            {/* Sub */}
            <motion.p
              className="hero__sub"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Fire protection, commercial cleaning, and facility service companies hire ZeelTech when they're tired of losing bids to competitors with better-looking websites.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="hero__ctas"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link to="/contact" className="btn-primary">
                Get a Free Website Audit <FiArrowRight />
              </Link>
              <Link to="/projects" className="btn-outline">
                See Contractor Websites <FiArrowUpRight />
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div
              className="hero__trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {TRUST_ITEMS.map((t) => (
                <span key={t} className="hero__trust-item">
                  <FiCheckCircle className="hero__trust-icon" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="hero__scroll"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <span className="hero__scroll-label">Scroll</span>
          <span className="hero__scroll-line" />
        </motion.div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────────────── */}
      <div className="ticker-section">
        <div className="ticker-track ticker-row">
          {Array(2).fill(TICKER_ITEMS).flat().map((item, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-item__text">{item}</span>
              <span className="ticker-item__dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── PROOF BAR ────────────────────────────────────────────────── */}
      <section className="proof-section">
        <div className="proof-bar">
          {PROOF_STATS.map((stat, i) => (
            <ProofBarItem key={i} {...stat} />
          ))}
        </div>
      </section>

      {/* ── PROBLEM / POSITIONING ────────────────────────────────────── */}
      <section className="section--steel">
        <div className="container">
          <div className="problem-layout">
            <div>
              <SectionHead
                num="02 / 09"
                label="The Problem"
                title="Your Competitors Are Winning Bids"
                serif="You Deserve."
              />
              <p className="problem__body">
                A facility manager searches for a commercial cleaner. They find your website and a competitor's. Yours looks like it was built in 2016. Theirs looks credible, loads fast, and has a clear quote form. They call them.
              </p>
              <p className="problem__body problem__cta">
                You didn't lose that bid because of your service. You lost it because of your website. That's the problem ZeelTech was built to solve — specifically for contractors, specifically for commercial work.
              </p>
              <Link to="/contact" className="btn-primary">
                Book a Free Audit Call <FiArrowRight />
              </Link>
            </div>

            <div>
              {PROBLEM_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={[
                    "problem-list__item",
                    item.bad ? "problem-list__item--bad" : "problem-list__item--good",
                    i === 2 ? "problem-list__item--divider" : "",
                  ].join(" ").trim()}
                >
                  <span
                    className={`problem-list__icon ${
                      item.bad ? "problem-list__icon--bad" : "problem-list__icon--good"
                    }`}
                  >
                    {item.bad ? "✕" : "✓"}
                  </span>
                  <div>
                    <div
                      className={`problem-list__label ${
                        item.bad ? "problem-list__label--bad" : "problem-list__label--good"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="problem-list__desc">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section className="section--steel-1">
        <div className="container">
          <SectionHead
            num="03 / 09"
            label="What You Get"
            title="Systems Built to"
            serif="Fill Your Pipeline"
            subtitle="We don't just build websites. We build lead generation infrastructure — around how commercial service companies actually win business."
          />
          <div className="zt-grid-3">
            {displayServices.map((s, i) => (
              <ServiceCard
                key={s?._id || s?.slug || i}
                service={s}
                index={i}
                IconComponent={ICON_MAP[s?.slug]}
              />
            ))}
          </div>
          <div style={{ marginTop: "3rem" }}>
            <Link to="/services" className="btn-outline">
              View All Services <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ───────────────────────────────────────────────── */}
      <section className="section--steel">
        <div className="container">
          <SectionHead
            num="04 / 09"
            label="Who We Build For"
            title="We Know"
            serif="Your Industry"
            subtitle="Generic agency websites don't work for commercial service contractors. We've built specifically for these niches — we already know what your customers search for, what objections they have, and what makes them pick up the phone."
          />
          <div className="zt-grid-4">
            {INDUSTRIES.map((ind, i) => (
              <IndustryCard key={i} data={ind} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────────────────── */}
      <section className="section--steel-1">
        <div className="container">
          <SectionHead
            num="05 / 09"
            label="Proof of Work"
            title="What Happens After"
            serif="We Build Your Site"
            subtitle="Real projects. Real contractors. Real results — measured in quote requests, search rankings, and revenue."
          />
          <div className="zt-grid-2">
            {(projects.length ? projects : Array(2).fill(null)).map((p, i) => (
              <CaseCard key={p?._id || i} project={p} index={i} />
            ))}
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <Link to="/projects" className="btn-outline">
              View All Projects <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="section--steel">
          <div className="container">
            <SectionHead
              num="06 / 09"
              label="Client Results"
              title="What Contractors Say"
              serif="After Launch"
              subtitle="Not about the design. About the results."
              center
            />
            <div className="zt-grid-3">
              {testimonials.map((t, i) => (
                <TestimonialCard key={t._id} t={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="section--steel-1">
        <div className="container">
          <div className="faq-layout">
            <div>
              <SectionHead
                num="07 / 09"
                label="Before You Ask"
                title="Honest Answers"
                serif="Upfront"
              />
              <p className="faq-intro__body">
                We know you've been burned by vague agency promises. These are the real answers to the questions every contractor asks.
              </p>
              <Link to="/contact" className="btn-primary">
                <FiPhone size={14} /> Book Your Free Audit
              </Link>
            </div>
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="section--cta">
        <div className="cta__watermark">AUDIT</div>
        <div className="container cta__inner">
          <div className="cta-grid">
            <div>
              <div className="bracket-label cta__label">Ready to build?</div>
              <h2 className="cta__h2">
                Ready to Stop Losing Bids to Competitors With{" "}
                <em className="cta__serif">Better Websites?</em>
              </h2>
              <p className="cta__sub">
                We'll audit your current site (or your top competitor's) for free and show you exactly what's costing you leads. No pitch. No pressure. Just a 15-minute call and an honest assessment.
              </p>
              <div className="cta__btns">
                <Link to="/contact" className="btn-primary">
                  Book My Free Website Audit <FiArrowRight />
                </Link>
                <Link to="/projects" className="btn-outline">
                  See Our Work First
                </Link>
              </div>
              <p className="cta__fine">
                15-minute call &nbsp;·&nbsp; No commitment &nbsp;·&nbsp; Response within 24 hours
              </p>
            </div>

            <div className="cta__box">
              <div className="cta__box-title">What the audit covers</div>
              {AUDIT_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={`cta__box-item${i < AUDIT_ITEMS.length - 1 ? " cta__box-item--bordered" : ""}`}
                >
                  <FiCheckCircle className="cta__box-icon" />
                  <span className="cta__box-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────── */

function ProofBarItem({ num, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className="proof-bar-item"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="proof-bar-num">{num}</div>
      <div className="proof-bar-label">{label}</div>
    </motion.div>
  );
}

function ServiceCard({ service, index, IconComponent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  if (!service) {
    return (
      <div className="service-card--loading">
        <div className="zt-skeleton skeleton-icon" />
        <div className="zt-skeleton skeleton-title" />
        <div className="zt-skeleton skeleton-line-1" />
        <div className="zt-skeleton skeleton-line-2" />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/services/${service.slug}`} className="service-card">
        <div className="service-card__top">
          <div className="service-card__icon-box">
            {IconComponent ? <IconComponent /> : <FiCode />}
          </div>
          <span className="service-card__index">0{index + 1}</span>
        </div>
        <h4 className="service-card__title">{service.title}</h4>
        <p className="service-card__desc">{service.subDescription}</p>
        <div className="service-card__more">
          Learn more <FiArrowRight size={11} />
        </div>
      </Link>
    </motion.div>
  );
}

function IndustryCard({ data, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = data.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="industry-card"
    >
      <div className="industry-num">{data.num} / 04</div>
      <div className="industry-icon"><Icon /></div>
      <h4>{data.title}</h4>
      <p>{data.body}</p>
      <Link to={data.link} className="arrow-link">
        {data.linkLabel} <FiArrowUpRight size={11} />
      </Link>
    </motion.div>
  );
}

function CaseCard({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  if (!project) {
    return (
      <div className="case-card case-card--loading">
        <div className="case-card__banner-skeleton">
          <div className="zt-skeleton skeleton-result-num" />
          <div className="zt-skeleton skeleton-result-lbl" />
        </div>
        <div className="case-card__body">
          <div className="zt-skeleton skeleton-title" style={{ marginBottom: "0.75rem" }} />
          <div className="zt-skeleton skeleton-line-1" style={{ marginBottom: "0.4rem" }} />
          <div className="zt-skeleton skeleton-line-2" />
        </div>
      </div>
    );
  }

  const primaryResult = project.results?.[0];
  const otherResults  = project.results?.slice(1, 3) || [];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="case-card"
    >
      <div className="case-result-banner">
        <div className="case-result-num">{primaryResult?.value || "+42"}</div>
        <div className="case-result-label">
          {primaryResult?.metric || "new quote requests in 60 days"}
        </div>
      </div>

      <div className="case-card__body">
        <div className="case-card__tags">
          <span className="zt-tag">
            {(typeof project.category === "object" ? project.category?.name : project.category) || "Commercial Cleaning"}
          </span>
          {project.location && (
            <span className="zt-tag">
              {typeof project.location === "object" ? project.location?.name : project.location}
            </span>
          )}
        </div>
        <h4 className="case-card__title">{project.title}</h4>
        <p className="case-card__desc">{project.description?.slice(0, 130)}...</p>

        {otherResults.length > 0 && (
          <div className="case-card__stats">
            {otherResults.map((r, i) => (
              <div
                key={i}
                className={`case-card__stat${i < otherResults.length - 1 ? " case-card__stat--bordered" : ""}`}
              >
                <div className="case-card__stat-val">{r.value}</div>
                <div className="case-card__stat-key">{r.metric}</div>
              </div>
            ))}
          </div>
        )}

        <Link to={`/projects/${project.slug}`} className="case-card__link">
          View Case Study <FiArrowUpRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ t, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="testi-card"
    >
      <div className="testi-quote-mark">"</div>
      <div className="testi-card__stars">
        {Array(t.rating || 5).fill(0).map((_, i) => (
          <span key={i} className="testi-card__star">★</span>
        ))}
      </div>
      <p className="testi-card__quote">"{t.testimonialText}"</p>
      <div className="testi-card__footer">
        <img
          src={t.imgUrl}
          alt={t.name}
          className="testi-card__avatar"
        />
        <div>
          <div className="testi-card__name">{t.name}</div>
          <div className="testi-card__role">{t.position} · {t.company}</div>
        </div>
      </div>
    </motion.div>
  );
}