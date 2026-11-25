import { useState, useEffect } from 'react'
import './FeaturesSection.css'
import { getPublishedProjects } from '../data/projectStore'
import ProjectAvailabilityBox from './ProjectAvailabilityBox'

export default function FeaturesSection({ theme, onLaunchWalkthrough, onOpenFloorPlan, onOpenVisitModal, onOpenEnquiry }) {
  const [activeTab, setActiveTab] = useState('all')
  const [projectsList, setProjectsList] = useState(getPublishedProjects)
  const [startIndex, setStartIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth <= 720) return 1
    if (window.innerWidth <= 1060) return 2
    return 3
  })

  useEffect(() => {
    const sync = () => setProjectsList(getPublishedProjects())
    window.addEventListener('aaa_data_updated', sync)
    return () => window.removeEventListener('aaa_data_updated', sync)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth <= 720) setVisibleCount(1)
      else if (window.innerWidth <= 1060) setVisibleCount(2)
      else setVisibleCount(3)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const filteredProjects = activeTab === 'all'
    ? projectsList
    : projectsList.filter(p => p.id === activeTab)

  const maxStart = Math.max(0, filteredProjects.length - visibleCount)

  useEffect(() => {
    setStartIndex(prev => Math.min(prev, maxStart))
  }, [activeTab, maxStart])

  const gapPx = visibleCount === 3 ? 32 : 24
  const showArrows = filteredProjects.length > visibleCount

  return (
    <section className="features-section" id="projects">
      <div className="container">
        {/* Section Header */}
        <div className="features-header">
          <div className="section-tag">PREMIER RESIDENTIAL PORTFOLIO</div>
          <h2 className="features-title">
            Featured Landmark <span className="accent-gradient-text">Developments</span>
          </h2>
          <div className="blueprint-title-decor" />
          <p className="features-desc">
            Explore meticulously designed living spaces across prime growth nodes with rapid transit connectivity and resort-grade amenities.
          </p>

          {/* Mobile-Friendly Filter Tabs */}
          <div className="filter-scroll-wrapper">
            <div className="projects-filter-bar">
              <button
                className={`filter-pill ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Projects ({projectsList.length})
              </button>
              <button
                className={`filter-pill ${activeTab === 'kharghar' ? 'active' : ''}`}
                onClick={() => setActiveTab('kharghar')}
              >
                Kharghar
              </button>
              <button
                className={`filter-pill ${activeTab === 'taloja' ? 'active' : ''}`}
                onClick={() => setActiveTab('taloja')}
              >
                Taloja
              </button>
              <button
                className={`filter-pill ${activeTab === 'panvel' ? 'active' : ''}`}
                onClick={() => setActiveTab('panvel')}
              >
                Panvel
              </button>
            </div>
          </div>
        </div>

        {/* Cards Carousel (3 visible on desktop, smooth < > slide when > 3) */}
        <div className={`projects-carousel-wrap ${showArrows ? 'has-arrows' : ''}`}>
          {showArrows && (
            <button
              type="button"
              className="carousel-arrow-btn prev"
              aria-label="Previous property"
              disabled={startIndex === 0}
              onClick={() => setStartIndex(i => Math.max(0, i - 1))}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          <div className="projects-carousel-viewport">
            <div
              className="projects-carousel-track"
              style={{
                transform: `translateX(calc(-${startIndex} * ((100% + ${gapPx}px) / ${visibleCount})))`,
              }}
            >
              {filteredProjects.map((proj) => (
                <article className="project-card glass-card" key={proj.id}>

              {/* Image & App-style Badges */}
              <div className="project-image-wrapper">
                <img src={proj.image} alt={proj.title} className="project-image" loading="lazy" />
                <div className="project-image-overlay" />

                {/* Status Badge (Top-Left) */}
                <div className="project-status-badge">
                  <span className="live-dot" />
                  <span>Under Construction</span>
                </div>

                {/* Handover pill (Top-Right) */}
                <div className="project-possession-pill">
                  <span>Handover: {proj.completion}</span>
                </div>

                {/* Prominent Price Pill (Bottom-Right, exactly like mobile app reference) */}
                <div className="project-price-tag">
                  <span className="price-tag-sub">From</span>
                  <span className="price-tag-amount">{proj.startingPrice}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="project-content">
                <div className="project-meta-row">
                  <span className="project-tag-accent">{proj.tag}</span>
                  <span className="rera-badge">RERA: {proj.rera}</span>
                </div>

                <h3 className="project-card-title">{proj.title}</h3>

                <div className="project-location-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{proj.location}</span>
                </div>

                {/* Quick App-style Specs Row */}
                <div className="project-app-specs">
                  <span className="spec-chip">🛏️ {proj.bhkSummary}</span>
                  <span className="spec-chip">📐 {proj.areaSummary}</span>
                </div>

                {/* Highlights */}
                <div className="project-highlights-row">
                  {proj.highlights.map((item, idx) => (
                    <span key={idx} className="highlight-pill">✓ {item}</span>
                  ))}
                </div>

                {/* Flat Availability & Possession Info */}
                <ProjectAvailabilityBox project={proj} />

                {/* Configurations & Pricing Accordion/Box */}
                <div className="project-pricing-box">
                  <div className="pricing-header">Available Configurations</div>
                  <div className="pricing-grid">
                    {Object.entries(proj.pricing).map(([bhk, data]) => (
                      <div className="pricing-item" key={bhk}>
                        <div className="bhk-info">
                          <span className="pricing-bhk">{bhk}</span>
                          <span className="pricing-area">{data.area}</span>
                        </div>
                        <span className="pricing-val">{data.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Touch Action Buttons */}
                <div className="card-actions-group">
                  <button
                    className="btn-primary card-action-btn primary-btn"
                    onClick={() => onLaunchWalkthrough && onLaunchWalkthrough(proj)}
                  >
                    <span>3D Virtual Tour</span>
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <button
                    className="btn-outline card-action-btn"
                    onClick={() => onOpenFloorPlan && onOpenFloorPlan(proj)}
                  >
                    <span>Floor Plans</span>
                  </button>

                  <button
                    className="btn-solid btn-mobile-book"
                    onClick={() => onOpenVisitModal && onOpenVisitModal(proj)}
                  >
                    <span>Book Private Site Visit</span>
                  </button>

                  {onOpenEnquiry && (
                    <button
                      className="btn-outline btn-mobile-book"
                      onClick={() => onOpenEnquiry(proj)}
                    >
                      <span>Customer Enquiry</span>
                    </button>
                  )}
                </div>
              </div>

            </article>
              ))}
            </div>
          </div>

          {showArrows && (
            <button
              type="button"
              className="carousel-arrow-btn next"
              aria-label="Next property"
              disabled={startIndex >= maxStart}
              onClick={() => setStartIndex(i => Math.min(maxStart, i + 1))}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>

        {showArrows && (
          <div className="carousel-dots">
            {Array.from({ length: maxStart + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                className={`carousel-dot ${startIndex === idx ? 'active' : ''}`}
                onClick={() => setStartIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
