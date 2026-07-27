import PropTypes from 'prop-types'

function Notification({ item, onClose }) {
  if (!item) return null

  return (
    <div className={`notification ${item.type}`} role="status" aria-live="polite">
      <span>{item.message}</span>
      <button type="button" className="btn small ghost" onClick={onClose}>
        Dismiss
      </button>
    </div>
  )
}

Notification.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.oneOf(['success', 'error']).isRequired,
    message: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
}

Notification.defaultProps = {
  item: null,
}

export default Notification
