import { Link } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'

export default function NotFound() {
  return (
    <Container className="py-5">
      <div className="text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="display-1 fw-bold text-primary mb-4">404</h1>
        <h2 className="fw-bold mb-3">Page Not Found</h2>
        <p className="text-muted mb-4 fs-5">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Button as={Link} to="/" variant="primary" size="lg">
            Go Home
          </Button>
          <Button as={Link} to="/search" variant="outline-primary" size="lg">
            Browse Vehicles
          </Button>
        </div>
      </div>
    </Container>
  )
}