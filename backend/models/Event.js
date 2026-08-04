import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    booked: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Event', eventSchema)
