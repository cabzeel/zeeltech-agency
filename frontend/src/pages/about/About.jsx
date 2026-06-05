import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet-async";
import { FiLinkedin, FiInstagram } from "react-icons/fi";
import PageWrapper from "../../components/ui/PageWrapper";
import SectionHeader from "../../components/ui/SectionHeader";
import api from "../../utils/api";
import "./About.css";

const values = [
  {
    title: "Craftsmanship",
    desc: "We treat every project as a work of craft — obsessing over the details that make the difference between good and exceptional.",
  },
  {
    title: "Transparency",
    desc: "No surprises. We communicate openly about timelines, costs, and challenges throughout every engagement.",
  },
  {
    title: "Innovation",
    desc: "We stay ahead of the curve, adopting emerging technologies and design trends to give our clients a competitive edge.",
  },
  {
    title: "Partnership",
    desc: "We are not just vendors — we are invested partners in your success, thinking about your goals as if they were our own.",
  },
];

export default function About() {
  const [team, setTeam] = useState([]);
  useEffect(() => {
    api
      .get("/team?isVisible=true")
      .then((r) => setTeam(r.data?.data ?? []))
      .catch(() => {});
  }, []);

  return (
    <PageWrapper>
      <Helmet>
        <title>About ZeelTech | Web Agency from Cameroon Serving the US & UK</title>
        <meta
          name="description"
          content="ZeelTech Web Solutions is a professional web agency based in Cameroon, building websites for chiropractors and small businesses across the US, UK, Canada and Australia."
        />
        <link rel="canonical" href="https://zeeltechsolutions.com/about" />
      </Helmet>

      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__orb" />
        <div className="container page-hero__inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label section-label--center">Our Story</span>
            <h1 className="page-hero__h1">
              Built by Builders,
              <br />
              <span className="gold-gradient">For Builders</span>
            </h1>
            <p className="page-hero__sub">
              Zeeltech started from a simple belief: great digital products should
              be accessible to businesses of every size. Founded in Cameroon,
              we've grown into a team that serves clients across Africa and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section section--alt">
        <div className="container">
          <div className="about-story__grid">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="section-label">Our Mission</span>
              <h2 className="about-story__h2">
                Turning Vision Into{" "}
                <span className="gold-gradient">Reality</span>
              </h2>
              <p className="about-story__p">
                We founded Zeeltech with a clear mission: help ambitious
                businesses leverage technology to grow faster, serve customers
                better, and build lasting digital assets.
              </p>
              <p className="about-story__p about-story__p--last">
                Every project we take on is an opportunity to do something
                excellent. We don't ship mediocre work — we craft solutions that
                stand the test of time and drive measurable results.
              </p>
              <div className="stat-grid">
                {[
                  ["20+", "Projects"],
                  ["5+", "Years"],
                  ["4", "Countries"],
                ].map(([n, l]) => (
                  <div key={l} className="glass-gold stat-card">
                    <div className="stat-card__num">{n}</div>
                    <div className="stat-card__label">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="about-story__img-frame">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700"
                  alt="Team working"
                  className="about-story__img"
                />
                <div className="about-story__img-overlay" />
                <div className="glass about-story__caption">
                  <div className="about-story__caption-title">Bamenda, Cameroon 🇨🇲</div>
                  <div className="about-story__caption-sub">
                    Serving clients across Africa &amp; beyond
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <SectionHeader
            label="Our Values"
            title="The Principles That |Guide Us|"
            center
          />
          <div className="grid-2 values-grid">
            {values.map((v, i) => (
              <ValueCard key={v.title} value={v} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeader
            label="The Team"
            title="Meet the People Behind |Zeeltech|"
            subtitle="A small, focused team of designers, engineers, and strategists dedicated to your success."
            center
          />
          <div className="grid-4 team-grid">
            {(team.length ? team : Array(4).fill(null)).map((m, i) => (
              <TeamCard key={m?._id || i} member={m} index={i} />
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

/* ── Extracted so useInView is called at component top-level (Rules of Hooks) ── */
function ValueCard({ value, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass value-card"
    >
      <div className="value-card__num">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h4 className="value-card__title">{value.title}</h4>
      <p className="value-card__desc">{value.desc}</p>
    </motion.div>
  );
}

function TeamCard({ member, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const isLoading = !member;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {isLoading ? (
        <div className="glass team-card team-card--loading">
          <div className="skeleton team-card__avatar-skeleton" />
          <div className="skeleton team-card__name-skeleton" />
          <div className="skeleton team-card__role-skeleton" />
        </div>
      ) : (
        <div className="glass team-card">
          <img
            src={member.imgUrl}
            alt={member.name}
            className="team-card__avatar"
          />
          <div className="team-card__name">{member.name}</div>
          <div className="team-card__position">{member.position}</div>
          {member.bio && (
            <p className="team-card__bio">{member.bio.slice(0, 100)}...</p>
          )}
          <div className="team-card__socials">
            {member.socialLinks?.linkedin && (
              <a href={member.socialLinks.linkedin} className="social-link">
                <FiLinkedin />
              </a>
            )}
            {member.socialLinks?.instagram && (
              <a href={member.socialLinks.instagram} className="social-link">
                <FiInstagram />
              </a>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}