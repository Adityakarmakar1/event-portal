import Booking from '../models/Booking.js'
import Event from '../models/Event.js'

function formatBooking(booking) {
  const event = booking.event
  return {
    id: booking._id,
    eventId: event._id,
    title: event.title,
    category: event.category,
    date: event.date,
    time: event.time,
    location: event.location,
    capacity: event.capacity,
    booked: event.booked,
    description: event.description,
    createdAt: booking.createdAt,
  }
}

export async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 })

    res.json(bookings.filter((b) => b.event).map(formatBooking))
  } catch (err) {
    next(err)
  }
}

export async function createBooking(req, res, next) {
  try {
    const { eventId } = req.body
    if (!eventId) {
      return res.status(400).json({ message: 'eventId is required' })
    }

    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const existing = await Booking.findOne({ user: req.user._id, event: eventId })
    if (existing) {
      return res.status(409).json({ message: 'Already booked' })
    }

    if (event.booked >= event.capacity) {
      return res.status(409).json({ message: 'This event is full' })
    }

    const booking = await Booking.create({ user: req.user._id, event: eventId })
    event.booked += 1
    await event.save()

    await booking.populate('event')
    res.status(201).json(formatBooking(booking))
  } catch (err) {
    next(err)
  }
}

export async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const event = await Event.findById(booking.event)
    if (event) {
      event.booked = Math.max(0, event.booked - 1)
      await event.save()
    }

    await booking.deleteOne()
    res.json({ message: 'Booking cancelled' })
  } catch (err) {
    next(err)
  }
}

export async function getBookedEventIds(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id }).select('event')
    res.json(bookings.map((b) => String(b.event)))
  } catch (err) {
    next(err)
  }
}
