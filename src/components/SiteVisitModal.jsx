import { useState } from 'react'
import { addSiteVisit, getPublishedProjects } from '../data/projectStore'
import './SiteVisitModal.css'

export default function SiteVisitModal({ isOpen, onClose, defaultProject = 'Aura Heights (Kharghar)' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project: defaultProject,
    visitDate: '',
    visitTime: 'Morning (10:00 AM - 1:00 PM)',
    cabRequired: true,
  })

  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return
    addSiteVisit(formData)
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    onClose()
  }

  return (
    <div className="visit-modal-overlay">
      <div className="visit-modal-backdrop" onClick={onClose} />
      
      <div className="visit-modal-card glass-card">
        <button className="visit-modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {!submitted ? (
          <>
            <div className="visit-modal-header">
              <span className="section-tag">VIP SITE EXPERIENCE</span>
              <h3 className="visit-modal-title">Schedule a Private Site Visit</h3>
              <p className="visit-modal-desc">
                Experience our luxury model residences in person. We provide complimentary air-conditioned cab pickup and drop-off across Mumbai & Navi Mumbai.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="visit-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    required
                    placeholder="+91 98200 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emailAddress">Email Address</label>
                  <input
                    type="email"
                    id="emailAddress"
                    placeholder="rajesh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="preferredProject">Select Project *</label>
                  <select
                    id="preferredProject"
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  >
                    {getPublishedProjects().map(p => {
                      const val = `${p.title} (${p.location.split(',')[0].trim()})`
                      return <option key={p.id} value={val}>{p.title} — {p.location.split(',')[0]}</option>
                    })}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="visitDate">Preferred Date</label>
                  <input
                    type="date"
                    id="visitDate"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="visitTime">Preferred Time Slot</label>
                  <select
                    id="visitTime"
                    value={formData.visitTime}
                    onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                    <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                    <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="cab-preference">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.cabRequired}
                    onChange={(e) => setFormData({ ...formData, cabRequired: e.target.checked })}
                  />
                  <span>Request complimentary AC chauffeur pickup from my location</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary form-submit-btn">
                  <span>Confirm Site Visit</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span className="privacy-badge">🔒 Your contact info is strictly confidential. Zero spam guarantee.</span>
              </div>
            </form>
          </>
        ) : (
          <div className="visit-success-state">
            <div className="success-icon">✓</div>
            <h3 className="success-title">Site Visit Confirmed!</h3>
            <p className="success-desc">
              Thank you, <strong>{formData.name}</strong>. Your private tour request for <strong>{formData.project}</strong> has been assigned to a Senior Property Relationship Manager.
            </p>
            <div className="confirmation-box">
              <div className="confirm-row">
                <span className="lbl">Contact:</span>
                <span className="val">{formData.phone}</span>
              </div>
              <div className="confirm-row">
                <span className="lbl">Time Slot:</span>
                <span className="val">{formData.visitTime}</span>
              </div>
              <div className="confirm-row">
                <span className="lbl">Chauffeur Service:</span>
                <span className="val">{formData.cabRequired ? 'Requested (Driver details via SMS)' : 'Self-Driven'}</span>
              </div>
            </div>
            <button className="btn-primary" onClick={handleReset}>
              Close & Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
