/**
 * Zeeltech Agency - Database Seeder
 * Run:   node src/seeders/seed.js
 * Clear: node src/seeders/seed.js --clear
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
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

async function clearDB() {
  await Promise.all([
    Role.deleteMany(), User.deleteMany(), Category.deleteMany(),
    Service.deleteMany(), Team.deleteMany(), Project.deleteMany(),
    Testimonial.deleteMany(), Pricing.deleteMany(), Blog.deleteMany(),
  ]);
  console.log('✅ Database cleared');
}

console.log("MONGO_URI:", process.env.MONGO_URI);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  if (process.argv.includes('--clear')) { await clearDB(); process.exit(0); }
  await clearDB();

  // ── Roles ────────────────────────────────────────────────────────────────
  const resources   = ['posts','users','comments','projects','services','testimonials'];
  const allActions  = ['create','read','update','delete'];

  const superadminRole = await Role.create({
    title: 'superadmin',
    description: 'Full access to everything',
    permissions: resources.map(r => ({ resource: r, actions: allActions })),
  });
  await Role.create({
    title: 'editor',
    description: 'Can manage posts, comments, projects',
    permissions: [
      { resource: 'posts',    actions: allActions },
      { resource: 'comments', actions: allActions },
      { resource: 'projects', actions: ['read','update'] },
    ],
  });
  await Role.create({
    title: 'contributor',
    description: 'Can create and read posts',
    permissions: [
      { resource: 'posts',    actions: ['create','read'] },
      { resource: 'comments', actions: ['read'] },
    ],
  });
  console.log('✅ Roles seeded');

  // ── Admin User ───────────────────────────────────────────────────────────
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

  // ── Categories ───────────────────────────────────────────────────────────
  const cats = await Category.insertMany([
    { name: 'Web Development',   slug: 'web-development',   description: 'Articles about modern web development practices and tools', type: 'both' },
    { name: 'Mobile Apps',       slug: 'mobile-apps',       description: 'Insights into mobile application development for iOS and Android', type: 'both' },
    { name: 'UI/UX Design',      slug: 'ui-ux-design',      description: 'Design trends, tips and best practices for great user experiences', type: 'blog' },
    { name: 'Digital Marketing', slug: 'digital-marketing', description: 'Strategies for growing your digital presence effectively', type: 'blog' },
    { name: 'E-Commerce',        slug: 'e-commerce',        description: 'Full-featured online store and marketplace projects', type: 'project' },
    { name: 'SaaS Products',     slug: 'saas-products',     description: 'Software as a service platforms and dashboards', type: 'project' },
  ]);
  console.log('✅ Categories seeded');

  // ── Services ─────────────────────────────────────────────────────────────
  await Service.insertMany([
    {
      imgUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600',
      title: 'Web Development', slug: 'web-development',
      subDescription: 'We craft high-performance, scalable web applications tailored to your business goals.',
      fullDescription: 'Our web development team combines cutting-edge technology with clean architecture to deliver web applications that scale. From simple landing pages to complex enterprise platforms, we handle every layer of the stack — frontend, backend, databases, and cloud deployment. We use modern frameworks, best practices, and agile methodology to ship fast and ship right.',
      process: [
        { title: 'Discovery',       description: 'We learn your business goals and technical requirements through in-depth consultation.' },
        { title: 'Design',          description: 'We wireframe and prototype the UI/UX, ensuring alignment before a line of code is written.' },
        { title: 'Development',     description: 'Agile sprints with constant communication and weekly deliverables.' },
        { title: 'Launch & Support',description: 'Deployment, monitoring, and ongoing maintenance to keep things running smoothly.' },
      ],
      tools: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'],
      cta: 'Start Your Project', order: 1, status: 'active',
    },
    {
      imgUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
      title: 'Mobile App Development', slug: 'mobile-app-development',
      subDescription: 'Native and cross-platform mobile apps that delight users on iOS and Android.',
      fullDescription: 'We design and build mobile applications that users love. Whether you need a native iOS app, an Android app, or a cross-platform solution with React Native or Flutter, our mobile team delivers polished, high-performance apps that hit the app stores fast and keep users coming back.',
      process: [
        { title: 'Strategy',        description: 'Platform analysis, user persona mapping, and feature prioritization.' },
        { title: 'Prototyping',     description: 'Interactive prototypes reviewed and refined with you before development.' },
        { title: 'Development',     description: 'Clean, maintainable code with full test coverage and CI/CD pipelines.' },
        { title: 'App Store Launch',description: 'End-to-end submission, optimization, and post-launch analytics.' },
      ],
      tools: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Expo'],
      cta: 'Build Your App', order: 2, status: 'active',
    },
    {
      imgUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
      title: 'UI/UX Design', slug: 'ui-ux-design',
      subDescription: 'Human-centered design that converts visitors into loyal customers.',
      fullDescription: 'Good design is invisible — it just works. Our design team creates interfaces that are intuitive, beautiful, and conversion-focused. We combine user research, modern design systems, and motion design to give your product a competitive edge in a crowded market.',
      process: [
        { title: 'Research',              description: 'User interviews, competitive analysis, and heuristic evaluation.' },
        { title: 'Information Architecture', description: 'Sitemaps, user flows, and low-fidelity wireframes.' },
        { title: 'Visual Design',         description: 'High-fidelity mockups, design systems, and interactive prototypes in Figma.' },
        { title: 'Handoff',               description: 'Developer-ready design files with specs, assets, and motion guidelines.' },
      ],
      tools: ['Figma', 'Adobe XD', 'Framer', 'Lottie', 'Maze', 'Hotjar'],
      cta: 'Redesign Your Product', order: 3, status: 'active',
    },
    {
      imgUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
      title: 'Digital Marketing', slug: 'digital-marketing',
      subDescription: 'Data-driven marketing strategies that put your brand in front of the right audience.',
      fullDescription: 'We help brands grow their digital footprint through SEO, paid advertising, content marketing, and social media management. Every campaign we run is data-driven, measurable, and optimized for ROI. We do not chase vanity metrics — we chase revenue.',
      process: [
        { title: 'Audit',     description: 'Full audit of your current digital presence and competitor analysis.' },
        { title: 'Strategy',  description: 'A custom growth plan with clear KPIs and channel selection.' },
        { title: 'Execution', description: 'Campaign setup, content creation, and ad management.' },
        { title: 'Reporting', description: 'Monthly performance reports with actionable insights.' },
      ],
      tools: ['Google Analytics', 'SEMrush', 'Meta Ads', 'Google Ads', 'Mailchimp', 'HubSpot'],
      cta: 'Grow My Brand', order: 4, status: 'active',
    },
  ]);
  console.log('✅ Services seeded');

  // ── Team ─────────────────────────────────────────────────────────────────
  await Team.insertMany([
    { name: 'Zeel Hassan',  slug: 'zeel-hassan',  position: 'Founder & CEO',      imgUrl: 'https://randomuser.me/api/portraits/men/32.jpg',  bio: 'Full-stack engineer with 8+ years of experience building scalable SaaS products. Passionate about clean code and great user experiences.', socialLinks: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' }, order: 1, isVisible: true },
    { name: 'Amara Nkosi',  slug: 'amara-nkosi',  position: 'Lead Designer',       imgUrl: 'https://randomuser.me/api/portraits/women/44.jpg', bio: 'Award-winning UI/UX designer who transforms complex problems into elegant, user-friendly interfaces that drive conversions.', socialLinks: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' }, order: 2, isVisible: true },
    { name: 'Kevin Tamba',  slug: 'kevin-tamba',  position: 'Backend Engineer',    imgUrl: 'https://randomuser.me/api/portraits/men/67.jpg',  bio: 'Node.js and cloud infrastructure specialist. Loves building robust APIs and distributed systems that handle millions of requests.', socialLinks: { linkedin: 'https://linkedin.com' }, order: 3, isVisible: true },
    { name: 'Sophie Mbah',  slug: 'sophie-mbah',  position: 'Mobile Developer',    imgUrl: 'https://randomuser.me/api/portraits/women/23.jpg', bio: 'React Native and Flutter developer with 5+ published apps on both iOS and Android stores. Expert in animations and performance.', socialLinks: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' }, order: 4, isVisible: true },
  ]);
  console.log('✅ Team seeded');

  // ── Projects ─────────────────────────────────────────────────────────────
  await Project.insertMany([
    {
      title: 'ShopWave E-Commerce Platform', slug: 'shopwave-ecommerce',
      coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      images: [],
      description: 'A full-featured e-commerce platform with real-time inventory, multi-vendor support, and advanced analytics dashboard.',
      category: cats[4]._id, clientName: 'ShopWave Inc.',
      timeline: { startDate: new Date('2024-01-01'), endDate: new Date('2024-06-01') },
      status: 'completed', isFeatured: true, order: 1,
      problem: 'Client needed a scalable marketplace that could handle 10,000+ concurrent users during flash sales without downtime.',
      solution: 'Built with microservices architecture, Redis caching, and a React storefront with SSR for maximum SEO performance.',
      results: [{ metric: 'Conversion Rate', value: '+34%' }, { metric: 'Page Load', value: '0.9s' }, { metric: 'GMV', value: '$2M/mo' }],
      cta: 'View Case Study',
    },
    {
      title: 'TaskFlow SaaS Dashboard', slug: 'taskflow-saas',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      images: [],
      description: 'A project management SaaS with real-time collaboration, Gantt charts, and comprehensive team analytics.',
      category: cats[5]._id, clientName: 'TaskFlow Ltd.',
      timeline: { startDate: new Date('2024-03-01'), endDate: new Date('2024-09-01') },
      status: 'completed', isFeatured: true, order: 2,
      problem: 'Teams were losing 4+ hours per week switching between disconnected project management and communication tools.',
      solution: 'Unified platform with WebSocket real-time collaboration, integrations for Slack and GitHub, and a powerful reporting engine.',
      results: [{ metric: 'Time Saved', value: '4hrs/wk' }, { metric: 'User Retention', value: '91%' }, { metric: 'MRR', value: '$80K' }],
      cta: 'View Case Study',
    },
    {
      title: 'MedConnect Telemedicine App', slug: 'medconnect-app',
      coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
      images: [],
      description: 'Telemedicine app connecting patients with doctors for video consultations and digital prescriptions across Africa.',
      category: cats[1]._id, clientName: 'MedConnect Health',
      timeline: { startDate: new Date('2024-06-01') },
      status: 'ongoing', isFeatured: false, order: 3,
      problem: 'Rural patients had no accessible way to consult specialists without traveling hours to the nearest city hospital.',
      solution: 'React Native app with WebRTC video calls, end-to-end encryption, offline record access, and digital prescriptions.',
      results: [{ metric: 'Patients Reached', value: '12,000+' }, { metric: 'App Store Rating', value: '4.8★' }],
      cta: 'Learn More',
    },
  ]);
  console.log('✅ Projects seeded');

  // ── Testimonials ─────────────────────────────────────────────────────────
  await Testimonial.insertMany([
    { name: 'Marcus Ellroy',    position: 'CTO',               company: 'ShopWave Inc.',      testimonialText: 'Zeeltech delivered beyond expectations. The platform handled our Black Friday sale — 15,000 concurrent users — without a single hiccup. Outstanding engineering team.', rating: 5, status: 'approved', isFeatured: true,  imgUrl: 'https://randomuser.me/api/portraits/men/11.jpg',   websiteUrl: 'https://shopwave.com' },
    { name: 'Aisha Kamara',     position: 'Product Manager',   company: 'TaskFlow Ltd.',      testimonialText: "The team's communication was impeccable. Weekly demos, fast iterations, and they genuinely cared about the product outcome, not just shipping code. A true partner.", rating: 5, status: 'approved', isFeatured: true,  imgUrl: 'https://randomuser.me/api/portraits/women/55.jpg', websiteUrl: 'https://taskflow.com' },
    { name: 'Dr. Emmanuel Fru', position: 'CEO',               company: 'MedConnect Health',  testimonialText: 'They understood the nuances of healthcare software — privacy, reliability, and simplicity for non-tech users. The app has genuinely changed lives in rural communities.', rating: 5, status: 'approved', isFeatured: true,  imgUrl: 'https://randomuser.me/api/portraits/men/78.jpg' },
    { name: 'Chloé Dupont',     position: 'Marketing Director',company: 'BrandBoost Agency',  testimonialText: 'Our organic traffic increased 220% in just 3 months after Zeeltech rebuilt our website. The Core Web Vitals scores alone made the investment worthwhile.', rating: 5, status: 'approved', isFeatured: false, imgUrl: 'https://randomuser.me/api/portraits/women/33.jpg' },
  ]);
  console.log('✅ Testimonials seeded');

  // ── Pricing ──────────────────────────────────────────────────────────────
  await Pricing.insertMany([
    { name: 'Basic',    priceRange: { min: 500,   max: 1500  }, features: ['1 Page Website', 'Mobile Responsive', 'Contact Form', '3 Revisions', '1 Month Support'],                                                                                 cta: 'Get Started',   isPopular: false, order: 1, status: 'active' },
    { name: 'Pro',      priceRange: { min: 2000,  max: 5000  }, features: ['Up to 10 Pages', 'CMS Integration', 'SEO Optimization', 'Custom Animations', 'Blog Setup', '5 Revisions', '3 Months Support'],                                          cta: 'Most Popular',  isPopular: true,  order: 2, status: 'active' },
    { name: 'Advanced', priceRange: { min: 5000,  max: 12000 }, features: ['Full Web Application', 'Custom Backend API', 'Database Design', 'Auth System', 'Admin Dashboard', 'Unlimited Revisions', '6 Months Support'],                            cta: 'Scale Up',      isPopular: false, order: 3, status: 'active' },
    { name: 'Premium',  priceRange: { min: 12000, max: 50000 }, features: ['Enterprise Platform', 'Mobile App Included', 'DevOps & CI/CD', 'Load Testing', 'Dedicated Team', 'Priority Support 24/7', '1 Year Maintenance'],                         cta: 'Go Enterprise', isPopular: false, order: 4, status: 'active' },
  ]);
  console.log('✅ Pricing seeded');

  // ── Blogs ─────────────────────────────────────────────────────────────────
  await Blog.insertMany([
    {
      title: 'Why Your Business Needs a Custom Web App in 2025',
      slug: 'why-business-needs-custom-web-app-2025',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      excerpt: 'Off-the-shelf tools have limits. Discover why businesses that invest in custom software consistently outperform their competitors.',
      content: '<p>The digital landscape in 2025 demands more than a templated website. Businesses that invest in custom web applications gain a competitive edge through tailored workflows, seamless integrations, and user experiences that generic platforms simply cannot offer.</p><h2>The Problem with Cookie-Cutter Solutions</h2><p>Tools like Wix and Squarespace are excellent for simple presences, but they become bottlenecks as your business scales. Custom apps grow with you — shaped exactly to your processes, your users, and your goals.</p>',
      author: adminUser._id, category: cats[0]._id,
      tags: ['web development', 'business', 'technology'], status: 'published',
      isFeatured: true, readTime: 5, publishedAt: new Date(), views: 243,
    },
    {
      title: 'The Art of Glassmorphism: A Modern UI Design Trend',
      slug: 'glassmorphism-modern-ui-design-trend',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      excerpt: 'Glassmorphism is everywhere in 2025 UI design. Here is how to use it tastefully without sacrificing usability.',
      content: '<p>Glassmorphism — the frosted glass effect seen across modern interfaces — has evolved from a fleeting trend into a design staple. When used correctly, it adds depth, elegance, and visual hierarchy to digital products.</p><h2>The Core Principles</h2><p>True glassmorphism requires: background blur, semi-transparent surfaces, subtle borders, and a vibrant background underneath to let the effect breathe.</p>',
      author: adminUser._id, category: cats[2]._id,
      tags: ['design', 'UI', 'glassmorphism'], status: 'published',
      isFeatured: true, readTime: 4, publishedAt: new Date(Date.now() - 3 * 864e5), views: 189,
    },
    {
      title: 'SEO in 2025: What Still Works and What Doesnt',
      slug: 'seo-2025-what-works',
      coverImage: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800',
      excerpt: 'Google keeps evolving. We break down the SEO strategies driving real traffic in 2025 and the ones to finally abandon.',
      content: '<p>Search engine optimization has never been more nuanced. With AI-driven search, E-E-A-T signals, and Core Web Vitals playing a bigger role, the rules have changed dramatically since 2022.</p><h2>What Works in 2025</h2><p>Topical authority, firsthand experience content, and technical performance are the three non-negotiable pillars of modern SEO success.</p>',
      author: adminUser._id, category: cats[3]._id,
      tags: ['SEO', 'digital marketing', 'Google'], status: 'published',
      isFeatured: false, readTime: 7, publishedAt: new Date(Date.now() - 7 * 864e5), views: 412,
    },
    {
      title: 'React Native vs Flutter in 2025: Which Should You Choose?',
      slug: 'react-native-vs-flutter-2025',
      coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
      excerpt: 'Both frameworks are mature and production-ready. We compare them across performance, ecosystem, and developer hiring.',
      content: '<p>The React Native vs Flutter debate has raged since 2018. In 2025, both frameworks have matured significantly, making the choice less obvious than ever. This guide gives you a practical decision framework based on your team and product.</p>',
      author: adminUser._id, category: cats[1]._id,
      tags: ['mobile', 'React Native', 'Flutter'], status: 'published',
      isFeatured: false, readTime: 8, publishedAt: new Date(Date.now() - 14 * 864e5), views: 567,
    },
  ]);
  console.log('✅ Blogs seeded');

  console.log('\n🎉 All done! Database is fully seeded.');
  console.log('──────────────────────────────────────────────');
  console.log('  Admin login: admin@zeeltech.com / Admin@1234');
  console.log('──────────────────────────────────────────────');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });