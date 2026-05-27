import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Helmet } from 'react-helmet-async'
import { FiCheck, FiArrowRight, FiZap, FiGlobe } from 'react-icons/fi'
import PageWrapper from '../components/ui/PageWrapper'
import SectionHeader from '../components/ui/SectionHeader'

// ── PRICING DATA — Real ZeelTech model ──
const TIERS = {
  usd: [
    {
      id: 'basic',
      name: 'Starter',
      tagline: 'Get online properly.',
      price: '$300 – $500',
      unit: 'one-time',
      popular: false,
      cta: 'Start Here',
      description: 'For businesses that need a clean, professional presence online. No fluff, no bloat — just a site that works.',
      features: [
        '3–5 page responsive website',
        'Mobile-first design',
        'Contact form with email notifications',
        'Google Maps integration',
        'Social media links',
        'Basic on-page SEO',
        'Deployed and live on your domain',
        '2 rounds of revisions',
      ],
      notIncluded: ['Backend / database', 'Booking system', 'Blog / CMS'],
    },
    {
      id: 'mid',
      name: 'Professional',
      tagline: 'The one most clients choose.',
      price: '$500 – $1,000',
      unit: 'one-time',
      popular: true,
      cta: 'Get Started',
      description: 'A complete web presence built to convert visitors into enquiries. Includes the integrations that actually matter for your business.',
      features: [
        'Everything in Starter',
        'Online booking / appointment form',
        'CMS — update your own content',
        'Google Analytics + tracking setup',
        'Facebook Pixel integration',
        'Speed optimisation (Lighthouse 85+)',
        'Local SEO + Google Business setup',
        'WhatsApp chat integration',
        '3 rounds of revisions',
      ],
      notIncluded: ['Custom web application', 'E-commerce store'],
    },
    {
      id: 'top',
      name: 'Premium',
      tagline: 'For businesses that want everything.',
      price: '$1,000 – $2,500',
      unit: 'one-time',
      popular: false,
      cta: 'Let\'s Talk',
      description: 'Full custom builds — booking systems, admin dashboards, payment integration, e-commerce. If you can describe it, we can build it.',
      features: [
        'Everything in Professional',
        'Custom web application',
        'User authentication + accounts',
        'Payment integration (Stripe / local)',
        'Admin dashboard',
        'E-commerce with cart + checkout',
        'API integrations (any platform)',
        'Performance-optimised architecture',
        'Unlimited revisions during build',
      ],
      notIncluded: [],
    },
    {
      id: 'retainer',
      name: 'Maintenance',
      tagline: 'Keep it running perfectly.',
      price: '$100 – $200',
      unit: 'per month',
      popular: false,
      cta: 'Add to Any Plan',
      description: 'Monthly care plan — uptime monitoring, speed checks, backups, content updates. Your site stays fast, secure and current.',
      features: [
        'Weekly uptime monitoring',
        'Monthly speed audit',
        'Security checks',
        'Backup verification',
        'Up to 2hrs content updates/month',
        'Monthly performance report',
        'Priority support response',
      ],
      notIncluded: [],
    },
  ],
  xaf: [
    {
      id: 'basic',
      name: 'Starter',
      tagline: 'Commencez à exister en ligne.',
      price: '150 000 – 250 000 XAF',
      unit: 'paiement unique',
      popular: false,
      cta: 'Démarrer',
      description: 'Pour les entreprises qui ont besoin d\'une présence professionnelle en ligne. Simple, rapide, efficace.',
      features: [
        'Site web 3–5 pages responsive',
        'Design mobile-first',
        'Formulaire de contact avec notifications',
        'Intégration Google Maps',
        'Liens réseaux sociaux',
        'SEO on-page de base',
        'Déploiement sur votre domaine',
        '2 rounds de révisions',
      ],
      notIncluded: ['Backend / base de données', 'Système de réservation', 'Blog / CMS'],
    },
    {
      id: 'mid',
      name: 'Professionnel',
      tagline: 'Le choix de la majorité de nos clients.',
      price: '300 000 – 500 000 XAF',
      unit: 'paiement unique',
      popular: true,
      cta: 'Commencer',
      description: 'Une présence web complète, conçue pour transformer les visiteurs en clients. Inclut les intégrations qui font vraiment la différence.',
      features: [
        'Tout du pack Starter',
        'Formulaire de réservation / rendez-vous',
        'CMS — modifiez votre contenu vous-même',
        'Google Analytics + suivi des conversions',
        'Intégration Facebook Pixel',
        'Optimisation vitesse (Lighthouse 85+)',
        'SEO local + configuration Google Business',
        'Intégration WhatsApp',
        '3 rounds de révisions',
      ],
      notIncluded: ['Application web sur mesure', 'Boutique e-commerce'],
    },
    {
      id: 'top',
      name: 'Premium',
      tagline: 'Pour les entreprises qui veulent tout.',
      price: '450 000 – 1 200 000 XAF',
      unit: 'paiement unique',
      popular: false,
      cta: 'Discutons-en',
      description: 'Développements sur mesure — systèmes de réservation, tableaux de bord admin, paiement en ligne, e-commerce. Si vous pouvez le décrire, nous pouvons le construire.',
      features: [
        'Tout du pack Professionnel',
        'Application web personnalisée',
        'Authentification utilisateur',
        'Intégration paiement (Stripe / Mobile Money)',
        'Tableau de bord administrateur',
        'E-commerce avec panier et caisse',
        'Intégrations API (toute plateforme)',
        'Architecture optimisée',
        'Révisions illimitées pendant le build',
      ],
      notIncluded: [],
    },
    {
      id: 'retainer',
      name: 'Maintenance',
      tagline: 'Gardez votre site en parfait état.',
      price: '50 000 – 100 000 XAF',
      unit: 'par mois',
      popular: false,
      cta: 'Ajouter à tout pack',
      description: 'Suivi mensuel — monitoring, audits de vitesse, sauvegardes, mises à jour de contenu. Votre site reste rapide, sécurisé et à jour.',
      features: [
        'Monitoring uptime hebdomadaire',
        'Audit de vitesse mensuel',
        'Vérifications de sécurité',
        'Vérification des sauvegardes',
        'Jusqu\'à 2h de mises à jour/mois',
        'Rapport mensuel de performance',
        'Support prioritaire',
      ],
      notIncluded: [],
    },
  ],
}

