/**
 * Zeeltech Agency - Database Seeder
 * Seeded with real production data (services, team, projects)
 *
 * Run:   node seed.js
 * Clear: node seed.js --clear
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');
dotenv.config();

const Role        = require('../models/Role');
const User        = require('../models/User');
const Category    = require('../models/Category');
const Service     = require('../models/Service');
const Team        = require('../models/Team');
const Project     = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Pricing     = require('../models/Pricing');
const Blog        = require('../models/Blog');

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function clearDB() {
  await Promise.all([
    Role.deleteMany(),
    User.deleteMany(),
    Category.deleteMany(),
    Service.deleteMany(),
    Team.deleteMany(),
    Project.deleteMany(),
    Testimonial.deleteMany(),
    Pricing.deleteMany(),
    Blog.deleteMany(),
  ]);
  console.log('✅ Database cleared');
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SEED
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  if (process.argv.includes('--clear')) {
    await clearDB();
    process.exit(0);
  }

  await clearDB();

  // ── ROLES ──────────────────────────────────────────────────────────────────
  const resources  = ['posts', 'users', 'comments', 'projects', 'services', 'testimonials'];
  const allActions = ['create', 'read', 'update', 'delete'];

  const superadminRole = await Role.create({
    title:       'superadmin',
    description: 'Full access to everything',
    permissions: resources.map(r => ({ resource: r, actions: allActions })),
  });

  await Role.create({
    title:       'editor',
    description: 'Can manage posts, comments, and view projects',
    permissions: [
      { resource: 'posts',    actions: allActions },
      { resource: 'comments', actions: allActions },
      { resource: 'projects', actions: ['read', 'update'] },
    ],
  });

  await Role.create({
    title:       'contributor',
    description: 'Can create and read posts only',
    permissions: [
      { resource: 'posts',    actions: ['create', 'read'] },
      { resource: 'comments', actions: ['read'] },
    ],
  });

  console.log('✅ Roles seeded');

  // ── ADMIN USER ─────────────────────────────────────────────────────────────
  const salt   = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('Admin@1234', salt);

  const adminUser = await User.create({
    username: 'superadmin',
    email:    'admin@zeeltech.com',
    password: hashed,
    role:     superadminRole._id,
    isActive: true,
  });

  console.log('✅ Admin user seeded  →  admin@zeeltech.com / Admin@1234');

  // ── CATEGORIES ─────────────────────────────────────────────────────────────
  const cats = await Category.insertMany([
    { name: 'Web Development',   slug: 'web-development',   description: 'Custom websites, web apps, and full-stack development projects',  type: 'both'    },
    { name: 'UI/UX Design',      slug: 'ui-ux-design',      description: 'Design systems, prototypes, and user experience projects',         type: 'both'    },
    { name: 'Digital Marketing', slug: 'digital-marketing', description: 'SEO, paid ads, and growth marketing campaigns',                    type: 'blog'    },
    { name: 'Mobile Apps',       slug: 'mobile-apps',       description: 'iOS and Android mobile application projects',                      type: 'both'    },
    { name: 'E-Commerce',        slug: 'e-commerce',        description: 'Online store builds, product pages, and checkout flows',           type: 'project' },
    { name: 'SaaS Products',     slug: 'saas-products',     description: 'Software-as-a-service dashboards and platforms',                   type: 'project' },
  ]);

  // handy lookup by slug
  const cat = slug => cats.find(c => c.slug === slug);

  console.log('✅ Categories seeded');

  // ── SERVICES ───────────────────────────────────────────────────────────────
  await Service.insertMany([
    {
      imgUrl:          'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
      title:           'Website Design & Development',
      slug:            'website-design-development',
      subDescription:  'We design and build fast, conversion-focused websites that represent your brand professionally and turn visitors into customers.',
      fullDescription: 'Your website is your most important business asset — and most websites are wasting that potential. We build custom websites from the ground up, starting with strategy and wireframes before a single line of code is written. Every site we deliver is mobile-first, SEO-ready, and optimized for speed. We handle the full stack — design, frontend development, backend logic, database setup, and deployment. Whether you need a simple five-page business site or a complex multi-section platform, we engineer it to perform. No templates, no page builders, no shortcuts. Clean code, sharp design, and a site that actually works for your business.',
      process: [
        { title: 'Discovery & Strategy', description: 'We learn your goals, audience, and competitors before touching any design or code.' },
        { title: 'Design & Wireframes',  description: 'We create wireframes and high-fidelity mockups for your approval before development starts.' },
        { title: 'Development',          description: 'Clean, well-structured code built mobile-first with performance and SEO baked in.' },
        { title: 'Launch & Handover',    description: 'We deploy, test across devices, and hand over a site you fully own and understand.' },
      ],
      tools:   ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Figma', 'Git'],
      cta:     'Start Your Project',
      order:   1,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80',
      title:           'Landing Page Design',
      slug:            'landing-page-design',
      subDescription:  'High-converting landing pages built to capture leads, drive sales, and make your ad spend actually worth it.',
      fullDescription: 'A landing page has one job — convert. We design and build standalone landing pages engineered around a single goal, whether that\'s collecting leads, selling a product, or promoting an event. Every element — headline, layout, imagery, call-to-action — is intentional and tested against conversion best practices. We pair sharp visual design with persuasive copywriting and fast load times to ensure the highest possible conversion rate. Ideal for businesses running Facebook Ads, Google Ads, or any campaign that needs a dedicated destination page that performs. We typically deliver within 5–7 business days.',
      process: [
        { title: 'Goal Alignment',    description: 'We clarify the single conversion action the page must drive before any design begins.' },
        { title: 'Copy & Structure',  description: 'We map out the headline, sections, and CTA hierarchy based on proven conversion frameworks.' },
        { title: 'Design & Build',    description: 'Pixel-perfect visual design coded for speed, with tracking pixels and analytics wired in.' },
        { title: 'Test & Optimise',   description: 'We run the page through speed checks and usability review before handing it over.' },
      ],
      tools:   ['HTML', 'CSS', 'JavaScript', 'Figma', 'Hotjar', 'Facebook Pixel', 'Google Tag Manager'],
      cta:     'Build My Landing Page',
      order:   2,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      title:           'E-Commerce Development',
      slug:            'e-commerce-development',
      subDescription:  'Full online store builds with product management, secure checkout, and everything your customers need to buy with confidence.',
      fullDescription: 'We build e-commerce stores that are fast, intuitive, and built to sell. From product catalog architecture to cart logic, payment gateway integration, and order management, we handle every layer of your online store. We work with both custom-built solutions and established platforms depending on your needs and budget. Every store we deliver includes mobile-optimized product pages, a streamlined checkout flow, inventory management, and integration with payment providers. We also build in abandoned cart recovery, discount systems, and analytics tracking from day one so you can understand your customers and grow revenue intelligently.',
      process: [
        { title: 'Store Planning',        description: 'Product architecture, payment provider selection, and feature scoping.' },
        { title: 'Design',                description: 'Mobile-first product pages, cart, and checkout flows designed for maximum conversions.' },
        { title: 'Build & Integrate',     description: 'Full store development with payment gateways, inventory, and order management.' },
        { title: 'Launch & Analytics',    description: 'Deployment with Google Analytics, conversion tracking, and performance verification.' },
      ],
      tools:   ['WooCommerce', 'Shopify', 'Stripe', 'PayPal', 'Node.js', 'MongoDB', 'Figma', 'Google Analytics'],
      cta:     'Launch My Store',
      order:   3,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
      title:           'Web App Development',
      slug:            'web-app-development',
      subDescription:  'Custom web applications built to solve real business problems — from internal tools to customer-facing platforms.',
      fullDescription: 'When off-the-shelf software doesn\'t fit your workflow, you need a custom web application. We design and build full-stack web apps tailored to your exact business logic — whether that\'s a booking system, a client portal, an inventory manager, a SaaS dashboard, or any other internal or external tool. We architect applications for performance, security, and scalability from the start. Our process covers requirements gathering, system design, UI/UX, frontend development, backend API development, database design, testing, and deployment. You get a production-ready application with proper authentication, role-based access control, and a codebase you actually own.',
      process: [
        { title: 'Requirements & Architecture', description: 'We map out your business logic, data models, and system design before writing code.' },
        { title: 'UI/UX Design',                description: 'Full interface design with user flows, wireframes, and interactive prototypes.' },
        { title: 'Full-Stack Development',       description: 'Frontend, backend API, database, and auth system built and tested thoroughly.' },
        { title: 'Deployment & Docs',            description: 'Hosted on reliable infrastructure with full technical documentation handed over.' },
      ],
      tools:   ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'REST API', 'Figma', 'GitHub', 'Render'],
      cta:     'Build My App',
      order:   4,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80',
      title:           'Website Redesign & Revamp',
      slug:            'website-redesign-revamp',
      subDescription:  'We take your outdated website and rebuild it into a modern, fast, and conversion-ready platform without losing your SEO equity.',
      fullDescription: 'An outdated website is actively costing you business. If your site looks old, loads slowly, or doesn\'t work on mobile, visitors leave before they even read your offer. We audit your existing website, identify what\'s hurting performance and conversions, then redesign and rebuild it from the ground up — or significantly improve it layer by layer. We preserve your existing URL structure and SEO rankings throughout the migration, so you don\'t lose the organic traffic you\'ve built. The result is a fresh, modern site that reflects your current brand, loads fast on every device, and converts significantly better than what you had before.',
      process: [
        { title: 'Audit & Diagnosis',   description: 'Full review of your current site\'s design, performance, SEO, and conversion weaknesses.' },
        { title: 'Redesign',            description: 'New visual design aligned with your brand, modernised and tested before rebuild.' },
        { title: 'Rebuild',             description: 'Clean code rebuild preserving URL structure, redirects, and all SEO metadata.' },
        { title: 'Migration & Launch',  description: 'Zero-downtime launch with full QA across devices and browsers before going live.' },
      ],
      tools:   ['Figma', 'HTML', 'CSS', 'JavaScript', 'React', 'Lighthouse', 'Google Search Console', 'Git'],
      cta:     'Revamp My Site',
      order:   5,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
      title:           'Website Maintenance & Support',
      slug:            'website-maintenance-support',
      subDescription:  'Ongoing technical support, updates, and monitoring so your website stays fast, secure, and working — every single day.',
      fullDescription: 'Websites break, get hacked, go slow, and become outdated without regular attention. Our maintenance plans keep your site healthy without you having to think about it. We handle software and plugin updates, security patches, uptime monitoring, performance checks, content updates, broken link fixes, and regular backups. If something goes wrong, you have a team that responds fast and knows your site inside out. Monthly reports keep you informed about your site\'s health, speed scores, and security status. Available as a monthly retainer — choose a plan that matches how active your site is.',
      process: [
        { title: 'Onboarding',          description: 'We audit your site\'s current state and document every dependency and access credential.' },
        { title: 'Ongoing Monitoring',  description: '24/7 uptime monitoring with instant alerts if anything goes down.' },
        { title: 'Monthly Maintenance', description: 'Updates, backups, security scans, and performance checks performed every month.' },
        { title: 'Monthly Report',      description: 'Clear report covering uptime, speed scores, security status, and changes made.' },
      ],
      tools:   ['Git', 'cPanel', 'Cloudflare', 'UptimeRobot', 'Google Search Console', 'Lighthouse', 'Wordfence'],
      cta:     'Get a Maintenance Plan',
      order:   6,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80',
      title:           'Search Engine Optimization (SEO)',
      slug:            'search-engine-optimization-seo',
      subDescription:  'Get found on Google by the people already searching for what you offer — without paying for every single click.',
      fullDescription: 'SEO is the highest ROI marketing channel for most businesses — but only when done properly. We conduct a full technical audit of your website, fix what\'s hurting your rankings, and build a keyword strategy around what your actual customers search for. Our SEO service covers on-page optimization, technical SEO fixes, site speed improvements, meta data, structured data markup, internal linking architecture, and content recommendations. For local businesses, we also handle Google Business Profile optimization and local citation building. We report monthly on keyword rankings, organic traffic, and conversions so you always know what\'s working.',
      process: [
        { title: 'Technical Audit',     description: 'Full crawl of your site identifying every technical issue affecting rankings.' },
        { title: 'Keyword Strategy',    description: 'Research-backed keyword plan mapped to your services and customer intent.' },
        { title: 'On-Page Optimisation',description: 'Meta tags, headers, content structure, internal linking, and schema markup.' },
        { title: 'Monthly Reporting',   description: 'Keyword ranking reports, traffic analysis, and next-steps every month.' },
      ],
      tools:   ['Google Search Console', 'Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Analytics', 'Yoast', 'Schema.org'],
      cta:     'Grow My Rankings',
      order:   7,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      title:           'Google Ads & Paid Media Management',
      slug:            'google-ads-paid-media-management',
      subDescription:  'We run and manage paid ad campaigns that bring in qualified leads — not just clicks — while keeping your cost per acquisition low.',
      fullDescription: 'Running ads without a strategy is burning money. We manage Google Ads and Meta Ads campaigns built around your business goals — leads, sales, bookings, or brand awareness. We handle everything from account setup and audience research to ad copy, creative direction, bidding strategy, landing page recommendations, and ongoing optimization. Every campaign is tracked to the conversion event that matters most to your business, and we optimize weekly based on real performance data. Our goal is always to lower your cost per lead or sale over time while scaling what\'s working. Monthly reporting gives you full transparency on where every dollar goes.',
      process: [
        { title: 'Account Audit & Setup', description: 'We audit existing accounts or build new ones with correct conversion tracking from day one.' },
        { title: 'Audience & Copy',       description: 'Audience research, ad copy, and creative direction aligned to your offer and goals.' },
        { title: 'Campaign Launch',       description: 'Campaigns launched with appropriate bidding strategies and budget allocation.' },
        { title: 'Optimise & Report',     description: 'Weekly optimisation and monthly performance reports with full spend transparency.' },
      ],
      tools:   ['Google Ads', 'Meta Ads Manager', 'Google Analytics', 'Google Tag Manager', 'Facebook Pixel', 'Looker Studio'],
      cta:     'Launch My Campaigns',
      order:   8,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1586772002130-b0f3daa6f6b3?w=800&q=80',
      title:           'Domain Setup & DNS Management',
      slug:            'domain-setup-dns-management',
      subDescription:  'Complete domain registration, DNS configuration, and email setup — done correctly the first time so nothing breaks downstream.',
      fullDescription: 'Bad DNS configuration causes email deliverability failures, website downtime, and security vulnerabilities — and most people don\'t realize it until the damage is done. We handle domain registration, DNS record setup, nameserver configuration, MX records for business email, SPF, DKIM, and DMARC configuration, subdomain management, and domain transfers. If you\'re migrating from one host to another, we manage the full DNS transition with zero downtime. We also set up professional business email addresses on your domain and ensure all records are correctly configured for SSL, Google Workspace, or any third-party tool you need to connect.',
      process: [
        { title: 'Domain & Registrar Review', description: 'We assess your current domain setup and identify any misconfigurations.' },
        { title: 'DNS Configuration',         description: 'All records set up correctly — A, CNAME, MX, TXT, SPF, DKIM, DMARC.' },
        { title: 'Email & Integrations',      description: 'Business email configured and all third-party tools connected and verified.' },
        { title: 'Handover & Documentation',  description: 'Full documentation of every record and credential, handed over to your team.' },
      ],
      tools:   ['Cloudflare', 'Namecheap', 'GoDaddy', 'cPanel', 'Google Workspace', 'DNSChecker', 'MXToolbox'],
      cta:     'Set Up My Domain',
      order:   9,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      title:           'API Integration',
      slug:            'api-integration',
      subDescription:  'We connect your website or app to any third-party service — payment gateways, CRMs, shipping providers, and more.',
      fullDescription: 'Modern businesses run on connected systems. If your website can\'t talk to your CRM, payment processor, shipping provider, or any other tool in your stack, you\'re doing manual work that should be automated. We integrate REST and GraphQL APIs into your existing website or application — handling authentication, data mapping, error handling, and webhook setup. Common integrations we handle include payment gateways (Stripe, PayPal, Flutterwave), email platforms (Mailchimp, SendGrid), CRMs (HubSpot, Zoho), shipping APIs (DHL, FedEx), and social platforms. We document every integration we build so your team can understand and maintain it.',
      process: [
        { title: 'Integration Scoping', description: 'We map out what needs to connect, the data flow, and any authentication requirements.' },
        { title: 'Build & Test',        description: 'Integration built with proper error handling, logging, and edge case coverage.' },
        { title: 'Webhook & Automation',description: 'Event-driven automation configured and verified end to end.' },
        { title: 'Documentation',       description: 'Full written documentation of every endpoint, payload, and configuration.' },
      ],
      tools:   ['REST API', 'GraphQL', 'Postman', 'Node.js', 'Stripe', 'Flutterwave', 'SendGrid', 'Webhooks', 'JWT'],
      cta:     'Connect My Systems',
      order:   10,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80',
      title:           'CMS Setup & Configuration',
      slug:            'cms-setup-configuration',
      subDescription:  'We set up and configure your content management system so your team can update the website without touching a line of code.',
      fullDescription: 'A good CMS gives your team full control over content without depending on a developer for every change. We set up, configure, and customize content management systems to fit your exact content structure and workflow. Whether you need a traditional CMS like WordPress or a modern headless CMS like Sanity or Contentful, we handle installation, theme or schema setup, user role configuration, plugin or integration setup, and editorial workflow design. We also train your team on how to use the system confidently. Every CMS we configure is structured so content editors can publish, update, and manage pages, blog posts, products, or any content type — without breaking anything.',
      process: [
        { title: 'CMS Selection',     description: 'We recommend the right CMS based on your content types, team size, and tech stack.' },
        { title: 'Setup & Configure', description: 'Installation, schema design, user roles, and all integrations configured correctly.' },
        { title: 'Content Migration', description: 'Existing content migrated cleanly with formatting and media intact.' },
        { title: 'Team Training',     description: 'Your team trained and confident before we hand over the keys.' },
      ],
      tools:   ['WordPress', 'Sanity', 'Contentful', 'Strapi', 'Ghost', 'Webflow CMS', 'Next.js', 'Netlify'],
      cta:     'Set Up My CMS',
      order:   11,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      title:           'Website Speed & Performance Optimization',
      slug:            'website-speed-performance-optimization',
      subDescription:  'We diagnose and fix what\'s making your website slow — improving load times, Lighthouse scores, and user experience across all devices.',
      fullDescription: 'A one-second delay in page load time can reduce conversions by up to 7%. If your site scores below 80 on Google\'s PageSpeed Insights, you are losing both rankings and revenue. We conduct a full performance audit of your website, identifying every issue contributing to slow load times — unoptimized images, render-blocking scripts, excessive HTTP requests, poor caching, large JavaScript bundles, and inefficient server responses. We then systematically fix each issue and re-test until your scores reflect a genuinely fast website. Deliverables include before/after Lighthouse reports, Core Web Vitals improvements, and a documented list of every change made and why.',
      process: [
        { title: 'Performance Audit',   description: 'Full Lighthouse and Core Web Vitals audit identifying every speed bottleneck.' },
        { title: 'Asset Optimisation',  description: 'Images converted to WebP, scripts deferred, CSS minified, fonts optimised.' },
        { title: 'Caching & CDN',       description: 'Browser caching, server caching, and CDN configured for maximum speed.' },
        { title: 'Re-test & Report',    description: 'Before/after Lighthouse reports with documented changes and score improvements.' },
      ],
      tools:   ['Google Lighthouse', 'PageSpeed Insights', 'GTmetrix', 'WebP', 'Cloudflare CDN', 'Lazy Loading', 'Webpack', 'Nginx'],
      cta:     'Speed Up My Site',
      order:   12,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      title:           'UI/UX Design & Prototyping',
      slug:            'uiux-design-prototyping',
      subDescription:  'User interface and experience design that makes your product intuitive, beautiful, and genuinely enjoyable to use.',
      fullDescription: 'Good design isn\'t decoration — it\'s the difference between a product people adopt and one they abandon. We design digital interfaces that are visually sharp, logically structured, and tested against real user behavior. Our UI/UX process starts with understanding your users and business goals, then moves through information architecture, wireframing, visual design, and interactive prototyping. Every design decision is intentional — layout, typography, color, spacing, interaction states, and micro-animations all serve a purpose. Deliverables include full Figma design files, component libraries, clickable prototypes, and a handoff-ready design system your developers can build from efficiently.',
      process: [
        { title: 'User Research',            description: 'User goals, pain points, and behavioral patterns defined before any design starts.' },
        { title: 'Information Architecture',  description: 'Sitemaps, user flows, and low-fidelity wireframes agreed before visual design.' },
        { title: 'Visual Design',            description: 'High-fidelity mockups, design system, and interactive Figma prototype.' },
        { title: 'Dev Handoff',              description: 'Annotated, developer-ready files with specs, assets, and motion guidelines.' },
      ],
      tools:   ['Figma', 'FigJam', 'Maze', 'Lottie', 'Adobe Illustrator', 'Zeroheight', 'Storybook'],
      cta:     'Design My Product',
      order:   13,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80',
      title:           'Conversion Rate Optimization (CRO)',
      slug:            'conversion-rate-optimization-cro',
      subDescription:  'We identify exactly why visitors aren\'t converting and fix it — turning your existing traffic into more leads, sales, and revenue.',
      fullDescription: 'Most websites convert between 1–3% of their visitors. We find out why the other 97% are leaving and systematically fix it. CRO is the process of increasing the percentage of visitors who take a desired action — whether that\'s filling a form, making a purchase, or booking a call. We start with a heatmap and session recording audit to understand real user behavior on your site, then combine that with analytics data to identify the highest-impact friction points. From there, we redesign problem areas, rewrite copy, restructure calls-to-action, and implement changes that are tracked against your baseline. The result is more revenue from the traffic you\'re already paying for.',
      process: [
        { title: 'Behavior Audit',       description: 'Heatmaps, session recordings, and analytics reviewed to find where users drop off.' },
        { title: 'Friction Identification', description: 'Prioritised list of issues by impact — copy, layout, CTAs, forms, trust signals.' },
        { title: 'Implement Changes',    description: 'Redesigns and copy rewrites deployed with analytics tracking against the baseline.' },
        { title: 'Report & Iterate',     description: 'Conversion lift reported and next round of improvements scoped.' },
      ],
      tools:   ['Hotjar', 'Google Analytics', 'Google Optimize', 'Clarity', 'Figma', 'Google Tag Manager', 'Looker Studio'],
      cta:     'Increase My Conversions',
      order:   14,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      title:           'Custom Admin Dashboard Development',
      slug:            'custom-admin-dashboard-development',
      subDescription:  'Purpose-built admin panels and internal dashboards that give your team full control over your platform — built exactly for your workflow.',
      fullDescription: 'Generic admin tools never quite fit. We build custom admin dashboards tailored to your specific platform, data model, and team workflow. Whether you need a CMS for your own website, an operations panel for your business, or a full internal tool for managing users, orders, content, or analytics — we design and build it from scratch. Every dashboard we build includes role-based access control, data tables with filtering and search, CRUD operations for all your data types, and clean data visualization where relevant. Built on a React frontend with a Node.js/Express API backend, your dashboard is fast, maintainable, and owned entirely by you.',
      process: [
        { title: 'Requirements Mapping', description: 'Every data type, user role, and workflow documented before design begins.' },
        { title: 'Dashboard Design',     description: 'Clean, functional UI designed for the people who will actually use it daily.' },
        { title: 'Build & Integrate',    description: 'Full-stack dashboard built with RBAC, CRUD, search, filters, and data viz.' },
        { title: 'Deploy & Train',       description: 'Hosted, documented, and your team walked through every feature at handover.' },
      ],
      tools:   ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Recharts', 'TailwindCSS', 'REST API', 'GitHub'],
      cta:     'Build My Dashboard',
      order:   15,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
      title:           'Mobile-Responsive Design Audit',
      slug:            'mobile-responsive-design-audit',
      subDescription:  'A thorough audit of your website\'s mobile experience — with a full report and fixes for every layout and performance issue on small screens.',
      fullDescription: 'Over 60% of web traffic is mobile. If your site has layout breaks, tiny tap targets, horizontal scrolling, or text that\'s unreadable on a phone — you are losing more than half your potential customers before they even read your offer. We conduct a comprehensive mobile responsiveness audit across all major screen sizes and devices, testing layout integrity, font sizing, button spacing, image scaling, navigation usability, form behavior, and load performance on mobile networks. You receive a detailed audit report documenting every issue found, its impact severity, and the recommended fix. We then implement all fixes and retest to confirm resolution before delivery.',
      process: [
        { title: 'Cross-Device Testing',  description: 'Your site tested across phones, tablets, and screens from 320px to 1440px.' },
        { title: 'Audit Report',          description: 'Every issue documented with severity rating, screenshot, and recommended fix.' },
        { title: 'Fix Implementation',    description: 'All issues resolved in code — layout, spacing, images, nav, and forms.' },
        { title: 'Re-test & Sign Off',    description: 'Full retest across all breakpoints before final delivery.' },
      ],
      tools:   ['Chrome DevTools', 'BrowserStack', 'Google Mobile-Friendly Test', 'Lighthouse', 'Responsively App', 'CSS Media Queries'],
      cta:     'Audit My Mobile Site',
      order:   16,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80',
      title:           'WhatsApp & Chatbot Integration',
      slug:            'whatsapp-chatbot-integration',
      subDescription:  'Add WhatsApp chat and automated chatbot flows to your website — so you never miss a lead, even when you\'re offline.',
      fullDescription: 'Your customers want instant answers — and if they don\'t get them, they leave. We integrate WhatsApp Business and AI-powered chatbots directly into your website to capture leads, answer common questions, qualify prospects, and route inquiries to the right person — automatically. For WhatsApp, we set up the Business API connection, configure automated greeting messages, quick replies, and lead capture flows. For chatbot integrations, we build conversation flows that handle FAQs, booking requests, product queries, and contact collection — with a human handoff when needed. Every integration is tested end to end and includes documentation for your team on how to manage and update it.',
      process: [
        { title: 'Flow Mapping',        description: 'We map every conversation scenario — FAQs, lead capture, bookings, and handoffs.' },
        { title: 'API Setup',           description: 'WhatsApp Business API or chatbot platform connected and authenticated.' },
        { title: 'Build & Test Flows',  description: 'Conversation flows built, tested end to end, and refined before going live.' },
        { title: 'Launch & Handover',   description: 'Live on your site with documentation so your team can manage and update flows.' },
      ],
      tools:   ['WhatsApp Business API', 'Twilio', 'Tidio', 'Crisp', 'ManyChat', 'Node.js', 'Webhooks', 'Dialogflow'],
      cta:     'Add Chat to My Site',
      order:   17,
      status:  'active',
    },
    {
      imgUrl:          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      title:           'Web Hosting & Deployment',
      slug:            'web-hosting-and-deployment',
      subDescription:  'Fast, reliable hosting built for businesses that can\'t afford downtime. NVMe SSD servers, free SSL, and one-click deployment — all managed for you.',
      fullDescription: 'We handle everything from server setup to ongoing maintenance so you can focus on running your business. Our hosting infrastructure runs on NVMe SSD storage for lightning-fast load times, backed by a 99.9% uptime guarantee. Every site comes with a free SSL certificate, automated daily backups, malware scanning, and a staging environment for safe updates. Whether you\'re launching a new site or migrating an existing one, we handle the technical heavy lifting end to end — including domain configuration, DNS setup, and performance optimization. You get a site that loads fast, stays secure, and scales as your business grows — without a single server headache.',
      process: [
        { title: 'Environment Setup',   description: 'Server provisioned, configured, and secured before your site is touched.' },
        { title: 'Migration or Deploy', description: 'Site migrated or deployed with zero downtime and full DNS configuration.' },
        { title: 'SSL & Backups',       description: 'SSL installed, automated backups configured, and malware scanning enabled.' },
        { title: 'Monitoring & Support',description: 'Uptime monitoring active and our team on hand for any issues post-launch.' },
      ],
      tools:   ['cPanel', 'Nginx', 'Cloudflare', "Let's Encrypt", 'MySQL', 'Git', 'Ubuntu Server', 'Hostinger'],
      cta:     'Get Hosted Today',
      order:   18,
      status:  'active',
    },
  ]);

  console.log('✅ Services seeded (18 services)');

  // ── TEAM ───────────────────────────────────────────────────────────────────
  await Team.insertMany([
    {
      name:     'Timchia Cabzeel',
      slug:     'zeel',
      position: 'Founder & CEO',
      imgUrl:   'https://i.imgur.com/rZVAAXw.jpeg',
      bio:      'Full-stack engineer with 5+ years of experience building scalable SaaS products. Passionate about clean code and great user experiences.',
      socialLinks: {
        linkedin:  'https://linkedin.com',
        instagram: 'https://instagram.com',
      },
      order:     1,
      isVisible: true,
    },
  ]);

  console.log('✅ Team seeded');

  // ── PROJECTS ───────────────────────────────────────────────────────────────
  await Project.insertMany([
    {
      title:       "Comfort's African Chops — WhatsApp Integrated Food Ordering Platform",
      slug:        'comforts-african-chops-whatsapp-integrated-food-ordering-platform',
      coverImage:  'https://i.imgur.com/xoq4xjW.png',
      images:      [],
      description: 'Comfort is a Cameroonian food entrepreneur running her business from abroad. We built her a mobile-first food ordering platform with WhatsApp integration — every order goes straight to her inbox, fully formatted and ready to act on.',
      category:    cat('web-development')._id,
      clientName:  'Comfort (Private client — Cameroonian abroad)',
      status:      'completed',
      order:       1,
      isFeatured:  true,
      url:         'https://comfort237.netlify.app',
      problem:     'Comfort was taking orders manually through DMs and phone calls — a chaotic process that led to missed orders, forgotten customer details, and no reliable way to track who ordered what or follow up with past clients. As her customer base grew, the manual process became unmanageable. She needed a system that centralised her orders without requiring her to learn new software or pay for expensive platforms.',
      solution:    'We built a custom food ordering website with a WhatsApp Business API integration at its core. Every order form submission triggers an automated WhatsApp message sent directly to Comfort\'s number, formatted with the customer\'s name, phone number, order items, quantities, and any special instructions. Comfort now receives every order instantly on her phone — in a format she can act on immediately. The site also captures customer contact details with each order, giving her a growing database of clients she can reach out to later for promotions, restocks, or follow-up. The result is a business that runs itself while she focuses on cooking.',
      cta:         'Order Now via WhatsApp',
      results:     [],
    },
    {
      title:       'Fako Grand Hotel Website',
      slug:        'fako-grand-hotel-website',
      coverImage:  'https://i.imgur.com/p0qHhpr.png',
      images:      [],
      description: 'A modern bilingual hotel website built for Fako Grand Hotel in Douala, enabling direct bookings, mobile-first access, and local payment integration while reducing reliance on third-party platforms.',
      category:    cat('web-development')._id,
      clientName:  'Internal Project',
      status:      'completed',
      order:       2,
      isFeatured:  true,
      url:         'https://fakogrand.netlify.app',
      problem:     'The hotel depended heavily on OTA platforms like Booking.com and Expedia, losing up to 22% per booking. It lacked a direct booking channel, did not support local payment methods like MTN MoMo, and failed to address trust issues such as power reliability, security, and bilingual communication.',
      solution:    'We built a mobile-first, bilingual website with an integrated booking system and support for MTN MoMo, Orange Money, and cards. The platform emphasizes direct booking, transparent pricing, and trust-building content, while showcasing rooms and experiences clearly to increase conversions.',
      cta:         'Book Direct Now',
      results:     [],
    },
    {
      title:       'Bank App UI',
      slug:        'bank-app-ui',
      coverImage:  'https://i.imgur.com/kOzSNxj.png',
      images:      [],
      description: 'A polished mobile banking application UI prototype hosted on Firebase, demonstrating a modern fintech dashboard with account overviews, transaction history, and card management screens.',
      category:    cat('ui-ux-design')._id,
      clientName:  'Internal',
      status:      'completed',
      order:       3,
      isFeatured:  true,
      url:         'https://bank-app-ui-a84c5.web.app/',
      problem:     'Many banking apps suffer from poor UX — cluttered dashboards, confusing navigation, and designs that fail to build user trust or clearly surface key financial data.',
      solution:    'A clean, component-driven banking UI was designed and deployed showcasing intuitive navigation, a clear account summary, transaction feeds, and a card management interface — serving as a reference-grade fintech UI prototype.',
      cta:         'View the App',
      results:     [],
    },
    {
      title:       'Zeeltech Sample Website',
      slug:        'zeeltech-sample-website',
      coverImage:  'https://i.imgur.com/EkngKZI.png',
      images:      [],
      description: 'A website that utilises modern animation tech and 3D for stunning and captivating visuals.',
      category:    cat('web-development')._id,
      clientName:  'Agency',
      status:      'ongoing',
      order:       4,
      isFeatured:  true,
      url:         'https://zeeltech.netlify.app',
      problem:     'In this modern day and age, animations are everywhere — but they are usually overdone and take the user\'s attention away from what actually matters.',
      solution:    'The Zeeltech website is a perfect blend of style and elegance. It utilises 3D graphics and stunning animations, masterfully presenting the main content in a way that is not only non-distracting but also highly captivating.',
      cta:         'View Zeeltech',
      results:     [],
    },
  ]);

  console.log('✅ Projects seeded (4 projects)');

  // ── TESTIMONIALS ───────────────────────────────────────────────────────────
  await Testimonial.insertMany([
    {
      name:            'Marcus Ellroy',
      position:        'CTO',
      company:         'ShopWave Inc.',
      testimonialText: 'Zeeltech delivered beyond expectations. The platform handled our Black Friday sale — 15,000 concurrent users — without a single hiccup. Outstanding engineering team.',
      rating:          5,
      status:          'approved',
      isFeatured:      true,
      imgUrl:          'https://randomuser.me/api/portraits/men/11.jpg',
      websiteUrl:      'https://shopwave.com',
    },
    {
      name:            'Aisha Kamara',
      position:        'Product Manager',
      company:         'TaskFlow Ltd.',
      testimonialText: "The team's communication was impeccable. Weekly demos, fast iterations, and they genuinely cared about the product outcome — not just shipping code. A true partner.",
      rating:          5,
      status:          'approved',
      isFeatured:      true,
      imgUrl:          'https://randomuser.me/api/portraits/women/55.jpg',
      websiteUrl:      'https://taskflow.com',
    },
    {
      name:            'Dr. Emmanuel Fru',
      position:        'CEO',
      company:         'MedConnect Health',
      testimonialText: 'They understood the nuances of healthcare software — privacy, reliability, and simplicity for non-tech users. The app has genuinely changed lives in rural communities.',
      rating:          5,
      status:          'approved',
      isFeatured:      true,
      imgUrl:          'https://randomuser.me/api/portraits/men/78.jpg',
    },
    {
      name:            'Chloé Dupont',
      position:        'Marketing Director',
      company:         'BrandBoost Agency',
      testimonialText: 'Our organic traffic increased 220% in just 3 months after Zeeltech rebuilt our website. The Core Web Vitals scores alone made the investment worthwhile.',
      rating:          5,
      status:          'approved',
      isFeatured:      false,
      imgUrl:          'https://randomuser.me/api/portraits/women/33.jpg',
    },
  ]);

  console.log('✅ Testimonials seeded');

  // ── PRICING ────────────────────────────────────────────────────────────────
  await Pricing.insertMany([
    {
      name:       'Basic',
      priceRange: { min: 500,   max: 1500  },
      features:   ['1 Page Website', 'Mobile Responsive', 'Contact Form', '3 Revisions', '1 Month Support'],
      cta:        'Get Started',
      isPopular:  false,
      order:      1,
      status:     'active',
    },
    {
      name:       'Pro',
      priceRange: { min: 2000,  max: 5000  },
      features:   ['Up to 10 Pages', 'CMS Integration', 'SEO Optimization', 'Custom Animations', 'Blog Setup', '5 Revisions', '3 Months Support'],
      cta:        'Most Popular',
      isPopular:  true,
      order:      2,
      status:     'active',
    },
    {
      name:       'Advanced',
      priceRange: { min: 5000,  max: 12000 },
      features:   ['Full Web Application', 'Custom Backend API', 'Database Design', 'Auth System', 'Admin Dashboard', 'Unlimited Revisions', '6 Months Support'],
      cta:        'Scale Up',
      isPopular:  false,
      order:      3,
      status:     'active',
    },
    {
      name:       'Premium',
      priceRange: { min: 12000, max: 50000 },
      features:   ['Enterprise Platform', 'Mobile App Included', 'DevOps & CI/CD', 'Load Testing', 'Dedicated Team', 'Priority Support 24/7', '1 Year Maintenance'],
      cta:        'Go Enterprise',
      isPopular:  false,
      order:      4,
      status:     'active',
    },
  ]);

  console.log('✅ Pricing seeded');

  // ── BLOGS ──────────────────────────────────────────────────────────────────
  await Blog.insertMany([
    {
      title:       'Why Your Business Needs a Custom Web App in 2025',
      slug:        'why-business-needs-custom-web-app-2025',
      coverImage:  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      excerpt:     'Off-the-shelf tools have limits. Discover why businesses that invest in custom software consistently outperform their competitors.',
      content:     '<p>The digital landscape in 2025 demands more than a templated website. Businesses that invest in custom web applications gain a competitive edge through tailored workflows, seamless integrations, and user experiences that generic platforms simply cannot offer.</p><h2>The Problem with Cookie-Cutter Solutions</h2><p>Tools like Wix and Squarespace are excellent for simple presences, but they become bottlenecks as your business scales. Custom apps grow with you — shaped exactly to your processes, your users, and your goals.</p>',
      author:      adminUser._id,
      category:    cat('web-development')._id,
      tags:        ['web development', 'business', 'technology'],
      status:      'published',
      isFeatured:  true,
      readTime:    5,
      publishedAt: new Date(),
      views:       243,
    },
    {
      title:       'The Art of Glassmorphism: A Modern UI Design Trend',
      slug:        'glassmorphism-modern-ui-design-trend',
      coverImage:  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      excerpt:     'Glassmorphism is everywhere in 2025 UI design. Here is how to use it tastefully without sacrificing usability.',
      content:     '<p>Glassmorphism — the frosted glass effect seen across modern interfaces — has evolved from a fleeting trend into a design staple. When used correctly, it adds depth, elegance, and visual hierarchy to digital products.</p><h2>The Core Principles</h2><p>True glassmorphism requires: background blur, semi-transparent surfaces, subtle borders, and a vibrant background underneath to let the effect breathe.</p>',
      author:      adminUser._id,
      category:    cat('ui-ux-design')._id,
      tags:        ['design', 'UI', 'glassmorphism'],
      status:      'published',
      isFeatured:  true,
      readTime:    4,
      publishedAt: new Date(Date.now() - 3 * 864e5),
      views:       189,
    },
    {
      title:       'SEO in 2025: What Still Works and What Doesn\'t',
      slug:        'seo-2025-what-works',
      coverImage:  'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800',
      excerpt:     'Google keeps evolving. We break down the SEO strategies driving real traffic in 2025 and the ones to finally abandon.',
      content:     '<p>Search engine optimization has never been more nuanced. With AI-driven search, E-E-A-T signals, and Core Web Vitals playing a bigger role, the rules have changed dramatically since 2022.</p><h2>What Works in 2025</h2><p>Topical authority, firsthand experience content, and technical performance are the three non-negotiable pillars of modern SEO success.</p>',
      author:      adminUser._id,
      category:    cat('digital-marketing')._id,
      tags:        ['SEO', 'digital marketing', 'Google'],
      status:      'published',
      isFeatured:  false,
      readTime:    7,
      publishedAt: new Date(Date.now() - 7 * 864e5),
      views:       412,
    },
    {
      title:       'React Native vs Flutter in 2025: Which Should You Choose?',
      slug:        'react-native-vs-flutter-2025',
      coverImage:  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
      excerpt:     'Both frameworks are mature and production-ready. We compare them across performance, ecosystem, and developer hiring.',
      content:     '<p>The React Native vs Flutter debate has raged since 2018. In 2025, both frameworks have matured significantly, making the choice less obvious than ever. This guide gives you a practical decision framework based on your team and product.</p>',
      author:      adminUser._id,
      category:    cat('mobile-apps')._id,
      tags:        ['mobile', 'React Native', 'Flutter'],
      status:      'published',
      isFeatured:  false,
      readTime:    8,
      publishedAt: new Date(Date.now() - 14 * 864e5),
      views:       567,
    },
  ]);

  console.log('✅ Blogs seeded');

  console.log('\n🎉 All done! Database is fully seeded with Zeeltech production data.');
  console.log('──────────────────────────────────────────────────────────────────');
  console.log('  Admin login: admin@zeeltech.com / Admin@1234                   ');
  console.log('  Services:    18  |  Projects: 4  |  Team: 1  |  Blogs: 4      ');
  console.log('──────────────────────────────────────────────────────────────────');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});