import { 
  FiShield, 
  FiZap, 
  FiCode, 
  FiLayout, 
  FiTrendingUp, 
  FiMapPin 
} from 'react-icons/fi';

const FAQ_DATA = [
  {
    q: "How much does a contractor website cost?",
    a: "Most of our contractor websites run between $2,500–$6,000 depending on scope — service area pages, quote funnels, number of services. We don't do $500 templates. Every site is custom-built for your business. We'll give you an honest estimate on the free audit call.",
  },
  {
    q: "How long does it take to launch?",
    a: "4–8 weeks from deposit to launch. We've refined the process specifically for service businesses — we know you don't have time to babysit a 6-month project. You'll see a working prototype within 2 weeks.",
  },
  {
    q: "Do I own the website after it's built?",
    a: "Yes. 100%. You own the code, the domain, the content. No ransom hosting, no proprietary lock-in. If you ever want to move it to another developer, everything transfers cleanly.",
  },
  {
    q: "We already have a website. Can you just improve it?",
    a: "Yes — but usually a rebuild is the smarter investment. Most existing contractor sites have structural problems that patches can't fix. The free audit will tell you honestly which makes more sense.",
  },
  {
    q: "Do you work with businesses outside the US?",
    a: "Yes. We work with commercial service companies in the US, UK, Canada, and Cameroon. Most of our client communication is async — timezone differences haven't been an issue.",
  },
];

/* ─── INDUSTRY DATA ──────────────────────────────────────────────────── */
const INDUSTRIES = [
  {
    num: "01",
    icon: FiShield, // Fixed: component reference
    title: "Fire Protection Companies",
    body: "Bid more confidently with a site that shows your licensing, service areas, compliance credentials, and emergency response capabilities — before a prospect ever calls.",
    link: "/projects/fire-protection",
    linkLabel: "View fire protection sites",
  },
  {
    num: "02",
    icon: FiZap, // Fixed: component reference
    title: "Commercial Cleaning Companies",
    body: "Decision-makers at office parks, schools, and medical facilities Google before they call. We make sure you show up, and that your site builds the trust to win the contract.",
    link: "/projects/commercial-cleaning",
    linkLabel: "View cleaning company sites",
  },
  {
    num: "03",
    icon: FiCode, // Fixed: component reference
    title: "Facility Maintenance & Contractors",
    body: "Your contracts are long-term relationships. Your website should communicate reliability, certifications, and response time — the three things facility managers actually care about.",
    link: "/projects/facility-maintenance",
    linkLabel: "View facility contractor sites",
  },
  {
    num: "04",
    icon: FiLayout, // Fixed: component reference
    title: "Landscaping & Ground Services",
    body: "Seasonal contracts, service area pages, before/after galleries, and commercial positioning — we've built it all for landscaping companies landing bigger clients.",
    link: "/projects/landscaping",
    linkLabel: "View landscaping sites",
  },
];

/* ─── SERVICE FALLBACKS ──────────────────────────────────────────────── */
const SERVICE_FALLBACKS = [
  {
    slug: "credibility-website",
    title: "Credibility-First Websites",
    subDescription:
      "Built to make prospects trust you before the first call. Licensing, credentials, service areas, and social proof — structured for commercial decision-makers.",
    icon: FiLayout, // Fixed: component reference
  },
  {
    slug: "quote-generation",
    title: "Quote Request Systems",
    subDescription:
      "Clear service funnels, targeted landing pages, and 24/7 lead capture forms built specifically around how contractors get inbound work.",
    icon: FiTrendingUp, // Fixed: component reference
  },
  {
    slug: "local-seo",
    title: "Local SEO Foundation",
    subDescription:
      "When a facility manager Googles your service in your city, you need to be on page one. We bake local SEO into every site from day one.",
    icon: FiMapPin, // Fixed: component reference
  },
];

const ICON_MAP = {
  "web-development":     FiCode,        // Fixed: component reference
  "ui-ux-design":        FiLayout,      // Fixed: component reference
  "digital-marketing":   FiTrendingUp,  // Fixed: component reference
  "credibility-website": FiLayout,      // Fixed: component reference
  "quote-generation":    FiTrendingUp,  // Fixed: component reference
  "local-seo":           FiMapPin,      // Fixed: component reference
};

const PROBLEM_ITEMS = [
  { label: "Generic template",       bad: true,  text: "Looks like 10,000 other sites. Gives prospects no reason to trust you over a competitor." },
  { label: "No quote funnel",        bad: true,  text: "Visitors leave without contacting you because there's no clear path to request a quote." },
  { label: "Not found on Google",    bad: true,  text: "No local SEO. When someone searches your service in your city, you don't appear." },
  { label: "Credibility-first design", bad: false, text: "Built around your licensing, credentials, and case studies. Wins trust before the first call." },
  { label: "Quote request systems",  bad: false, text: "Clear funnels, service area pages, and 24/7 lead capture. Your site works while you sleep." },
  { label: "Local SEO from day one", bad: false, text: "Service area targeting, structured data, and Google Business integration baked in." },
];

const TICKER_ITEMS = [
  "Fire Protection",
  "Commercial Cleaning",
  "Facility Maintenance",
  "Landscaping",
  "Industrial Contractors",
  "Service Contractors",
];

const PROOF_STATS = [
  { num: "+340%", label: "Average increase in quote requests within 90 days of launch" },
  { num: "< 1.8s", label: "Average page load time. Google-optimized on every build" },
  { num: "4+",    label: "Industries served: fire, cleaning, facility, landscaping" },
];

const TRUST_ITEMS = [
  "No long-term contracts",
  "Free 15-min audit call",
  "US · UK · Canada · Cameroon",
];

const AUDIT_ITEMS = [
  "Current site speed and mobile score",
  "Local SEO gaps vs. competitors",
  "Quote funnel and lead capture audit",
  "Credibility and trust signal review",
  "Top 3 wins you can action immediately",
];

export {
  FAQ_DATA,
  INDUSTRIES,
  SERVICE_FALLBACKS,
  ICON_MAP,
  PROBLEM_ITEMS,
  TICKER_ITEMS,
  PROOF_STATS,
  TRUST_ITEMS,
  AUDIT_ITEMS,
};