import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { TASK_PRIORITY, TASK_STATUS } from '../../config/config'
import { projectService } from '../../services/projectService'
import { useAIAnalysis } from '../../hooks/useAIAnalysis'
import AIAnalysisButton from './AIAnalysisButton'
import AIResultsCard from './AIResultsCard'

const DEFAULT_VALUES = {
  projectId: '',
  title: '',
  description: '',
  status: TASK_STATUS.TODO,
  priority: TASK_PRIORITY.MEDIUM,
  dueDate: '',
}

function toDateInputValue(value) {
  if (!value) return ''

  if (typeof value === 'string') {
    const isoDateMatch = value.match(/^(\d{4}-\d{2}-\d{2})/)
    if (isoDateMatch) {
      return isoDateMatch[1]
    }
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getTodayDateInputValue() {
  const now = new Date()
  const timezoneOffsetMs = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().split('T')[0]
}

function toUtcIsoDate(dateInput) {
  if (!dateInput) return null

  const [year, month, day] = dateInput.split('-').map(Number)
  if (!year || !month || !day) return null

  return new Date(Date.UTC(year, month - 1, day)).toISOString()
}

function TaskForm({ projectId, initialValues, onSubmit, onCancel, isSaving, submitLabel }) {
  const [values, setValues] = useState(DEFAULT_VALUES)
  const [errors, setErrors] = useState({})
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState('')

  const {
    aiResults,
    isAnalyzing,
    error: aiError,
    analyze,
    clearError,
    getIsStale,
    reset: resetAI,
  } = useAIAnalysis()

  const todayDateValue = getTodayDateInputValue()
  const initialDueDateValue = toDateInputValue(initialValues?.dueDate)
  const dueDateMinValue =
    initialDueDateValue && initialDueDateValue < todayDateValue
      ? initialDueDateValue
      : todayDateValue

  useEffect(() => {
    setValues({
      projectId: initialValues?.projectId ?? projectId ?? '',
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      status: initialValues?.status ?? TASK_STATUS.TODO,
      priority: initialValues?.priority ?? TASK_PRIORITY.MEDIUM,
      dueDate: toDateInputValue(initialValues?.dueDate),
    })
    // Reset AI analysis when switching to a different task
    resetAI()
  }, [initialValues, projectId, resetAI])

  useEffect(() => {
    let isMounted = true

    async function loadProjects() {
      setProjectsLoading(true)
      setProjectsError('')

      try {
        const data = await projectService.getAllProjects()
        if (!isMounted) return
        setProjects(data)
      } catch (error) {
        if (!isMounted) return
        setProjectsError(error.message || 'Failed to load projects.')
      } finally {
        if (isMounted) {
          setProjectsLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      isMounted = false
    }
  }, [])

  function validate() {
    const nextErrors = {}

    if (!values.title.trim()) {
      nextErrors.title = 'Task title is required.'
    }

    if (!values.projectId) {
      nextErrors.projectId = 'Please select a project.'
    }

    if (values.title.trim().length > 120) {
      nextErrors.title = 'Task title must be 120 characters or less.'
    }

    if (values.description.trim().length > 500) {
      nextErrors.description = 'Description must be 500 characters or less.'
    }

    if (
      values.dueDate &&
      values.dueDate < todayDateValue &&
      (!initialDueDateValue || values.dueDate !== initialDueDateValue)
    ) {
      nextErrors.dueDate = 'Due date cannot be in the past.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({
      ...prev,
      [name]:
        name === 'status' || name === 'priority' || name === 'projectId'
          ? Number(value)
          : value,
    }))
    clearError()
  }

  function handleAnalyzeClick() {
    analyze(values)
  }

  function handleApplyPriority(nextPriority) {
    setValues((prev) => ({ ...prev, priority: nextPriority }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    await onSubmit({
      projectId: values.projectId,
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      dueDate: toUtcIsoDate(values.dueDate),
    })
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h3>{submitLabel === 'Create task' ? 'Create task' : 'Edit task'}</h3>

      <label htmlFor="task-project">Project</label>
      <select
        id="task-project"
        name="projectId"
        value={values.projectId}
        onChange={handleChange}
        disabled={projectsLoading || Boolean(projectId)}
      >
        <option value="">Select a project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      {projectsLoading && <p className="form-hint">Loading projects...</p>}
      {projectsError && <p className="form-error">{projectsError}</p>}
      {errors.projectId && <p className="form-error">{errors.projectId}</p>}

      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        name="title"
        value={values.title}
        onChange={handleChange}
        maxLength={120}
      />
      {errors.title && <p className="form-error">{errors.title}</p>}

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        name="description"
        value={values.description}
        onChange={handleChange}
        rows={3}
        maxLength={500}
      />
      {errors.description && <p className="form-error">{errors.description}</p>}

      <label htmlFor="task-status">Status</label>
      <select id="task-status" name="status" value={values.status} onChange={handleChange}>
        <option value={TASK_STATUS.TODO}>To Do</option>
        <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
        <option value={TASK_STATUS.DONE}>Done</option>
      </select>

      <label htmlFor="task-priority">Priority</label>
      <select id="task-priority" name="priority" value={values.priority} onChange={handleChange}>
        <option value={TASK_PRIORITY.LOW}>Low</option>
        <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
        <option value={TASK_PRIORITY.HIGH}>High</option>
      </select>

      <label htmlFor="task-due-date">Due date</label>
      <input
        id="task-due-date"
        type="date"
        name="dueDate"
        min={dueDateMinValue}
        value={values.dueDate}
        onChange={handleChange}
      />
      {errors.dueDate && <p className="form-error">{errors.dueDate}</p>}

      <div className="ai-action-row">
        <AIAnalysisButton
          disabled={!values.title.trim() || isSaving}
          isAnalyzing={isAnalyzing}
          onClick={handleAnalyzeClick}
        />
        <p className="form-hint" role="status" aria-live="polite">
          {isAnalyzing ? 'AI is analyzing your task...' : 'Use AI to suggest priority, tags, and estimate.'}
        </p>
      </div>

      {aiError && <p className="form-error">{aiError}</p>}

      <AIResultsCard
        result={aiResults}
        userPriority={values.priority}
        onApplyPriority={handleApplyPriority}
        isStale={getIsStale(values)}
      />

      <div className="form-actions">
        <button type="submit" className="btn" disabled={isSaving}>
          {isSaving ? 'Saving...' : submitLabel}
        </button>
        <button type="button" className="btn ghost" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </form>
  )
}

TaskForm.propTypes = {
  projectId: PropTypes.number,
  initialValues: PropTypes.shape({
    projectId: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.number,
    priority: PropTypes.number,
    dueDate: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  submitLabel: PropTypes.string,
}

TaskForm.defaultProps = {
  projectId: undefined,
  initialValues: DEFAULT_VALUES,
  isSaving: false,
  submitLabel: 'Create task',
}

export default TaskForm
