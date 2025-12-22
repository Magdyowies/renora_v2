import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Home() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('/api/vehicles/')
        setVehicles(response.data)
      } catch (err) {
        setError('Failed to fetch vehicles.')
        console.error('Error fetching vehicles:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  const features = [
    { icon: '🚗', title: 'Wide Selection', description: 'Choose from hundreds of vehicles' },
    { icon: '💰', title: 'Best Prices', description: 'Competitive rates guaranteed' },
    { icon: '📱', title: 'Easy Booking', description: 'Book in minutes online' },
    { icon: '🛡️', title: 'Fully Insured', description: 'All vehicles are fully covered' },
  ]

  if (loading) {
    return (
      <Container className="my-5 py-5 text-center">
        <h2 className="fw-bold mb-0">Featured Vehicles</h2>
        <p>Loading featured vehicles...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="my-5 py-5 text-center text-danger">
        <h2 className="fw-bold mb-0">Featured Vehicles</h2>
        <p>{error}</p>
      </Container>
    )
  }

  return (
    <div>
      {/* Hero Section with Background Image */}
      <div className="hero-section-image">
        <div className="hero-overlay">
          <Container className="text-center py-5">
            <h1 className="display-2 fw-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Find your drive.
            </h1>
            <p className="lead text-white mb-5" style={{ fontSize: '1.3rem', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              Premium vehicle rentals for every journey. From city streets<br />
              to coastal roads, experience the freedom of the open road.
            </p>
            
            {/* Centered Search Box */}
            <Row className="justify-content-center">
              <Col lg={8} xl={7}>
                <Card className="shadow-lg border-0" style={{ borderRadius: '16px' }}>
                  <Card.Body className="p-4">
                    <Row className="g-3">
                      <Col md={6}>
                        <label className="form-label text-start d-block fw-semibold mb-2">
                           Pick-up Location
                        </label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg" 
                          placeholder="City, airport, or address"
                          style={{ borderRadius: '10px' }}
                        />
                      </Col>
                      <Col md={6}>
                        <label className="form-label text-start d-block fw-semibold mb-2">
                          Pick-up Date
                        </label>
                        <input 
                          type="date" 
                          className="form-control form-control-lg"
                          style={{ borderRadius: '10px' }}
                          placeholder="Select your pickup date"
                        />
                      </Col>
                      <Col xs={12}>
                        <Button 
                          as={Link}
                          to="/search"
                          variant="primary" 
                          size="lg" 
                          className="w-100"
                          style={{ 
                            padding: '0.875rem',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: '600'
                          }}
                        >
                           Search Vehicles
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Features Section */}
      <Container className="my-5 py-5">
        <h2 className="text-center mb-5 fw-bold">Why Choose Rentora?</h2>
        <Row>
          {features.map((feature, index) => (
            <Col key={index} md={3} sm={6} className="mb-4">
              <Card className="text-center border-0 h-100 shadow-sm card-hover">
                <Card.Body className="p-4">
                  <Card.Title className="fw-bold">{feature.title}</Card.Title>
                  <Card.Text className="text-muted">{feature.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Featured Vehicles */}
      <Container className="my-5 py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="fw-bold mb-0">Featured Vehicles</h2>
          <Button as={Link} to="/search" variant="outline-primary">
            View All
          </Button>
        </div>
        <Row>
          {vehicles && Array.isArray(vehicles) && vehicles.slice(0, 3).map((vehicle) => (
            <Col key={vehicle.id} md={4} className="mb-4">
              <Card className="vehicle-card shadow-sm h-100">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={vehicle.main_image} 
                    className="vehicle-image"
                    alt={vehicle.name}
                  />
                  {vehicle.status === 'available' ? (
                    <Badge bg="success" className="position-absolute top-0 end-0 m-3">
                      Available
                    </Badge>
                  ) : (
                    <Badge bg="danger" className="position-absolute top-0 end-0 m-3">
                      Unavailable
                    </Badge>
                  )}
                </div>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <Card.Title className="mb-1">{vehicle.name}</Card.Title>
                      <Badge bg="secondary" className="mb-2">{vehicle.category.name}</Badge>
                    </div>
                    <div className="text-end">
                      <div className="text-warning">⭐ {vehicle.rating}</div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="price-tag">
                      ${vehicle.price_per_day}<small className="text-muted fs-6">/day</small>
                    </div>
                    <Button 
                      as={Link} 
                      to={`/vehicle/${vehicle.id}`} 
                      variant="primary"
                      disabled={vehicle.status !== 'available'}
                    >
                      {vehicle.status === 'available' ? 'View Details' : 'Unavailable'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="bg-primary text-white py-5">
        <Container className="text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Hit the Road?</h2>
          <p className="lead mb-4">
            {user ? 'Browse our collection and book your perfect ride' : 'Join thousands of satisfied customers'}
          </p>
          {user ? (
            <Button as={Link} to="/search" size="lg" variant="light" className="px-5 py-3">
              Browse Vehicles
            </Button>
          ) : (
            <Button as={Link} to="/signup" size="lg" variant="light" className="px-5 py-3">
              Sign Up Now
            </Button>
          )}
        </Container>
      </div>
    </div>
  )
}