import axios from 'axios'
import { API_BASE_URL } from '../config/config'

const PROJECTS_URL = `${API_BASE_URL}/projects`

function mapApiError(error) {
  if (error.response) {
    const message = error.response.data?.message || error.response.data?.title
    return {
      status: error.response.status,
      message: message || `Request failed with status ${error.response.status}`,
    }
  }

  if (error.request) {
    return {
      status: 0,
      message: 'Network error: please check that the API is running.',
    }
  }

  return {
    status: 0,
    message: error.message || 'Unexpected error occurred.',
  }
}

export const projectService = {
  async getAllProjects() {
    try {
      const response = await axios.get(PROJECTS_URL)
      return response.data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async getProjectById(id) {
    try {
      const response = await axios.get(`${PROJECTS_URL}/${id}`)
      return response.data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async createProject(project) {
    try {
      const response = await axios.post(PROJECTS_URL, project)
      return response.data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async updateProject(id, project) {
    try {
      const response = await axios.put(`${PROJECTS_URL}/${id}`, project)
      return response.data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async deleteProject(id) {
    try {
      await axios.delete(`${PROJECTS_URL}/${id}`)
      return true
    } catch (error) {
      throw mapApiError(error)
    }
  },
}
