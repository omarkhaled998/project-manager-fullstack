import { useCallback, useRef, useState } from 'react'
import { aiService } from '../services/aiService'

function buildPayload(formValues) {
  return {
    title: formValues.title?.trim() || '',
    description: formValues.description?.trim() || '',
    userSetPriority: formValues.priority,
    dueDate: formValues.dueDate ? new Date(formValues.dueDate).toISOString() : null,
  }
}

export function useAIAnalysis() {
  const [aiResults, setAiResults] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [lastAnalyzedSignature, setLastAnalyzedSignature] = useState('')

  const autoAnalyzeTimerRef = useRef(null)

  const analyze = useCallback(async (formValues) => {
    const payload = buildPayload(formValues)

    if (!payload.title) {
      setError('Please enter a task title first.')
      return null
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const data = await aiService.analyzeTask(payload)
      setAiResults(data)
      setLastAnalyzedSignature(JSON.stringify(payload))
      return data
    } catch (err) {
      setError(err.message || 'AI service unavailable. Please try again.')
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError('')
  }, [])

  const getIsStale = useCallback((formValues) => {
    if (!aiResults) return false
    const signature = JSON.stringify(buildPayload(formValues))
    return signature !== lastAnalyzedSignature
  }, [aiResults, lastAnalyzedSignature])

  const scheduleAutoAnalyze = useCallback((formValues, enabled) => {
    if (!enabled) return

    if (autoAnalyzeTimerRef.current) {
      window.clearTimeout(autoAnalyzeTimerRef.current)
    }

    autoAnalyzeTimerRef.current = window.setTimeout(() => {
      analyze(formValues)
    }, 1400)
  }, [analyze])

  const cancelAutoAnalyze = useCallback(() => {
    if (autoAnalyzeTimerRef.current) {
      window.clearTimeout(autoAnalyzeTimerRef.current)
      autoAnalyzeTimerRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    setAiResults(null)
    setError('')
    setLastAnalyzedSignature('')
    cancelAutoAnalyze()
  }, [cancelAutoAnalyze])

  return {
    aiResults,
    isAnalyzing,
    error,
    analyze,
    clearError,
    getIsStale,
    scheduleAutoAnalyze,
    cancelAutoAnalyze,
    reset,
  }
}
