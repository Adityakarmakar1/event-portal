import { Link } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground.jsx'

export default function NotFound() {
  return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <AuroraBackground />
      <div
        className="glass fade-in"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 480,
          padding: '3rem 2.4rem',
          margin: '1.5rem',
          textAlign: 'center',
        }}
      >
        <div className="glass-sheen" />
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '4rem',
            fontWeight: 700,
            lineHeight: 1,
            marginBottom: '0.8rem',
            background: 'linear-gradient(135deg, var(--aurora-crimson), var(--aurora-coral))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </p>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Page not found</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.6rem' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </div>
  )
}
