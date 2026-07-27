import PropTypes from 'prop-types'
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS,
  TASK_STATUS_LABELS,
  formatDate,
  isTaskOverdue,
} from '../../config/config'

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const overdue = isTaskOverdue(task)

  return (
    <article className={`card task-card ${overdue ? 'overdue' : ''}`}>
      <div className="card-header">
        <h4>{task.title}</h4>
        <div className="card-actions">
          <button type="button" className="btn small ghost" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button type="button" className="btn small danger" onClick={() => onDelete(task)}>
            Delete
          </button>
        </div>
      </div>

      <p className="description">{task.description || 'No description provided.'}</p>

      <div className="badge-row">
        <span className={`badge status-${task.status}`}>{TASK_STATUS_LABELS[task.status]}</span>
        <span className={`badge priority-${task.priority}`}>
          {TASK_PRIORITY_LABELS[task.priority]} priority
        </span>
        {overdue && <span className="badge overdue-badge">Overdue</span>}
      </div>

      <div className="meta-row">
        <span>Due: {formatDate(task.dueDate)}</span>
        <span>Created: {formatDate(task.createdAt)}</span>
      </div>

      <label className="inline-select" htmlFor={`status-${task.id}`}>
        Update status
        <select
          id={`status-${task.id}`}
          value={task.status}
          onChange={(event) => onStatusChange(task, Number(event.target.value))}
        >
          <option value={TASK_STATUS.TODO}>To Do</option>
          <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
          <option value={TASK_STATUS.DONE}>Done</option>
        </select>
      </label>
    </article>
  )
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.number.isRequired,
    priority: PropTypes.number.isRequired,
    dueDate: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
}

export default TaskCard
