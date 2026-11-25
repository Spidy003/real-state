import './CTASection.css'
import dreamHomeImg from '../assets/dream-home.png'

export default function CTASection({ onOpenVisitModal }) {
  return (
    <section className="cta-section" id="contact">
      <div className="container cta-inner">
        <div className="cta-wrapper-card glass-card">
          
          {/* Left Details */}
          <div className="cta-left-details">
            <div className="section-tag">VIP SALES ADVISORY</div>
            <h2 className="cta-title">
              Your dream residence is ready. <br />
              <span className="gold-text">Experience it in person.</span>
            </h2>
            <div className="blueprint-title-decor" style={{ margin: '10px 0 20px', maxWidth: '100px' }} />
            
            <p className="cta-large-desc">
              Discover authentic luxury with our meticulously styled show residences. Our senior wealth and property advisors are on hand to provide personalized walkthroughs, transparent payment schedules, and instant home loan pre-approvals.
            </p>

            <div className="cta-features-list">
              <div className="cta-feat-item">
                <span className="feat-check">✓</span>
                <span>Complimentary AC Chauffeur Pickup & Drop</span>
              </div>
              <div className="cta-feat-item">
                <span className="feat-check">✓</span>
                <span>Direct Access to Sample Flats & Floor Blueprints</span>
              </div>
              <div className="cta-feat-item">
                <span className="feat-check">✓</span>
                <span>Exclusive Launch Price Benefits & Flexible Payment Milestones</span>
              </div>
            </div>

            <div className="cta-actions">
              <button 
                className="btn-solid cta-action-btn"
                onClick={onOpenVisitModal}
              >
                <span>Schedule a Private Site Tour</span>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="cta-quick-contacts">
                <a href="tel:+912268492000" className="quick-contact-link">
                  <span className="contact-icon">📞</span>
                  <span>+91 22 6849 2000</span>
                </a>
                <span className="contact-sep">•</span>
                <span className="experience-center-hours">Experience Center Open Mon-Sun 9:30 AM - 7:30 PM</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="cta-right-image">
            <img 
              src={dreamHomeImg} 
              alt="Delighted homeowners at AAA Builders luxury residential tower" 
              className="dream-home-full-img" 
              loading="lazy"
            />
            <div className="dream-home-badge">
              <span className="pulse-dot"></span>
              <span>4,500+ Homes Handed Over</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
