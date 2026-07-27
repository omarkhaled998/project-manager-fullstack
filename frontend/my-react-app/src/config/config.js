export const API_BASE_URL = 'http://localhost:5269/api'

export const TASK_STATUS = {
  TODO: 0,
  IN_PROGRESS: 1,
  DONE: 2,
}

export const TASK_PRIORITY = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.DONE]: 'Done',
}

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
}

export function formatDate(value) {
  if (!value) return 'N/A'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Invalid date'

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function isTaskOverdue(task) {
  if (!task?.dueDate) return false
  if (task.status === TASK_STATUS.DONE) return false

  const now = new Date()
  const dueDate = new Date(task.dueDate)
  return dueDate < now
}
