const COLORS = {
  success: { bg: 'rgba(94, 234, 212, 0.14)', border: 'rgba(94, 234, 212, 0.45)', text: '#bdf5ea' },
  error: { bg: 'rgba(255, 107, 129, 0.14)', border: 'rgba(255, 107, 129, 0.45)', text: '#ffc2cc' },
  info: { bg: 'rgba(182, 163, 255, 0.14)', border: 'rgba(182, 163, 255, 0.45)', text: '#ded4ff' },
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
