import PropTypes from 'prop-types'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <section className="panel" role="alert">
      <h2>Something went wrong</h2>
      <p>{error.message || 'Unexpected UI error occurred.'}</p>
      <button type="button" className="btn" onClick={resetErrorBoundary}>
        Try again
      </button>
    </section>
  )
}

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
}

function AppErrorBoundary({ children }) {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
}

AppErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppErrorBoundary
