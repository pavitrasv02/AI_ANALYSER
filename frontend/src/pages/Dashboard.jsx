import AICopilot from '../components/AICopilot.jsx'
import ComplaintForm from '../components/ComplaintForm.jsx'

export default function Dashboard() {
  return (
    <div className="app-shell fade-in">
      <header className="top-header">
        <p className="eyebrow">Pharmaceutical QMS</p>
        <h1>Customer Complaint Management</h1>
        <p className="subtitle">
          Capture complaint details and prepare for AI-assisted quality review.
        </p>
      </header>

      <main className="dashboard-grid">
        <section className="left-panel">
          <ComplaintForm />
        </section>
        <aside className="right-panel">
          <AICopilot />
        </aside>
      </main>
    </div>
  )
}
