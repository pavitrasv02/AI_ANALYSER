import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const REQUIRED_FIELDS = [
  { key: 'customerName', label: 'Customer Name' },
  { key: 'productName', label: 'Product Name' },
  { key: 'batchNumber', label: 'Batch Number' },
  { key: 'manufacturingSite', label: 'Manufacturing Site' },
  { key: 'complaintDate', label: 'Complaint Date' },
  { key: 'complaintCategory', label: 'Complaint Category' },
  { key: 'severity', label: 'Severity' },
  { key: 'riskLevel', label: 'Risk Level' },
  { key: 'complaintDescription', label: 'Complaint Description' },
]

function isFilled(value) {
  return typeof value === 'string' && value.trim() !== ''
}

function getBarTone(percent) {
  if (percent <= 50) return 'is-low'
  if (percent <= 80) return 'is-medium'
  return 'is-high'
}

export default function ComplaintCompleteness() {
  const form = useSelector((state) => state.complaint.form)

  const { percent, missingLabels } = useMemo(() => {
    const missing = REQUIRED_FIELDS.filter((field) => !isFilled(form[field.key]))
    const filledCount = REQUIRED_FIELDS.length - missing.length
    const score = Math.round((filledCount / REQUIRED_FIELDS.length) * 100)

    return {
      percent: score,
      missingLabels: missing.map((field) => field.label),
    }
  }, [form])

  const tone = getBarTone(percent)
  const isComplete = percent === 100

  return (
    <section className="completeness-card fade-in">
      <div className="completeness-card__header">
        <div>
          <h3>Complaint Completeness</h3>
          <p>Live check of required QMS complaint fields.</p>
        </div>
        <div className={`completeness-score completeness-score--${tone}`}>
          {percent}%
        </div>
      </div>

      <div className="completeness-bar" aria-hidden="true">
        <div
          className={`completeness-bar__fill ${tone}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="completeness-missing">
        <h4>Missing Information</h4>
        {isComplete ? (
          <p className="completeness-complete">
            ✅ Complaint information is complete.
          </p>
        ) : (
          <ul>
            {missingLabels.map((label) => (
              <li key={label}>⚠ Missing {label}</li>
            ))}
          </ul>
        )}
      </div>

      {isComplete ? (
        <div className="ready-badge" role="status">
          🟢 Ready for Quality Review
        </div>
      ) : null}
    </section>
  )
}
