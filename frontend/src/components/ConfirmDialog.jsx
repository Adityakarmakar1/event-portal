export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="glass fade-in"
        style={{ width: '100%', maxWidth: 400, padding: '1.6rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.4rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.7rem' }}>
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
