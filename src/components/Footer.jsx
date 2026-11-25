import './Footer.css'

const footerLinks = {
  Developments: [
    { label: 'Aura Heights (Kharghar)', href: '#projects' },
    { label: 'Eco Meadows (Taloja)', href: '#projects' },
    { label: 'Skyline Oasis (Panvel)', href: '#projects' },
    { label: 'Floor Plan Blueprints', href: '#projects' },
    { label: 'Ongoing Projects', href: '#projects' },
  ],
  'Buyer Services': [
    { label: 'Home Loan EMI Calculator', href: '#buyer-hub' },
    { label: 'Bank Tie-Up Approvals', href: '#buyer-hub' },
    { label: 'Schedule VIP Site Visit', href: '#contact' },
    { label: 'Proximity Travel Times', href: '#buyer-hub' },
    { label: 'Customer Testimonials', href: '#about' },
  ],
  'Company & Trust': [
    { label: 'About AAA Builders', href: '#about' },
    { label: '25-Year Track Record', href: '#about' },
    { label: 'Mivan Engineering', href: '#about' },
    { label: 'Careers at AAA', href: '#about' },
    { label: 'Press & Media Coverage', href: '#about' },
  ],
  Compliance: [
    { label: 'MahaRERA Certifications', href: '#about' },
    { label: 'Title Clearance Certificates', href: '#about' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Statutory Disclaimer', href: '#' },
  ],
}

export default function Footer({ onOpenEnquiry }) {
  return (
    <footer className="footer">
      <div className="footer__top container">
        {/* Brand & Address Column */}
        <div className="footer__brand">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 17V5l3-2v14" />
                <path d="M12 21V9l3-2v14" />
                <path d="M18 17V3l3-2v16" />
              </svg>
            </div>
            <div className="footer-logo-text">
              <span className="logo-main">AAA BUILDERS</span>
              <span className="logo-sub">& DEVELOPERS</span>
            </div>
          </div>
          
          <p className="footer__tagline">
            Premier real estate developer delivering luxury residences, modern architecture, and prime connectivity across Mumbai & Navi Mumbai.
          </p>

          <div className="footer__offices">
            <div className="office-item">
              <strong>Corporate Headquarters:</strong>
              <p>Platina, Level 8, G Block, BKC, Bandra (E), Mumbai 400051</p>
            </div>
            <div className="office-item">
              <strong>Sales & Experience Pavilion:</strong>
              <p>Sector 20, Kharghar, Navi Mumbai 410210</p>
            </div>
          </div>

          <div className="footer__rera-box">
            <span className="rera-title">MahaRERA Registration Numbers:</span>
            <p>Aura Heights: P52000034182 | Eco Meadows: P52000041290 | Skyline Oasis: P52000048911</p>
            <a href="https://maharera.mahaonline.gov.in" target="_blank" rel="noopener noreferrer" className="rera-link">
              Available at maharera.mahaonline.gov.in →
            </a>
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([cat, links]) => (
          <div className="footer__col" key={cat}>
            <h4 className="footer__col-title">{cat}</h4>
            <ul className="footer__links">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="footer__link">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__disclaimer container">
        <p>
          <strong>Disclaimer:</strong> All details, visual architectural mockups, configurations, and amenities shown are artistic impressions and indicative for representation only. They do not constitute an offer, contract, or warranty. Final specifications are governed by the formal Agreement for Sale registered under MahaRERA guidelines.
        </p>
      </div>

      <div className="footer__bottom container">
        <span className="footer__copy">
          © {new Date().getFullYear()} AAA Builders & Developers Pvt. Ltd. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {onOpenEnquiry && (
            <button
              type="button"
              onClick={onOpenEnquiry}
              style={{ background: 'none', border: 'none', color: 'var(--accent-light)', fontSize: '12.5px', cursor: 'pointer', fontWeight: 600 }}
            >
              Customer Enquiry
            </button>
          )}
          <span className="footer__built">
            ISO 9001:2015 Certified Real Estate Developer
          </span>
        </div>
      </div>
    </footer>
  )
}
