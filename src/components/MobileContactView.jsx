import './MobileContactView.css'

export default function MobileContactView({ onBack, onOpenMenu, onOpenVisitModal, onOpenEnquiry }) {
  return (
    <div className="mcontact">
      <div className="mcontact__header">
        <button className="mcontact__back" onClick={onBack} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="mcontact__header-text">
          <span className="mcontact__header-title">Contact & Offices</span>
          <span className="mcontact__header-sub">VIP Sales Advisory</span>
        </div>
        <button className="mcontact__menu-btn" onClick={onOpenMenu} aria-label="Open menu">
          ☰
        </button>
      </div>

      <div className="mcontact__scroll">
        {/* VIP Card */}
        <div className="mcontact__vip-card">
          <span className="mcontact__tag">VIP SALES ADVISORY</span>
          <h1 className="mcontact__title">
            Your dream residence is ready. <span className="mcontact__accent">Experience it in person.</span>
          </h1>
          <p className="mcontact__desc">
            Our senior property advisors provide personalized walkthroughs, transparent payment schedules, and instant home loan pre-approvals.
          </p>
          <div className="mcontact__checklist">
            <div>✓ Complimentary AC Chauffeur Pickup & Drop</div>
            <div>✓ Direct Access to Sample Flats & Blueprints</div>
            <div>✓ Exclusive Launch Price Benefits</div>
          </div>
          <div className="mcontact__btn-group">
            <button className="mcontact__btn-primary" onClick={onOpenVisitModal}>
              📅 Schedule Private Site Tour
            </button>
            <button className="mcontact__btn-secondary" onClick={onOpenEnquiry}>
              📝 Submit Customer Enquiry
            </button>
          </div>
        </div>

        {/* Direct Contact */}
        <div className="mcontact__card">
          <div className="mcontact__card-title">Direct Sales Desk</div>
          <a href="tel:+912268492000" className="mcontact__phone-btn">
            <span>📞 +91 22 6849 2000</span>
            <span className="mcontact__call-pill">Call Now</span>
          </a>
          <div className="mcontact__hours">
            Experience Center Open: Mon – Sun, 9:30 AM – 7:30 PM
          </div>
        </div>

        {/* Offices */}
        <div className="mcontact__card">
          <div className="mcontact__card-title">Our Offices</div>
          <div className="mcontact__office">
            <strong>Corporate Headquarters</strong>
            <p>Platina, Level 8, G Block, BKC, Bandra (E), Mumbai 400051</p>
          </div>
          <div className="mcontact__office">
            <strong>Sales & Experience Pavilion</strong>
            <p>Sector 20, Kharghar, Navi Mumbai 410210</p>
          </div>
        </div>

        {/* MahaRERA */}
        <div className="mcontact__card">
          <div className="mcontact__card-title">MahaRERA Registration</div>
          <p className="mcontact__rera-nums">
            Aura Heights: P52000034182<br />
            Eco Meadows: P52000041290<br />
            Skyline Oasis: P52000048911
          </p>
          <a
            href="https://maharera.mahaonline.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mcontact__rera-link"
          >
            Verify at maharera.mahaonline.gov.in →
          </a>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
