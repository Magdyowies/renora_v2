import { Container, Row, Col, Card, Table, Badge, Button, Modal } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom' // Import useLocation
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import bookingsService from '../services/bookingsService' // Import bookingsService
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'


export default function Dashboard() {
  const { user } = useAuth()
  const location = useLocation(); // Initialize useLocation
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await bookingsService.getUserBookings();
        setBookings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings.');
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, location.state?.bookingCompleted]) // Re-fetch when user changes or after booking completion

  // Calculate stats
  const activeBookings = bookings.filter(b => b.status === 'active').length
  const upcomingBookings = bookings.filter(b => {
    const pickupDate = new Date(b.pickup_date)
    const now = new Date()
    return pickupDate > now && b.status !== 'cancelled'
  }).length
  const totalRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + Number(b.final_price || 0), 0)

  const stats = [
    { title: 'Total Bookings', value: bookings.length, icon: '🚗', color: 'primary', trend: 'All time' },
    { title: 'Active Rentals', value: activeBookings, icon: '✅', color: 'success', trend: `${activeBookings} ongoing` },
    { title: 'Upcoming', value: upcomingBookings, icon: '📅', color: 'info', trend: `${upcomingBookings} scheduled` },
    { title: 'Total Spent', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: 'warning', trend: 'All bookings' },
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
    // Backend status can be 'pending', 'confirmed', 'active', 'completed', 'cancelled'
    // Map backend status to frontend display status for consistency
    if (booking.status === 'cancelled') return 'cancelled';
    if (booking.status === 'pending' || booking.status === 'confirmed') return 'upcoming';

    const now = new Date();
    const pickupDate = new Date(booking.pickup_date);
    const returnDate = new Date(booking.return_date);

    if (pickupDate <= now && now <= returnDate) {
      return 'active';
    } else if (pickupDate > now) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsService.cancelBooking(bookingId);
        toast.success('Booking cancelled successfully!');
        // Re-fetch bookings after cancellation
        const data = await bookingsService.getUserBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to cancel booking.');
      }
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

          {loading ? (
            <LoadingSpinner />
          ) : bookings.length === 0 ? (
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
                        <td className="fw-bold">#{booking.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {booking.vehicle.primary_image?.image && (
                              <img 
                                src={booking.vehicle.primary_image.image} 
                                alt={booking.vehicle.name}
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
                              <div className="fw-semibold">{booking.vehicle.name}</div>
                              <small className="text-muted">{booking.vehicle.category_name}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{format(new Date(booking.pickup_date), 'MMM dd, yyyy')}</div>
                          <div className="text-muted small">to {format(new Date(booking.return_date), 'MMM dd, yyyy')}</div>
                        </td>
                        <td>{booking.total_days} days</td>
                        <td>
                          <Badge bg={getStatusBadge(status)} className="text-capitalize">
                            {status}
                          </Badge>
                        </td>
                        <td className="fw-bold">${Number(booking.final_price)?.toFixed(2)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewDetails(booking)}
                            >
                              Details
                            </Button>
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
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
                {selectedBooking.vehicle_details.primary_image?.image && (
                  <img 
                    src={selectedBooking.vehicle_details.primary_image.image} 
                    alt={selectedBooking.vehicle_details.name}
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
                  <div className="fw-semibold">{selectedBooking.vehicle_details.name}</div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Category</label>
                  <div className="fw-semibold">{selectedBooking.vehicle_details.category_name}</div>
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
                  <div className="fw-semibold">{selectedBooking.customer.first_name} {selectedBooking.customer.last_name}</div>
                  <div className="small text-muted">{selectedBooking.customer.email}</div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Pickup Location</label>
                  <div className="fw-semibold">{selectedBooking.pickup_location}</div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Dropoff Location</label>
                  <div className="fw-semibold">{selectedBooking.return_location}</div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Duration</label>
                  <div className="fw-semibold">
                    {format(new Date(selectedBooking.pickup_date), 'MMM dd, yyyy')} to {format(new Date(selectedBooking.return_date), 'MMM dd, yyyy')}
                    <span className="text-muted ms-2">({selectedBooking.total_days} days)</span>
                  </div>
                </div>
              </Col>

              <Col md={12}>
                <hr className="my-4" />
                <h5 className="fw-bold mb-3">Payment Details</h5>
                <div className="bg-light p-3 rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Daily Rate</span>
                    <span>${(Number(selectedBooking.final_price) / Number(selectedBooking.total_days || 1))?.toFixed(2)}/day</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Number of Days</span>
                    <span>{selectedBooking.total_days} days</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Payment Method</span>
                    <span>{selectedBooking.method}</span> {/* Assuming method is directly available or fetched separately */}
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold fs-5">Total Amount</span>
                    <span className="fw-bold fs-5 text-primary">${Number(selectedBooking.final_price)?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-3 small text-muted">
                  <strong>Booked on:</strong> {new Date(selectedBooking.created_at).toLocaleString()}
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
            to={`/vehicle/${selectedBooking?.vehicle.id}`}
            onClick={() => setShowModal(false)}
          >
            View Vehicle
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}