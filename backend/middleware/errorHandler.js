export function errorHandler(err, req, res, next) {
  console.error(err)

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    return res.status(409).json({ message: `${field} already exists` })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' })
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  })
}
