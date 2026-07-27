import axios from 'axios'
import { API_BASE_URL } from '../config/config'

const TASKS_URL = `${API_BASE_URL}/tasks`

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

export const taskService = {
  async getAllTasks() {
    try {
      const response = await axios.get(TASKS_URL)
      return response.data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async getTaskById(id) {
    try {
      const response = await axios.get(`${TASKS_URL}/${id}`)
      return response.data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async getTasksByProjectId(projectId) {
    try {
      const response = await axios.get(`${TASKS_URL}/project/${projectId}`)
      return response.data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async createTask(task) {
    try {
      const response = await axios.post(TASKS_URL, task)
      return response.data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async updateTask(id, task) {
    try {
      const response = await axios.put(`${TASKS_URL}/${id}`, task)
      return response.data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async deleteTask(id) {
    try {
      await axios.delete(`${TASKS_URL}/${id}`)
      return true
    } catch (error) {
      throw mapApiError(error)
    }
  },
}
