import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <Link to="/" className="brand">
          Project Tracker
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Projects
          </NavLink>
        </nav>

        <button type="button" className="btn ghost" onClick={onToggleTheme}>
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </button>
      </div>
    </header>
  )
}

Navbar.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
}

export default Navbar
