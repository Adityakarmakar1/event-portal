import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AuroraBackground from '../components/AuroraBackground.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setPending(true)
    const result = await login(email, password)
    setPending(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const dest = location.state?.from || '/'
    navigate(dest, { replace: true })
  }

  return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <AuroraBackground />
      <div
        className="glass fade-in"
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '2.4rem', margin: '1.5rem' }}
      >
        <div className="glass-sheen" />
        <div style={{ marginBottom: '1.8rem' }}>
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: 'linear-gradient(135deg, var(--aurora-crimson), var(--aurora-coral))',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#160407',
              marginBottom: '1rem',
            }}
          >
            N
          </span>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>Welcome to Nimbus</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Sign in to browse and book upcoming events.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.82rem', color: 'var(--danger)' }}>{error}</p>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.4rem' }} disabled={pending}>
            {pending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.4rem', textAlign: 'center' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-coral)' }}>
            Create one
          </Link>
        </p>

        <p style={{ fontSize: '0.76rem', color: 'var(--text-faint)', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
          Admin: admin@nimbus.app / admin123
        </p>
      </div>
    </div>
  )
}
