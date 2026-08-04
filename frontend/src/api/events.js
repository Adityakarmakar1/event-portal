import { apiFetch } from './client.js'

export async function fetchEvents() {
  return apiFetch('/events')
}

export async function createEvent(event) {
  return apiFetch('/events', {
    method: 'POST',
    body: JSON.stringify(event),
  })
}

export async function updateEvent(id, patch) {
  return apiFetch(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  })
}

export async function deleteEvent(id) {
  return apiFetch(`/events/${id}`, { method: 'DELETE' })
}
