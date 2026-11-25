import './WhyChooseUs.css'

const pillars = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    tag: '100% CLEAR TITLE',
    title: 'MahaRERA Certified & Bank Approved',
    desc: 'Zero legal ambiguity. Every property comes with verified freehold land title, clear occupancy approvals, and tie-ups with leading national banks (SBI, HDFC, ICICI) for guaranteed smooth disbursals.'
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    tag: 'ENGINEERING EXCELLENCE',
    title: 'Monolithic Mivan Construction',
    desc: 'Built using precision aluminium formwork technology providing earthquake-resistant durability, superior moisture barrier, higher acoustic insulation, and maximum usable carpet area.'
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="12 6 12 12 16 14"/>
      </svg>
    ),
    tag: 'UNCOMPROMISED DISCIPLINE',
    title: 'Unblemished 25-Year Delivery Track',
    desc: 'Over 4,500+ happy families have received on-time possession without delays. We respect your family\'s milestones with stringent timelines backed by institutional escrow protections.'
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    tag: 'PRIME URBAN GROWTH',
    title: 'Strategic High-Appreciation Nodes',
    desc: 'Located within 3 to 7 minutes from operational metro lines, the upcoming Navi Mumbai International Airport (NMIA), and key commercial business districts for exceptional capital growth.'
  }
]

export default function WhyChooseUs({ onOpenVisitModal }) {
  return (
    <section className="why-us-section" id="about">
      <div className="container">
        <div className="why-us-header">
          <div className="section-tag">THE AAA BUILDERS PROMISE</div>
          <h2 className="why-us-title">
            Built on trust. <span className="gold-text">Crafted for generations.</span>
          </h2>
          <div className="blueprint-title-decor" />
          <p className="why-us-desc">
            For more than two decades, AAA Builders & Developers has shaped landmark skylines across Mumbai and Navi Mumbai. We combine uncompromising structural standards with client-first transparency.
          </p>
        </div>

        <div className="why-us-grid">
          {pillars.map((item, idx) => (
            <div className="why-us-card glass-card" key={idx}>
              <div className="card-top">
                <div className="pillar-icon-box">{item.icon}</div>
                <span className="pillar-tag">{item.tag}</span>
              </div>
              <h3 className="pillar-title">{item.title}</h3>
              <p className="pillar-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Developer Metric Highlights Strip */}
        <div className="developer-metrics-bar glass-card">
          <div className="metric-box">
            <span className="metric-number">25+</span>
            <span className="metric-label">Years of Industry Leadership</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-box">
            <span className="metric-number">1.8M+</span>
            <span className="metric-label">Sq. Ft. Delivered</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-box">
            <span className="metric-number">4,500+</span>
            <span className="metric-label">Delighted Families</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-box">
            <span className="metric-number">100%</span>
            <span className="metric-label">On-Time Project Delivery</span>
          </div>
        </div>
      </div>
    </section>
  )
}
