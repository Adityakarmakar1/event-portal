import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nimbus'
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  console.log('MongoDB connected')
}
