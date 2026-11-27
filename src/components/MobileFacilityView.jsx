import './MobileFacilityView.css'
import { useState, useMemo, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const FILTERS = [
  { id: 'transit',   emoji: '🚇', label: 'Transit' },
  { id: 'education', emoji: '🎓', label: 'Education' },
  { id: 'healthcare',emoji: '🏥', label: 'Healthcare' },
  { id: 'lifestyle', emoji: '🛍️', label: 'Lifestyle' },
]

export default function MobileFacilityView({ project, projectsList = [], onSelectProject, theme, onBack, onOpenMenu, onOpenVisitModal }) {
  const [activeFilter, setActiveFilter] = useState('transit')
  const mapContainerRef = useRef(null)

  const activeLandmarks = useMemo(() => project.landmarks[activeFilter] || [], [project, activeFilter])

  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    })
    L.control.zoom({ position: 'topright' }).addTo(map)

    const tileUrl = theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map)

    const projectCoords = [project.lat, project.lng]
    map.setView(projectCoords, 13)

    const projColor = theme === 'light' ? '#78582b' : '#c8a262'
    const projIcon = L.divIcon({
      className: 'custom-project-marker',
      html: `<div class="marker-pulse-large" style="border-color:${projColor}"></div><div class="marker-dot-project" style="background-color:${projColor}"></div>`,
      iconSize: [40, 40], iconAnchor: [20, 20],
    })
    L.marker(projectCoords, { icon: projIcon })
      .bindTooltip(`<b>${project.title}</b>`, { permanent: true, direction: 'bottom', className: 'map-tooltip' })
      .addTo(map)

    const lmColor = theme === 'light' ? '#735225' : '#d4af37'
    activeLandmarks.forEach(lm => {
      const lmCoords = [lm.lat, lm.lng]
      const lmIcon = L.divIcon({
        className: 'custom-landmark-marker',
        html: `<div class="marker-pulse-small" style="border-color:${lmColor}"></div><div class="marker-dot-landmark" style="background-color:${lmColor}"></div>`,
        iconSize: [30, 30], iconAnchor: [15, 15],
      })
      L.marker(lmCoords, { icon: lmIcon })
        .bindTooltip(`<b>${lm.name}</b><br>${lm.time} (${lm.dist})`, { direction: 'top', className: 'map-tooltip' })
        .addTo(map)
      L.polyline([projectCoords, lmCoords], { color: lmColor, weight: 2, dashArray: '5,5' }).addTo(map)
    })

    if (activeLandmarks.length > 0) {
      const bounds = L.latLngBounds([projectCoords, ...activeLandmarks.map(lm => [lm.lat, lm.lng])])
      map.fitBounds(bounds, { padding: [44, 44] })
    }

    setTimeout(() => { try { map.invalidateSize() } catch (_) {} }, 200)

    return () => { map.remove() }
  }, [project, activeFilter, theme, activeLandmarks])

  return (
    <div className="mfac">
      {/* Header */}
      <div className="mfac__header">
        <button className="mfac__back" onClick={onBack} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="mfac__header-text">
          <span className="mfac__header-title">Nearby Facilities</span>
          <span className="mfac__header-sub">{project.title} · {project.location.split(',')[0]}</span>
        </div>
        {onOpenMenu ? (
          <button className="mfac__back" onClick={onOpenMenu} aria-label="Open menu" style={{ fontSize: 17 }}>
            ☰
          </button>
        ) : (
          <span className="mfac__header-icon">🗺️</span>
        )}
      </div>

      {projectsList.length > 1 && onSelectProject && (
        <div style={{ display: 'flex', gap: 8, padding: '8px 16px 0', overflowX: 'auto' }}>
          {projectsList.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectProject(p)}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: '1px solid var(--border-subtle)',
                background: p.id === project.id ? 'var(--accent-primary)' : 'transparent',
                color: p.id === project.id ? '#fff' : 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      {/* Filter chips */}
      <div className="mfac__filter-row">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`mfac__filter-chip ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="mfac__map-wrap">
        <div ref={mapContainerRef} className="mfac__map" />
      </div>

      {/* Landmark list */}
      <div className="mfac__list-scroll">
        <div className="mfac__list-title">
          {FILTERS.find(f => f.id === activeFilter)?.emoji}{' '}
          {FILTERS.find(f => f.id === activeFilter)?.label} Near {project.title}
        </div>
        <div className="mfac__list">
          {activeLandmarks.map((lm, i) => (
            <div className="mfac__list-item" key={i}>
              <div className="mfac__list-left">
                <span className="mfac__list-dot" />
                <span className="mfac__list-name">{lm.name}</span>
              </div>
              <div className="mfac__list-right">
                <span className="mfac__list-time">{lm.time}</span>
                <span className="mfac__list-dist">{lm.dist}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="mfac__cta" onClick={onOpenVisitModal}>
          Schedule Site Visit — See It Yourself
        </button>
        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
