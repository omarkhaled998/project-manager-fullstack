import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const DEFAULT_VALUES = {
  name: '',
  description: '',
}

function ProjectForm({ initialValues, onSubmit, onCancel, isSaving, submitLabel }) {
  const [values, setValues] = useState(DEFAULT_VALUES)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setValues({
      name: initialValues?.name || '',
      description: initialValues?.description || '',
    })
  }, [initialValues])

  function validate() {
    const nextErrors = {}

    if (!values.name.trim()) {
      nextErrors.name = 'Project name is required.'
    }

    if (values.name.trim().length > 120) {
      nextErrors.name = 'Project name must be 120 characters or less.'
    }

    if (values.description.trim().length > 500) {
      nextErrors.description = 'Description must be 500 characters or less.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    await onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
    })
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h3>{submitLabel === 'Create project' ? 'Create project' : 'Edit project'}</h3>

      <label htmlFor="project-name">Name</label>
      <input
        id="project-name"
        name="name"
        value={values.name}
        onChange={handleChange}
        maxLength={120}
      />
      {errors.name && <p className="form-error">{errors.name}</p>}

      <label htmlFor="project-description">Description</label>
      <textarea
        id="project-description"
        name="description"
        value={values.description}
        onChange={handleChange}
        rows={3}
        maxLength={500}
      />
      {errors.description && <p className="form-error">{errors.description}</p>}

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

ProjectForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  submitLabel: PropTypes.string,
}

ProjectForm.defaultProps = {
  initialValues: DEFAULT_VALUES,
  isSaving: false,
  submitLabel: 'Create project',
}

export default ProjectForm
