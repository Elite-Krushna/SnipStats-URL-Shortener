import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap' 
import { Link } from 'react-router-dom'
import { BarChart3, Link2, MousePointerClick } from 'lucide-react'
import StatCard from '../components/StatCard'
import LinksTable from '../components/LinksTable'
import ActivityChart from '../components/ActivityChart'
import { getActivity, getLinks, getStats } from '../services/api'
import './DashboardPage.css'

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [links, setLinks] = useState([])
  const [activity, setActivity] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const pageRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [statsData, linksData, activityData] = await Promise.all([
            getStats(),
            getLinks(50),
            getActivity(7),
        ])
        if (cancelled) return
        setStats(statsData)
        setLinks(linksData.links)
        setActivity(activityData.activity)
        setStatus('ready')
      } catch (error) {
        if (cancelled) return
        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])
  // Fade-in once the data has loaded (skipped if reduced motion is preferred)
    useEffect(() => {
    if (status !== 'ready') return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.stat-card, .chart-card, .chart-empty, .links-table-wrap, .dashboard-empty', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
        })
    }, pageRef)
    return () => mm.revert()
    }, [status])

  return (
    <section className="dashboard container" ref={pageRef}>
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">Real data from your SQLite database.</p>

      {status === 'loading' && <p className="dashboard-message">Loading...</p>}

      {status === 'error' && (
        <p className="hero-error" role="alert">
          {errorMessage}
        </p>
      )}

      {status === 'ready' && (
        <>
        <div className="dashboard-stats">
            <StatCard icon={Link2} label="Total links" value={stats.totalLinks} />
            <StatCard icon={MousePointerClick} label="Total clicks" value={stats.totalClicks} />
        </div>

        <h2 className="dashboard-heading">Clicks over the last 7 days</h2>
        <ActivityChart activity={activity} />

        <h2 className="dashboard-heading">Recent links</h2>

          {links.length === 0 ? (
            <div className="dashboard-empty">
              <BarChart3 size={32} />
              <p>No links yet. Create your first short link to see it here.</p>
              <Link to="/" className="btn btn-primary">
                Shorten a URL
              </Link>
            </div>
          ) : (
            <LinksTable links={links} />
          )}
        </>
      )}
    </section>
  )
}

export default DashboardPage