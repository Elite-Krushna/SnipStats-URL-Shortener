import { useState } from 'react'
import { Link2, Menu, X } from 'lucide-react'
import './Navbar.css'
import { Link, NavLink } from 'react-router-dom'

// The links shown in the navbar. Easy to edit later.
const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/#features' },
  { label: 'Dashboard', to: '/dashboard' },
]

function Navbar() {
  // Remembers whether the mobile menu is open (true) or closed (false)
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-icon">
            <Link2 size={20} />
          </span>
          <span>
            Snip<span className="accent">Stats</span>
          </span>
        </Link>

        {/* Hamburger button (only visible on small screens) */}
        <button
          className="navbar-toggle"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="nav-menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation links */}
        <nav
          id="nav-menu"
          className={`navbar-links ${isOpen ? 'open' : ''}`}
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end
              className={({ isActive }) =>
                `navbar-link${isActive && link.label !== 'Features' ? ' active' : ''}`
              }
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/" className="btn btn-primary navbar-cta" onClick={closeMenu}>
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar