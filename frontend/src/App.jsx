import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/home/Home'
import About from './pages/about/About'
import Services from './pages/services/Services'
import ServiceDetail from './pages/servicedetail/ServiceDetail'
import Projects from './pages/projects/Projects'
import ProjectDetail from './pages/projectdetail/ProjectDetail'
import Blog from './pages/blog/Blog'
import BlogPost from './pages/blogPost/BlogPost'
import Pricing from './pages/pricing/Pricing'
import Contact from './pages/contact/Contact'
import NotFound from './pages/notfound/NotFound'
import ZeeltechAdmin from './pages/zeeltechadmin/ZeeltechAdmin'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"                  element={<Home />} />
          <Route path="/about"             element={<About />} />
          <Route path="/services"          element={<Services />} />
          <Route path="/services/:slug"    element={<ServiceDetail />} />
          <Route path="/projects"          element={<Projects />} />
          <Route path="/projects/:slug"    element={<ProjectDetail />} />
          <Route path="/blog"              element={<Blog />} />
          <Route path="/blog/:slug"        element={<BlogPost />} />
          <Route path="/pricing"           element={<Pricing />} />
          <Route path="/contact"           element={<Contact />} />
          <Route path='/admin'             element={<ZeeltechAdmin />} />
          <Route path="*"                  element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}
