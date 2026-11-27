import './BuyerHub.css'
import { useState, useMemo, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const projectPricing = {
  kharghar: {
    title: 'Aura Heights',
    nodeName: 'Aura Heights (Kharghar)',
    lat: 19.0435,
    lng: 73.0645,
    basePrices: { '1 BHK': 7500000, '2.5 BHK': 12000000, '3.5 BHK': 18000000 },
    landmarks: {
      transit: [
        { name: 'Kharghar Sector 20 Metro', time: '4 mins', dist: '1.2 km', lat: 19.0450, lng: 73.0600 },
        { name: 'Central Park Metro Station', time: '7 mins', dist: '2.5 km', lat: 19.0600, lng: 73.0680 }
      ],
      education: [
        { name: 'Vibgyor High School', time: '5 mins', dist: '1.5 km', lat: 19.0490, lng: 73.0670 },
        { name: 'NIFT Campus', time: '9 mins', dist: '3.2 km', lat: 19.0400, lng: 73.0720 }
      ],
      healthcare: [
        { name: 'MGM Multispecialty Hospital', time: '10 mins', dist: '4.0 km', lat: 19.0250, lng: 73.0780 },
        { name: 'Tata Memorial Center', time: '12 mins', dist: '4.8 km', lat: 19.0480, lng: 73.0850 }
      ],
      lifestyle: [
        { name: 'Kharghar Golf Course', time: '6 mins', dist: '2.1 km', lat: 19.0550, lng: 73.0665 },
        { name: 'Little World Mall', time: '11 mins', dist: '3.8 km', lat: 19.0220, lng: 73.0610 }
      ]
    }
  },
  taloja: {
    title: 'Eco Meadows',
    nodeName: 'Eco Meadows (Taloja)',
    lat: 19.0710,
    lng: 73.0980,
    basePrices: { '1 BHK': 4500000, '2 BHK': 7500000, '3 BHK': 11000000 },
    landmarks: {
      transit: [
        { name: 'Taloja Phase 2 Metro', time: '3 mins', dist: '0.8 km', lat: 19.0760, lng: 73.1000 },
        { name: 'Pendhar Metro Station', time: '8 mins', dist: '2.9 km', lat: 19.0820, lng: 73.0920 }
      ],
      education: [
        { name: 'The Elite Public School', time: '6 mins', dist: '1.8 km', lat: 19.0650, lng: 73.1050 },
        { name: 'Taloja Central High', time: '8 mins', dist: '2.6 km', lat: 19.0600, lng: 73.0900 }
      ],
      healthcare: [
        { name: 'Apex General Hospital', time: '7 mins', dist: '2.2 km', lat: 19.0740, lng: 73.1030 },
        { name: 'Mata Child Care Hospital', time: '10 mins', dist: '3.1 km', lat: 19.0680, lng: 73.0880 }
      ],
      lifestyle: [
        { name: 'Taloja Eco Central Park', time: '5 mins', dist: '1.4 km', lat: 19.0750, lng: 73.1080 },
        { name: 'Eco Meadows Galleria', time: '2 mins', dist: '0.4 km', lat: 19.0700, lng: 73.0950 }
      ]
    }
  },
  panvel: {
    title: 'Skyline Oasis',
    nodeName: 'Skyline Oasis (Panvel)',
    lat: 18.9950,
    lng: 73.1250,
    basePrices: { '1 BHK': 6000000, '2 BHK': 9500000, '3 BHK': 14000000 },
    landmarks: {
      transit: [
        { name: 'Panvel Railway Station', time: '6 mins', dist: '2.2 km', lat: 18.9890, lng: 73.1160 },
        { name: 'Navi Mumbai Airport Transit', time: '10 mins', dist: '4.5 km', lat: 19.0200, lng: 73.0800 }
      ],
      education: [
        { name: 'Amity International University', time: '12 mins', dist: '5.0 km', lat: 18.9750, lng: 73.1600 },
        { name: 'DAV Public School', time: '8 mins', dist: '3.0 km', lat: 18.9980, lng: 73.1120 }
      ],
      healthcare: [
        { name: 'Apollo Hospital Panvel', time: '9 mins', dist: '3.5 km', lat: 19.0150, lng: 73.1180 },
        { name: 'Lifeline Multispecialty', time: '6 mins', dist: '2.1 km', lat: 18.9920, lng: 73.1200 }
      ],
      lifestyle: [
        { name: 'Orion Mall Multiplex', time: '7 mins', dist: '2.4 km', lat: 18.9930, lng: 73.1170 },
        { name: 'Karnala Eco Sanctuary', time: '20 mins', dist: '9.5 km', lat: 18.8950, lng: 73.1150 }
      ]
    }
  }
}

export default function BuyerHub({ theme }) {
  const [selectedProj, setSelectedProj] = useState('kharghar')
  const project = projectPricing[selectedProj]

  const configs = Object.keys(project.basePrices)
  const [selectedConfig, setSelectedConfig] = useState(configs[0])

  // Reset BHK configuration choice if project changes
  useEffect(() => {
    setSelectedConfig(Object.keys(projectPricing[selectedProj].basePrices)[0])
  }, [selectedProj])

  const basePrice = project.basePrices[selectedConfig] || 5000000

  // Sliders State variables
  const [downPayPct, setDownPayPct] = useState(20) // defaults to 20%
  const [tenureYears, setTenureYears] = useState(20) // defaults to 20 years
  const [interestRate, setInterestRate] = useState(8.5) // defaults to 8.5%

  // Recalculate Down Payment amount dynamically when percentage or price updates
  const downPaymentAmount = useMemo(() => {
    return Math.round(basePrice * (downPayPct / 100))
  }, [basePrice, downPayPct])

  // Loan Amount
  const loanPrincipal = useMemo(() => {
    return basePrice - downPaymentAmount
  }, [basePrice, downPaymentAmount])

  // EMI Math Logic
  const emiResults = useMemo(() => {
    const P = loanPrincipal
    const r = interestRate / 12 / 100 // Monthly Interest Rate
    const n = tenureYears * 12 // Months

    if (P <= 0) return { emi: 0, totalInterest: 0, totalPayable: 0, principalPct: 100, interestPct: 0 }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayable = emi * n
    const totalInterest = totalPayable - P

    const principalPct = Math.round((P / totalPayable) * 100)
    const interestPct = 100 - principalPct

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
      principalPct,
      interestPct
    }
  }, [loanPrincipal, interestRate, tenureYears])

  // Proximity Map Filter state
  const [activeFilter, setActiveFilter] = useState('transit')

  // Landmarks based on selected category
  const activeLandmarks = useMemo(() => {
    return project.landmarks[activeFilter] || []
  }, [project, activeFilter])

  // Map Container Ref
  const mapContainerRef = useRef(null)

  // Initialize, update, and clean up Leaflet Map in a single self-cleaning effect
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Create Map instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false // disable scroll wheel zoom to allow page scroll
    })
    L.control.zoom({ position: 'topright' }).addTo(map)

    // Set Map Tile URLs based on active theme
    const tileUrl = theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

    L.tileLayer(tileUrl, {
      maxZoom: 19
    }).addTo(map)

    const projectCoords = [project.lat, project.lng]
    map.setView(projectCoords, 13)

    // Project center node
    const projColor = theme === 'light' ? '#78582b' : '#c8a262'
    const projIcon = L.divIcon({
      className: 'custom-project-marker',
      html: `
        <div class="marker-pulse-large" style="border-color: ${projColor}"></div>
        <div class="marker-dot-project" style="background-color: ${projColor}"></div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    })

    L.marker(projectCoords, { icon: projIcon })
      .bindTooltip(`<b>${project.title}</b>`, { permanent: true, direction: 'bottom', className: 'map-tooltip' })
      .addTo(map)

    // Category Landmark nodes & Connection lines
    const landmarkColor = theme === 'light' ? '#735225' : '#d4af37'
    activeLandmarks.forEach((lm) => {
      const lmCoords = [lm.lat, lm.lng]
      const lmIcon = L.divIcon({
        className: 'custom-landmark-marker',
        html: `
          <div class="marker-pulse-small" style="border-color: ${landmarkColor}"></div>
          <div class="marker-dot-landmark" style="background-color: ${landmarkColor}"></div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })

      L.marker(lmCoords, { icon: lmIcon })
        .bindTooltip(`<b>${lm.name}</b><br>${lm.time} (${lm.dist})`, { direction: 'top', className: 'map-tooltip' })
        .addTo(map)

      // Dynamic dashed route distance lines
      L.polyline([projectCoords, lmCoords], {
        color: landmarkColor,
        weight: 2,
        dashArray: '5, 5',
        className: 'map-route-line-anim'
      }).addTo(map)
    })

    // Adjust bounds to fit all elements
    if (activeLandmarks.length > 0) {
      const bounds = L.latLngBounds([projectCoords, ...activeLandmarks.map(lm => [lm.lat, lm.lng])])
      map.fitBounds(bounds, { padding: [50, 50] })
    }

    // Force Leaflet to recalculate tile layout after any layout shift (e.g. flex container)
    setTimeout(() => { try { map.invalidateSize() } catch (_) {} }, 150)
    setTimeout(() => { try { map.invalidateSize() } catch (_) {} }, 500)

    // Teardown the map when component updates or unmounts to prevent double-initialization
    return () => {
      map.remove()
    }
  }, [selectedProj, activeFilter, theme, project, activeLandmarks])

  // Utility formatter
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <section className="buyer-hub-section" id="buyer-hub">
      <div className="container">
        
        {/* Header */}
        <div className="hub-section-header">
          <div className="section-tag">FINANCIAL & LOCATION INTELLIGENCE</div>
          <h2 className="hub-title">
            Home Loan Calculator & <span className="gold-text">Proximity Network</span>
          </h2>
          <div className="blueprint-title-decor" />
          <p className="hub-desc">
            Personalize your down payment and loan tenure with live bank EMI estimates, then evaluate actual commute times to premier transit, education, and healthcare hubs.
          </p>
        </div>

        {/* Project Selector Control Bar */}
        <div className="hub-project-selector-bar">
          {Object.entries(projectPricing).map(([key, data]) => (
            <button
              key={key}
              className={`project-tab-btn ${selectedProj === key ? 'active' : ''}`}
              onClick={() => setSelectedProj(key)}
            >
              <span className="dot"></span>
              {data.title} ({key.toUpperCase()})
            </button>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="hub-dashboard-grid">
          
          {/* ── LEFT: Precision EMI Calculator ── */}
          <div className="dashboard-widget glass-card emi-widget-card">
            <div className="widget-header">
              <span className="title-icon">📊</span>
              <h3>Precision EMI Calculator</h3>
            </div>

            <div className="widget-body">
              {/* BHK selector */}
              <div className="calc-group config-select-group">
                <label className="input-label">Select Apartment Configuration</label>
                <div className="config-button-row">
                  {configs.map((config) => (
                    <button
                      key={config}
                      className={`config-btn ${selectedConfig === config ? 'selected' : ''}`}
                      onClick={() => setSelectedConfig(config)}
                    >
                      {config}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Base Price Display */}
              <div className="price-display-row">
                <span className="label">Estimated Base Price:</span>
                <span className="value">{formatCurrency(basePrice)}</span>
              </div>

              {/* Slider 1: Down Payment */}
              <div className="slider-group">
                <div className="slider-label-row">
                  <span className="label">Down Payment ({downPayPct}%)</span>
                  <span className="value">{formatCurrency(downPaymentAmount)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={downPayPct}
                  onChange={(e) => setDownPayPct(Number(e.target.value))}
                  className="hud-slider"
                />
                <div className="slider-limits">
                  <span>10% (Min)</span>
                  <span>90% (Max)</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="slider-group">
                <div className="slider-label-row">
                  <span className="label">Interest Rate (p.a.)</span>
                  <span className="value">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="7.0"
                  max="12.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="hud-slider"
                />
                <div className="slider-limits">
                  <span>7.0%</span>
                  <span>12.0%</span>
                </div>
              </div>

              {/* Slider 3: Loan Tenure */}
              <div className="slider-group">
                <div className="slider-label-row">
                  <span className="label">Loan Tenure</span>
                  <span className="value">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="hud-slider"
                />
                <div className="slider-limits">
                  <span>5 yrs</span>
                  <span>30 yrs</span>
                </div>
              </div>

              {/* Calculated Outputs Display */}
              <div className="calculator-output-panel">
                <div className="emi-result-row">
                  <span className="label">Estimated Monthly EMI</span>
                  <span className="emi-value">{formatCurrency(emiResults.emi)}<span className="month">/mo</span></span>
                </div>

                {/* Ratio Bar */}
                <div className="ratio-bar-wrapper">
                  <div className="ratio-labels">
                    <span>Principal: {emiResults.principalPct}%</span>
                    <span>Interest: {emiResults.interestPct}%</span>
                  </div>
                  <div className="ratio-bar">
                    <div className="bar-principal" style={{ width: `${emiResults.principalPct}%` }}></div>
                    <div className="bar-interest" style={{ width: `${emiResults.interestPct}%` }}></div>
                  </div>
                </div>

                <div className="breakdown-grid">
                  <div className="breakdown-item">
                    <span className="lbl">Principal Loan</span>
                    <span className="val">{formatCurrency(loanPrincipal)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="lbl">Total Interest</span>
                    <span className="val">{formatCurrency(emiResults.totalInterest)}</span>
                  </div>
                </div>

                <div className="bank-partner-strip">
                  <span className="bank-strip-title">Pre-Approved Banking Partners:</span>
                  <div className="bank-rates-row">
                    <span className="rate-pill">SBI @ 8.50%</span>
                    <span className="rate-pill">HDFC @ 8.55%</span>
                    <span className="rate-pill">ICICI @ 8.60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Interactive Location Map ── */}
          <div className="dashboard-widget glass-card map-widget-card">
            <div className="widget-header">
              <span className="title-icon">🗺️</span>
              <h3>Interactive Proximity Map</h3>
            </div>

            <div className="widget-body map-widget-body">
              {/* Category Filter Controls */}
              <div className="map-filters-row">
                <button
                  className={`filter-btn ${activeFilter === 'transit' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('transit')}
                >
                  🚇 Transit
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'education' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('education')}
                >
                  🎓 Education
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'healthcare' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('healthcare')}
                >
                  🏥 Healthcare
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'lifestyle' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('lifestyle')}
                >
                  🛍️ Lifestyle
                </button>
              </div>

              {/* Interactive Map Container */}
              <div className="vector-map-container">
                <div 
                  id="proximity-leaflet-map" 
                  ref={mapContainerRef} 
                  style={{ width: '100%', height: '100%', minHeight: '300px' }}
                ></div>

                {/* Connectivity List Overlay */}
                <div className="proximity-connectivity-list">
                  <div className="list-title">Landmarks Proximity Breakdown ({activeFilter.toUpperCase()})</div>
                  <div className="list-items">
                    {activeLandmarks.map((lm, idx) => (
                      <div className="list-item" key={idx}>
                        <div className="item-details">
                          <span className="dot-bullet"></span>
                          <span className="name">{lm.name}</span>
                        </div>
                        <div className="item-metrics">
                          <span className="time">{lm.time}</span>
                          <span className="divider">|</span>
                          <span className="dist">{lm.dist}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}

