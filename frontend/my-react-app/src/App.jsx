import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AppErrorBoundary from './components/common/AppErrorBoundary'
import Navbar from './components/common/Navbar'
import Notification from './components/common/Notification'
import NotFound from './components/common/NotFound'
import ProjectDetail from './components/projects/ProjectDetail'
import ProjectList from './components/projects/ProjectList'

function App() {
  const [notification, setNotification] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (!notification) return undefined

    const timeoutId = window.setTimeout(() => {
      setNotification(null)
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [notification])

  function notify(type, message) {
    setNotification({ type, message })
  }

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    <AppErrorBoundary>
      <div className="app-shell">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        <main className="container">
          <Routes>
            <Route path="/" element={<ProjectList onNotify={notify} />} />
            <Route path="/projects/:id" element={<ProjectDetail onNotify={notify} />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Notification item={notification} onClose={() => setNotification(null)} />
      </div>
    </AppErrorBoundary>
  )
}

export default App
