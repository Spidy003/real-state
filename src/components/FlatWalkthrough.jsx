import './FlatWalkthrough.css'
import { useState, useEffect, useRef } from 'react'

const TOTAL_FRAMES = 300
const LR_START = 104
const LR_END = 240
const SCROLL_VH = 420   // lower = less scroll needed per frame
const WHEEL_SPEED = 0.75  // higher = faster scroll response

/* Frames animated per second during Play or room glide */
const ANIM_FPS = 24

const getSectionInfo = (frame) => {
  if (frame <= 60) return { title: 'GRAND ENTRANCE', desc: 'Sleek design, spacious main foyer.' }
  if (frame < LR_START) return { title: 'CORRIDOR & HALLWAY', desc: 'Wide passage with premium tile flooring.' }
  if (frame <= LR_END) return { title: 'EXPANSIVE LIVING ROOM', desc: 'Premium glass partition with high-end ceiling detail.' }
  if (frame <= 270) return { title: 'MASTER BEDROOM SUITE', desc: 'Spacious layout with rich wood panels.' }
  return { title: 'PANORAMIC BALCONY', desc: 'Breathtaking high-floor node vistas.' }
}

const checkPortraitMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 900 && window.innerHeight > window.innerWidth

export default function FlatWalkthrough({ onBackToHome, project }) {
  const [loading, setLoading] = useState(true)
  const [loadedCount, setLoadedCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPortraitMobile, setIsPortraitMobile] = useState(checkPortraitMobile)

  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const frameRef = useRef(1)
  const rafRef = useRef(null)
  const isRotatedRef = useRef(isPortraitMobile)

  /* direct-DOM refs */
  const playerTrackRef = useRef(null)
  const playerFillRef = useRef(null)
  const playerThumbRef = useRef(null)
  const progressValRef = useRef(null)
  const spatialTitleRef = useRef(null)
  const spatialDescRef = useRef(null)
  const frameNumRef = useRef(null)
  const scrollPromptRef = useRef(null)

  const updateHUDRef = useRef(null)
  const isDraggingRef = useRef(false)
  const isAnimRef = useRef(false)
  const animRafRef = useRef(null)

  const projectName = project?.title || 'Aura Heights'

  /* ─── Track portrait mobile for YouTube-like horizontal rotation ─── */
  useEffect(() => {
    const onResize = () => {
      const portrait = checkPortraitMobile()
      isRotatedRef.current = portrait
      setIsPortraitMobile(portrait)
    }
    window.addEventListener('resize', onResize)

    // Attempt native orientation lock if supported (gracefully ignored if not)
    try {
      if (window.innerWidth <= 900 && screen.orientation?.lock) {
        screen.orientation.lock('landscape').catch(() => { })
      }
    } catch (_) { }

    return () => {
      window.removeEventListener('resize', onResize)
      try {
        if (screen.orientation?.unlock) screen.orientation.unlock()
      } catch (_) { }
    }
  }, [])

  /* ─── helpers ─── */
  const scrollableH = () =>
    Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

  const cancelAnim = () => {
    if (animRafRef.current) cancelAnimationFrame(animRafRef.current)
    animRafRef.current = null
    isAnimRef.current = false
    setIsPlaying(false)
  }

  /**
   * Smooth frame glide (used by Play button and room quick-jump buttons).
   */
  const animScrollToFrame = (targetFrame, fps = ANIM_FPS) => {
    cancelAnim()

    const startFrame = frameRef.current
    const totalFrames = Math.abs(targetFrame - startFrame)
    if (totalFrames === 0) return

    const duration = Math.max(800, (totalFrames / fps) * 1000)
    const startTime = performance.now()
    isAnimRef.current = true

    const step = (now) => {
      if (!isAnimRef.current) return

      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const frame = Math.round(startFrame + (targetFrame - startFrame) * progress)
      const clamped = Math.max(1, Math.min(TOTAL_FRAMES, frame))

      frameRef.current = clamped
      const total = scrollableH()
      window.scrollTo(0, ((clamped - 1) / (TOTAL_FRAMES - 1)) * total)
      updateHUDRef.current?.(clamped)

      if (progress < 1) {
        animRafRef.current = requestAnimationFrame(step)
      } else {
        isAnimRef.current = false
        animRafRef.current = null
        setIsPlaying(false)
      }
    }

    animRafRef.current = requestAnimationFrame(step)
  }

  /** Play / Pause toggle for the frame bar */
  const togglePlay = () => {
    if (isAnimRef.current) {
      cancelAnim()
      return
    }
    if (frameRef.current >= TOTAL_FRAMES) {
      frameRef.current = 1
      updateHUDRef.current?.(1)
    }
    setIsPlaying(true)
    animScrollToFrame(TOTAL_FRAMES, ANIM_FPS)
  }

  /** Zero-latency snap (for scrubber drag/tap) */
  const snapToFrame = (n) => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, n))
    const total = scrollableH()
    frameRef.current = clamped
    window.scrollTo(0, ((clamped - 1) / (TOTAL_FRAMES - 1)) * total)
    updateHUDRef.current?.(clamped)
  }

  /* ─── Preload 300 frames ─── */
  useEffect(() => {
    let alive = true
    let done = 0
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
      img.onload = tick
      img.onerror = tick
      imgs.push(img)
    }
    imagesRef.current = imgs
    return () => { alive = false; document.body.style.overflow = 'auto' }
  }, [])

  /* ─── Canvas + scroll + scrubber drag ─── */
  useEffect(() => {
    if (loading) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const drawFrame = (idx) => {
      const img = imagesRef.current[idx - 1]
      if (!img?.complete || !img.naturalWidth) return
      const iR = img.width / img.height
      const cR = canvas.width / canvas.height
      let dw, dh, dx, dy
      if (iR > cR) { dh = canvas.height; dw = dh * iR; dx = (canvas.width - dw) / 2; dy = 0 }
      else { dw = canvas.width; dh = dw / iR; dx = 0; dy = (canvas.height - dh) / 2 }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    const resize = () => {
      if (isRotatedRef.current) {
        canvas.width = window.innerHeight
        canvas.height = window.innerWidth
      } else {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      drawFrame(frameRef.current)
    }

    const updateHUD = (frame) => {
      const pct = Math.round(((frame - 1) / (TOTAL_FRAMES - 1)) * 100)
      const info = getSectionInfo(frame)

      if (playerFillRef.current) playerFillRef.current.style.width = `${pct}%`
      if (playerThumbRef.current) playerThumbRef.current.style.left = `${pct}%`
      if (progressValRef.current) progressValRef.current.textContent = `${pct}%`
      if (spatialTitleRef.current) spatialTitleRef.current.textContent = info.title
      if (spatialDescRef.current) spatialDescRef.current.textContent = info.desc
      if (frameNumRef.current) frameNumRef.current.innerHTML =
        `Frame <span class="highlight-frame">${String(frame).padStart(3, '0')}</span> / ${TOTAL_FRAMES}`
      if (scrollPromptRef.current) scrollPromptRef.current.style.opacity = frame < 15 ? '1' : '0'
    }
    updateHUDRef.current = updateHUD

    const onScroll = () => {
      if (isDraggingRef.current || isAnimRef.current) return
      const pct = Math.max(0, Math.min(1, window.scrollY / scrollableH()))
      const frame = Math.floor(pct * (TOTAL_FRAMES - 1)) + 1
      frameRef.current = frame
      updateHUD(frame)
    }

    const onWheel = (e) => {
      cancelAnim()
      if (isDraggingRef.current) return
      e.preventDefault()
      const f = frameRef.current
      const delta = (f >= LR_START && f <= LR_END && Math.abs(e.deltaX) > 1)
        ? e.deltaX : e.deltaY
      window.scrollBy({ top: delta * WHEEL_SPEED, behavior: 'auto' })
    }

    /* ── Scrubber drag (handles both normal & 90deg rotated mobile portrait) ── */
    const trackEl = playerTrackRef.current
    const thumbEl = playerThumbRef.current

    const frameFromPointer = (clientX, clientY) => {
      if (!trackEl) return 1
      const rect = trackEl.getBoundingClientRect()
      const pct = isRotatedRef.current
        ? Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
        : Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return Math.round(1 + pct * (TOTAL_FRAMES - 1))
    }

    const onDragMove = (e) => {
      if (!isDraggingRef.current) return
      const pt = e.touches ? e.touches[0] : e
      snapToFrame(frameFromPointer(pt.clientX, pt.clientY))
    }

    const onDragEnd = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      window.removeEventListener('mousemove', onDragMove)
      window.removeEventListener('mouseup', onDragEnd)
      window.removeEventListener('touchmove', onDragMove)
      window.removeEventListener('touchend', onDragEnd)
    }

    const onDragStart = (e) => {
      cancelAnim()
      e.preventDefault()
      isDraggingRef.current = true
      const pt = e.touches ? e.touches[0] : e
      snapToFrame(frameFromPointer(pt.clientX, pt.clientY))
      window.addEventListener('mousemove', onDragMove)
      window.addEventListener('mouseup', onDragEnd)
      window.addEventListener('touchmove', onDragMove, { passive: true })
      window.addEventListener('touchend', onDragEnd)
    }

    if (trackEl) {
      trackEl.addEventListener('mousedown', onDragStart)
      trackEl.addEventListener('touchstart', onDragStart, { passive: false })
    }
    if (thumbEl) {
      thumbEl.addEventListener('mousedown', onDragStart)
      thumbEl.addEventListener('touchstart', onDragStart, { passive: false })
    }

    const loop = () => {
      drawFrame(frameRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })

    resize(); updateHUD(frameRef.current); loop()

    return () => {
      cancelAnim()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      if (trackEl) {
        trackEl.removeEventListener('mousedown', onDragStart)
        trackEl.removeEventListener('touchstart', onDragStart)
      }
      if (thumbEl) {
        thumbEl.removeEventListener('mousedown', onDragStart)
        thumbEl.removeEventListener('touchstart', onDragStart)
      }
      window.removeEventListener('mousemove', onDragMove)
      window.removeEventListener('mouseup', onDragEnd)
      window.removeEventListener('touchmove', onDragMove)
      window.removeEventListener('touchend', onDragEnd)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loading, isPortraitMobile])

  return (
    <div className={`walkthrough-page ${isPortraitMobile ? 'walkthrough-page--rotated' : ''}`}>
      <div style={{ height: `${SCROLL_VH}vh`, width: '100%', pointerEvents: 'none' }} />

      {/* Preloader */}
      {loading && (
        <div className="walkthrough-loader-overlay">
          <div className="walkthrough-loader-card glass-card">
            <div className="loader-radar-circle">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(200, 162, 98,0.12)" strokeWidth="4" />
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
            <p className="loader-subtitle">Preparing your immersive walkthrough…</p>
            <div className="loader-details-bar"><span>{loadedCount}</span> / <span>{TOTAL_FRAMES} frames</span></div>
          </div>
        </div>
      )}

      {/* Landscape stage (rotates 90deg in portrait mobile just like YouTube fullscreen) */}
      <div className={`walkthrough-stage ${isPortraitMobile ? 'walkthrough-stage--rotated' : ''}`}>
        <div className="walkthrough-canvas-container">
          <canvas ref={canvasRef} className="walkthrough-canvas" />
          <div className="canvas-scanner-overlay" />
        </div>

        {!loading && (
          <>
            <div className="walkthrough-top-hud">
              <button className="walkthrough-back-btn" onClick={onBackToHome}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back</span>
              </button>

              <div className="walkthrough-top-center">
                <div className="room-nav-group">
                  <button className="room-nav-btn" onClick={() => animScrollToFrame(1)}>Foyer</button>
                  <div className="room-nav-divider" />
                  <button className="room-nav-btn" onClick={() => animScrollToFrame(LR_START)}>Living</button>
                  <div className="room-nav-divider" />
                  <button className="room-nav-btn" onClick={() => animScrollToFrame(180)}>Kitchen</button>
                  <div className="room-nav-divider" />
                  <button className="room-nav-btn" onClick={() => animScrollToFrame(245)}>Bedroom</button>
                  <div className="room-nav-divider" />
                  <button className="room-nav-btn" onClick={() => animScrollToFrame(285)}>Balcony</button>
                </div>
              </div>

              <div className="walkthrough-project-badge glass-card">
                <div className="badge-pulsar" />
                <span className="badge-text">{projectName}</span>
              </div>
            </div>

            <div className="walkthrough-spatial-hud glass-card">
              <div className="spatial-accent-line" />
              <div className="spatial-meta">
                <span className="spatial-tag">3D RESIDENCE TOUR</span>
                <h2 className="spatial-title" ref={spatialTitleRef}>GRAND ENTRANCE</h2>
                <p className="spatial-desc" ref={spatialDescRef}>Sleek design, spacious main foyer.</p>
              </div>
              <div className="spatial-frame-counter" ref={frameNumRef}>
                Frame <span className="highlight-frame">001</span> / {TOTAL_FRAMES}
              </div>
            </div>

            {/* Unified Play/Pause + Frame Scrubber Bar */}
            <div className="walkthrough-player-bar glass-card">
              <button
                type="button"
                className="player-play-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause walkthrough' : 'Play walkthrough'}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <div ref={playerTrackRef} className="player-track">
                <div className="player-track-bg" />
                <div ref={playerFillRef} className="player-track-fill" style={{ width: '0%' }} />
                <div ref={playerThumbRef} className="player-track-thumb" style={{ left: '0%' }} />
              </div>

              <span className="player-pct" ref={progressValRef}>0%</span>
            </div>

            <div ref={scrollPromptRef} className="walkthrough-scroll-prompt">
              <div className="scroll-prompt-mouse"><div className="scroll-prompt-wheel" /></div>
              <span className="scroll-prompt-text">Tap ▶ or Drag Bar to Walk Inside</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
