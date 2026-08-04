import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as bookingsApi from '../api/bookings.js'
import { useEvents } from '../context/EventsContext.jsx'
import AuroraBackground from '../components/AuroraBackground.jsx'
import Navbar from '../components/Navbar.jsx'
import Toast from '../components/Toast.jsx'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export default function Bookings() {
  const { refreshEvents, refreshBookings } = useEvents()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingId, setPendingId] = useState(null)
  const [toast, setToast] = useState(null)

  function showToast(message, type) {
    setToast({ message, type })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 2600)
  }

  useEffect(() => {
    bookingsApi
      .fetchBookings()
      .then(setBookings)
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  async function handleCancel(booking) {
    setPendingId(booking.id)
    try {
      await bookingsApi.cancelBooking(booking.id)
      setBookings((prev) => prev.filter((b) => b.id !== booking.id))
      await Promise.all([refreshEvents(), refreshBookings()])
      showToast(`Cancelled "${booking.title}".`, 'info')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="page">
      <AuroraBackground />
      <Navbar />

      <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>My bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {loading ? 'Loading...' : `${bookings.length} upcoming reservation${bookings.length === 1 ? '' : 's'}.`}
          </p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="glass" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>No bookings yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              Browse events and reserve a spot when something catches your eye.
            </p>
            <Link to="/events" className="btn btn-primary">
              Browse events
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((booking) => {
              let dateLabel = booking.date
              try {
                dateLabel = dateFormatter.format(new Date(`${booking.date}T00:00:00`))
              } catch {
                /* keep raw */
              }

              return (
                <div
                  key={booking.id}
                  className="glass fade-in"
                  style={{
                    padding: '1.4rem 1.6rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <span className="tag tag-accent">{booking.category}</span>
                      <span className="tag tag-booked">Confirmed</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>{booking.title}</h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {dateLabel} &middot; {booking.time} &middot; {booking.location}
                    </p>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleCancel(booking)}
                    disabled={pendingId === booking.id}
                  >
                    {pendingId === booking.id ? 'Cancelling...' : 'Cancel booking'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Toast message={toast?.message} type={toast?.type} />
    </div>
  )
}
