import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { formatDate } from '../../config/config'

function ProjectCard({ project, onEdit, onDelete }) {
  const totalTasks = project.tasks?.length ?? 0
  const doneTasks = project.tasks?.filter((task) => task.status === 2).length ?? 0

  return (
    <article className="card project-card">
      <div className="card-header">
        <h3>{project.name}</h3>
        <div className="card-actions">
          <button type="button" className="btn small ghost" onClick={() => onEdit(project)}>
            Edit
          </button>
          <button type="button" className="btn small danger" onClick={() => onDelete(project)}>
            Delete
          </button>
        </div>
      </div>

      <p className="description">{project.description || 'No description provided.'}</p>

      <div className="meta-row">
        <span>{totalTasks} tasks</span>
        <span>{doneTasks} done</span>
        <span>Created: {formatDate(project.createdAt)}</span>
      </div>

      <Link to={`/projects/${project.id}`} className="btn">
        View details
      </Link>
    </article>
  )
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.number.isRequired,
      }),
    ),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default ProjectCard
