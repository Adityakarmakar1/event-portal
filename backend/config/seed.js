import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Event from '../models/Event.js'
import { connectDB } from './db.js'

dotenv.config()

const SEED_EVENTS = [
  {
    title: 'Aurora Sound Festival',
    category: 'Music',
    date: '2026-09-12',
    time: '18:00',
    location: 'Harborlight Amphitheatre',
    capacity: 400,
    booked: 362,
    description:
      'An open-air night of ambient and electronic acts, closing with a synchronized light show over the water.',
  },
  {
    title: 'Product Design Summit',
    category: 'Conference',
    date: '2026-09-20',
    time: '09:30',
    location: 'Meridian Convention Center',
    capacity: 250,
    booked: 118,
    description:
      'Two tracks on interface craft and design systems, with hands-on critique sessions in the afternoon.',
  },
  {
    title: 'Night Market: Street Eats',
    category: 'Food',
    date: '2026-08-29',
    time: '17:00',
    location: 'Lower Dockside Lane',
    capacity: 600,
    booked: 600,
    description:
      'Forty stalls, live cooking demos, and a communal seating pavilion strung with lanterns.',
  },
  {
    title: 'Marathon for the Bay',
    category: 'Sports',
    date: '2026-10-04',
    time: '06:45',
    location: 'Bayfront Promenade',
    capacity: 1200,
    booked: 540,
    description:
      'A charity run along the waterfront with 5K, 10K, and full marathon routes, ending at Founders Pier.',
  },
  {
    title: 'Glasswork & Ceramics Fair',
    category: 'Arts',
    date: '2026-09-06',
    time: '11:00',
    location: 'The Kiln District',
    capacity: 180,
    booked: 74,
    description:
      'Independent makers showing hand-blown glass and thrown ceramics, with live demonstrations all day.',
  },
  {
    title: 'Startup Pitch Night',
    category: 'Business',
    date: '2026-09-27',
    time: '19:00',
    location: 'Beacon Tower, 30th Floor',
    capacity: 150,
    booked: 149,
    description:
      'Eight early-stage founders pitch to a panel of investors, followed by an open networking hour.',
  },
]

async function seed() {
  await connectDB()

  const adminEmail = 'admin@nimbus.app'
  let admin = await User.findOne({ email: adminEmail })
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
    })
    console.log('Created admin user: admin@nimbus.app / admin123')
  } else {
    console.log('Admin user already exists')
  }

  const eventCount = await Event.countDocuments()
  if (eventCount === 0) {
    await Event.insertMany(SEED_EVENTS)
    console.log(`Seeded ${SEED_EVENTS.length} events`)
  } else {
    console.log(`Events already seeded (${eventCount} found)`)
  }

  await mongoose.disconnect()
  console.log('Seed complete')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