const ADD_ONS = {
  usd: [
    { name: 'WhatsApp chatbot (Tidio / Crisp)', price: '$80 – $120' },
    { name: 'WhatsApp API automation (Twilio)', price: '$150 – $250' },
    { name: 'Stripe payment integration', price: '$150 – $200' },
    { name: 'Facebook Pixel + GTM setup', price: '$60 – $100' },
    { name: 'Google Analytics 4 setup', price: '$50 – $80' },
    { name: 'Domain + DNS + business email', price: '$50 – $80' },
    { name: 'Extra revision round', price: '$30 / round' },
    { name: 'Rush delivery (under 5 days)', price: '+30%' },
  ],
  xaf: [
    { name: 'Chatbot WhatsApp (Tidio / Crisp)', price: '40 000 – 60 000 XAF' },
    { name: 'Automatisation WhatsApp API (Twilio)', price: '80 000 – 120 000 XAF' },
    { name: 'Intégration paiement Stripe', price: '75 000 – 100 000 XAF' },
    { name: 'Configuration Facebook Pixel + GTM', price: '30 000 – 50 000 XAF' },
    { name: 'Configuration Google Analytics 4', price: '25 000 – 40 000 XAF' },
    { name: 'Domaine + DNS + email professionnel', price: '25 000 – 40 000 XAF' },
    { name: 'Round de révision supplémentaire', price: '15 000 XAF / round' },
    { name: 'Livraison express (moins de 5 jours)', price: '+30%' },
  ],
}

const FAQ = {
  usd: [
    {
      q: 'Are the prices fixed?',
      a: 'The ranges are starting points. Your final quote depends on scope, integrations needed, and timeline. We always send a detailed proposal before any commitment — no surprises.',
    },
    {
      q: 'How does payment work?',
      a: 'We work on a 50% deposit before work begins, 50% on final delivery. For larger projects we can structure milestone payments. International clients pay via card or bank transfer.',
    },
    {
      q: 'How long does a project take?',
      a: 'Starter sites: 5–7 days. Professional builds: 7–14 days. Premium / custom: 2–6 weeks depending on complexity. Timeline starts the day the deposit lands.',
    },
    {
      q: 'What do you need from me to start?',
      a: 'Your logo, any photos or content you have, and your preferences. If you don\'t have content yet we can advise on copy — most clients don\'t come prepared and that\'s fine.',
    },
    {
      q: 'Do you work with clients outside Cameroon?',
      a: 'Yes — most of our clients are in the US, UK, Canada and Australia. We communicate entirely via message and deliver remotely. Time zone has never been an issue.',
    },
  ],
  xaf: [
    {
      q: 'Les prix sont-ils fixes ?',
      a: 'Les fourchettes sont des points de départ. Votre devis final dépend de la portée du projet, des intégrations nécessaires et du délai. Nous envoyons toujours une proposition détaillée avant tout engagement.',
    },
    {
      q: 'Comment fonctionne le paiement ?',
      a: 'Nous travaillons avec un acompte de 50% avant le début des travaux, et 50% à la livraison finale. Les clients locaux paient via Mobile Money (MTN MoMo).',
    },
    {
      q: 'Combien de temps prend un projet ?',
      a: 'Sites Starter : 5–7 jours. Builds Professionnels : 7–14 jours. Premium / sur mesure : 2–6 semaines selon la complexité. Le délai commence le jour où l\'acompte est reçu.',
    },
    {
      q: 'De quoi avez-vous besoin pour commencer ?',
      a: 'Votre logo, des photos si disponibles, et vos préférences. Si vous n\'avez pas de contenu, nous pouvons vous conseiller — la plupart de nos clients n\'arrivent pas préparés et c\'est tout à fait normal.',
    },
    {
      q: 'Travaillez-vous avec des entreprises hors Cameroun ?',
      a: 'Oui — et inversement, nous servons aussi des clients locaux partout au Cameroun, en Côte d\'Ivoire, au Sénégal et dans toute la zone CEMAC.',
    },
  ],
}

