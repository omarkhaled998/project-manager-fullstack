import PropTypes from 'prop-types'

function TagBadge({ label }) {
  return <span className="tag-badge">#{label}</span>
}

TagBadge.propTypes = {
  label: PropTypes.string.isRequired,
}

export default TagBadge
