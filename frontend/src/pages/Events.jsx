import { useMemo, useState } from 'react'
import { useEvents } from '../context/EventsContext.jsx'
import AuroraBackground from '../components/AuroraBackground.jsx'
import Navbar from '../components/Navbar.jsx'
import EventCard from '../components/EventCard.jsx'
import Toast from '../components/Toast.jsx'

export default function Events() {
  const { events, loading } = useEvents()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [toast, setToast] = useState(null)

  function showToast(message, type) {
    setToast({ message, type })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 2600)
  }

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(events.map((e) => e.category)))],
    [events]
  )

  const filtered = useMemo(() => {
    return events
      .filter((e) => (category === 'All' ? true : e.category === category))
      .filter((e) => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return (
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
  }, [events, query, category])

  return (
    <div className="page">
      <AuroraBackground />
      <Navbar />

      <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>All events</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {loading ? 'Loading...' : `${filtered.length} of ${events.length} events match your filters.`}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            alignItems: 'center',
          }}
        >
          <input
            className="input"
            style={{ maxWidth: 320, flex: '1 1 240px' }}
            placeholder="Search by name, venue, or keyword"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={c === category ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading events...</p>
        ) : filtered.length === 0 ? (
          <div className="glass" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>No events match yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Try a different keyword or clear the category filter.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.2rem',
            }}
          >
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} onToast={showToast} />
            ))}
          </div>
        )}
      </main>

      <Toast message={toast?.message} type={toast?.type} />
    </div>
  )
}
