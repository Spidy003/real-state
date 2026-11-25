import { useState, useEffect, useMemo } from 'react'
import './FloorPlanModal.css'

const roomData = {
  '1 BHK': {
    living: { name: 'Living & Dining Area', size: "11'0\" x 15'0\"", floor: 'Italian Marble Finish', balcony: 'Attached (11\'0" x 4\'0")', details: 'Spacious living area with floor-to-ceiling glass slider door leading to the sunset balcony.' },
    bedroom: { name: 'Master Bedroom', size: "10'0\" x 12'0\"", floor: 'Vitrified Tiles', balcony: 'No', details: 'Cozy master bedroom with pre-installed AC ducts and large soundproof window looking into the green park.' },
    kitchen: { name: 'Kitchen', size: "8'0\" x 8'0\"", floor: 'Granite Top & Ceramic Tiles', balcony: 'Utility attached', details: 'Modular layout ready with chimney exhaust and premium granite countertops.' },
    balcony: { name: 'Balcony Deck', size: "11'0\" x 4'0\"", floor: 'Anti-Skid Wooden Decking', balcony: 'N/A', details: 'Private outdoor balcony with panoramic views of the landscaped park and city skyline.' },
    bath: { name: 'En-Suite Bathroom', size: "7'0\" x 4'6\"", floor: 'Anti-Skid Ceramic Tiles', balcony: 'No', details: 'Premium VitrA sanitary fittings, wall-mounted WC, and instant geyser provision.' }
  },
  '2 BHK': {
    living: { name: 'Grand Living & Dining Room', size: "12'0\" x 18'0\"", floor: 'Imported Italian Marble', balcony: 'Double Deck (12\'0" x 5\'0")', details: 'Grand living layout with dedicated dining nook, smart lock access, and panoramic glass facade.' },
    master: { name: 'Master Suite', size: "11'0\" x 13'6\"", floor: 'Premium Wooden Laminate', balcony: 'Attached (11\'0" x 3\'6")', details: 'Ultra-luxury bedroom space featuring attached closet space, private deck access, and smart lights.' },
    bedroom2: { name: 'Children / Guest Bedroom', size: "10'0\" x 11'0\"", floor: 'Vitrified Tiles', balcony: 'No', details: 'Spacious bedroom with large bay window for abundant natural sunlight.' },
    kitchen: { name: 'Gourmet Kitchen', size: "9'0\" x 8'6\"", floor: 'Anti-Skid Vitrified', balcony: 'Utility Attached', details: 'Parallel platform layout with piped gas connection and aqua-guard water purifier.' },
    balcony: { name: 'Main Deck', size: "12'0\" x 5'0\"", floor: 'Premium Wooden Tile Deck', balcony: 'N/A', details: 'Spacious sunset terrace deck with stainless steel & glass safety railings.' },
    bath: { name: 'Master Bathroom', size: "8'0\" x 5'0\"", floor: 'Premium Marble Finish', balcony: 'No', details: 'En-suite bath featuring glass shower partition, Grohe fixtures, and false ceiling.' }
  },
  '3 BHK': {
    living: { name: 'Grand Living & Dining Lounge', size: "14'0\" x 22'0\"", floor: 'Premium Italian Marble', balcony: 'Grand Sun Deck (14\'0" x 6\'0")', details: 'Extremely spacious room with false-ceiling lights, dedicated bar area, and sunset mountain views.' },
    master: { name: 'Presidential Suite', size: "12'0\" x 15'0\"", floor: 'Teak Wooden Flooring', balcony: 'Attached Deck', details: 'Master suite featuring walk-in wardrobe cabinet, automated smart curtains, and en-suite grand bath.' },
    bedroom2: { name: 'Guest Bedroom', size: "11'0\" x 13'0\"", floor: 'Vitrified Tiles', balcony: 'Attached Deck', details: 'Guest bedroom with attached bathroom, glass wardrobes, and private corner deck.' },
    bedroom3: { name: 'Children / Study Room', size: "10'0\" x 12'0\"", floor: 'Vitrified Tiles', balcony: 'No', details: 'Work-from-home study or children\'s bedroom with ample wall storage space.' },
    kitchen: { name: 'Kitchen & Dry Utility', size: "10'0\" x 10'0\"", floor: 'Granite Decking', balcony: 'Dry Deck Attached', details: 'L-shaped modular kitchen space featuring quartz countertops, built-in microwave slot, and utility sink.' },
    balcony: { name: 'Grand Sunset Deck', size: "14'0\" x 6'0\"", floor: 'Teak Wood Floor Tiles', balcony: 'N/A', details: 'Expansive private deck suitable for outdoor coffee table, container garden, and evening relaxation.' }
  }
}

