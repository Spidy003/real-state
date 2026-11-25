import { useState } from 'react'
import { getPublishedProjects, logAdminActivity } from '../data/projectStore'
import './EnquiryPage.css'

const BUDGETS = [
  'Under ₹50 Lakhs',
  '₹50 L – ₹75 L',
  '₹75 L – ₹1 Cr',
  '₹1 Cr – ₹1.5 Cr',
  '₹1.5 Cr – ₹2 Cr',
  '₹2 Cr+',
]

const CONFIGS = ['1 BHK', '1.5 BHK', '2 BHK', '2.5 BHK', '3 BHK', '3.5 BHK']

const FOLLOWUP_OPTIONS = [
  { label: 'Tomorrow', value: 1 },
  { label: 'In 2 Days', value: 2 },
  { label: 'In 3 Days', value: 3 },
  { label: 'In 5 Days', value: 5 },
  { label: 'In 1 Week', value: 7 },
  { label: 'Custom Date', value: 'custom' },
]

function generateEnquiryId() {
  const existing = JSON.parse(localStorage.getItem('aaa_enquiries') || '[]')
  const year = new Date().getFullYear()
  const num = (existing.length + 1).toString().padStart(4, '0')
  return `ENQ-${year}-${num}`
}

export default function EnquiryPage({ onBack, isMobile }) {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    project: '',
    config: '',
    budget: '',
    enquiryBy: 'Direct Customer',
    followUpDays: 1,
    followUpDate: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [enquiryId, setEnquiryId] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.mobile.trim() || !/^[6-9]\d{9}$/.test(form.mobile.trim()))
      errs.mobile = 'Valid 10-digit mobile required'
    if (!form.project) errs.project = 'Select a project'
    if (!form.config) errs.config = 'Select a configuration'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const id = generateEnquiryId()
    const followUpDate = form.followUpDays === 'custom' && form.followUpDate
      ? form.followUpDate
      : new Date(Date.now() + (form.followUpDays || 1) * 86400000).toISOString().split('T')[0]

    const enquiry = {
      id,
      ...form,
      followUpDate,
      status: 'New',
      createdAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('aaa_enquiries') || '[]')
    existing.push(enquiry)
    localStorage.setItem('aaa_enquiries', JSON.stringify(existing))
    logAdminActivity(`New enquiry ${id} from ${form.name} for ${form.project}`)

    setEnquiryId(id)
    setSubmitted(true)
  }

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  if (submitted) {
    return (
      <div className="enq-page">
        {onBack && (
          <div className="enq-header">
            <button className="enq-back-btn" onClick={onBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <span className="enq-header-title">Enquiry Submitted</span>
          </div>
        )}
        <div className="enq-success-card">
          <div className="enq-success-icon">✅</div>
          <h2 className="enq-success-title">Enquiry Received!</h2>
          <p className="enq-success-sub">Our team will contact you shortly.</p>
          <div className="enq-id-box">
            <span className="enq-id-label">Your Enquiry ID</span>
            <span className="enq-id-value">{enquiryId}</span>
          </div>
          <p className="enq-id-note">Save this ID for future reference and follow-ups.</p>
          <button className="enq-submit-btn" onClick={onBack}>
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="enq-page">
      {/* Header */}
      {onBack && (
        <div className="enq-header">
          <button className="enq-back-btn" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="enq-header-title">Customer Enquiry</span>
        </div>
      )}

      <div className="enq-container">
        {/* Intro */}
        <div className="enq-intro">
          <div className="section-tag">ENQUIRY FORM</div>
          <h2 className="enq-title">
            Interested in a Property? <span className="accent-gradient-text">Let's Connect</span>
          </h2>
          <p className="enq-desc">
            Fill in your details and our dedicated relationship manager will get back to you within 24 hours.
          </p>
        </div>

        {/* Form */}
        <form className="enq-form glass-card" onSubmit={handleSubmit} noValidate>
          {/* Row 1: Name + Mobile */}
          <div className="enq-form-row">
            <div className={`enq-field ${errors.name ? 'has-error' : ''}`}>
              <label>Full Name <span className="req">*</span></label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => update('name', e.target.value)}
              />
              {errors.name && <span className="enq-error">{errors.name}</span>}
            </div>
            <div className={`enq-field ${errors.mobile ? 'has-error' : ''}`}>
              <label>Mobile Number <span className="req">*</span></label>
              <div className="enq-mobile-wrap">
                <span className="enq-mobile-prefix">+91</span>
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  value={form.mobile}
                  onChange={e => update('mobile', e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {errors.mobile && <span className="enq-error">{errors.mobile}</span>}
            </div>
          </div>

          {/* Row 2: Project + Config */}
          <div className="enq-form-row">
            <div className={`enq-field ${errors.project ? 'has-error' : ''}`}>
              <label>Interested Project <span className="req">*</span></label>
              <select value={form.project} onChange={e => update('project', e.target.value)}>
                <option value="">Select a project</option>
                {getPublishedProjects().map(p => (
                  <option key={p.id} value={p.title}>{p.title} — {p.location.split(',')[0]}</option>
                ))}
              </select>
              {errors.project && <span className="enq-error">{errors.project}</span>}
            </div>
            <div className={`enq-field ${errors.config ? 'has-error' : ''}`}>
              <label>Configuration <span className="req">*</span></label>
              <select value={form.config} onChange={e => update('config', e.target.value)}>
                <option value="">Select BHK</option>
                {CONFIGS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.config && <span className="enq-error">{errors.config}</span>}
            </div>
          </div>

          {/* Row 3: Budget + Enquiry By */}
          <div className="enq-form-row">
            <div className="enq-field">
              <label>Budget Range</label>
              <select value={form.budget} onChange={e => update('budget', e.target.value)}>
                <option value="">Select budget</option>
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="enq-field">
              <label>Enquiry By</label>
              <select value={form.enquiryBy} onChange={e => update('enquiryBy', e.target.value)}>
                <option value="Direct Customer">Direct Customer</option>
                <option value="Channel Partner / Agent">Channel Partner / Agent</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          {/* Row 4: Follow-up */}
          <div className="enq-form-row">
            <div className="enq-field">
              <label>Follow-up Preference</label>
              <select
                value={form.followUpDays}
                onChange={e => update('followUpDays', e.target.value === 'custom' ? 'custom' : parseInt(e.target.value))}
              >
                {FOLLOWUP_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {form.followUpDays === 'custom' && (
              <div className="enq-field">
                <label>Custom Follow-up Date</label>
                <input
                  type="date"
                  value={form.followUpDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => update('followUpDate', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="enq-field enq-full-width">
            <label>Additional Notes</label>
            <textarea
              rows={3}
              placeholder="Any specific requirements, preferred floor, budget constraints, etc."
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
            />
          </div>

          <button type="submit" className="enq-submit-btn">
            Submit Enquiry →
          </button>

          <p className="enq-privacy">
            🔒 Your information is secure and will only be used to assist your property search.
          </p>
        </form>
      </div>
    </div>
  )
}
