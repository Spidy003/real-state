import './MobileBottomNav.css'
import { useState, useEffect } from 'react'

export default function MobileBottomNav({ onOpenVisitModal }) {
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200
      const projectsEl = document.getElementById('projects')
      const aboutEl = document.getElementById('about')
      const hubEl = document.getElementById('buyer-hub')
      const contactEl = document.getElementById('contact')

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveTab('contact')
      } else if (hubEl && scrollPos >= hubEl.offsetTop) {
        setActiveTab('calc')
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setActiveTab('about')
      } else if (projectsEl && scrollPos >= projectsEl.offsetTop) {
        setActiveTab('projects')
      } else {
        setActiveTab('home')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="mobile-bottom-dock" aria-label="Mobile Navigation Dock">
      <div className="dock-inner glass-card">
        {/* Home */}
        <a
          href="#home"
          className={`dock-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <div className="dock-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span className="dock-label">Home</span>
        </a>

        {/* Projects / Developments */}
        <a
          href="#projects"
          className={`dock-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <div className="dock-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
              <path d="M9 22v-4h6v4"/>
              <path d="M8 6h.01"/>
              <path d="M16 6h.01"/>
              <path d="M12 6h.01"/>
              <path d="M12 10h.01"/>
              <path d="M12 14h.01"/>
              <path d="M16 10h.01"/>
              <path d="M16 14h.01"/>
              <path d="M8 10h.01"/>
              <path d="M8 14h.01"/>
            </svg>
          </div>
          <span className="dock-label">Projects</span>
        </a>

        {/* EMI Calculator */}
        <a
          href="#buyer-hub"
          className={`dock-tab ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => setActiveTab('calc')}
        >
          <div className="dock-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2"/>
              <line x1="8" y1="6" x2="16" y2="6"/>
              <line x1="16" y1="14" x2="16" y2="18"/>
              <path d="M16 10h.01"/>
              <path d="M12 10h.01"/>
              <path d="M8 10h.01"/>
              <path d="M12 14h.01"/>
              <path d="M8 14h.01"/>
              <path d="M12 18h.01"/>
              <path d="M8 18h.01"/>
            </svg>
          </div>
          <span className="dock-label">EMI Calc</span>
        </a>

        {/* Call Quick Link */}
        <a
          href="tel:+912268492000"
          className="dock-tab"
        >
          <div className="dock-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <span className="dock-label">Call</span>
        </a>

        {/* Primary CTA: Book Site Visit */}
        <button
          className="dock-cta-btn"
          onClick={onOpenVisitModal}
          aria-label="Book Site Visit"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Book Visit</span>
        </button>
      </div>
    </nav>
  )
}
