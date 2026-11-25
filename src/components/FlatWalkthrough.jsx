import { useState, useEffect, useRef } from 'react'
import './FlatWalkthrough.css'

const TOTAL_FRAMES = 300
const LR_START     = 104
const LR_END       = 240
const SCROLL_VH    = 420   // lower = less scroll needed per frame
const WHEEL_SPEED  = 0.75  // higher = faster scroll response

/* Frames animated per second during "View Living Room" / back-btn glide */
const ANIM_FPS = 20

const getSectionInfo = (frame) => {
  if (frame <= 60)      return { title: 'GRAND ENTRANCE',        desc: 'Sleek design, spacious main foyer.' }
  if (frame < LR_START) return { title: 'CORRIDOR & HALLWAY',    desc: 'Wide passage with premium tile flooring.' }
  if (frame <= LR_END)  return { title: 'EXPANSIVE LIVING ROOM', desc: 'Premium glass partition with high-end ceiling detail.' }
  if (frame <= 270)     return { title: 'MASTER BEDROOM SUITE',  desc: 'Spacious layout with rich wood panels.' }
  return                       { title: 'PANORAMIC BALCONY',     desc: 'Breathtaking high-floor node vistas.' }
}

export default function FlatWalkthrough({ onBackToHome, project }) {
  const [loading,     setLoading]     = useState(true)
  const [loadedCount, setLoadedCount] = useState(0)

  const canvasRef   = useRef(null)
  const imagesRef   = useRef([])
  const frameRef    = useRef(1)
  const rafRef      = useRef(null)   // canvas loop

  /* direct-DOM refs */
  const thumbRef        = useRef(null)
  const trackRef        = useRef(null)
  const zoneBarRef      = useRef(null)
  const progressFillRef = useRef(null)
  const progressValRef  = useRef(null)
  const tipRef          = useRef(null)
  const spatialTitleRef = useRef(null)
  const spatialDescRef  = useRef(null)
  const frameNumRef     = useRef(null)
  const scrollPromptRef = useRef(null)

  /* updateHUD stored in a ref so animScrollToFrame can call it */
  const updateHUDRef  = useRef(null)

  const isDraggingRef  = useRef(false)
  const isAnimRef      = useRef(false)   // true while glide anim runs
  const animRafRef     = useRef(null)

  const projectName = project?.title || 'Aura Heights'

  /* ─── helpers ─── */
  const scrollableH = () =>
    document.documentElement.scrollHeight - window.innerHeight

  const cancelAnim = () => {
    if (animRafRef.current) cancelAnimationFrame(animRafRef.current)
    animRafRef.current = null
    isAnimRef.current  = false
  }

  /**
   * Cinematic slow glide.
   * Animates frameRef.current directly at ANIM_FPS so the canvas
   * visibly changes every RAF tick — no waiting, no jumping.
   */
  const animScrollToFrame = (targetFrame) => {
    cancelAnim()

    const startFrame = frameRef.current
    const totalFrames = Math.abs(targetFrame - startFrame)
    if (totalFrames === 0) return

    // duration = frames ÷ fps, clamped 1.5 s → 7 s
    const duration  = Math.max(1500, Math.min(7000, (totalFrames / ANIM_FPS) * 1000))
    const startTime = performance.now()
    isAnimRef.current = true

    const step = (now) => {
      if (!isAnimRef.current) return          // cancelled mid-flight

      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Pure linear → constant frame rate → always visibly moving
      const frame = Math.round(startFrame + (targetFrame - startFrame) * progress)
      const clamped = Math.max(1, Math.min(TOTAL_FRAMES, frame))

      // ① update canvas frame directly
      frameRef.current = clamped

      // ② keep window.scrollY in sync so manual scroll after anim is correct
      const total = scrollableH()
      window.scrollTo(0, ((clamped - 1) / (TOTAL_FRAMES - 1)) * total)

      // ③ update all HUD elements
      updateHUDRef.current?.(clamped)

      if (progress < 1) {
        animRafRef.current = requestAnimationFrame(step)
      } else {
        isAnimRef.current  = false
        animRafRef.current = null
      }
    }

    animRafRef.current = requestAnimationFrame(step)
  }

  /** Zero-latency snap (for drag) */
  const snapToFrame = (n) => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, n))
    const total   = scrollableH()
    frameRef.current = clamped
    window.scrollTo(0, ((clamped - 1) / (TOTAL_FRAMES - 1)) * total)
    updateHUDRef.current?.(clamped)
  }

  /* ─── Preload 300 frames ─── */
  useEffect(() => {
    let alive = true
    let done  = 0
    const imgs = []

    window.scrollTo(0, 0)
    document.body.style.overflow = 'hidden'

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/flat1-frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`
      const tick = () => {
        if (!alive) return
        done++
        setLoadedCount(done)
        if (done === TOTAL_FRAMES) {
          setLoading(false)
          document.body.style.overflow = 'auto'
        }
      }
      img.onload  = tick
      img.onerror = tick
      imgs.push(img)
    }
    imagesRef.current = imgs
    return () => { alive = false; document.body.style.overflow = 'auto' }
  }, [])

  /* ─── Canvas + scroll + drag (runs once loading is done) ─── */
  useEffect(() => {
    if (loading) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const drawFrame = (idx) => {
      const img = imagesRef.current[idx - 1]
      if (!img?.complete || !img.naturalWidth) return
      const iR = img.width / img.height, cR = canvas.width / canvas.height
      let dw, dh, dx, dy
      if (iR > cR) { dh = canvas.height; dw = dh * iR; dx = (canvas.width - dw) / 2; dy = 0 }
      else          { dw = canvas.width;  dh = dw / iR; dx = 0; dy = (canvas.height - dh) / 2 }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      drawFrame(frameRef.current)
    }

    /* ── HUD updater (stored in ref for use by animScrollToFrame) ── */
    const updateHUD = (frame) => {
      const inLR  = frame >= LR_START && frame <= LR_END
      const pct   = Math.round((frame / TOTAL_FRAMES) * 100)
      const info  = getSectionInfo(frame)
      const lrPct = inLR ? (frame - LR_START) / (LR_END - LR_START) : 0

      if (thumbRef.current)        thumbRef.current.style.left   = `${lrPct * 100}%`
      if (zoneBarRef.current)      zoneBarRef.current.style.display = inLR ? 'flex' : 'none'
      if (progressFillRef.current) progressFillRef.current.style.width = `${pct}%`
      if (progressValRef.current)  progressValRef.current.textContent  = `${pct}%`
      if (tipRef.current)          tipRef.current.textContent = inLR
        ? '← Drag the bar or scroll left / right →'
        : 'Scroll up / down to walk through'
      if (spatialTitleRef.current) spatialTitleRef.current.textContent = info.title
      if (spatialDescRef.current)  spatialDescRef.current.textContent  = info.desc
      if (frameNumRef.current)     frameNumRef.current.innerHTML =
        `Frame <span class="highlight-frame">${String(frame).padStart(3, '0')}</span> / ${TOTAL_FRAMES}`
      if (scrollPromptRef.current) scrollPromptRef.current.style.opacity = frame < 15 ? '1' : '0'
    }
    updateHUDRef.current = updateHUD   // expose to animScrollToFrame

    /* ── Scroll handler (skipped during cinematic anim) ── */
    const onScroll = () => {
      if (isDraggingRef.current) return
      if (isAnimRef.current)     return   // anim owns frameRef, don't override
      const pct   = Math.max(0, Math.min(1, window.scrollY / scrollableH()))
      const frame = Math.floor(pct * (TOTAL_FRAMES - 1)) + 1
      frameRef.current = frame
      updateHUD(frame)
    }

    /* ── Wheel handler ── */
    const onWheel = (e) => {
      cancelAnim()                          // any wheel scroll cancels glide
      if (isDraggingRef.current) return
      e.preventDefault()
      const f     = frameRef.current
      const delta = (f >= LR_START && f <= LR_END && Math.abs(e.deltaX) > 1)
        ? e.deltaX : e.deltaY
      window.scrollBy({ top: delta * WHEEL_SPEED, behavior: 'auto' })
    }

    /* ── Drag on LR track ── */
    const trackEl = trackRef.current
    const thumbEl = thumbRef.current

    const frameFromX = (clientX) => {
      if (!trackEl) return LR_START
      const rect = trackEl.getBoundingClientRect()
      const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return Math.round(LR_START + pct * (LR_END - LR_START))
    }

    const onDragMove = (e) => {
      if (!isDraggingRef.current) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      snapToFrame(frameFromX(clientX))
    }

    const onDragEnd = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      if (trackEl) trackEl.style.cursor = 'grab'
      if (thumbEl) { thumbEl.style.cursor = 'grab'; thumbEl.style.boxShadow = '0 0 12px var(--accent-cyan)' }
      window.removeEventListener('mousemove', onDragMove)
      window.removeEventListener('mouseup',   onDragEnd)
      window.removeEventListener('touchmove', onDragMove)
      window.removeEventListener('touchend',  onDragEnd)
    }

    const onDragStart = (e) => {
      if (frameRef.current < LR_START || frameRef.current > LR_END) return
      cancelAnim()
      e.preventDefault()
      isDraggingRef.current = true
      if (trackEl) trackEl.style.cursor = 'grabbing'
      if (thumbEl) { thumbEl.style.cursor = 'grabbing'; thumbEl.style.boxShadow = '0 0 24px var(--accent-cyan)' }
      snapToFrame(frameFromX(e.touches ? e.touches[0].clientX : e.clientX))
      window.addEventListener('mousemove', onDragMove)
      window.addEventListener('mouseup',   onDragEnd)
      window.addEventListener('touchmove', onDragMove, { passive: true })
      window.addEventListener('touchend',  onDragEnd)
    }

    if (trackEl) { trackEl.addEventListener('mousedown', onDragStart); trackEl.addEventListener('touchstart', onDragStart, { passive: false }) }
    if (thumbEl) { thumbEl.addEventListener('mousedown', onDragStart); thumbEl.addEventListener('touchstart', onDragStart, { passive: false }) }

    /* ── canvas RAF loop ── */
    const loop = () => { drawFrame(frameRef.current); rafRef.current = requestAnimationFrame(loop) }

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll,  { passive: true  })
    window.addEventListener('wheel',  onWheel,   { passive: false })

    resize(); updateHUD(1); loop()

    return () => {
      cancelAnim()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel',  onWheel)
      if (trackEl) { trackEl.removeEventListener('mousedown', onDragStart); trackEl.removeEventListener('touchstart', onDragStart) }
      if (thumbEl) { thumbEl.removeEventListener('mousedown', onDragStart); thumbEl.removeEventListener('touchstart', onDragStart) }
      window.removeEventListener('mousemove', onDragMove)
      window.removeEventListener('mouseup',   onDragEnd)
      window.removeEventListener('touchmove', onDragMove)
      window.removeEventListener('touchend',  onDragEnd)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loading])

  /* ─── JSX ─── */
  return (
    <div className="walkthrough-page">
      <div style={{ height: `${SCROLL_VH}vh`, width: '100%', pointerEvents: 'none' }} />

      {/* Preloader */}
      {loading && (
        <div className="walkthrough-loader-overlay">
          <div className="walkthrough-loader-card glass-card">
            <div className="loader-radar-circle">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="4" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-cyan)" strokeWidth="4"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * loadedCount) / TOTAL_FRAMES}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.1s ease' }}
                />
              </svg>
              <div className="loader-percent">{Math.round((loadedCount / TOTAL_FRAMES) * 100)}%</div>
            </div>
            <h3 className="loader-title">Preloading 3D Frames</h3>
            <p  className="loader-subtitle">Preparing your immersive walkthrough…</p>
            <div className="loader-details-bar"><span>{loadedCount}</span> / <span>{TOTAL_FRAMES} frames</span></div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="walkthrough-canvas-container">
        <canvas ref={canvasRef} className="walkthrough-canvas" />
        <div className="canvas-scanner-overlay" />
      </div>

      {/* HUD */}
      {!loading && (
        <>
          <div className="walkthrough-top-hud">
            <button className="walkthrough-back-btn" onClick={onBackToHome}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              <span>Back to Residences</span>
            </button>

            <div className="walkthrough-top-center">
              {/* Room navigation buttons */}
              <div className="room-nav-group">
                {/* Grand Foyer */}
                <button className="room-nav-btn" onClick={() => animScrollToFrame(1)}>
                  Foyer
                </button>

                <div className="room-nav-divider" />

                {/* Living Room → frame 104 */}
                <button className="room-nav-btn" onClick={() => animScrollToFrame(LR_START)}>
                  Living & Dining
                </button>

                <div className="room-nav-divider" />

                {/* Kitchen → frame 180 */}
                <button className="room-nav-btn" onClick={() => animScrollToFrame(180)}>
                  Kitchen
                </button>

                <div className="room-nav-divider" />

                {/* Master Bedroom → frame 245 */}
                <button className="room-nav-btn" onClick={() => animScrollToFrame(245)}>
                  Master Bedroom
                </button>

                <div className="room-nav-divider" />

                {/* Balcony → frame 285 */}
                <button className="room-nav-btn" onClick={() => animScrollToFrame(285)}>
                  Balcony Deck
                </button>
              </div>
            </div>

            <div className="walkthrough-project-badge glass-card">
              <div className="badge-pulsar" />
              <span className="badge-text">{projectName} • Model Suite</span>
            </div>
          </div>

          <div className="walkthrough-spatial-hud glass-card">
            <div className="spatial-accent-line" />
            <div className="spatial-meta">
              <span className="spatial-tag">RESIDENCE TOUR</span>
              <h2 className="spatial-title" ref={spatialTitleRef}>GRAND ENTRANCE</h2>
              <p  className="spatial-desc"  ref={spatialDescRef}>Sleek design, spacious main foyer.</p>
            </div>
            <div className="spatial-frame-counter" ref={frameNumRef}>
              Interactive 360° View
            </div>
          </div>

          <div className="walkthrough-progress-hud glass-card">
            <div className="hud-metric-row">
              <span className="hud-metric-label">EXPLORATION</span>
              <span className="hud-metric-val" ref={progressValRef}>0%</span>
            </div>
            <div className="hud-progress-track">
              <div className="hud-progress-fill" ref={progressFillRef} style={{ width: '0%' }} />
            </div>
            <div className="hud-tip" ref={tipRef}>Scroll up / down to walk through</div>
          </div>

          {/* LR drag track */}
          <div ref={zoneBarRef} className="lr-zone-bar glass-card" style={{ display: 'none' }}>
            <span className="lr-zone-label">LIVING ROOM</span>
            <span className="lr-hint">◀</span>
            <div ref={trackRef} className="lr-track-inner">
              <div className="lr-track-fill" />
              <div ref={thumbRef} className="lr-track-thumb" style={{ left: '0%' }} />
            </div>
            <span className="lr-hint">▶</span>
            <button className="lr-back-btn" title="Glide to end" onClick={() => animScrollToFrame(300)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
              </svg>
            </button>
          </div>

          <div ref={scrollPromptRef} className="walkthrough-scroll-prompt">
            <div className="scroll-prompt-mouse"><div className="scroll-prompt-wheel" /></div>
            <span className="scroll-prompt-text">Scroll Down to Walk Inside</span>
          </div>
        </>
      )}
    </div>
  )
}
