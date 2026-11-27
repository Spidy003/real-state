import './Navbar.css'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Developments', href: '#projects' },
  { label: '3D Showcase', href: '#home' },
  { label: 'Why AAA', href: '#about' },
  { label: 'Finance & EMI', href: '#buyer-hub' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ theme, toggleTheme, onOpenVisitModal, onOpenEnquiry }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Brand Logo + Location Pill */}
        <div className="navbar__logo-wrap">
          <a href="/" className="navbar__logo" id="nav-logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 17V5l3-2v14" />
                <path d="M12 21V9l3-2v14" />
                <path d="M18 17V3l3-2v16" />
              </svg>
            </div>
            <div className="logo-text-group">
              <span className="logo-title">AAA BUILDERS</span>
              <span className="logo-subtitle">& DEVELOPERS</span>
            </div>
          </a>
          {/* Mobile-only location pill */}
          <span className="navbar__location-pill" aria-label="Location: Navi Mumbai">
            📍 Navi Mumbai
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="navbar__nav" aria-label="Main Navigation">
          <ul className="navbar__links">
            {navLinks.map(link => (
              <li key={link.label}>
                <a href={link.href} className="navbar__link">{link.label}</a>
              </li>
            ))}
            {onOpenEnquiry && (
              <li>
                <button
                  type="button"
                  className="navbar__link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={onOpenEnquiry}
                >
                  Enquiry
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="navbar__actions">
          {/* Theme Toggle Button */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            id="theme-toggle"
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Site Visit CTA */}
          <button
            onClick={onOpenVisitModal}
            className="btn-primary navbar__cta"
            id="nav-cta"
          >
            <span>Book Site Visit</span>
          </button>

          {/* Mobile Burger */}
          <button
            className={`navbar__burger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle navigation menu"
            id="nav-burger"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`navbar__drawer ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <a
            key={link.label}
            href={link.href}
            className="drawer__link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        {onOpenEnquiry && (
          <button
            type="button"
            className="drawer__link"
            style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}
            onClick={() => { setMenuOpen(false); onOpenEnquiry() }}
          >
            Enquiry
          </button>
        )}
        <button
          className="btn-primary drawer__cta"
          onClick={() => {
            setMenuOpen(false)
            if (onOpenVisitModal) onOpenVisitModal()
          }}
        >
          <span>Book Site Visit</span>
        </button>
      </div>
    </header>
  )
}
