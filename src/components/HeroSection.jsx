import { lazy, Suspense, useState } from 'react'
import './HeroSection.css'

// Lazy-load the 3D building canvas
const BuildingCanvas = lazy(() => import('./BuildingCanvas'))

const institutionalPartners = [
  { name: 'HDFC BANK', sub: 'APPROVED HOME LOANS' },
  { name: 'SBI', sub: 'STATE BANK OF INDIA' },
  { name: 'ICICI BANK', sub: 'INSTITUTIONAL PARTNER' },
  { name: 'TATA STEEL', sub: 'STRUCTURAL QUALITY' },
  { name: 'HAFELE', sub: 'GERMAN HARDWARE' },
  { name: 'KOHLER', sub: 'BATHROOM FIXTURES' },
]

export default function HeroSection({ theme, onOpenVisitModal }) {
  const [isExploded, setIsExploded] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  return (
    <section className="hero" id="home">
      {/* Ambient background glow */}
      <div className="hero__glow hero__glow--1" />
      <div className="hero__glow hero__glow--2" />

      <div className="hero__layout container">
        {/* ── Left: Architectural Value Proposition ── */}
        <div className="hero__content">
          <div className="hero__badge anim-fade-up anim-delay-1">
            <span className="badge-dot" />
            <span>MahaRERA REGISTERED DEVELOPMENTS • NAVI MUMBAI</span>
          </div>

          <h1 className="hero__headline anim-fade-up anim-delay-2">
            Crafting Architectural <br />
            <span className="gold-text">Excellence</span> & Timeless <br />
            Living Spaces
          </h1>

          <p className="hero__sub anim-fade-up anim-delay-3">
            Explore master-planned luxury communities engineered with uncompromising structural standards, high-appreciation connectivity, and resort-inspired amenities across Kharghar, Taloja, and Panvel.
          </p>

          {/* Action CTAs */}
          <div className="hero__actions anim-fade-up anim-delay-4">
            <a href="#projects" className="btn-primary hero__cta-btn">
              <span>Explore Residences</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            <button
              onClick={onOpenVisitModal}
              className="btn-outline hero__cta-secondary"
            >
              <span>Schedule VIP Site Visit</span>
            </button>
          </div>

          {/* Key Metrics */}
          <div className="hero__stats anim-fade-up anim-delay-4">
            <div className="hero__stat">
              <span className="hero__stat-num">25<span className="plus">+</span></span>
              <span className="hero__stat-label">Years of Trust</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">1.8M<span className="plus">+</span></span>
              <span className="hero__stat-label">Sq. Ft. Built</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">4,500<span className="plus">+</span></span>
              <span className="hero__stat-label">Happy Families</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">100<span className="pct">%</span></span>
              <span className="hero__stat-label">RERA Clear</span>
            </div>
          </div>
        </div>

        {/* ── Right: Interactive 3D Architectural Canvas ── */}
        <div className="hero__canvas-wrap">
          {/* Controls Bar for 3D Viewer */}
          <div className="model-controls-bar">
            <div className="model-info-pill">
              <span className="pulse-indicator" />
              <span>3D Tower Model</span>
            </div>

            <div className="model-buttons-group">
              <button
                className={`model-btn ${isExploded ? 'active' : ''}`}
                onClick={() => setIsExploded(!isExploded)}
                title="Explode floor plates to view internal layouts"
              >
                {isExploded ? 'Collapse Tower' : 'Explode Floors'}
              </button>

              <button
                className={`model-btn ${autoRotate ? 'active' : ''}`}
                onClick={() => setAutoRotate(!autoRotate)}
                title="Toggle rotation"
              >
                {autoRotate ? 'Pause Rotate' : 'Auto Rotate'}
              </button>
            </div>
          </div>

          {/* Interactive 3D Canvas */}
          <div className="canvas-frame">
            <Suspense fallback={
              <div className="canvas-loader">
                <div className="loader-ring" />
                <span>Loading Architectural 3D Model…</span>
              </div>
            }>
              <BuildingCanvas theme={theme} isExploded={isExploded} autoRotate={autoRotate} />
            </Suspense>
          </div>

          <div className="canvas-caption">
            <span>🖱️ Click & drag to rotate • Scroll to zoom in & out</span>
          </div>
        </div>
      </div>

      {/* ── Institutional Banking & Quality Partners ── */}
      <div className="hero__partners container">
        <span className="partners__label">Approved Home Loan & Quality Partners:</span>
        <div className="partners__grid">
          {institutionalPartners.map(partner => (
            <div className="partner-badge" key={partner.name}>
              <span className="partner-name">{partner.name}</span>
              <span className="partner-sub">{partner.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
