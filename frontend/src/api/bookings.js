import { apiFetch } from './client.js'

export async function fetchBookings() {
  return apiFetch('/bookings')
}

export async function fetchBookedEventIds() {
  return apiFetch('/bookings/event-ids')
}

export async function bookEvent(eventId) {
  return apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify({ eventId }),
  })
}

export async function cancelBooking(bookingId) {
  return apiFetch(`/bookings/${bookingId}`, { method: 'DELETE' })
}
