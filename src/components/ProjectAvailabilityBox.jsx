import { useState } from 'react'
import './ProjectAvailabilityBox.css'

export default function ProjectAvailabilityBox({ project }) {
  const [expanded, setExpanded] = useState(false)
  const inv = project.inventory
  if (!inv) return null

  const total = Math.max(inv.totalFlats || 1, 1)
  const progress = project.possession?.constructionProgress ?? 0

  return (
    <div className="pab">
      {/* Header row: Booking Status + Starting Price */}
      <div className="pab__top">
        <span className="pab__booking-badge">
          <span className="pab__dot" />
          {project.bookingStatus || 'Booking Open'}
        </span>
        <span className="pab__rera-link-wrap">
          MahaRERA: <strong>{project.rera}</strong>{' '}
          <a
            href="https://maharera.mahaonline.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="pab__rera-link"
          >
            View registration ↗
          </a>
        </span>
      </div>

      {/* Flat Availability Counts */}
      <div className="pab__counts">
        <div className="pab__count-item avail">
          <span className="pab__count-num">{inv.available}</span>
          <span className="pab__count-lbl">Available</span>
        </div>
        <div className="pab__count-item booked">
          <span className="pab__count-num">{inv.booked}</span>
          <span className="pab__count-lbl">Booked</span>
        </div>
        <div className="pab__count-item sold">
          <span className="pab__count-num">{inv.sold}</span>
          <span className="pab__count-lbl">Sold</span>
        </div>
      </div>

      {/* Stacked Availability Bar */}
      <div className="pab__bar" aria-label="Flat availability breakdown">
        <div className="pab__bar-seg avail" style={{ width: `${(inv.available / total) * 100}%` }} />
        <div className="pab__bar-seg booked" style={{ width: `${(inv.booked / total) * 100}%` }} />
        <div className="pab__bar-seg sold" style={{ width: `${(inv.sold / total) * 100}%` }} />
      </div>

      {/* Possession Info: Expected vs Confirmed */}
      <div className="pab__possession">
        <div className="pab__poss-row">
          <span className="pab__poss-lbl">Expected Possession</span>
          <span className="pab__poss-val">{project.possession?.expected || project.completion}</span>
        </div>
        <div className="pab__poss-row">
          <span className="pab__poss-lbl">Confirmed Handover</span>
          <span className={`pab__poss-val ${project.possession?.confirmed ? 'is-confirmed' : 'is-pending'}`}>
            {project.possession?.confirmed || 'Awaiting Official Confirmation'}
          </span>
        </div>
      </div>

      {/* Construction Progress */}
      <div className="pab__progress">
        <div className="pab__progress-head">
          <span>Construction Progress</span>
          <strong>{progress}%</strong>
        </div>
        <div className="pab__progress-track">
          <div className="pab__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Expandable BHK & Floor-wise Availability */}
      <button
        type="button"
        className="pab__toggle-btn"
        onClick={() => setExpanded(v => !v)}
      >
        <span>{expanded ? 'Hide' : 'View'} BHK & Floor-wise Availability</span>
        <span>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="pab__details">
          {inv.byBHK && (
            <div className="pab__detail-block">
              <div className="pab__detail-title">Available Flats by BHK</div>
              <div className="pab__bhk-grid">
                {Object.entries(inv.byBHK).map(([bhk, d]) => (
                  <div className="pab__bhk-chip" key={bhk}>
                    <strong>{bhk}</strong>
                    <span>{d.available} / {d.total} avail</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {inv.byFloor && inv.byFloor.length > 0 && (
            <div className="pab__detail-block">
              <div className="pab__detail-title">Floor-wise Flat Availability</div>
              <div className="pab__floor-list">
                {inv.byFloor.map(f => (
                  <div className="pab__floor-row" key={f.floor}>
                    <span className="pab__floor-name">{f.floor}</span>
                    <span className="pab__floor-stats">
                      <em className="avail">{f.available} Avail</em> ·{' '}
                      <em className="booked">{f.booked} Booked</em> ·{' '}
                      <em className="sold">{f.sold} Sold</em>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
