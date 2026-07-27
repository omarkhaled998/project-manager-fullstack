import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="panel">
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/" className="btn">
        Back to projects
      </Link>
    </section>
  )
}

export default NotFound