// Detect market from IP
async function detectMarket() {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
    const data = await res.json()
    const africanCountries = ['CM', 'NG', 'GH', 'CI', 'SN', 'GA', 'CG', 'TD', 'CF', 'GQ', 'RW', 'UG', 'TZ', 'KE', 'ET']
    return africanCountries.includes(data.country_code) ? 'xaf' : 'usd'
  } catch {
    return 'usd' // default to USD on failure
  }
}

export default function Pricing() {
  const [market, setMarket] = useState(null) // null = loading
  const [openFaq, setOpenFaq] = useState(null)
  const [manualOverride, setManualOverride] = useState(false)

  useEffect(() => {
    detectMarket().then(m => setMarket(m))
  }, [])

  const plans = market ? TIERS[market] : []
  const addons = market ? ADD_ONS[market] : []
  const faqs = market ? FAQ[market] : []
  const isXAF = market === 'xaf'

  const toggleMarket = () => {
    setMarket(m => m === 'usd' ? 'xaf' : 'usd')
    setManualOverride(true)
  }

  return (
    <PageWrapper>
      <Helmet>
        <title>Pricing | ZeelTech Web Solutions – Professional Websites from $300</title>
        <meta name="description" content="Transparent pricing for professional websites. Starter from $300 / 150,000 XAF. No hidden fees. ZeelTech serves the US, UK, Canada, Australia and Cameroon." />
        <link rel="canonical" href="https://zeeltech-agency.vercel.app/pricing" />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '5rem 0 3rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,180,41,0.07) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>Transparent Pricing</span>
            <h1 style={{ maxWidth: 700, margin: '0 auto 1.5rem' }}>
              Real prices.<br />
              <span className="gold-gradient">No guesswork.</span>
            </h1>
            <p style={{ maxWidth: 520, margin: '0 auto 2rem', fontSize: '1.05rem' }}>
              {isXAF
                ? 'Des prix clairs, adaptés au marché local. Aucun frais caché. Aucune surprise.'
                : 'What you see is what you pay. Every quote starts here — scope adjustments are always explained before anything is agreed.'}
            </p>

            {/* Market toggle */}
            {market && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.5rem 1rem' }}>
                <FiGlobe style={{ color: 'var(--gold)', fontSize: '0.9rem' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {isXAF ? 'Affichage en XAF (Afrique)' : 'Showing USD (International)'}
                </span>
                <button
                  onClick={toggleMarket}
                  style={{
                    fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--gold)',
                    background: 'none', border: '1px solid var(--border-gold)', borderRadius: '6px',
                    padding: '0.2rem 0.6rem', cursor: 'pointer',
                  }}
                >
                  {isXAF ? 'Switch to USD' : 'Voir en XAF'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ paddingBottom: '5rem' }}>
        <div className="container">
          {!market ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', height: 520, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem', alignItems: 'start' }}>
              {plans.map((plan, i) => <PricingCard key={plan.id} plan={plan} index={i} isXAF={isXAF} />)}
            </div>
          )}

          <style>{`
            @media(max-width:1024px){
              .pricing-grid{grid-template-columns:repeat(2,1fr)!important}
            }
            @media(max-width:640px){
              .pricing-grid{grid-template-columns:1fr!important}
            }
            @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
          `}</style>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.82rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {isXAF
              ? 'Paiement via MTN Mobile Money. Devis personnalisé disponible — '
              : 'Custom enterprise quotes available — '}
            <Link to="/contact" style={{ color: 'var(--gold)' }}>
              {isXAF ? 'contactez-nous' : 'contact us'}
            </Link>
          </p>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section" style={{ background: 'var(--bg-1)', paddingTop: '4rem' }}>
        <div className="container">
          <SectionHeader
            label={isXAF ? 'Services additionnels' : 'Add-ons'}
            title={isXAF ? 'Ajoutez ce dont |vous avez besoin|' : 'Add What |You Need|'}
            center
          />
          <p style={{ textAlign: 'center', maxWidth: 520, margin: '-1rem auto 3rem', fontSize: '0.9rem' }}>
            {isXAF
              ? 'Chaque service ci-dessous peut être ajouté à n\'importe quel pack.'
              : 'Any of these can be bolted onto any tier. Discussed during scoping, quoted before anything is agreed.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', maxWidth: 800, margin: '0 auto' }}>
            {addons.map((addon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', padding: '0.85rem 1.25rem',
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{addon.name}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '1rem' }}>{addon.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment terms strip */}
      <section style={{ padding: '3rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', textAlign: 'center' }}>
            {(isXAF ? [
              { icon: '50%', label: 'Acompte', desc: 'Versé avant le début des travaux' },
              { icon: '50%', label: 'Solde', desc: 'Versé à la livraison finale' },
              { icon: 'MoMo', label: 'Paiement', desc: 'MTN Mobile Money — +237 653 344 368' },
            ] : [
              { icon: '50%', label: 'Deposit', desc: 'Paid before work begins' },
              { icon: '50%', label: 'Balance', desc: 'Paid on final delivery' },
              { icon: 'Card', label: 'Payment', desc: 'International card or bank transfer' },
            ]).map(({ icon, label, desc }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <SectionHeader
            label="FAQ"
            title={isXAF ? 'Questions |fréquentes|' : 'Common |Questions|'}
            center
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((item, i) => (
              <div key={i} className="glass" style={{ overflow: 'hidden', borderRadius: 'var(--radius)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1.25rem 1.5rem', background: 'none', border: 'none', color: 'var(--text)',
                    fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {item.q}
                  <span style={{ color: 'var(--gold)', fontSize: '1.2rem', transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: '1rem' }}>+</span>
                </button>
                <motion.div initial={{ height: 0 }} animate={{ height: openFaq === i ? 'auto' : 0 }} style={{ overflow: 'hidden' }}>
                  <p style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.88rem', lineHeight: 1.8 }}>{item.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', textAlign: 'center', background: 'var(--bg-1)' }}>
        <div className="container">
          <FiZap style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>
            {isXAF
              ? <>Pas sûr de quel pack ? <span className="gold-gradient">Parlons-en.</span></>
              : <>Not sure which plan? <span className="gold-gradient">Talk to us.</span></>}
          </h2>
          <p style={{ maxWidth: 480, margin: '0 auto 2rem' }}>
            {isXAF
              ? 'Chaque projet est différent. Décrivez vos objectifs — nous vous recommanderons la meilleure approche et vous enverrons un devis détaillé.'
              : 'Every project is different. Tell us what you\'re trying to achieve and we\'ll recommend the right approach with a detailed quote — no pressure, no obligation.'}
          </p>
          <Link to="/contact" className="btn btn-gold">
            {isXAF ? 'Obtenir un devis gratuit' : 'Get a Free Quote'} <FiArrowRight />
          </Link>
        </div>
      </section>
    </PageWrapper>
  )
}

function PricingCard({ plan, index, isXAF }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius)',
        padding: '2rem',
        border: `1px solid ${plan.popular ? 'var(--gold)' : 'var(--border)'}`,
        background: plan.popular ? 'rgba(240,180,41,0.06)' : 'var(--bg-2)',
        transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
        boxShadow: plan.popular ? 'var(--shadow-gold)' : 'none',
        transition: 'var(--transition)',
      }}
    >
      {plan.popular && (
        <div style={{
          position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
          color: '#080808', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
          letterSpacing: '0.1em', padding: '0.25rem 1rem', borderRadius: '0 0 8px 8px',
          whiteSpace: 'nowrap',
        }}>
          {isXAF ? 'LE PLUS CHOISI' : 'MOST POPULAR'}
        </div>
      )}

      {/* Plan header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ color: plan.popular ? 'var(--gold)' : 'var(--text)', fontFamily: 'var(--font-mono)', marginBottom: '0.3rem' }}>
          {plan.name}
        </h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '1rem', lineHeight: 1.4 }}>
          {plan.tagline}
        </p>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
          {plan.price}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
          {plan.unit}
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '1.5rem', minHeight: 72 }}>
        {plan.description}
      </p>

      {/* Features */}
      <ul style={{ listStyle: 'none', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {plan.features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <FiCheck style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.15rem' }} />
            {f}
          </li>
        ))}
      </ul>

      {/* Not included */}
      {plan.notIncluded.length > 0 && (
        <ul style={{ listStyle: 'none', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {plan.notIncluded.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              <span style={{ flexShrink: 0, marginTop: '0.1rem' }}>–</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/contact"
        className={`btn ${plan.popular ? 'btn-gold' : 'btn-outline'}`}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {plan.cta}
      </Link>
    </motion.div>
  )
}