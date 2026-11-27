import './MobileMenuDrawer.css'

const MENU_ITEMS = [
  { id: 'home',        icon: '🏠', label: 'Home',               sub: '3D Showcase & Overview' },
  { id: 'properties',  icon: '🏢', label: 'Our Projects',       sub: 'Flats, Availability & Pricing' },
  { id: 'walkthrough', icon: '🎥', label: '3D Flat Walkthrough',sub: 'Fullscreen Interactive Tour' },
  { id: 'emi',         icon: '💰', label: 'Home Loan & EMI',    sub: 'Live Bank EMI Calculator' },
  { id: 'facility',    icon: '🗺️', label: 'Proximity & Map',    sub: 'Metro, Schools & Hospitals' },
  { id: 'about',       icon: '🛡️', label: 'Why AAA Builders',   sub: '25+ Yrs Trust & MahaRERA' },
  { id: 'enquiry',     icon: '📝', label: 'Customer Enquiry',   sub: 'Submit Requirements & Track ID' },
  { id: 'contact',     icon: '📞', label: 'Contact & Offices',  sub: 'BKC HQ & Kharghar Pavilion' },
]

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  onOpenVisitModal,
  theme,
  toggleTheme,
}) {
  if (!isOpen) return null

  return (
    <div className="mmenu-backdrop" onClick={onClose}>
      <nav
        className="mmenu-drawer"
        aria-label="Mobile Navigation"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mmenu-header">
          <div className="mmenu-brand">
            <div className="mmenu-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 17V5l3-2v14" />
                <path d="M12 21V9l3-2v14" />
                <path d="M18 17V3l3-2v16" />
              </svg>
            </div>
            <div>
              <div className="mmenu-brand-name">AAA BUILDERS</div>
              <div className="mmenu-brand-sub">& DEVELOPERS</div>
            </div>
          </div>

          <button className="mmenu-close" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mmenu-list">
          {MENU_ITEMS.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`mmenu-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onClose()
                  onNavigate(item.id)
                }}
              >
                <span className="mmenu-item-icon">{item.icon}</span>
                <div className="mmenu-item-text">
                  <span className="mmenu-item-label">{item.label}</span>
                  <span className="mmenu-item-sub">{item.sub}</span>
                </div>
                <span className="mmenu-item-arrow">›</span>
              </button>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="mmenu-footer">
          <button
            type="button"
            className="mmenu-theme-row"
            onClick={toggleTheme}
          >
            <span>{theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}</span>
          </button>

          <button
            type="button"
            className="mmenu-visit-btn"
            onClick={() => {
              onClose()
              onOpenVisitModal()
            }}
          >
            📅 Book VIP Site Visit
          </button>
        </div>
      </nav>
    </div>
  )
}
