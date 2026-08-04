import Event from '../models/Event.js'
import Booking from '../models/Booking.js'

function formatEvent(event) {
  return {
    id: event._id,
    title: event.title,
    category: event.category,
    date: event.date,
    time: event.time,
    location: event.location,
    capacity: event.capacity,
    booked: event.booked,
    description: event.description,
  }
}

export async function getEvents(req, res, next) {
  try {
    const events = await Event.find().sort({ date: 1, time: 1 })
    res.json(events.map(formatEvent))
  } catch (err) {
    next(err)
  }
}

export async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(formatEvent(event))
  } catch (err) {
    next(err)
  }
}

export async function createEvent(req, res, next) {
  try {
    const { title, category, date, time, location, capacity, description } = req.body

    if (!title?.trim() || !category || !date || !time || !location?.trim() || !capacity) {
      return res.status(400).json({ message: 'All event fields are required' })
    }

    const event = await Event.create({
      title: title.trim(),
      category,
      date,
      time,
      location: location.trim(),
      capacity: Number(capacity),
      description: description || '',
      booked: 0,
    })

    res.status(201).json(formatEvent(event))
  } catch (err) {
    next(err)
  }
}

export async function updateEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const { title, category, date, time, location, capacity, description } = req.body
    const nextCapacity = capacity !== undefined ? Number(capacity) : event.capacity

    if (nextCapacity < event.booked) {
      return res.status(400).json({
        message: `Capacity can't be below ${event.booked} already booked`,
      })
    }

    if (title !== undefined) event.title = title.trim()
    if (category !== undefined) event.category = category
    if (date !== undefined) event.date = date
    if (time !== undefined) event.time = time
    if (location !== undefined) event.location = location.trim()
    if (capacity !== undefined) event.capacity = nextCapacity
    if (description !== undefined) event.description = description

    await event.save()
    res.json(formatEvent(event))
  } catch (err) {
    next(err)
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    await Booking.deleteMany({ event: event._id })
    await event.deleteOne()
    res.json({ message: 'Event deleted' })
  } catch (err) {
    next(err)
  }
}
