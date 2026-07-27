import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { projectService } from '../../services/projectService'
import ProjectCard from './ProjectCard'
import ProjectForm from './ProjectForm'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

function ProjectList({ onNotify }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  async function loadProjects() {
    setLoading(true)
    setError('')

    try {
      const data = await projectService.getAllProjects()
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const filteredProjects = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return projects

    return projects.filter((project) => project.name.toLowerCase().includes(normalized))
  }, [projects, search])

  const dashboardStats = useMemo(() => {
    const allTasks = projects.flatMap((project) => project.tasks || [])
    return {
      projectCount: projects.length,
      taskCount: allTasks.length,
      todoCount: allTasks.filter((task) => task.status === 0).length,
      inProgressCount: allTasks.filter((task) => task.status === 1).length,
      doneCount: allTasks.filter((task) => task.status === 2).length,
    }
  }, [projects])

  function startCreate() {
    setEditingProject(null)
    setShowForm(true)
  }

  function startEdit(project) {
    setEditingProject(project)
    setShowForm(true)
  }

  function stopForm() {
    setEditingProject(null)
    setShowForm(false)
  }

  async function handleSaveProject(payload) {
    setIsSaving(true)

    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, payload)
        onNotify('success', 'Project updated successfully.')
      } else {
        await projectService.createProject(payload)
        onNotify('success', 'Project created successfully.')
      }

      stopForm()
      await loadProjects()
    } catch (err) {
      onNotify('error', err.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteProject(project) {
    const confirmed = window.confirm(`Delete project "${project.name}"? This cannot be undone.`)
    if (!confirmed) return

    try {
      await projectService.deleteProject(project.id)
      onNotify('success', 'Project deleted successfully.')
      await loadProjects()
    } catch (err) {
      onNotify('error', err.message)
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading projects..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadProjects} />
  }

  return (
    <div className="stack-lg">
      <section className="panel">
        <div className="section-header">
          <h2>Dashboard</h2>
          <button type="button" className="btn" onClick={startCreate}>
            New project
          </button>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <p>Total projects</p>
            <strong>{dashboardStats.projectCount}</strong>
          </article>
          <article className="stat-card">
            <p>Total tasks</p>
            <strong>{dashboardStats.taskCount}</strong>
          </article>
          <article className="stat-card">
            <p>To Do</p>
            <strong>{dashboardStats.todoCount}</strong>
          </article>
          <article className="stat-card">
            <p>In Progress</p>
            <strong>{dashboardStats.inProgressCount}</strong>
          </article>
          <article className="stat-card">
            <p>Done</p>
            <strong>{dashboardStats.doneCount}</strong>
          </article>
        </div>

        <label htmlFor="project-search">Search projects</label>
        <input
          id="project-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by project name"
        />
      </section>

      {showForm && (
        <ProjectForm
          initialValues={editingProject}
          onSubmit={handleSaveProject}
          onCancel={stopForm}
          isSaving={isSaving}
          submitLabel={editingProject ? 'Update project' : 'Create project'}
        />
      )}

      <section className="panel">
        <div className="section-header">
          <h2>Projects</h2>
          <span>{filteredProjects.length} shown</span>
        </div>

        {filteredProjects.length === 0 ? (
          <p className="empty">No projects found. Try creating one first.</p>
        ) : (
          <div className="grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={startEdit}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

ProjectList.propTypes = {
  onNotify: PropTypes.func.isRequired,
}

export default ProjectList
