import './MobileAboutView.css'

const PILLARS = [
  {
    icon: '🛡️',
    tag: '100% CLEAR TITLE',
    title: 'MahaRERA Certified & Bank Approved',
    desc: 'Zero legal ambiguity. Verified freehold land title, clear occupancy approvals, and tie-ups with SBI, HDFC, and ICICI for smooth disbursals.',
  },
  {
    icon: '🏗️',
    tag: 'ENGINEERING EXCELLENCE',
    title: 'Monolithic Mivan Construction',
    desc: 'Precision aluminium formwork technology delivering earthquake-resistant durability, moisture barrier, acoustic insulation, and maximum carpet area.',
  },
  {
    icon: '⏱️',
    tag: 'UNCOMPROMISED DISCIPLINE',
    title: '25-Year On-Time Delivery Track',
    desc: 'Over 4,500+ happy families have received on-time possession without delays, backed by institutional escrow protections.',
  },
  {
    icon: '📍',
    tag: 'PRIME URBAN GROWTH',
    title: 'Strategic High-Appreciation Nodes',
    desc: 'Within 3 to 7 minutes from operational metro lines, the upcoming Navi Mumbai International Airport (NMIA), and commercial hubs.',
  },
]

export default function MobileAboutView({ onBack, onOpenMenu, onOpenProjects, onOpenVisitModal }) {
  return (
    <div className="mabout">
      <div className="mabout__header">
        <button className="mabout__back" onClick={onBack} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="mabout__header-text">
          <span className="mabout__header-title">Why AAA Builders</span>
          <span className="mabout__header-sub">25+ Years of Trust</span>
        </div>
        <button className="mabout__menu-btn" onClick={onOpenMenu} aria-label="Open menu">
          ☰
        </button>
      </div>

      <div className="mabout__scroll">
        <div className="mabout__hero">
          <span className="mabout__tag">THE AAA BUILDERS PROMISE</span>
          <h1 className="mabout__title">
            Built on trust. <span className="mabout__accent">Crafted for generations.</span>
          </h1>
          <p className="mabout__desc">
            For more than two decades, AAA Builders & Developers has shaped landmark skylines across Mumbai and Navi Mumbai with uncompromising structural standards.
          </p>
        </div>

        {/* Metrics grid */}
        <div className="mabout__metrics">
          <div className="mabout__metric">
            <span className="mabout__metric-num">25+</span>
            <span className="mabout__metric-lbl">Years Trust</span>
          </div>
          <div className="mabout__metric">
            <span className="mabout__metric-num">1.8M+</span>
            <span className="mabout__metric-lbl">Sq. Ft. Built</span>
          </div>
          <div className="mabout__metric">
            <span className="mabout__metric-num">4,500+</span>
            <span className="mabout__metric-lbl">Families</span>
          </div>
          <div className="mabout__metric">
            <span className="mabout__metric-num">100%</span>
            <span className="mabout__metric-lbl">On-Time</span>
          </div>
        </div>

        {/* Pillars */}
        <div className="mabout__pillars">
          {PILLARS.map((item, i) => (
            <div className="mabout__card" key={i}>
              <div className="mabout__card-top">
                <span className="mabout__card-icon">{item.icon}</span>
                <span className="mabout__card-tag">{item.tag}</span>
              </div>
              <h3 className="mabout__card-title">{item.title}</h3>
              <p className="mabout__card-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mabout__actions">
          <button className="mabout__btn-primary" onClick={onOpenProjects}>
            Explore Our Projects →
          </button>
          <button className="mabout__btn-secondary" onClick={onOpenVisitModal}>
            Book VIP Site Visit
          </button>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
