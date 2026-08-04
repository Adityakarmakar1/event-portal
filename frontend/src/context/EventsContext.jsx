import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as eventsApi from '../api/events.js'
import * as bookingsApi from '../api/bookings.js'
import { useAuth } from './AuthContext.jsx'

const EventsContext = createContext(null)

export function EventsProvider({ children }) {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [bookedEventIds, setBookedEventIds] = useState([])
  const [loading, setLoading] = useState(true)

  const refreshEvents = useCallback(async () => {
    const data = await eventsApi.fetchEvents()
    setEvents(data)
    return data
  }, [])

  const refreshBookings = useCallback(async () => {
    if (!user) {
      setBookedEventIds([])
      return []
    }
    const ids = await bookingsApi.fetchBookedEventIds()
    setBookedEventIds(ids)
    return ids
  }, [user])

  useEffect(() => {
    setLoading(true)
    Promise.all([refreshEvents(), refreshBookings()])
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [refreshEvents, refreshBookings])

  async function addEvent(event) {
    const created = await eventsApi.createEvent(event)
    setEvents((prev) => [...prev, created])
    return created
  }

  async function updateEvent(id, patch) {
    const updated = await eventsApi.updateEvent(id, patch)
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)))
    return updated
  }

  async function deleteEvent(id) {
    await eventsApi.deleteEvent(id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setBookedEventIds((prev) => prev.filter((eventId) => eventId !== id))
  }

  function isBooked(eventId) {
    return bookedEventIds.includes(eventId)
  }

  async function bookEvent(eventId) {
    try {
      await bookingsApi.bookEvent(eventId)
      setBookedEventIds((prev) => [...prev, eventId])
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, booked: e.booked + 1 } : e))
      )
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  async function cancelBookingByEventId(eventId) {
    try {
      const bookings = await bookingsApi.fetchBookings()
      const booking = bookings.find((b) => b.eventId === eventId)
      if (!booking) return { ok: false, error: 'Booking not found' }

      await bookingsApi.cancelBooking(booking.id)
      setBookedEventIds((prev) => prev.filter((id) => id !== eventId))
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, booked: Math.max(0, e.booked - 1) } : e
        )
      )
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  return (
    <EventsContext.Provider
      value={{
        events,
        loading,
        refreshEvents,
        refreshBookings,
        addEvent,
        updateEvent,
        deleteEvent,
        bookEvent,
        cancelBookingByEventId,
        isBooked,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used within EventsProvider')
  return ctx
}
