import './HeroSection.css'
import heroImg from '../assets/hero.png'

const institutionalPartners = [
  'HDFC BANK',
  'SBI',
  'ICICI BANK',
  'TATA STEEL',
  'HAFELE',
  'KOHLER',
]

export default function HeroSection({ onOpenVisitModal }) {
  return (
    <section className="hero-section" id="home">
      <div className="container hero-inner">
        {/* ── Left: Editorial Value Proposition ── */}
        <div className="hero-text-col">
          <div className="hero-eyebrow">
            MAHARERA REGISTERED · NAVI MUMBAI
          </div>

          <h1 className="hero-headline">
            Designing
            <br />
            Spaces That
            <span className="accent-line">Inspire Living</span>
          </h1>

          <p className="hero-subtext">
            Master-planned luxury residences crafted with monolithic Mivan engineering,
            uncompromising structural standards, and direct metro connectivity across
            Kharghar, Taloja, and Panvel.
          </p>

          <div className="hero-cta-group">
            <a href="#projects" className="btn-primary">
              <span>Explore Residences</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <button
              type="button"
              onClick={onOpenVisitModal}
              className="btn-outline"
            >
              <span>Schedule Private Visit</span>
            </button>
          </div>

          <div className="hero-partners-strip">
            <span className="partners-label">Approved &amp; Built With</span>
            <div className="partners-list">
              {institutionalPartners.map((name) => (
                <span key={name} className="partner-logo">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Cinematic Architectural Image ── */}
        <div className="hero-image-col">
          <img
            src={heroImg}
            alt="AAA Builders luxury residential architecture"
            className="hero-main-image"
          />
          <div className="hero-image-frame" />

          <div className="hero-rera-badge">
            100% RERA CLEAR
          </div>

          <div className="hero-stat-badge">
            <span className="stat-badge-number">25+</span>
            <span className="stat-badge-label">Years of Architectural Trust</span>
          </div>
        </div>
      </div>
    </section>
  )
}
