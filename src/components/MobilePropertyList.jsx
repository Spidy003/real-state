import { useState, useEffect } from 'react'
import { getPublishedProjects } from '../data/projectStore'
import ProjectAvailabilityBox from './ProjectAvailabilityBox'
import './MobilePropertyList.css'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'kharghar', label: '📍 Kharghar' },
  { id: 'taloja', label: '📍 Taloja' },
  { id: 'panvel', label: '📍 Panvel' },
]

export default function MobilePropertyList({
  theme,
  onBack,
  onViewIn3D,
  onCheckEMI,
  onCheckFacility,
  onOpenVisitModal,
  onOpenEnquiry,
}) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [projectsList, setProjectsList] = useState(getPublishedProjects)

  useEffect(() => {
    const sync = () => setProjectsList(getPublishedProjects())
    window.addEventListener('aaa_data_updated', sync)
    return () => window.removeEventListener('aaa_data_updated', sync)
  }, [])

  const filtered = activeFilter === 'all'
    ? projectsList
    : projectsList.filter(p => p.id === activeFilter)

  return (
    <div className="mpl">
      {/* ── Sticky header ── */}
      <div className="mpl__header">
        <button className="mpl__back-btn" onClick={onBack} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="mpl__header-text">
          <span className="mpl__header-title">Our Projects</span>
          <span className="mpl__header-sub">Navi Mumbai</span>
        </div>
        <button className="mpl__visit-quick-btn" onClick={() => onOpenVisitModal(null)}>
          Book Visit
        </button>
      </div>

      {/* ── Filter chips ── */}
      <div className="mpl__filter-row">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`mpl__filter-chip ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Property cards ── */}
      <div className="mpl__list">
        {filtered.map(proj => (
          <article className="mpl__card" key={proj.id}>
            {/* Image */}
            <div className="mpl__card-image-wrap">
              <img
                src={proj.image}
                alt={proj.title}
                className="mpl__card-image"
                loading="lazy"
              />
              {/* Overlays */}
              <div className="mpl__card-img-overlay" />
              <div className="mpl__card-status">
                <span className="mpl__status-dot" />
                Under Construction
              </div>
              <div className="mpl__card-handover">
                🏗️ {proj.completion}
              </div>
              <div className="mpl__card-price-tag">
                <span className="mpl__price-from">From</span>
                <span className="mpl__price-amount">{proj.startingPrice}</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="mpl__card-body">
              {/* Top meta */}
              <div className="mpl__card-meta-row">
                <span className="mpl__card-tag">{proj.tag}</span>
                <span className="mpl__card-rera">RERA ✓</span>
              </div>

              <h3 className="mpl__card-title">{proj.title}</h3>

              <div className="mpl__card-location">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{proj.location}</span>
              </div>

              {/* Spec chips */}
              <div className="mpl__spec-row">
                <span className="mpl__spec-chip">🛏️ {proj.bhkSummary}</span>
                <span className="mpl__spec-chip">📐 {proj.areaSummary}</span>
              </div>

              {/* Highlights */}
              <div className="mpl__highlights">
                {proj.highlights.map((h, i) => (
                  <span key={i} className="mpl__highlight-pill">✓ {h}</span>
                ))}
              </div>

              {/* Flat Availability & Possession Info */}
              <ProjectAvailabilityBox project={proj} />

              {/* Pricing configs */}
              <div className="mpl__pricing-box">
                <div className="mpl__pricing-title">Available Configurations</div>
                <div className="mpl__pricing-grid">
                  {Object.entries(proj.pricing).map(([bhk, data]) => (
                    <div className="mpl__pricing-row" key={bhk}>
                      <div>
                        <div className="mpl__pricing-bhk">{bhk}</div>
                        <div className="mpl__pricing-area">{data.area}</div>
                      </div>
                      <span className="mpl__pricing-val">{data.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 3 Action Buttons ── */}
              <div className="mpl__actions">
                {/* Primary: View in 3D */}
                <button
                  className="mpl__action-primary"
                  onClick={() => onViewIn3D(proj)}
                >
                  <span className="mpl__action-icon">🏠</span>
                  <span>View in 3D</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Secondary row */}
                <div className="mpl__action-row">
                  <button
                    className="mpl__action-secondary"
                    onClick={() => onCheckEMI(proj)}
                  >
                    <span>💰 Check EMI</span>
                  </button>
                  <button
                    className="mpl__action-secondary"
                    onClick={() => onCheckFacility(proj)}
                  >
                    <span>🗺️ Check Facility</span>
                  </button>
                </div>

                {/* Book visit */}
                <button
                  className="mpl__action-visit"
                  onClick={() => onOpenVisitModal(proj)}
                >
                  Book Private Site Visit — Free Cab Included
                </button>

                {onOpenEnquiry && (
                  <button
                    className="mpl__action-secondary"
                    style={{ width: '100%' }}
                    onClick={() => onOpenEnquiry(proj)}
                  >
                    <span>📝 Submit Enquiry</span>
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom safe area padding */}
      <div style={{ height: 24 }} />
    </div>
  )
}
