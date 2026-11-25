import { lazy, Suspense } from 'react'
import './MobileHome.css'

const BuildingCanvas = lazy(() => import('./BuildingCanvas'))

export default function MobileHome({ theme, toggleTheme, onCheckProperty, onOpenVisitModal, onOpenEnquiry }) {
  return (
    <div className="mhome">
      {/* ── 3D Canvas — full-bleed top area ── */}
      <div className="mhome__canvas-area">
        <Suspense fallback={
          <div className="mhome__canvas-loader">
            <div className="mhome__loader-ring" />
          </div>
        }>
          <BuildingCanvas theme={theme} isExploded={false} autoRotate={true} />
        </Suspense>
        {/* gradient fade into bottom card */}
        <div className="mhome__canvas-fade" />
      </div>

      {/* ── Top Bar ── */}
      <div className="mhome__topbar">
        {/* Logo */}
        <div className="mhome__logo">
          <div className="mhome__logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 17V5l3-2v14" /><path d="M12 21V9l3-2v14" /><path d="M18 17V3l3-2v16" />
            </svg>
          </div>
          <div className="mhome__logo-text">
            <span className="mhome__logo-name">AAA BUILDERS</span>
            <span className="mhome__logo-sub">& DEVELOPERS</span>
          </div>
        </div>

        {/* Theme toggle */}
        <button className="mhome__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Bottom Content Card ── */}
      <div className="mhome__bottom-card">
        {/* MahaRERA badge */}
        <div className="mhome__rera-badge">
          <span className="mhome__badge-dot" />
          <span>MahaRERA Registered · Navi Mumbai</span>
        </div>

        <h1 className="mhome__headline">
          Discover Your<br />
          <span className="mhome__headline-accent">Dream Home</span>
        </h1>

        <p className="mhome__sub">
          Luxury residences in Kharghar, Taloja & Panvel with metro connectivity and resort-grade amenities.
        </p>

        {/* Stats row */}
        <div className="mhome__stats-row">
          <div className="mhome__stat">
            <span className="mhome__stat-num">25+</span>
            <span className="mhome__stat-lbl">Yrs Trust</span>
          </div>
          <div className="mhome__stat-sep" />
          <div className="mhome__stat">
            <span className="mhome__stat-num">4,500+</span>
            <span className="mhome__stat-lbl">Families</span>
          </div>
          <div className="mhome__stat-sep" />
          <div className="mhome__stat">
            <span className="mhome__stat-num">3</span>
            <span className="mhome__stat-lbl">Projects</span>
          </div>
          <div className="mhome__stat-sep" />
          <div className="mhome__stat">
            <span className="mhome__stat-num">100%</span>
            <span className="mhome__stat-lbl">RERA Clear</span>
          </div>
        </div>

        {/* Primary CTA */}
        <button className="mhome__cta-btn" onClick={onCheckProperty}>
          <span>Check Properties</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Secondary */}
        <button className="mhome__visit-btn" onClick={onOpenVisitModal}>
          Schedule VIP Site Visit — Free Cab Included
        </button>

        {/* Quick links: Enquiry */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '4px' }}>
          {onOpenEnquiry && (
            <button
              type="button"
              onClick={onOpenEnquiry}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
            >
              📝 Customer Enquiry
            </button>
          )}
        </div>

        {/* Partner banks strip */}
        <div className="mhome__banks">
          <span className="mhome__banks-label">Home Loans Approved by:</span>
          <div className="mhome__banks-row">
            {['SBI', 'HDFC BANK', 'ICICI BANK'].map(b => (
              <span key={b} className="mhome__bank-chip">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
