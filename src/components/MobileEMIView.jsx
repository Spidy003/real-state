import { useState, useMemo } from 'react'
import './MobileEMIView.css'

const formatCurrency = (val) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

export default function MobileEMIView({ project, onBack, onOpenVisitModal }) {
  const configs = Object.keys(project.basePrices)
  const [selectedConfig, setSelectedConfig] = useState(configs[0])
  const [downPayPct, setDownPayPct] = useState(20)
  const [tenureYears, setTenureYears] = useState(20)
  const [interestRate, setInterestRate] = useState(8.5)

  const basePrice = project.basePrices[selectedConfig] || 5000000

  const downPaymentAmount = useMemo(() => Math.round(basePrice * downPayPct / 100), [basePrice, downPayPct])
  const loanPrincipal = useMemo(() => basePrice - downPaymentAmount, [basePrice, downPaymentAmount])

  const emiResults = useMemo(() => {
    const P = loanPrincipal
    const r = interestRate / 12 / 100
    const n = tenureYears * 12
    if (P <= 0) return { emi: 0, totalInterest: 0, totalPayable: 0, principalPct: 100, interestPct: 0 }
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayable = emi * n
    const totalInterest = totalPayable - P
    const principalPct = Math.round((P / totalPayable) * 100)
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
      principalPct,
      interestPct: 100 - principalPct,
    }
  }, [loanPrincipal, interestRate, tenureYears])

  return (
    <div className="memi">
      {/* Header */}
      <div className="memi__header">
        <button className="memi__back" onClick={onBack} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="memi__header-text">
          <span className="memi__header-title">EMI Calculator</span>
          <span className="memi__header-sub">{project.title} · {project.location.split(',')[0]}</span>
        </div>
        <span className="memi__header-icon">📊</span>
      </div>

      <div className="memi__scroll">
        {/* BHK Selector */}
        <div className="memi__section">
          <div className="memi__section-label">Select Configuration</div>
          <div className="memi__config-row">
            {configs.map(c => (
              <button
                key={c}
                className={`memi__config-btn ${selectedConfig === c ? 'active' : ''}`}
                onClick={() => setSelectedConfig(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Base price display */}
        <div className="memi__price-card">
          <span className="memi__price-label">Base Price</span>
          <span className="memi__price-val">{formatCurrency(basePrice)}</span>
        </div>

        {/* Sliders */}
        <div className="memi__section">
          <div className="memi__section-label">Loan Parameters</div>

          <div className="memi__slider-group">
            <div className="memi__slider-row">
              <span className="memi__slider-name">Down Payment ({downPayPct}%)</span>
              <span className="memi__slider-val">{formatCurrency(downPaymentAmount)}</span>
            </div>
            <input type="range" min="10" max="90" step="5" value={downPayPct}
              onChange={e => setDownPayPct(Number(e.target.value))} className="memi__slider" />
            <div className="memi__slider-limits"><span>10%</span><span>90%</span></div>
          </div>

          <div className="memi__slider-group">
            <div className="memi__slider-row">
              <span className="memi__slider-name">Interest Rate (p.a.)</span>
              <span className="memi__slider-val">{interestRate}%</span>
            </div>
            <input type="range" min="7.0" max="12.0" step="0.1" value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))} className="memi__slider" />
            <div className="memi__slider-limits"><span>7.0%</span><span>12.0%</span></div>
          </div>

          <div className="memi__slider-group">
            <div className="memi__slider-row">
              <span className="memi__slider-name">Loan Tenure</span>
              <span className="memi__slider-val">{tenureYears} Years</span>
            </div>
            <input type="range" min="5" max="30" step="1" value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))} className="memi__slider" />
            <div className="memi__slider-limits"><span>5 yrs</span><span>30 yrs</span></div>
          </div>
        </div>

        {/* Result card */}
        <div className="memi__result-card">
          <div className="memi__emi-row">
            <span className="memi__emi-label">Monthly EMI</span>
            <span className="memi__emi-value">{formatCurrency(emiResults.emi)}<span className="memi__emi-mo">/mo</span></span>
          </div>

          {/* Ratio bar */}
          <div className="memi__ratio-labels">
            <span>Principal: {emiResults.principalPct}%</span>
            <span>Interest: {emiResults.interestPct}%</span>
          </div>
          <div className="memi__ratio-bar">
            <div className="memi__bar-p" style={{ width: `${emiResults.principalPct}%` }} />
            <div className="memi__bar-i" style={{ width: `${emiResults.interestPct}%` }} />
          </div>

          {/* Breakdown */}
          <div className="memi__breakdown">
            <div className="memi__breakdown-item">
              <span className="memi__bd-label">Principal Loan</span>
              <span className="memi__bd-val">{formatCurrency(loanPrincipal)}</span>
            </div>
            <div className="memi__breakdown-item">
              <span className="memi__bd-label">Total Interest</span>
              <span className="memi__bd-val">{formatCurrency(emiResults.totalInterest)}</span>
            </div>
            <div className="memi__breakdown-item">
              <span className="memi__bd-label">Total Payable</span>
              <span className="memi__bd-val">{formatCurrency(emiResults.totalPayable)}</span>
            </div>
            <div className="memi__breakdown-item">
              <span className="memi__bd-label">Down Payment</span>
              <span className="memi__bd-val">{formatCurrency(downPaymentAmount)}</span>
            </div>
          </div>

          {/* Banks */}
          <div className="memi__banks-strip">
            <span className="memi__banks-label">Pre-Approved Banks:</span>
            <div className="memi__banks-row">
              {['SBI @ 8.50%', 'HDFC @ 8.55%', 'ICICI @ 8.60%'].map(b => (
                <span key={b} className="memi__bank-pill">{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="memi__cta" onClick={onOpenVisitModal}>
          Get Home Loan Assistance — Book Site Visit
        </button>

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
