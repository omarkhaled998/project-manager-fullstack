import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import TaskCard from './TaskCard'
import { TASK_PRIORITY, TASK_STATUS } from '../../config/config'

function sortTasks(tasks, sortBy) {
  const copy = [...tasks]

  if (sortBy === 'newest') {
    return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  if (sortBy === 'priority') {
    return copy.sort((a, b) => b.priority - a.priority)
  }

  return copy.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate) - new Date(b.dueDate)
  })
}

function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const statusMatch = statusFilter === 'all' || task.status === Number(statusFilter)
      const priorityMatch =
        priorityFilter === 'all' || task.priority === Number(priorityFilter)
      return statusMatch && priorityMatch
    })

    return sortTasks(filtered, sortBy)
  }, [tasks, statusFilter, priorityFilter, sortBy])

  return (
    <section className="panel">
      <div className="section-header">
        <h3>Tasks</h3>
        <span>{visibleTasks.length} shown</span>
      </div>

      <div className="toolbar">
        <label htmlFor="status-filter">
          Status
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All</option>
            <option value={TASK_STATUS.TODO}>To Do</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.DONE}>Done</option>
          </select>
        </label>

        <label htmlFor="priority-filter">
          Priority
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value="all">All</option>
            <option value={TASK_PRIORITY.LOW}>Low</option>
            <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
            <option value={TASK_PRIORITY.HIGH}>High</option>
          </select>
        </label>

        <label htmlFor="sort-by">
          Sort by
          <select id="sort-by" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
            <option value="newest">Newest</option>
          </select>
        </label>
      </div>

      {visibleTasks.length === 0 ? (
        <p className="empty">No tasks match your filters yet.</p>
      ) : (
        <div className="stack">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </section>
  )
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      status: PropTypes.number.isRequired,
      priority: PropTypes.number.isRequired,
      dueDate: PropTypes.string,
      createdAt: PropTypes.string,
    }),
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
}

export default TaskList
