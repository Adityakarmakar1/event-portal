import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header
      className="glass"
      style={{
        position: 'sticky',
        top: 16,
        zIndex: 20,
        margin: '16px auto 0',
        width: 'calc(100% - 32px)',
        maxWidth: 1180,
        borderRadius: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.4rem',
        }}
      >
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--aurora-crimson), var(--aurora-coral))',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: '#160407',
            }}
          >
            N
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.15rem' }}>
            Nimbus
          </span>
        </NavLink>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
          <NavItem to="/">Home</NavItem>
          <NavItem to="/events">Events</NavItem>
          <NavItem to="/bookings">Bookings</NavItem>
          {user?.role === 'admin' && <NavItem to="/admin">Admin</NavItem>}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      style={({ isActive }) => ({
        fontSize: '0.9rem',
        fontWeight: 500,
        color: isActive ? 'var(--accent-coral)' : 'var(--text-muted)',
        transition: 'color 0.2s ease',
      })}
    >
      {children}
    </NavLink>
  )
}
