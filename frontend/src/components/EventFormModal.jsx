import { useState } from 'react'

const CATEGORIES = ['Music', 'Conference', 'Food', 'Sports', 'Arts', 'Business', 'Other']

const emptyForm = {
  title: '',
  category: 'Music',
  date: '',
  time: '',
  location: '',
  capacity: 100,
  description: '',
}

export default function EventFormModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => (initial ? { ...initial } : { ...emptyForm }))
  const [errors, setErrors] = useState({})
  const isEdit = Boolean(initial)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    if (!form.date) next.date = 'Pick a date.'
    if (!form.time) next.time = 'Pick a time.'
    if (!form.location.trim()) next.location = 'Location is required.'
    if (!form.capacity || Number(form.capacity) <= 0) next.capacity = 'Capacity must be greater than 0.'
    if (isEdit && initial.booked > Number(form.capacity)) {
      next.capacity = `Capacity can't be below ${initial.booked} already booked.`
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSave({ ...form, capacity: Number(form.capacity) })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass fade-in"
        style={{ width: '100%', maxWidth: 560, padding: '1.8rem', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1.4rem' }}>
          {isEdit ? 'Edit event' : 'Add a new event'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              className="input"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Aurora Sound Festival"
            />
            {errors.title && <FieldError text={errors.title} />}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                className="input"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                style={{ colorScheme: 'dark' }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="capacity">Capacity</label>
              <input
                id="capacity"
                type="number"
                min="1"
                className="input"
                value={form.capacity}
                onChange={(e) => update('capacity', e.target.value)}
              />
              {errors.capacity && <FieldError text={errors.capacity} />}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="field">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                className="input"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                style={{ colorScheme: 'dark' }}
              />
              {errors.date && <FieldError text={errors.date} />}
            </div>
            <div className="field">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                className="input"
                value={form.time}
                onChange={(e) => update('time', e.target.value)}
                style={{ colorScheme: 'dark' }}
              />
              {errors.time && <FieldError text={errors.time} />}
            </div>
          </div>

          <div className="field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              className="input"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="e.g. Harborlight Amphitheatre"
            />
            {errors.location && <FieldError text={errors.location} />}
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="What should attendees expect?"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.7rem', marginTop: '0.4rem' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save changes' : 'Create event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FieldError({ text }) {
  return <span style={{ fontSize: '0.76rem', color: 'var(--danger)' }}>{text}</span>
}