export default function FloorPlanModal({ project, onClose, onOpenVisitModal }) {
  const configs = Object.keys(project.pricing)
  const [activeConfig, setActiveConfig] = useState(configs[0])
  const [selectedRoomKey, setSelectedRoomKey] = useState('living')
  const [hoveredRoomKey, setHoveredRoomKey] = useState(null)

  const mappedConfig = useMemo(() => {
    if (roomData[activeConfig]) return activeConfig
    if (activeConfig.includes('1')) return '1 BHK'
    if (activeConfig.includes('3')) return '3 BHK'
    return '2 BHK'
  }, [activeConfig])

  const currentRooms = roomData[mappedConfig] || roomData['2 BHK']
  const activeRoom = currentRooms[hoveredRoomKey] || currentRooms[selectedRoomKey] || currentRooms.living

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const getPriceDisplay = () => {
    const p = project.pricing[activeConfig]
    if (!p) return 'Price On Request'
    if (typeof p === 'object') return p.price
    return p
  }

  const handleInquire = () => {
    onClose()
    if (onOpenVisitModal) {
      onOpenVisitModal(project)
    }
  }

  return (
    <div className="floor-modal-overlay">
      <div className="floor-modal-backdrop" onClick={onClose} />
      
      <div className="floor-modal-card glass-card">
        {/* Close Button */}
        <button className="floor-modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Modal Header */}
        <div className="floor-modal-header">
          <div className="modal-tag-badge">ARCHITECTURAL BLUEPRINT & SPECS</div>
          <h2 className="modal-title">{project.title} — Floor Plan Selector</h2>
          <p className="modal-subtitle">📍 {project.location} • Select a configuration and hover or tap rooms to view detailed civil dimensions.</p>
        </div>

        {/* Splitting Layout: SVG Blueprint on Left, Technical Specs on Right */}
        <div className="floor-modal-body-grid">
          
          {/* ── LEFT SIDE: SVG Interactive Blueprint ── */}
          <div className="blueprint-column">
            
            {/* BHK Tabs Bar */}
            <div className="blueprint-tabs-bar">
              {configs.map((config) => (
                <button
                  key={config}
                  className={`blueprint-tab-btn ${activeConfig === config ? 'active' : ''}`}
                  onClick={() => {
                    setActiveConfig(config)
                    setSelectedRoomKey('living')
                  }}
                >
                  {config}
                </button>
              ))}
            </div>

            {/* SVG Visualizer Canvas */}
            <div className="blueprint-svg-container">
              <svg className="floor-plan-svg" viewBox="0 0 100 100">
                <defs>
                  <pattern id="modalGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(200, 164, 107, 0.08)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#modalGrid)" />

                {/* ── 1 BHK BLUEPRINT SVG ── */}
                {mappedConfig === '1 BHK' && (
                  <g className="svg-layout-group">
                    <rect x="10" y="10" width="80" height="80" fill="none" stroke="rgba(200, 164, 107, 0.3)" strokeWidth="1" strokeDasharray="3,3" />

                    {/* Room 1: Living Room */}
                    <g 
                      className={`room-group ${selectedRoomKey === 'living' ? 'selected' : ''} ${hoveredRoomKey === 'living' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('living')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('living')}
                    >
                      <rect x="15" y="15" width="40" height="45" className="room-bg" />
                      <text x="35" y="38" className="room-label">LIVING ROOM</text>
                      <path d="M 20 20 L 20 50 L 25 50 L 25 20 Z" className="furniture-item" />
                      <rect x="25" y="30" width="8" height="15" className="furniture-item" />
                    </g>

                    {/* Room 2: Balcony */}
                    <g 
                      className={`room-group ${selectedRoomKey === 'balcony' ? 'selected' : ''} ${hoveredRoomKey === 'balcony' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('balcony')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('balcony')}
                    >
                      <rect x="15" y="60" width="40" height="15" className="room-bg balcony-bg" />
                      <text x="35" y="68" className="room-label">BALCONY</text>
                      <line x1="15" y1="74" x2="55" y2="74" stroke="currentColor" strokeWidth="0.8" />
                    </g>

                    {/* Room 3: Master Bedroom */}
                    <g 
                      className={`room-group ${selectedRoomKey === 'bedroom' ? 'selected' : ''} ${hoveredRoomKey === 'bedroom' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('bedroom')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('bedroom')}
                    >
                      <rect x="58" y="15" width="27" height="40" className="room-bg" />
                      <text x="71.5" y="35" className="room-label">MASTER BED</text>
                      <rect x="63" y="18" width="18" height="18" rx="1" className="furniture-item" />
                    </g>

                    {/* Room 4: Kitchen */}
                    <g 
                      className={`room-group ${selectedRoomKey === 'kitchen' ? 'selected' : ''} ${hoveredRoomKey === 'kitchen' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('kitchen')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('kitchen')}
                    >
                      <rect x="58" y="58" width="27" height="27" className="room-bg" />
                      <text x="71.5" y="72" className="room-label">KITCHEN</text>
                      <path d="M 58 58 L 80 58 L 80 64 L 64 64 L 64 85 L 58 85 Z" className="furniture-item" />
                    </g>

                    {/* Room 5: Bathroom */}
                    <g 
                      className={`room-group ${selectedRoomKey === 'bath' ? 'selected' : ''} ${hoveredRoomKey === 'bath' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('bath')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('bath')}
                    >
                      <rect x="15" y="78" width="40" height="12" className="room-bg" />
                      <text x="35" y="85" className="room-label">BATH</text>
                    </g>
                  </g>
                )}

                {/* ── 2 BHK BLUEPRINT SVG ── */}
                {mappedConfig === '2 BHK' && (
                  <g className="svg-layout-group">
                    <rect x="8" y="8" width="84" height="84" fill="none" stroke="rgba(200, 164, 107, 0.3)" strokeWidth="1" strokeDasharray="3,3" />

                    {/* Room 1: Living & Dining */}
                    <g 
                      className={`room-group ${selectedRoomKey === 'living' ? 'selected' : ''} ${hoveredRoomKey === 'living' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('living')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('living')}
                    >
                      <rect x="12" y="12" width="45" height="42" className="room-bg" />
                      <text x="34.5" y="32" className="room-label">LIVING & DINING</text>
                      <path d="M 16 16 L 16 40 L 20 40 L 20 16 Z" className="furniture-item" />
                      <rect x="42" y="18" width="10" height="12" rx="1" className="furniture-item" />
                    </g>

                    {/* Room 2: Balcony */}
                    <g 
                      className={`room-group ${selectedRoomKey === 'balcony' ? 'selected' : ''} ${hoveredRoomKey === 'balcony' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('balcony')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('balcony')}
                    >
                      <rect x="12" y="56" width="45" height="14" className="room-bg balcony-bg" />
                      <text x="34.5" y="64" className="room-label">SUNSET DECK</text>
                    </g>

                    {/* Room 3: Master Suite */}
                    <g 
                      className={`room-group ${selectedRoomKey === 'master' ? 'selected' : ''} ${hoveredRoomKey === 'master' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('master')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('master')}
                    >
                      <rect x="60" y="12" width="28" height="38" className="room-bg" />
                      <text x="74" y="30" className="room-label">MASTER SUITE</text>
                      <rect x="64" y="15" width="20" height="18" rx="1" className="furniture-item" />
                    </g>

                    {/* Room 4: Kitchen */}
                    <g 
                      className={`room-group ${selectedRoomKey === 'kitchen' ? 'selected' : ''} ${hoveredRoomKey === 'kitchen' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('kitchen')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('kitchen')}
                    >
                      <rect x="60" y="53" width="28" height="24" className="room-bg" />
                      <text x="74" y="66" className="room-label">KITCHEN</text>
                    </g>

                    {/* Room 5: Bath */}
                    <g 
                      className={`room-group ${selectedRoomKey === 'bath' ? 'selected' : ''} ${hoveredRoomKey === 'bath' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('bath')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('bath')}
                    >
                      <rect x="12" y="73" width="45" height="15" className="room-bg" />
                      <text x="34.5" y="81" className="room-label">BATH</text>
                    </g>
                  </g>
                )}

                {/* ── 3 BHK BLUEPRINT SVG ── */}
                {mappedConfig === '3 BHK' && (
                  <g className="svg-layout-group">
                    <rect x="6" y="6" width="88" height="88" fill="none" stroke="rgba(200, 164, 107, 0.3)" strokeWidth="1" strokeDasharray="3,3" />

                    <g 
                      className={`room-group ${selectedRoomKey === 'living' ? 'selected' : ''} ${hoveredRoomKey === 'living' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('living')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('living')}
                    >
                      <rect x="10" y="10" width="50" height="45" className="room-bg" />
                      <text x="35" y="32" className="room-label">GRAND LIVING</text>
                    </g>

                    <g 
                      className={`room-group ${selectedRoomKey === 'balcony' ? 'selected' : ''} ${hoveredRoomKey === 'balcony' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('balcony')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('balcony')}
                    >
                      <rect x="10" y="58" width="50" height="15" className="room-bg balcony-bg" />
                      <text x="35" y="67" className="room-label">PANORAMIC BALCONY</text>
                    </g>

                    <g 
                      className={`room-group ${selectedRoomKey === 'master' ? 'selected' : ''} ${hoveredRoomKey === 'master' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('master')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('master')}
                    >
                      <rect x="63" y="10" width="28" height="38" className="room-bg" />
                      <text x="77" y="28" className="room-label">PRESIDENTIAL SUITE</text>
                    </g>

                    <g 
                      className={`room-group ${selectedRoomKey === 'kitchen' ? 'selected' : ''} ${hoveredRoomKey === 'kitchen' ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredRoomKey('kitchen')}
                      onMouseLeave={() => setHoveredRoomKey(null)}
                      onClick={() => setSelectedRoomKey('kitchen')}
                    >
                      <rect x="63" y="52" width="28" height="35" className="room-bg" />
                      <text x="77" y="70" className="room-label">GOURMET KITCHEN</text>
                    </g>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* ── RIGHT SIDE: Technical Specifications ── */}
          <div className="specs-column">
            <div className="specs-box-header">
              <span className="spec-indicator"></span>
              <h4>Technical Specifications</h4>
            </div>

            <div className="specs-card-content">
              <div className="spec-table-row">
                <span className="spec-label">Development:</span>
                <span className="spec-value">{project.title}</span>
              </div>
              <div className="spec-table-row">
                <span className="spec-label">Target Handover:</span>
                <span className="spec-value">{project.completion}</span>
              </div>
              <div className="spec-table-row">
                <span className="spec-label">Vastu Orientation:</span>
                <span className="spec-value">East-Facing (Vastu Compliant)</span>
              </div>
              <div className="spec-table-row">
                <span className="spec-label">Quote Estimate:</span>
                <span className="spec-value text-gold">{getPriceDisplay()}</span>
              </div>

              <div className="spec-separator" />

              {/* Dynamic Room Info */}
              <div className="room-specs-detail-box">
                <div className="active-room-title-bar">
                  <h5>{activeRoom.name}</h5>
                </div>

                <div className="room-spec-grid">
                  <div className="room-spec-item">
                    <span className="lbl">Dimensions:</span>
                    <span className="val">{activeRoom.size}</span>
                  </div>
                  <div className="room-spec-item">
                    <span className="lbl">Flooring:</span>
                    <span className="val">{activeRoom.floor}</span>
                  </div>
                </div>

                <div className="room-desc-paragraph">
                  <span className="desc-heading">SPECIFICATION & FINISHES</span>
                  <p>{activeRoom.details}</p>
                </div>
              </div>

              {/* Inquire CTA Button */}
              <div className="modal-cta-box">
                <button 
                  className="btn-primary modal-action-btn"
                  onClick={handleInquire}
                >
                  <span>Book Site Visit For This Unit</span>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="notice">*Receive detailed structural drawings, civil plans, and booking token assistance.</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
