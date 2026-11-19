import { Link2 } from 'lucide-react'
import './Footer.css'
import { Link } from 'react-router-dom' 

function Footer() {
  // Gets the current year automatically
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">
              <Link2 size={18} />
            </span>
            <span>
              Snip<span className="accent">Stats</span>
            </span>
          </Link>
          <p className="footer-text">
            A URL shortener with analytics, built as a Cloud Computing college project.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/#features">Features</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {year} SnipStats. College project.</p>
      </div>
    </footer>
  )
}

export default Footer