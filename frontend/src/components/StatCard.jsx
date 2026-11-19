import './StatCard.css'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-card-icon">
        <Icon size={22} />
      </span>
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    </div>
  )
}

export default StatCard