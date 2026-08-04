import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AuroraBackground from '../components/AuroraBackground.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setPending(true)
    const result = await register(name, email, password)
    setPending(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/', { replace: true })
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
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>Create an account</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Join Nimbus to discover and book events.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Lee"
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              placeholder="At least 6 characters"
            />
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              className="input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.82rem', color: 'var(--danger)' }}>{error}</p>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.4rem' }} disabled={pending}>
            {pending ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.4rem', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-cyan)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
