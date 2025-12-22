import { Container, Row, Col, Card, Badge, Button, Tab, Tabs } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom' // Import useLocation
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import bookingsService from '../services/bookingsService' // Import bookingsService
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'


export default function MyBookings() {
  const { isAuthenticated } = useAuth()
  const location = useLocation(); // Initialize useLocation

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    const fetchBookings = async () => {
      try {
        const data = await bookingsService.getUserBookings()
        setBookings(data)
      } catch (err) {
        setError('Failed to fetch bookings.')
        toast.error('Failed to fetch bookings.')
        console.error('Fetch bookings error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [isAuthenticated, location.state?.bookingCompleted]) // Add location.state?.bookingCompleted to dependencies



  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      active: 'success',
      completed: 'secondary',
      cancelled: 'danger',
    }
    return variants[status] || 'secondary'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      active: '🚗',
      completed: '✔️',
      cancelled: '❌',
    }
    return icons[status] || '📋'
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      toast.error('Failed to cancel booking.');
    }
  };

  // Filter bookings based on their actual status from backend
  const activeBookings = bookings.filter(b => b.status === 'active')
  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed')
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled')

  const BookingCard = ({ booking }) => (
    <Card className="shadow-sm border-0 mb-4 card-hover" style={{ borderRadius: '12px' }}>
      <Card.Body className="p-4">
        <Row className="align-items-center">
          <Col md={3}>
            <img
              src={booking.vehicle.primary_image?.image || 'https://via.placeholder.com/120x80'}
              alt={booking.vehicle.name}
              style={{
                width: '100%',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center mb-2">
              <h5 className="fw-bold mb-0 me-2">{booking.vehicle.name}</h5>
              <Badge bg={getStatusBadge(booking.status)} className="text-capitalize">
                {getStatusIcon(booking.status)} {booking.status}
              </Badge>
            </div>
            <div className="text-muted small mb-2">
              <div>📅 {format(new Date(booking.pickup_date), 'MMM dd, yyyy')} to {format(new Date(booking.return_date), 'MMM dd, yyyy')}</div>
              <div>📍 {booking.pickup_location}</div>
              <div>💰 ${Number(booking.total_price)?.toFixed(2)}</div>
            </div>
          </Col>
          <Col md={3} className="text-md-end">
            <div className="mb-2">
              <div className="text-muted small">Total</div>
              <h4 className="fw-bold text-primary mb-3">${Number(booking.total_price)?.toFixed(2)}</h4>
            </div>
            <div className="d-flex flex-column gap-2">
              <Button
                as={Link}
                to={`/vehicle/${booking.vehicle.id}`}
                variant="outline-primary"
                size="sm"
              >
                View Vehicle
              </Button>
              {booking.status === 'pending' && ( // Only show Pay Now for pending bookings
                <Button
                  as={Link}
                  to={`/payment/${booking.id}`} // Link to payment page with booking ID
                  variant="primary"
                  size="sm"
                >
                  Pay Now
                </Button>
              )}
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <Button variant="outline-danger" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                  Cancel Booking
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => window.location.reload()} variant="primary">
          Reload Page
        </Button>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Container>
        <div className="mb-4">
          <h1 className="fw-bold mb-2">My Bookings</h1>
          <p className="text-muted">Manage your vehicle rentals</p>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginRight: '1rem'
                    }}
                  >
                    🚗
                  </div>
                  <div>
                    <div className="text-muted small">Active Rentals</div>
                    <h3 className="fw-bold mb-0">{activeBookings.length}</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginRight: '1rem'
                    }}
                  >
                    📅
                  </div>
                  <div>
                    <div className="text-muted small">Upcoming</div>
                    <h3 className="fw-bold mb-0">{upcomingBookings.length}</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginRight: '1rem'
                    }}
                  >
                    📊
                  </div>
                  <div>
                    <div className="text-muted small">Total Bookings</div>
                    <h3 className="fw-bold mb-0">{bookings.length}</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Bookings Tabs */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <Tabs defaultActiveKey="all" className="mb-4">
              <Tab eventKey="all" title={`All (${bookings.length})`}>
                {bookings.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3" style={{ fontSize: '4rem' }}>🚗</div>
                    <h4 className="fw-bold mb-2">No bookings yet</h4>
                    <p className="text-muted mb-4">Start exploring our amazing fleet!</p>
                    <Button as={Link} to="/search" variant="primary">
                      Browse Vehicles
                    </Button>
                  </div>
                ) : (
                  bookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </Tab>

              <Tab eventKey="active" title={`Active (${activeBookings.length})`}>
                {activeBookings.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No active bookings</p>
                  </div>
                ) : (
                  activeBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </Tab>

              <Tab eventKey="upcoming" title={`Upcoming (${upcomingBookings.length})`}>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No upcoming bookings</p>
                  </div>
                ) : (
                  upcomingBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </Tab>

              <Tab eventKey="past" title={`Past (${pastBookings.length})`}>
                {pastBookings.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No past bookings</p>
                  </div>
                ) : (
                  pastBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}