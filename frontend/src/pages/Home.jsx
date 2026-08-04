import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEvents } from '../context/EventsContext.jsx'
import AuroraBackground from '../components/AuroraBackground.jsx'
import Navbar from '../components/Navbar.jsx'
import EventCard from '../components/EventCard.jsx'
import Toast from '../components/Toast.jsx'

export default function Home() {
  const { user } = useAuth()
  const { events, loading } = useEvents()
  const [toast, setToast] = useState(null)

  function showToast(message, type) {
    setToast({ message, type })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 2600)
  }

  const upcoming = [...events]
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .slice(0, 3)

  const openSpots = events.reduce((sum, e) => sum + Math.max(0, e.capacity - e.booked), 0)

  return (
    <div className="page">
      <AuroraBackground />
      <Navbar />

      <main className="container" style={{ paddingTop: '3.5rem', paddingBottom: '4rem', flex: 1 }}>
        <section
          className="fade-in"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1.4rem',
            marginBottom: '3rem',
          }}
        >
          <span className="tag tag-accent">Welcome back, {user?.name}</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.1rem)', maxWidth: 640, lineHeight: 1.08 }}>
            Find something worth showing up for.
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: 520, lineHeight: 1.6 }}>
            {loading
              ? 'Loading events...'
              : `${events.length} events across the city this season, with ${openSpots.toLocaleString()} open spots remaining. Reserve a seat in a couple of taps.`}
          </p>
          <Link to="/events" className="btn btn-primary">
            Browse all events
          </Link>
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.3rem' }}>Coming up soon</h2>
            <Link to="/events" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
              View all &rarr;
            </Link>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading events...</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.2rem',
              }}
            >
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} onToast={showToast} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Toast message={toast?.message} type={toast?.type} />
    </div>
  )
}
