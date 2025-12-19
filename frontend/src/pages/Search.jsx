import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap'
import { useState } from 'react'

export default function Search() {
  const allVehicles = [
    {
      id: 1, name: 'Tesla Model Y Performance', year: 2024, category: 'SUV', price: 129,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600',
      rating: 4.9, seats: 5, transmission: 'Automatic', fuel: 'Electric', available: true
    },
    {
      id: 2, name: 'Porsche 911 Carrera', year: 2023, category: 'Sports', price: 350,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600',
      rating: 5.0, seats: 4, transmission: 'Automatic', fuel: 'Petrol', available: true
    },
    {
      id: 3, name: 'Mercedes-Benz G-Class', year: 2023, category: 'SUV', price: 400,
      image: 'https://images.cdn.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/01-mercedes-g500-g-wagen-2024-review-lead-driving-front.jpg?itok=o7z6UwrT',
      rating: 4.8, seats: 5, transmission: 'Automatic', fuel: 'Petrol', available: true
    },
    {
      id: 4, name: 'BMW M4 Competition', year: 2024, category: 'Coupe', price: 299,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600',
      rating: 4.9, seats: 4, transmission: 'Manual', fuel: 'Petrol', available: true
    },
    {
      id: 5, name: 'Range Rover Autobiography', year: 2023, category: 'Luxury', price: 450,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600',
      rating: 4.7, seats: 5, transmission: 'Automatic', fuel: 'Petrol', available: true
    },
    {
      id: 6, name: 'Audi RS e-tron GT', year: 2024, category: 'Sedan', price: 399,
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600',
      rating: 4.9, seats: 5, transmission: 'Automatic', fuel: 'Electric', available: true
    },
    {
      id: 7, name: 'Toyota Camry Hybrid', year: 2024, category: 'Sedan', price: 85,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600',
      rating: 4.6, seats: 5, transmission: 'Automatic', fuel: 'Hybrid', available: true
    },
    {
      id: 8, name: 'Honda Accord Sport', year: 2024, category: 'Sedan', price: 75,
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600',
      rating: 4.7, seats: 5, transmission: 'Automatic', fuel: 'Petrol', available: true
    },
    {
      id: 9, name: 'Ford Mustang GT', year: 2024, category: 'Sports', price: 199,
      image: 'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=800',
      rating: 4.8, seats: 4, transmission: 'Manual', fuel: 'Petrol', available: true
    },
    {
      id: 10, name: 'Chevrolet Suburban', year: 2023, category: 'SUV', price: 180,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600',
      rating: 4.5, seats: 8, transmission: 'Automatic', fuel: 'Petrol', available: true
    },
    {
      id: 11, name: 'Nissan Leaf Plus', year: 2024, category: 'Electric', price: 70,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600',
      rating: 4.4, seats: 5, transmission: 'Automatic', fuel: 'Electric', available: true
    },
    {
      id: 12, name: 'Volkswagen ID.4', year: 2024, category: 'Electric', price: 95,
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600',
      rating: 4.6, seats: 5, transmission: 'Automatic', fuel: 'Electric', available: true
    },
    {
      id: 13, name: 'Lexus ES 350', year: 2024, category: 'Luxury', price: 125,
      image:'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
      rating: 4.8, seats: 5, transmission: 'Automatic', fuel: 'Petrol', available: true
    },
    {
      id: 14, name: 'Mazda CX-5 Turbo', year: 2024, category: 'SUV', price: 90,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600',
      rating: 4.7, seats: 5, transmission: 'Automatic', fuel: 'Petrol', available: true
    },
    {
      id: 15, name: 'Jeep Wrangler Rubicon', year: 2024, category: 'SUV', price: 150,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      rating: 4.6, seats: 5, transmission: 'Automatic', fuel: 'Petrol', available: true
    },
  ]

  const [filters, setFilters] = useState({
    priceMax: 500,
    category: '',
    transmission: '',
    features: []
  })

  const [sortBy, setSortBy] = useState('recommended')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter vehicles
  const filteredVehicles = allVehicles.filter(vehicle => {
    // Price filter
    if (vehicle.price > filters.priceMax) return false
    
    // Category filter
    if (filters.category && vehicle.category !== filters.category) return false
    
    // Transmission filter
    if (filters.transmission && vehicle.transmission !== filters.transmission) return false
    
    // Search query
    if (searchQuery && !vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    return true
  })

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.year - a.year
      default:
        return 0
    }
  })

  const resetFilters = () => {
    setFilters({
      priceMax: 500,
      category: '',
      transmission: '',
      features: []
    })
    setSearchQuery('')
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Container>
        {/* Header with Search */}
        <div className="mb-4">
          <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>Find your perfect ride</h1>
          <Row className="align-items-center">
            <Col md={8}>
              <Form.Control
                type="text"
                placeholder="Search by vehicle name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  borderRadius: '10px', 
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0'
                }}
              />
            </Col>
            <Col md={4}>
              <p className="text-muted mb-0 mt-2 mt-md-0">
                {sortedVehicles.length} vehicles available
              </p>
            </Col>
          </Row>
        </div>

        <Row>
          {/* Filters Sidebar */}
          <Col lg={3} className="mb-4">
            <div className="search-sidebar">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Filters</h5>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={resetFilters}
                  style={{ color: '#14b8a6', textDecoration: 'none' }}
                >
                  Reset
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Price Range</h6>
                <input 
                  type="range" 
                  className="form-range mb-2" 
                  min="50" 
                  max="500" 
                  value={filters.priceMax}
                  onChange={(e) => setFilters({...filters, priceMax: parseInt(e.target.value)})}
                  style={{ accentColor: '#14b8a6' }}
                />
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">$50</span>
                  <span className="fw-semibold">${filters.priceMax}+</span>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Category</h6>
                {['SUV', 'Sedan', 'Sports', 'Coupe', 'Luxury', 'Electric'].map((cat) => (
                  <Form.Check
                    key={cat}
                    type="radio"
                    name="category"
                    label={cat}
                    checked={filters.category === cat}
                    onChange={() => setFilters({...filters, category: filters.category === cat ? '' : cat})}
                    className="mb-2"
                  />
                ))}
              </div>

              {/* Transmission */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Transmission</h6>
                <Form.Check 
                  type="radio" 
                  name="transmission" 
                  label="Automatic"
                  checked={filters.transmission === 'Automatic'}
                  onChange={() => setFilters({...filters, transmission: filters.transmission === 'Automatic' ? '' : 'Automatic'})}
                  className="mb-2" 
                />
                <Form.Check 
                  type="radio" 
                  name="transmission" 
                  label="Manual"
                  checked={filters.transmission === 'Manual'}
                  onChange={() => setFilters({...filters, transmission: filters.transmission === 'Manual' ? '' : 'Manual'})}
                  className="mb-2" 
                />
              </div>

              {/* Features */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Features</h6>
                {['Bluetooth', 'GPS', 'Sunroof', 'Heated Seats', 'Apple CarPlay'].map((feature) => (
                  <Form.Check 
                    key={feature}
                    type="checkbox" 
                    label={feature} 
                    className="mb-2" 
                  />
                ))}
              </div>
            </div>
          </Col>

          {/* Vehicle Grid */}
          <Col lg={9}>
            {/* Sort */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="text-muted mb-0">
                Showing {sortedVehicles.length} of {allVehicles.length} vehicles
              </p>
              <Form.Select 
                style={{ width: 'auto', borderRadius: '10px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
                <option value="newest">Newest First</option>
              </Form.Select>
            </div>

            {sortedVehicles.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted">No vehicles found</h4>
                <p className="text-muted">Try adjusting your filters</p>
                <Button variant="primary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <Row>
                {sortedVehicles.map((vehicle) => (
                  <Col key={vehicle.id} lg={4} md={6} className="mb-4">
                    <Card className="vehicle-card h-100">
                      <div className="position-relative">
                        <Card.Img 
                          variant="top" 
                          src={vehicle.image} 
                          className="vehicle-image"
                          alt={vehicle.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <Badge 
                          bg="secondary" 
                          className="position-absolute"
                          style={{ top: '10px', left: '10px' }}
                        >
                          {vehicle.category}
                        </Badge>
                        <Badge 
                          bg="warning" 
                          text="dark"
                          className="position-absolute"
                          style={{ top: '10px', right: '10px' }}
                        >
                          ⭐ {vehicle.rating}
                        </Badge>
                      </div>
                      <Card.Body>
                        <h5 className="fw-bold mb-1" style={{ fontSize: '1.125rem' }}>
                          {vehicle.name}
                        </h5>
                        <p className="text-muted small mb-3">{vehicle.year}</p>
                        
                        <div className="d-flex gap-3 mb-3 text-muted small">
                          <span>👤 {vehicle.seats}</span>
                          <span>⚙️ {vehicle.transmission}</span>
                          <span>⚡ {vehicle.fuel}</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="price-tag">
                              ${vehicle.price}
                              <small>/day</small>
                            </div>
                          </div>
                          <Button 
                            as={Link} 
                            to={`/vehicle/${vehicle.id}`} 
                            variant="outline-primary"
                            style={{ borderRadius: '10px', padding: '8px 20px' }}
                          >
                            View Details →
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}