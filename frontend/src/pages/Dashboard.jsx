import { Container, Row, Col, Card, Table, Badge, Button, Modal } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [bookings, setBookings] = useState([])

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/signin')
    }
  }, [user, navigate])

  // Load bookings from localStorage
  useEffect(() => {
    const loadBookings = () => {
      try {
        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
        
        // Filter bookings for current user
        const userBookings = allBookings.filter(b => b.customerEmail === user?.email)
        
        // Sort by creation date (newest first)
        userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        
        setBookings(userBookings)
      } catch (error) {
        console.error('Error loading bookings:', error)
      }
    }

    if (user) {
      loadBookings()
    }
  }, [user])

  // Calculate stats
  const totalVehicles = 15
  const activeBookings = bookings.filter(b => b.status === 'active').length
  const upcomingBookings = bookings.filter(b => {
    const startDate = new Date(b.startDate)
    const now = new Date()
    return startDate > now && b.status !== 'cancelled'
  }).length
  const totalRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.total, 0)

  const stats = [
    { title: 'Total Bookings', value: bookings.length, icon: '🚗', color: 'primary', trend: 'All time' },
    { title: 'Active Rentals', value: activeBookings, icon: '✅', color: 'success', trend: `${activeBookings} ongoing` },
    { title: 'Upcoming', value: upcomingBookings, icon: '📅', color: 'info', trend: `${upcomingBookings} scheduled` },
    { title: 'Total Spent', value: `$${totalRevenue}`, icon: '💰', color: 'warning', trend: 'All bookings' },
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

  const getBookingStatus = (booking) => {
    if (booking.status === 'cancelled') return 'cancelled'
    
    const now = new Date()
    const startDate = new Date(booking.startDate)
    const endDate = new Date(booking.endDate)
    
    if (startDate <= now && now <= endDate) {
      return 'active'
    } else if (startDate > now) {
      return 'upcoming'
    } else {
      return 'completed'
    }
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const updatedBookings = allBookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      )
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
      
      // Refresh bookings
      const userBookings = updatedBookings.filter(b => b.customerEmail === user.email)
      setBookings(userBookings)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Container className="py-5">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold mb-2">Welcome back, {user?.name || user?.email}! 👋</h1>
          <p className="text-muted">Here's an overview of your rentals</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-5">
        {stats.map((stat, index) => (
          <Col key={index} md={3} sm={6} className="mb-3">
            <Card className="border-0 shadow-sm h-100 card-hover">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <p className="text-muted mb-1 small">{stat.title}</p>
                    <h2 className="mb-0 fw-bold">{stat.value}</h2>
                  </div>
                  <div 
                    className="fs-1"
                    style={{
                      width: '50px',
                      height: '50px',
                      background: `linear-gradient(135deg, var(--bs-${stat.color}) 0%, var(--bs-${stat.color}) 100%)`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.9
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
                <small className="text-muted">{stat.trend}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bookings Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">My Bookings</h4>
            <Button as={Link} to="/search" variant="outline-primary" size="sm">
              + New Booking
            </Button>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3" style={{ fontSize: '4rem' }}>🚗</div>
              <h5 className="fw-bold mb-2">No bookings yet</h5>
              <p className="text-muted mb-4">Start exploring our vehicles and make your first booking!</p>
              <Button as={Link} to="/search" variant="primary">
                Browse Vehicles
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Vehicle</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const status = getBookingStatus(booking)
                    return (
                      <tr key={booking.id}>
                        <td className="fw-bold">#{booking.id.toString().slice(-6)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {booking.vehicleImage && (
                              <img 
                                src={booking.vehicleImage} 
                                alt={booking.vehicle}
                                style={{ 
                                  width: '50px', 
                                  height: '50px', 
                                  objectFit: 'cover', 
                                  borderRadius: '8px',
                                  marginRight: '10px'
                                }}
                              />
                            )}
                            <div>
                              <div className="fw-semibold">{booking.vehicle}</div>
                              <small className="text-muted">{booking.vehicleCategory}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{booking.startDate}</div>
                          <div className="text-muted small">to {booking.endDate}</div>
                        </td>
                        <td>{booking.days} days</td>
                        <td>
                          <Badge bg={getStatusBadge(status)} className="text-capitalize">
                            {status}
                          </Badge>
                        </td>
                        <td className="fw-bold">${booking.total}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewDetails(booking)}
                            >
                              Details
                            </Button>
                            {status === 'upcoming' && (
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Booking Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details - #{selectedBooking?.id.toString().slice(-6)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Row>
              <Col md={6}>
                <h5 className="fw-bold mb-3">Vehicle Information</h5>
                {selectedBooking.vehicleImage && (
                  <img 
                    src={selectedBooking.vehicleImage} 
                    alt={selectedBooking.vehicle}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }}
                  />
                )}
                <div className="mb-3">
                  <label className="text-muted small">Vehicle</label>
                  <div className="fw-semibold">{selectedBooking.vehicle}</div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Category</label>
                  <div className="fw-semibold">{selectedBooking.vehicleCategory}</div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Status</label>
                  <div>
                    <Badge bg={getStatusBadge(getBookingStatus(selectedBooking))} className="text-capitalize">
                      {getBookingStatus(selectedBooking)}
                    </Badge>
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                <h5 className="fw-bold mb-3">Trip Information</h5>
                <div className="mb-3">
                  <label className="text-muted small">Customer</label>
                  <div className="fw-semibold">{selectedBooking.customer}</div>
                  <div className="small text-muted">{selectedBooking.customerEmail}</div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Pickup Location</label>
                  <div className="fw-semibold">{selectedBooking.pickupLocation}</div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Dropoff Location</label>
                  <div className="fw-semibold">{selectedBooking.dropoffLocation}</div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Duration</label>
                  <div className="fw-semibold">
                    {selectedBooking.startDate} to {selectedBooking.endDate}
                    <span className="text-muted ms-2">({selectedBooking.days} days)</span>
                  </div>
                </div>
              </Col>

              <Col md={12}>
                <hr className="my-4" />
                <h5 className="fw-bold mb-3">Payment Details</h5>
                <div className="bg-light p-3 rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Daily Rate</span>
                    <span>${selectedBooking.pricePerDay}/day</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Number of Days</span>
                    <span>{selectedBooking.days} days</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Payment Method</span>
                    <span>{selectedBooking.paymentMethod} •••• {selectedBooking.cardLast4}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold fs-5">Total Amount</span>
                    <span className="fw-bold fs-5 text-primary">${selectedBooking.total}</span>
                  </div>
                </div>
                <div className="mt-3 small text-muted">
                  <strong>Booked on:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            as={Link} 
            to={`/vehicle/${selectedBooking?.vehicleId}`}
            onClick={() => setShowModal(false)}
          >
            View Vehicle
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}