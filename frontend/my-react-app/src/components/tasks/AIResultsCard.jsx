import PropTypes from 'prop-types'
import { TASK_PRIORITY, TASK_PRIORITY_LABELS } from '../../config/config'
import TagBadge from './TagBadge'

function getPriorityClass(priority) {
  if (priority === TASK_PRIORITY.HIGH) return 'priority-high'
  if (priority === TASK_PRIORITY.MEDIUM) return 'priority-medium'
  return 'priority-low'
}

function AIResultsCard({ result, userPriority, onApplyPriority, isStale }) {
  if (!result) return null

  const aiPriority = result.aiSuggestedPriority
  const showApply = aiPriority !== userPriority

  return (
    <section className={`panel ai-results ${isStale ? 'stale' : ''}`} aria-live="polite">
      <div className="section-header ai-header">
        <h3>AI Suggestions</h3>
        {isStale && <span className="badge">Re-analyze recommended</span>}
      </div>

      <div className="ai-grid">
        <article className="ai-item">
          <p className="ai-label">Priority comparison</p>
          <div className="ai-comparison">
            <p>
              Yours: <strong>{TASK_PRIORITY_LABELS[userPriority]}</strong>
            </p>
            <p>
              AI:{' '}
              <span className={`ai-priority ${getPriorityClass(aiPriority)}`}>
                {TASK_PRIORITY_LABELS[aiPriority]}
              </span>
            </p>
          </div>
          {showApply && (
            <button type="button" className="btn small" onClick={() => onApplyPriority(aiPriority)}>
              Apply AI Priority
            </button>
          )}
        </article>

        <article className="ai-item">
          <p className="ai-label">Estimated effort</p>
          <p className="ai-time">{result.aiTimeEstimate || 'Not provided'}</p>
        </article>
      </div>

      <div className="ai-tags">
        <p className="ai-label">Suggested tags</p>
        <div className="tag-list">
          {(result.suggestedTags || []).map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>
      </div>

      <p className="ai-label">Reasoning</p>
      <p className="ai-reasoning">{result.reasoning || 'No reasoning provided.'}</p>
    </section>
  )
}

AIResultsCard.propTypes = {
  result: PropTypes.shape({
    suggestedTags: PropTypes.arrayOf(PropTypes.string),
    aiSuggestedPriority: PropTypes.number,
    aiTimeEstimate: PropTypes.string,
    reasoning: PropTypes.string,
  }),
  userPriority: PropTypes.number.isRequired,
  onApplyPriority: PropTypes.func.isRequired,
  isStale: PropTypes.bool,
}

AIResultsCard.defaultProps = {
  result: null,
  isStale: false,
}

export default AIResultsCard
