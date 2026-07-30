import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearForm, setField } from '../redux/complaintSlice.js'
import ComplaintCompleteness from './ComplaintCompleteness.jsx'

const categoryOptions = [
  'Packaging Defect',
  'Labeling Issue',
  'Product Appearance',
  'Contamination',
  'Adverse Event',
]

const severityOptions = ['Minor', 'Major', 'Critical']
const riskOptions = ['Low', 'Medium', 'High']
const statusOptions = ['Draft', 'Under Review', 'Closed']

function getRiskBadgeClass(riskLevel) {
  const value = (riskLevel || '').toLowerCase()
  if (value === 'high') return 'risk-badge risk-badge--high'
  if (value === 'medium') return 'risk-badge risk-badge--medium'
  if (value === 'low') return 'risk-badge risk-badge--low'
  return 'risk-badge risk-badge--neutral'
}

export default function ComplaintForm() {
  const dispatch = useDispatch()
  const form = useSelector((state) => state.complaint.form)
  const insights = useSelector((state) => state.complaint.insights)
  const aiUpdatedFields = useSelector((state) => state.complaint.aiUpdatedFields)
  const [highlightedFields, setHighlightedFields] = useState([])

  useEffect(() => {
    if (!aiUpdatedFields?.length) return undefined

    const showTimer = window.setTimeout(() => {
      setHighlightedFields(aiUpdatedFields)
    }, 0)

    const hideTimer = window.setTimeout(() => {
      setHighlightedFields([])
    }, 2500)

    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(hideTimer)
    }
  }, [aiUpdatedFields])

  const onChange = (field) => (event) => {
    setHighlightedFields((previous) => previous.filter((item) => item !== field))
    dispatch(
      setField({
        field,
        value: event.target.value,
      }),
    )
  }

  const isHighlighted = (field) => highlightedFields.includes(field)

  const renderLabel = (htmlFor, text, fieldKey) => (
    <label htmlFor={htmlFor} className="field-label">
      <span>{text}</span>
      {isHighlighted(fieldKey) ? (
        <span className="ai-label-icon" title="Updated by AI">
          👾
        </span>
      ) : null}
    </label>
  )

  const onSave = () => {
    window.alert('Complaint saved in local Redux state.')
  }

  return (
    <div className="card fade-in">
      <div className="section-heading">
        <h2>Customer Complaint Form</h2>
        <p className="card-subtitle">
          Capture and track complaint details for pharmaceutical quality review.
        </p>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="complaintId">Complaint ID</label>
          <input id="complaintId" value={form.complaintId} readOnly />
        </div>

        <div className="field">
          {renderLabel('customerName', 'Customer Name', 'customerName')}
          <input
            id="customerName"
            className={isHighlighted('customerName') ? 'ai-updated' : ''}
            value={form.customerName}
            onChange={onChange('customerName')}
            placeholder="Enter customer name"
          />
        </div>

        <div className="field">
          {renderLabel('productName', 'Product Name', 'productName')}
          <input
            id="productName"
            className={isHighlighted('productName') ? 'ai-updated' : ''}
            value={form.productName}
            onChange={onChange('productName')}
            placeholder="Enter product name"
          />
        </div>

        <div className="field">
          {renderLabel('batchNumber', 'Batch Number', 'batchNumber')}
          <input
            id="batchNumber"
            className={isHighlighted('batchNumber') ? 'ai-updated' : ''}
            value={form.batchNumber}
            onChange={onChange('batchNumber')}
            placeholder="Enter batch number"
          />
        </div>

        <div className="field">
          {renderLabel('manufacturingSite', 'Manufacturing Site', 'manufacturingSite')}
          <input
            id="manufacturingSite"
            className={isHighlighted('manufacturingSite') ? 'ai-updated' : ''}
            value={form.manufacturingSite}
            onChange={onChange('manufacturingSite')}
            placeholder="Enter manufacturing site"
          />
        </div>

        <div className="field">
          {renderLabel('complaintDate', 'Complaint Date', 'complaintDate')}
          <input
            id="complaintDate"
            type="date"
            className={isHighlighted('complaintDate') ? 'ai-updated' : ''}
            value={form.complaintDate}
            onChange={onChange('complaintDate')}
          />
        </div>

        <div className="field">
          {renderLabel('complaintCategory', 'Complaint Category', 'complaintCategory')}
          <select
            id="complaintCategory"
            className={isHighlighted('complaintCategory') ? 'ai-updated' : ''}
            value={form.complaintCategory}
            onChange={onChange('complaintCategory')}
          >
            <option value="">Select category</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          {renderLabel('severity', 'Severity', 'severity')}
          <select
            id="severity"
            className={isHighlighted('severity') ? 'ai-updated' : ''}
            value={form.severity}
            onChange={onChange('severity')}
          >
            <option value="">Select severity</option>
            {severityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <div className="field-label-row">
            {renderLabel('riskLevel', 'Risk Level', 'riskLevel')}
            {form.riskLevel ? (
              <span className={getRiskBadgeClass(form.riskLevel)}>{form.riskLevel}</span>
            ) : null}
          </div>
          <select
            id="riskLevel"
            className={isHighlighted('riskLevel') ? 'ai-updated' : ''}
            value={form.riskLevel}
            onChange={onChange('riskLevel')}
          >
            <option value="">Select risk</option>
            {riskOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          {renderLabel('status', 'Status', 'status')}
          <select
            id="status"
            className={isHighlighted('status') ? 'ai-updated' : ''}
            value={form.status}
            onChange={onChange('status')}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="field field-full">
          {renderLabel(
            'complaintDescription',
            'Complaint Description',
            'complaintDescription',
          )}
          <textarea
            id="complaintDescription"
            className={isHighlighted('complaintDescription') ? 'ai-updated' : ''}
            value={form.complaintDescription}
            onChange={onChange('complaintDescription')}
            rows={6}
            placeholder="Describe the complaint in detail"
          />
        </div>
      </div>

      <ComplaintCompleteness />

      <div className="section-heading section-heading--details">
        <h2>Complaint Details</h2>
        <p className="card-subtitle">
          Supporting context for review and follow-up actions.
        </p>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <span className="detail-label">AI Summary</span>
          <p>{insights.summary || 'No AI summary available yet.'}</p>
        </div>
        <div className="detail-card">
          <span className="detail-label">Root Cause Hypothesis</span>
          <p>{insights.rootCause || 'No root cause generated yet.'}</p>
        </div>
        <div className="detail-card detail-card--full">
          <span className="detail-label">CAPA Recommendation</span>
          <p>
            {insights.capaRecommendation || 'No CAPA recommendation generated yet.'}
          </p>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={onSave} type="button">
          Save
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => dispatch(clearForm())}
          type="button"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
