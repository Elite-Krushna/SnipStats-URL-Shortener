import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { MousePointerClick } from 'lucide-react'
import './ActivityChart.css'

// "2026-10-19" -> "19 Oct"
function shortDay(day) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

function ActivityChart({ activity }) {
  const hasClicks = activity.some((point) => point.clicks > 0)

  // Empty state: no recorded clicks in this period
  if (!hasClicks) {
    return (
      <div className="chart-empty">
        <MousePointerClick size={32} />
        <p>No clicks recorded in the last {activity.length} days yet.</p>
        <p className="chart-empty-hint">Open one of your short links and the chart will fill in.</p>
      </div>
    )
  }

  const data = activity.map((point) => ({ ...point, label: shortDay(point.day) }))

  return (
    <div 
        className="chart-card"
        role="img"
        aria-label={`Bar chart of clicks per day. ${data
            .map((point) => `${point.label}: ${point.clicks}`)
            .join(', ')}.`}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="rgba(167, 139, 250, 0.12)" vertical={false} />
          <XAxis dataKey="label" stroke="#9a94bb" tickLine={false} />
          <YAxis stroke="#9a94bb" allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
            contentStyle={{
              background: '#0a0418',
              border: '1px solid rgba(167, 139, 250, 0.3)',
              borderRadius: 8,
              color: '#ece8f8',
            }}
            formatter={(value) => [value, 'Clicks']}
          />
          <Bar dataKey="clicks" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ActivityChart