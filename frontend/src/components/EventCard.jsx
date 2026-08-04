import { useState } from 'react'
import { useEvents } from '../context/EventsContext.jsx'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export default function EventCard({ event, onToast }) {
  const { bookEvent, cancelBookingByEventId, isBooked } = useEvents()
  const [pending, setPending] = useState(false)

  const booked = isBooked(event.id)
  const spotsLeft = event.capacity - event.booked
  const isFull = spotsLeft <= 0

  async function handleBook() {
    setPending(true)
    const result = await bookEvent(event.id)
    setPending(false)
    if (result.ok) {
      onToast?.(`You're in for "${event.title}".`, 'success')
    } else {
      onToast?.(result.error, 'error')
    }
  }

  async function handleCancel() {
    setPending(true)
    const result = await cancelBookingByEventId(event.id)
    setPending(false)
    if (result.ok) {
      onToast?.(`Booking cancelled for "${event.title}".`, 'info')
    } else {
      onToast?.(result.error, 'error')
    }
  }

  let dateLabel = event.date
  try {
    dateLabel = dateFormatter.format(new Date(`${event.date}T00:00:00`))
  } catch {
    /* keep raw string if parsing fails */
  }

  return (
    <div className="glass glass-hover fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 260 }}>
      <div className="glass-sheen" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.8rem' }}>
        <span className="tag tag-accent">{event.category}</span>
        {booked ? (
          <span className="tag tag-booked">Booked</span>
        ) : isFull ? (
          <span className="tag tag-full">Full</span>
        ) : (
          <span className="tag">{spotsLeft} spots left</span>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{event.title}</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {event.description}
        </p>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span>{dateLabel} &middot; {event.time}</span>
        <span>{event.location}</span>
      </div>

      {booked ? (
        <button className="btn btn-ghost" onClick={handleCancel} disabled={pending}>
          Cancel booking
        </button>
      ) : (
        <button className="btn btn-primary" onClick={handleBook} disabled={pending || isFull}>
          {isFull ? 'Sold out' : 'Book event'}
        </button>
      )}
    </div>
  )
}
