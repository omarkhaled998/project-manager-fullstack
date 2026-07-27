import axios from 'axios'
import { API_BASE_URL } from '../config/config'

const AI_URL = `${API_BASE_URL}/ai/analyze-task`

function mapAiError(error) {
  if (error.code === 'ECONNABORTED') {
    return {
      status: 408,
      message: 'AI is taking longer than expected. Please try again.',
    }
  }

  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || 'AI service unavailable. Please try again.',
    }
  }

  if (error.request) {
    return {
      status: 0,
      message: 'AI service unavailable. Please try again.',
    }
  }

  return {
    status: 0,
    message: error.message || 'Unexpected AI error occurred.',
  }
}

export const aiService = {
  async analyzeTask(taskData) {
    try {
      const response = await axios.post(
        AI_URL,
        {
          title: taskData.title,
          description: taskData.description || '',
          userSetPriority: taskData.userSetPriority,
          dueDate: taskData.dueDate,
        },
        {
          timeout: 60000, // 60 seconds for AI analysis
        },
      )

      return response.data
    } catch (error) {
      throw mapAiError(error)
    }
  },
}
