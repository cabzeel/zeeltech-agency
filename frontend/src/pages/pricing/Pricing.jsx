import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet-async";
import { FiCheck, FiArrowRight, FiMinus } from "react-icons/fi";
import PageWrapper from "../../components/ui/PageWrapper";
import SectionHeader from "../../components/ui/SectionHeader";
import "./Pricing.css";

/* ─── DATA ───────────────────────────────────────────────────────────── */
const TIERS = [
  {
    id: "foundation",
    name: "Foundation",
    tagline: "Stop losing bids to a site that looks 2016.",
    price: "Starts at $1,500",
    popular: false,
    cta: "Get a Free Audit",
    description:
      "For contractors who know their current site is costing them work. We build you something credible — fast-loading, mobile-ready, and structured so decision-makers trust you before they ever call.",
    features: [
      "Custom-designed credibility site (5–7 pages)",
      "Mobile-first, Lighthouse 90+ performance",
      "Service pages built around what you actually do",
      "Licensing, credentials & trust signals front and center",
      "Contact form with email notifications",
      "Google Maps + service area integration",
      "Basic on-page SEO",
      "Deployed on your domain — you own everything",
      "2 rounds of revisions",
    ],
    notIncluded: [
      "Quote request funnel",
      "Local SEO & Google Business setup",
      "Multi-location service area pages",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Built to fill your pipeline, not just your portfolio.",
    price: "Starts at $3,000",
    popular: true,
    cta: "Get a Free Audit",
    description:
      "For contractors ready to turn their website into a lead source. Everything in Foundation, plus the systems that make prospects actually reach out — quote funnels, local SEO, and conversion-focused landing pages.",
    features: [
      "Everything in Foundation",
      "Quote request funnel with service-specific forms",
      "Local SEO foundation — structured for your city and niche",
      "Google Business profile setup & optimisation",
      "Service area landing pages (up to 3 locations)",
      "Google Analytics 4 + conversion tracking",
      "Facebook Pixel integration",
      "Speed optimisation (Lighthouse 90+)",
      "3 rounds of revisions",
    ],
    notIncluded: [
      "Case study & results pages",
      "Ongoing monthly SEO",
    ],
  },
  {
    id: "authority",
    name: "Authority",
    tagline: "Own your market. Make competitors look like amateurs.",
    price: "Starts at $5,500",
    popular: false,
    cta: "Let's Talk",
    description:
      "For established contractors going after bigger contracts. A full web system — case studies, service area dominance, custom integrations, and a site that positions you as the obvious choice in your niche.",
    features: [
      "Everything in Growth",
      "Case study & results pages (we write the copy)",
      "Expanded service area pages (up to 10 locations)",
      "CMS — update your own content without a developer",
      "Custom quote or booking system",
      "WhatsApp & live chat integration",
      "API integrations (any platform you already use)",
      "Admin dashboard if needed",
      "Unlimited revisions during the build",
    ],
    notIncluded: [],
  },
];

const ADDONS = [
  { name: "Monthly maintenance & uptime monitoring",   price: "From $150 / mo" },
  { name: "Additional service area pages",             price: "From $200 / page" },
  { name: "Extra revision round",                      price: "$150 / round" },
  { name: "Copywriting (we write your service pages)", price: "From $300" },
  { name: "Rush delivery (under 7 days)",              price: "+25%" },
  { name: "Google Analytics 4 setup only",             price: "From $150" },
  { name: "Domain + DNS + business email setup",       price: "From $100" },
];

const FAQS = [
  {
    q: "Why no exact price?",
    a: "A fire protection company with 3 trucks and one service area is a different build to a commercial cleaning company covering 4 cities. The ranges are honest starting points — your actual quote comes after a 15-minute audit call where we understand your specific situation. No obligation.",
  },
  {
    q: "How does payment work?",
    a: "50% deposit before work begins, 50% on delivery. We accept card and bank transfer. Nothing starts until the deposit is confirmed — and nothing is owed until you're happy with the final result.",
  },
  {
    q: "How long does a build take?",
    a: "Foundation: 1–2 weeks. Growth: 2–3 weeks. Authority: 3–5 weeks. Timeline starts the day the deposit lands and assets are received. Most delays come from waiting on client content — we'll tell you exactly what we need upfront.",
  },
  {
    q: "What do you need from me to get started?",
    a: "Your logo, any photos you have, a list of your services, and your preferences. Most clients don't have all of this ready — that's fine. We'll tell you what we can work around and what we genuinely need.",
  },
  {
    q: "Do I own the site after it's built?",
    a: "100%. The code, the domain, the content — all yours. No monthly platform fees, no proprietary lock-in. If you ever want to move to another developer, everything transfers cleanly.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "Every tier includes revision rounds for a reason. We don't sign off on anything you're not happy with. In the rare case we can't get it right, we'll refund the balance — we'd rather part ways cleanly than keep a client who isn't satisfied.",
  },
];

const PROCESS = [
  { num: "01", title: "Free Audit Call",      desc: "15 minutes. We look at your current site (or your top competitor's), identify what's costing you leads, and recommend the right tier." },
  { num: "02", title: "Proposal & Deposit",   desc: "You get a detailed scope — pages, features, timeline, exact price. 50% deposit to start. No surprises after this point." },
  { num: "03", title: "Build & Review",       desc: "We build. You review. Revisions happen in rounds — no endless back-and-forth, no scope creep." },
  { num: "04", title: "Launch & Hand Off",    desc: "We deploy to your domain, walk you through everything, and hand it over. You own it. Maintenance is optional." },
];

/* ─── COMPONENT ──────────────────────────────────────────────────────── */
export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <PageWrapper>
      <Helmet>
        <title>Pricing | ZeelTech — Contractor Websites That Generate Leads</title>
        <meta
          name="description"
          content="Transparent pricing for contractor websites. Foundation from $1,500. Fire protection, commercial cleaning, and facility service companies. Free audit call."
        />
        <link rel="canonical" href="https://zeeltechsolutions.com/pricing" />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="page-hero__orb" />
        <div className="container page-hero__inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label section-label--center">Transparent Pricing</span>
            <h1 className="page-hero__h1">
              Real Ranges.
              <br />
              <em className="gold-gradient">No Guesswork.</em>
            </h1>
            <p className="page-hero__sub">
              We don't publish exact prices because every contractor business is
              different. What we do publish is exactly what's included at each
              level — so you know what you're getting before you ever get on a call.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Tiers ────────────────────────────────────────────────────── */}
      <section className="pricing-tiers-section">
        <div className="container">
          <div className="pricing-grid">
            {TIERS.map((tier, i) => (
              <PricingCard key={tier.id} plan={tier} index={i} />
            ))}
          </div>
          <p className="pricing-footnote">
            Every project starts with a free audit call.{" "}
            <Link to="/contact" className="pricing-footnote__link">
              Book yours →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────── */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeader
            label="How It Works"
            title="From Audit Call to |Live Site|"
            subtitle="Four steps. No ambiguity. You know what happens next at every stage."
            center
          />
          <div className="process-grid">
            {PROCESS.map((step, i) => (
              <ProcessStep key={step.num} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Add-ons ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeader
            label="Add-ons"
            title="Add What |You Actually Need|"
            subtitle="Bolt any of these onto any tier. Every add-on is quoted before anything is agreed."
            center
          />
          <div className="addon-grid">
            {ADDONS.map((addon, i) => (
              <motion.div
                key={i}
                className="addon-row"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <span className="addon-row__name">{addon.name}</span>
                <span className="addon-row__price">{addon.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="section section--alt">
        <div className="container pricing-faq-wrap">
          <SectionHeader
            label="Before You Ask"
            title="Honest Answers |Upfront|"
            center
          />
          <div className="pricing-faq-list">
            {FAQS.map((item, i) => (
              <div key={i} className="glass faq-item-glass">
                <button
                  className="faq-trigger-glass"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <span className={`faq-toggle${openFaq === i ? " faq-toggle--open" : ""}`}>+</span>
                </button>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: openFaq === i ? "auto" : 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="faq-answer">{item.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="pricing-cta-section">
        <div className="container pricing-cta__inner">
          <div className="bracket-label pricing-cta__label">Ready to build?</div>
          <h2 className="pricing-cta__h2">
            Not Sure Which Tier?{" "}
            <em className="gold-gradient">That's What the Audit Is For.</em>
          </h2>
          <p className="pricing-cta__sub">
            15 minutes. We look at your current site, tell you honestly what
            tier makes sense, and give you a number. No pitch, no pressure.
          </p>
          <Link to="/contact" className="btn btn-gold">
            Book My Free Audit <FiArrowRight />
          </Link>
          <p className="pricing-cta__fine">
            15-minute call &nbsp;·&nbsp; No commitment &nbsp;·&nbsp; Response within 24 hours
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}

/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────── */
function PricingCard({ plan, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className={`pricing-card${plan.popular ? " pricing-card--popular" : ""}`}
    >
      {plan.popular && (
        <div className="pricing-badge">MOST POPULAR</div>
      )}

      <div className="pricing-card__header">
        <h4 className={`pricing-card__name${plan.popular ? " pricing-card__name--popular" : ""}`}>
          {plan.name}
        </h4>
        <p className="pricing-card__tagline">{plan.tagline}</p>
        <div className="pricing-card__price">{plan.price}</div>
      </div>

      <p className="pricing-card__desc">{plan.description}</p>

      <ul className="feature-list">
        {plan.features.map((f) => (
          <li key={f} className="feature-list__item">
            <FiCheck className="feature-list__icon" /> {f}
          </li>
        ))}
      </ul>

      {plan.notIncluded.length > 0 && (
        <ul className="excluded-list">
          {plan.notIncluded.map((f) => (
            <li key={f} className="excluded-list__item">
              <FiMinus className="excluded-list__icon" /> {f}
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/contact"
        className={`btn ${plan.popular ? "btn-gold" : "btn-outline"} pricing-card__cta`}
      >
        {plan.cta} <FiArrowRight size={13} />
      </Link>
    </motion.div>
  );
}

function ProcessStep({ step, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="process-step"
    >
      <div className="process-step__num">{step.num}</div>
      <h4 className="process-step__title">{step.title}</h4>
      <p className="process-step__desc">{step.desc}</p>
    </motion.div>
  );
}