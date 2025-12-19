import { Container, Row, Col, Card, Badge, Button, Tab, Tabs } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function MyBookings() {
  const { user } = useAuth()

  // Mock bookings for the current user
  const userBookings = [
    {
      id: 1,
      vehicleId: 1,
      vehicleName: 'Tesla Model Y Performance',
      vehicleImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
      startDate: '2024-12-20',
      endDate: '2024-12-25',
      status: 'active',
      total: 645,
      pricePerDay: 129,
      days: 5,
      pickupLocation: 'San Francisco Airport'
    },
    {
      id: 2,
      vehicleId: 2,
      vehicleName: 'Porsche 911 Carrera',
      vehicleImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
      startDate: '2024-11-15',
      endDate: '2024-11-18',
      status: 'completed',
      total: 1050,
      pricePerDay: 350,
      days: 3,
      pickupLocation: 'Downtown San Francisco'
    },
    {
      id: 3,
      vehicleId: 4,
      vehicleName: 'BMW M4 Competition',
      vehicleImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
      startDate: '2025-01-10',
      endDate: '2025-01-15',
      status: 'upcoming',
      total: 1495,
      pricePerDay: 299,
      days: 5,
      pickupLocation: 'San Francisco Airport'
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      completed: 'secondary',
      upcoming: 'info',
      cancelled: 'danger',
    }
    return variants[status] || 'secondary'
  }

  const getStatusIcon = (status) => {
    const icons = {
      active: '🚗',
      completed: '✓',
      upcoming: '📅',
      cancelled: '✗',
    }
    return icons[status] || '📋'
  }

  const activeBookings = userBookings.filter(b => b.status === 'active')
  const upcomingBookings = userBookings.filter(b => b.status === 'upcoming')
  const pastBookings = userBookings.filter(b => b.status === 'completed' || b.status === 'cancelled')

  const BookingCard = ({ booking }) => (
    <Card className="shadow-sm border-0 mb-4 card-hover" style={{ borderRadius: '12px' }}>
      <Card.Body className="p-4">
        <Row className="align-items-center">
          <Col md={3}>
            <img 
              src={booking.vehicleImage} 
              alt={booking.vehicleName}
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
              <h5 className="fw-bold mb-0 me-2">{booking.vehicleName}</h5>
              <Badge bg={getStatusBadge(booking.status)} className="text-capitalize">
                {getStatusIcon(booking.status)} {booking.status}
              </Badge>
            </div>
            <div className="text-muted small mb-2">
              <div>📅 {booking.startDate} to {booking.endDate}</div>
              <div>📍 {booking.pickupLocation}</div>
              <div>💰 ${booking.pricePerDay}/day × {booking.days} days</div>
            </div>
          </Col>
          <Col md={3} className="text-md-end">
            <div className="mb-2">
              <div className="text-muted small">Total</div>
              <h4 className="fw-bold text-primary mb-3">${booking.total}</h4>
            </div>
            <div className="d-flex flex-column gap-2">
              <Button 
                as={Link}
                to={`/vehicle/${booking.vehicleId}`}
                variant="outline-primary" 
                size="sm"
              >
                View Vehicle
              </Button>
              {booking.status === 'upcoming' && (
                <Button variant="outline-danger" size="sm">
                  Cancel Booking
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )

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
                    <h3 className="fw-bold mb-0">{userBookings.length}</h3>
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
              <Tab eventKey="all" title={`All (${userBookings.length})`}>
                {userBookings.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3" style={{ fontSize: '4rem' }}>🚗</div>
                    <h4 className="fw-bold mb-2">No bookings yet</h4>
                    <p className="text-muted mb-4">Start exploring our amazing fleet!</p>
                    <Button as={Link} to="/search" variant="primary">
                      Browse Vehicles
                    </Button>
                  </div>
                ) : (
                  userBookings.map(booking => (
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