import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import vehiclesService from '../services/vehiclesService'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Search() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    priceMax: 500,
    category: '',
    transmission: '',
    features: []
  })

  const [sortBy, setSortBy] = useState('recommended')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehiclesService.getVehicles()
        setVehicles(data)
      } catch (err) {
        setError('Failed to fetch vehicles.')
        toast.error('Failed to fetch vehicles.')
        console.error('Fetch vehicles error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    // Price filter
    if (parseFloat(vehicle.price_per_day) > filters.priceMax) return false
    
    // Category filter
    if (filters.category && vehicle.category?.name !== filters.category) return false
    
    // Transmission filter
    if (filters.transmission && vehicle.transmission !== filters.transmission) return false
    
    // Search query
    if (searchQuery && !vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    // Feature filter (assuming vehicle.features is an array of objects with a 'name' property)
    // if (filters.features.length > 0) {
    //   const vehicleFeatureNames = vehicle.features.map(f => f.name);
    //   if (!filters.features.every(filterFeature => vehicleFeatureNames.includes(filterFeature))) {
    //     return false;
    //   }
    // }
    
    return true
  })

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price_per_day) - parseFloat(b.price_per_day)
      case 'price-high':
        return parseFloat(b.price_per_day) - parseFloat(a.price_per_day)
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.year - a.year
      default:
        return 0
    }
  })
  const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/600x400";
  if (path.startsWith("http")) return path;
  return `http://localhost:8000${path}`;
};


  const resetFilters = () => {
    setFilters({
      priceMax: 500,
      category: '',
      transmission: '',
      features: []
    })
    setSearchQuery('')
  }

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
                {sortedVehicles.length} of {vehicles.length} vehicles
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
                {/* Dynamically fetch categories or use a predefined list if backend provides one */}
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
                {/* Features are not available in the provided vehicle data structure */}
                {/* {['Bluetooth', 'GPS', 'Sunroof', 'Heated Seats', 'Apple CarPlay'].map((feature) => (
                  <Form.Check 
                    key={feature}
                    type="checkbox" 
                    label={feature} 
                    className="mb-2" 
                  />
                ))} */}
                 <p className="text-muted small">Features filter not yet implemented.</p>
              </div>
            </div>
          </Col>

          {/* Vehicle Grid */}
          
          <Col lg={9}>
            {/* Sort */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="text-muted mb-0">
                Showing {sortedVehicles.length} of {vehicles.length} vehicles
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
  src={getImageUrl(vehicle.primary_image?.image)}


  className="vehicle-image"
  alt="Vehicle"
  style={{ height: '200px', objectFit: 'cover' }}
/>

                        <Badge 
                          bg="secondary" 
                          className="position-absolute"
                          style={{ top: '10px', left: '10px' }}
                        >
                          {vehicle.category?.name}
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
                          <span>⚡ {vehicle.fuel_type}</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="price-tag">
                              ${vehicle.price_per_day}
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