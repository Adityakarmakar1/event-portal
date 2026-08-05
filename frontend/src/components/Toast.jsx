const COLORS = {
  success: { bg: 'rgba(52, 211, 153, 0.14)', border: 'rgba(52, 211, 153, 0.45)', text: '#bdf5ea' },
  error: { bg: 'rgba(255, 77, 109, 0.14)', border: 'rgba(255, 77, 109, 0.45)', text: '#ffb3c1' },
  info: { bg: 'rgba(255, 107, 74, 0.14)', border: 'rgba(255, 107, 74, 0.45)', text: '#ffd3cb' },
}

export default function Toast({ message, type = 'info' }) {
  if (!message) return null
  const c = COLORS[type] || COLORS.info
  return (
    <div
      className="toast glass"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
    >
      {message}
    </div>
  )
}
