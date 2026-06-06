import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FiMail, FiPhone, FiMapPin, FiSend, FiTwitter, FiLinkedin, FiInstagram, FiFacebook } from "react-icons/fi";
import toast from "react-hot-toast";
import PageWrapper from "../../components/ui/PageWrapper";
import api from "../../utils/api";
import "./Contact.css";

const SERVICES = ["Web Development", "Mobile App", "UI/UX Design", "Digital Marketing", "Other"];

const CONTACT_INFO = [
  { icon: <FiMail />,   label: "Email",    value: "cabzeel@zeeltechsolutions.com",          href: "mailto:cabzeel@zeeltechsolutions.com" },
  { icon: <FiPhone />,  label: "Phone",    value: "+237 681313220",              href: "tel:+237681313220" },
  { icon: <FiMapPin />, label: "Location", value: "Bamenda, North West, Cameroon 🇨🇲" },
];

const SOCIALS = [
  { icon: <FiLinkedin />,  label: "LinkedIn", link: "https://www.linkedin.com/in/timchia-cabzeel-29a101261" },
  { icon: <FiFacebook />,   label: "Facebook", link: "https://web.facebook.com/profile.php?id=61585788879290" },
  { icon: <FiInstagram />, label: "Instagram", link: "https://www.instagram.com/zeeltechsol_237/" },
];

const HOURS = [
  ["Mon – Fri",  "8:00 AM – 6:00 PM WAT"],
  ["Saturday",   "10:00 AM – 2:00 PM WAT"],
  ["Sunday",     "Closed"],
];

const AUDIT_CHECKLIST = [
  "Current site speed and mobile score",
  "Local SEO gaps vs. competitors",
  "Quote funnel and lead capture audit",
  "Credibility and trust signal review",
  "Top 3 wins you can action immediately",
];

export default function Contact() {
  const [form, setForm]                       = useState({ name: "", email: "", phone: "", subject: "", message: "", service: "" });
  const [submitting, setSubmitting]           = useState(false);
  const [subscribeEmail, setSubscribeEmail]   = useState("");
  const [subscribing, setSubscribing]         = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all required fields"); return;
    }
    setSubmitting(true);
    try {
      await api.post("/contacts", {
        name: form.name, email: form.email, phone: form.phone,
        subject: form.service ? `[${form.service}] ${form.subject}` : form.subject,
        message: form.message,
      });
      toast.success("Message sent! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "", service: "" });
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    }
    setSubmitting(false);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    setSubscribing(true);
    try {
      await api.post("/subscribers/subscribe", { email: subscribeEmail });
      toast.success("Subscribed! Welcome to the Zeeltech newsletter.");
      setSubscribeEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not subscribe. Please try again.");
    }
    setSubscribing(false);
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>Contact ZeelTech | Get a Free Website Audit</title>
        <meta name="description" content="Contact ZeelTech Web Solutions for a free website audit. We build professional websites for chiropractors and small businesses across the US, UK and Cameroon." />
        <link rel="canonical" href="https://zeeltechsolutions.com/contact" />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="page-hero page-hero--sm" style={{ textAlign: "center" }}>
        <div className="page-hero__glow" />
        <div className="container page-hero__inner">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label" style={{ justifyContent: "center" }}>Get In Touch</span>
            <h1 style={{ maxWidth: 640, margin: "0 auto 1.25rem" }}>
              Let's Build Something <span className="gold-gradient">Together</span>
            </h1>
            <p style={{ maxWidth: 500, margin: "0 auto", fontSize: "1.05rem" }}>
              Share your vision with us. We'll respond within 24 hours with insights and a tailored approach.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="container">
          <div className="contact-layout">

            {/* ── Left sidebar ───────────────────────────────────────── */}
            <motion.div
              className="contact-sidebar"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Contact info */}
              <div className="glass contact-info-card">
                <h3 className="contact-card__heading">Contact Information</h3>
                <div className="contact-info-list">
                  {CONTACT_INFO.map((item) => (
                    <div key={item.label} className="contact-row">
                      <div className="icon-box">{item.icon}</div>
                      <div>
                        <div className="contact-row__label">{item.label}</div>
                        {item.href
                          ? <a href={item.href} className="contact-row__link">{item.value}</a>
                          : <div className="contact-row__value">{item.value}</div>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Socials */}
              <div className="glass contact-side-panel">
                <h4 className="contact-panel__heading">Follow Us</h4>
                <div className="contact-socials">
                  {SOCIALS.map((s) => (
                    <a key={s.label} href="" className="social-btn" aria-label={s.label}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Business hours */}
              <div className="glass contact-side-panel">
                <h4 className="contact-panel__heading">Business Hours</h4>
                {HOURS.map(([day, hours]) => (
                  <div key={day} className="hours-row">
                    <span className="hours-row__day">{day}</span>
                    <span className={`hours-row__time${hours === "Closed" ? " hours-row__time--closed" : ""}`}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>

              {/* Newsletter */}
              <div className="glass-gold contact-side-panel">
                <h4 className="contact-panel__heading contact-panel__heading--gold">Newsletter</h4>
                <p style={{ fontSize: "0.82rem", marginBottom: "1rem" }}>
                  Get our latest insights delivered to your inbox.
                </p>
                <form onSubmit={handleSubscribe} className="newsletter-form">
                  <input
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                  <button type="submit" className="btn btn-gold" disabled={subscribing}>
                    {subscribing ? "..." : <FiSend />}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* ── Contact form ────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="glass contact-form-card">
                <h3 className="contact-card__heading">Send Us a Message</h3>
                <p style={{ fontSize: "0.88rem", marginBottom: "2rem" }}>
                  We'll get back to you within 24 hours, guaranteed.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@company.com" />
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div className="form-group">
                      <label>Phone (Optional)</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" />
                    </div>
                    <div className="form-group">
                      <label>Service Interested In</label>
                      <select name="service" value={form.service} onChange={handleChange}>
                        <option value="">Select a service</option>
                        {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject *</label>
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      rows={6}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project — goals, timeline, budget, and anything else that's relevant..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold contact-submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : <><FiSend /> Send Message</>}
                  </button>

                  <p className="contact-privacy-note">
                    By submitting you agree to our Privacy Policy. We never share your data.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}