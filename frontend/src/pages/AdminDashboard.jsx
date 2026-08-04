import { useState } from 'react'
import { useEvents } from '../context/EventsContext.jsx'
import AuroraBackground from '../components/AuroraBackground.jsx'
import Navbar from '../components/Navbar.jsx'
import EventFormModal from '../components/EventFormModal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export default function AdminDashboard() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents()
  const [modalMode, setModalMode] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  function showToast(message, type) {
    setToast({ message, type })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 2600)
  }

  async function handleSave(data) {
    setSaving(true)
    try {
      if (modalMode === 'add') {
        await addEvent(data)
        showToast(`"${data.title}" created.`, 'success')
      } else if (modalMode?.event) {
        await updateEvent(modalMode.event.id, data)
        showToast(`"${data.title}" updated.`, 'success')
      }
      setModalMode(null)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return
    try {
      await deleteEvent(pendingDelete.id)
      showToast(`"${pendingDelete.title}" deleted.`, 'info')
      setPendingDelete(null)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const sorted = [...events].sort(
    (a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
  )

  return (
    <div className="page">
      <AuroraBackground />
      <Navbar />

      <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Admin dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {events.length} events published. Add, edit, or remove listings below.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setModalMode('add')}>
            + Add event
          </button>
        </div>

        <div className="glass" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                  {['Event', 'Category', 'Date', 'Location', 'Capacity', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '1rem 1.2rem',
                        fontSize: '0.72rem',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--text-faint)',
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((event) => {
                  let dateLabel = event.date
                  try {
                    dateLabel = dateFormatter.format(new Date(`${event.date}T00:00:00`))
                  } catch {
                    /* keep raw */
                  }
                  const full = event.booked >= event.capacity
                  return (
                    <tr key={event.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <div style={{ fontWeight: 600 }}>{event.title}</div>
                      </td>
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <span className="tag">{event.category}</span>
                      </td>
                      <td style={{ padding: '1rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {dateLabel} &middot; {event.time}
                      </td>
                      <td style={{ padding: '1rem 1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {event.location}
                      </td>
                      <td style={{ padding: '1rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                        <span style={{ color: full ? 'var(--danger)' : 'var(--text-primary)' }}>
                          {event.booked}/{event.capacity}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setModalMode({ event })}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setPendingDelete(event)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No events yet. Create your first one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {modalMode && (
        <EventFormModal
          initial={modalMode === 'add' ? null : modalMode.event}
          onSave={handleSave}
          onClose={() => !saving && setModalMode(null)}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this event?"
          message={`"${pendingDelete.title}" will be permanently removed, including its booking count. This can't be undone.`}
          confirmLabel="Delete event"
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} />
    </div>
  )
}
