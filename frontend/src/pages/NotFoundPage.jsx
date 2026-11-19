import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="container" style={{ paddingBlock: '5rem', textAlign: 'center' }}>
      <h1>Page not found</h1>
      <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.5rem' }}>
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </section>
  )
}

export default NotFoundPage