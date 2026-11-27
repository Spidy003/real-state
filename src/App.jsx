import { useState, useEffect } from 'react'

// Desktop components
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import WhyChooseUs from './components/WhyChooseUs'
import BuyerHub from './components/BuyerHub'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import FlatWalkthrough from './components/FlatWalkthrough'
import FloorPlanModal from './components/FloorPlanModal'
import SiteVisitModal from './components/SiteVisitModal'
import MobileBottomNav from './components/MobileBottomNav'

// Mobile App shell
import MobileApp from './components/MobileApp'
import EnquiryPage from './components/EnquiryPage'

function getInitialRoute() {
  const hash = window.location.hash.replace('#', '')
  const path = window.location.pathname
  if (hash === 'enquiry' || path === '/enquiry') return 'enquiry'
  return 'landing'
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  // Detect mobile (<= 900px) with live resize tracking
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900)
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [currentView, setCurrentView] = useState(getInitialRoute)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null)
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)
  const [visitModalProject, setVisitModalProject] = useState('Aura Heights (Kharghar)')

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme')
    } else {
      document.body.classList.remove('light-theme')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const handleLaunchWalkthrough = (project) => {
    setSelectedProject(project)
    setCurrentView('walkthrough')
    window.scrollTo(0, 0)
  }

  const handleBackToHome = () => {
    setCurrentView('landing')
    setSelectedProject(null)
    if (window.location.hash === '#admin' || window.location.hash === '#enquiry') {
      window.history.replaceState(null, '', '/')
    }
    window.scrollTo(0, 0)
  }

  const handleOpenEnquiry = () => {
    setCurrentView('enquiry')
    window.scrollTo(0, 0)
  }

  const handleOpenVisitModal = (project) => {
    if (project?.title) setVisitModalProject(`${project.title} (${project.location})`)
    setIsVisitModalOpen(true)
  }

  const handleCloseVisitModal = () => setIsVisitModalOpen(false)

  const handleOpenFloorPlan = (project) => setSelectedFloorPlan(project)
  const handleCloseFloorPlan = () => setSelectedFloorPlan(null)

  useEffect(() => {
    if (currentView !== 'landing') return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view') }),
      { threshold: 0.1 }
    )
    const decors = document.querySelectorAll('.blueprint-title-decor')
    decors.forEach(el => observer.observe(el))
    return () => { decors.forEach(el => observer.unobserve(el)); observer.disconnect() }
  }, [currentView])

  // ── ENQUIRY (customer-facing, shared across desktop/mobile) ──
  if (currentView === 'enquiry') {
    return <EnquiryPage onBack={handleBackToHome} isMobile={isMobile} />
  }

  // ── MOBILE: render the native app-style flow ──
  if (isMobile) {
    return (
      <MobileApp
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenEnquiry={handleOpenEnquiry}
      />
    )
  }

  // ── DESKTOP: existing full-page layout ──
  if (currentView === 'walkthrough') {
    return <FlatWalkthrough project={selectedProject} onBackToHome={handleBackToHome} />
  }

  return (
    <div className="app">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenVisitModal={() => handleOpenVisitModal()}
        onOpenEnquiry={handleOpenEnquiry}
      />

      <main>
        <HeroSection theme={theme} onOpenVisitModal={() => handleOpenVisitModal()} />
        <FeaturesSection
          theme={theme}
          onLaunchWalkthrough={handleLaunchWalkthrough}
          onOpenFloorPlan={handleOpenFloorPlan}
          onOpenVisitModal={handleOpenVisitModal}
          onOpenEnquiry={handleOpenEnquiry}
        />
        <WhyChooseUs onOpenVisitModal={() => handleOpenVisitModal()} />
        <BuyerHub theme={theme} />
        <CTASection onOpenVisitModal={() => handleOpenVisitModal()} />
      </main>

      <Footer theme={theme} onOpenEnquiry={handleOpenEnquiry} />

      <MobileBottomNav onOpenVisitModal={() => handleOpenVisitModal()} />

      <SiteVisitModal
        isOpen={isVisitModalOpen}
        onClose={handleCloseVisitModal}
        defaultProject={visitModalProject}
      />

      {selectedFloorPlan && (
        <FloorPlanModal
          project={selectedFloorPlan}
          onClose={handleCloseFloorPlan}
          onOpenVisitModal={handleOpenVisitModal}
        />
      )}
    </div>
  )
}
