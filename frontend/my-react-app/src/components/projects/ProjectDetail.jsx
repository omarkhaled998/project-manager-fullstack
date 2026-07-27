import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { formatDate } from '../../config/config'
import { projectService } from '../../services/projectService'
import { taskService } from '../../services/taskService'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import ProjectForm from './ProjectForm'
import TaskList from '../tasks/TaskList'
import TaskForm from '../tasks/TaskForm'

function ProjectDetail({ onNotify }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const [isSavingProject, setIsSavingProject] = useState(false)
  const [isSavingTask, setIsSavingTask] = useState(false)

  async function loadProject() {
    setLoading(true)
    setError('')

    try {
      const data = await projectService.getProjectById(id)
      setProject(data)
    } catch (err) {
      setError(err.status === 404 ? 'Project not found.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProject()
  }, [id])

  async function handleUpdateProject(payload) {
    setIsSavingProject(true)

    try {
      await projectService.updateProject(project.id, payload)
      onNotify('success', 'Project updated successfully.')
      setShowProjectForm(false)
      await loadProject()
    } catch (err) {
      onNotify('error', err.message)
    } finally {
      setIsSavingProject(false)
    }
  }

  async function handleDeleteProject() {
    if (!project) return

    const confirmed = window.confirm(
      `Delete project "${project.name}" and its tasks? This cannot be undone.`,
    )
    if (!confirmed) return

    try {
      await projectService.deleteProject(project.id)
      onNotify('success', 'Project deleted successfully.')
      navigate('/')
    } catch (err) {
      onNotify('error', err.message)
    }
  }

  function openCreateTask() {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  function openEditTask(task) {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  function closeTaskForm() {
    setEditingTask(null)
    setShowTaskForm(false)
  }

  async function handleSaveTask(payload) {
    setIsSavingTask(true)

    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, payload)
        onNotify('success', 'Task updated successfully.')
      } else {
        await taskService.createTask(payload)
        onNotify('success', 'Task created successfully.')
      }

      closeTaskForm()
      await loadProject()
    } catch (err) {
      onNotify('error', err.message)
    } finally {
      setIsSavingTask(false)
    }
  }

  async function handleDeleteTask(task) {
    const confirmed = window.confirm(`Delete task "${task.title}"? This cannot be undone.`)
    if (!confirmed) return

    try {
      await taskService.deleteTask(task.id)
      onNotify('success', 'Task deleted successfully.')
      await loadProject()
    } catch (err) {
      onNotify('error', err.message)
    }
  }

  async function handleTaskStatusChange(task, nextStatus) {
    try {
      await taskService.updateTask(task.id, {
        projectId: task.projectId,
        title: task.title,
        description: task.description || '',
        status: nextStatus,
        priority: task.priority,
        dueDate: task.dueDate,
      })

      onNotify('success', 'Task status updated.')
      await loadProject()
    } catch (err) {
      onNotify('error', err.message)
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading project details..." />
  }

  if (error) {
    return (
      <div className="stack-lg">
        <ErrorMessage message={error} onRetry={loadProject} />
        <button type="button" className="btn ghost" onClick={() => navigate('/')}>
          Back to projects
        </button>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="stack-lg">
      <section className="panel">
        <div className="section-header">
          <h2>{project.name}</h2>
          <div className="inline-actions">
            <button type="button" className="btn ghost" onClick={() => navigate('/')}>
              Back
            </button>
            <button type="button" className="btn ghost" onClick={() => setShowProjectForm(true)}>
              Edit project
            </button>
            <button type="button" className="btn danger" onClick={handleDeleteProject}>
              Delete project
            </button>
          </div>
        </div>

        <p className="description">{project.description || 'No description provided.'}</p>
        <div className="meta-row">
          <span>Created: {formatDate(project.createdAt)}</span>
          <span>{project.tasks?.length ?? 0} tasks</span>
        </div>
      </section>

      {showProjectForm && (
        <ProjectForm
          initialValues={project}
          onSubmit={handleUpdateProject}
          onCancel={() => setShowProjectForm(false)}
          isSaving={isSavingProject}
          submitLabel="Update project"
        />
      )}

      <section className="panel">
        <div className="section-header">
          <h3>Task actions</h3>
          <button type="button" className="btn" onClick={openCreateTask}>
            New task
          </button>
        </div>
      </section>

      {showTaskForm && (
        <TaskForm
          projectId={project.id}
          initialValues={editingTask}
          onSubmit={handleSaveTask}
          onCancel={closeTaskForm}
          isSaving={isSavingTask}
          submitLabel={editingTask ? 'Update task' : 'Create task'}
        />
      )}

      <TaskList
        tasks={project.tasks || []}
        onEdit={openEditTask}
        onDelete={handleDeleteTask}
        onStatusChange={handleTaskStatusChange}
      />
    </div>
  )
}

ProjectDetail.propTypes = {
  onNotify: PropTypes.func.isRequired,
}

export default ProjectDetail
