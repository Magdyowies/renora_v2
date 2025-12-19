import { useParams, Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'

export default function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Expanded database with 15 vehicles
  const vehicleDatabase = {
    1: {
      name: 'Tesla Model Y Performance',
      category: 'Electric SUV',
      price: 129,
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
        'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800',
        'https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800',
      ],
      rating: 4.9,
      reviews: 234,
      year: 2024,
      transmission: 'Automatic',
      seats: 5,
      luggage: 3,
      fuelType: 'Electric',
      range: '330 miles',
      description: 'Experience the future of driving with the Tesla Model Y Performance. This all-electric SUV combines cutting-edge technology, exceptional performance, and zero emissions.',
      features: ['Autopilot', 'Premium Audio', 'Glass Roof', 'Heated Seats', 'Navigation', 'Supercharging', 'USB-C Charging', 'Climate Control'],
      available: true,
    },
    2: {
      name: 'Porsche 911 Carrera',
      category: 'Sports Car',
      price: 350,
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
      ],
      rating: 5.0,
      reviews: 189,
      year: 2023,
      transmission: 'Automatic PDK',
      seats: 4,
      luggage: 2,
      fuelType: 'Petrol',
      range: '380 miles',
      description: 'The legendary Porsche 911 Carrera delivers an unmatched driving experience with its iconic design, powerful engine, and precision handling.',
      features: ['Sport Chrono Package', 'BOSE Sound System', 'Adaptive Suspension', 'Sport Exhaust', 'Apple CarPlay', 'Leather Interior', 'Parking Sensors', 'Lane Assist'],
      available: true,
    },
    3: {
      name: 'Mercedes-Benz G-Class',
      category: 'Luxury SUV',
      price: 400,
      images: [
        'https://images.unsplash.com/photo-1617531653520-bd4f03619e05?w=800',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      ],
      rating: 4.8,
      reviews: 156,
      year: 2023,
      transmission: 'Automatic 9G-Tronic',
      seats: 5,
      luggage: 4,
      fuelType: 'Petrol',
      range: '410 miles',
      description: 'The iconic Mercedes-Benz G-Class combines legendary off-road capability with luxurious comfort and cutting-edge technology.',
      features: ['4MATIC All-Wheel Drive', 'Burmester Sound', 'Ambient Lighting', 'Panoramic Roof', 'Heated & Cooled Seats', '360° Camera', 'Off-Road Package', 'MBUX Infotainment'],
      available: true,
    },
    4: {
      name: 'BMW M4 Competition',
      category: 'Sports Coupe',
      price: 299,
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
        'https://images.unsplash.com/photo-1617531653497-8ff2c0e4e5a2?w=800',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      ],
      rating: 4.9,
      reviews: 201,
      year: 2024,
      transmission: 'Manual',
      seats: 4,
      luggage: 2,
      fuelType: 'Petrol',
      range: '340 miles',
      description: 'The BMW M4 Competition is a high-performance machine that delivers breathtaking acceleration and precise handling.',
      features: ['M Sport Differential', 'Carbon Fiber Roof', 'M Sport Brakes', 'Adaptive M Suspension', 'Harman Kardon Audio', 'Head-Up Display', 'Wireless Charging', 'M Drive Modes'],
      available: true,
    },
    5: {
      name: 'Range Rover Autobiography',
      category: 'Luxury SUV',
      price: 450,
      images: [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
      ],
      rating: 4.7,
      reviews: 178,
      year: 2023,
      transmission: 'Automatic',
      seats: 5,
      luggage: 5,
      fuelType: 'Petrol',
      range: '420 miles',
      description: 'The Range Rover Autobiography represents the pinnacle of luxury and refinement, combining supreme comfort with exceptional capability.',
      features: ['Terrain Response', 'Meridian Sound', 'Executive Seating', 'Dual Touchscreens', 'Air Suspension', 'Massage Seats', 'Gesture Control', 'Premium Leather'],
      available: true,
    },
    6: {
      name: 'Audi RS e-tron GT',
      category: 'Electric Sedan',
      price: 399,
      images: [
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
        'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800',
      ],
      rating: 4.9,
      reviews: 167,
      year: 2024,
      transmission: 'Automatic',
      seats: 5,
      luggage: 3,
      fuelType: 'Electric',
      range: '283 miles',
      description: 'The Audi RS e-tron GT is a stunning electric grand tourer that combines breathtaking performance with Audi\'s legendary build quality.',
      features: ['Quattro AWD', 'Bang & Olufsen Audio', 'Matrix LED Headlights', 'Sport Seats Plus', 'Virtual Cockpit', 'Fast Charging', 'Air Suspension', 'Launch Control'],
      available: true,
    },
    7: {
      name: 'Toyota Camry Hybrid',
      category: 'Sedan',
      price: 85,
      images: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
        'https://images.unsplash.com/photo-1623869675781-80aa31f92037?w=800',
      ],
      rating: 4.6,
      reviews: 342,
      year: 2024,
      transmission: 'Automatic CVT',
      seats: 5,
      luggage: 3,
      fuelType: 'Hybrid',
      range: '686 miles',
      description: 'Reliable and efficient hybrid sedan with spacious interior and advanced safety features. Perfect for daily commuting and long trips.',
      features: ['Toyota Safety Sense', 'Apple CarPlay', 'Adaptive Cruise Control', 'Lane Departure Warning', 'Premium Audio', 'Heated Seats', 'Wireless Charging', 'Blind Spot Monitor'],
      available: true,
    },
    8: {
      name: 'Honda Accord Sport',
      category: 'Sedan',
      price: 75,
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        'https://images.unsplash.com/photo-1623869675781-80aa31f92037?w=800',
      ],
      rating: 4.7,
      reviews: 298,
      year: 2024,
      transmission: 'Automatic',
      seats: 5,
      luggage: 3,
      fuelType: 'Petrol',
      range: '520 miles',
      description: 'Spacious and comfortable sedan with excellent fuel economy, modern features, and Honda\'s legendary reliability.',
      features: ['Honda Sensing', 'Sunroof', 'Heated Seats', 'Apple CarPlay', 'Android Auto', 'Dual-Zone Climate', 'Rear Camera', 'Keyless Entry'],
      available: true,
    },
    9: {
      name: 'Ford Mustang GT',
      category: 'Sports Car',
      price: 199,
      images: [
        'https://images.unsplash.com/photo-1584345604476-8ec5f12e42dd?w=800',
        'https://images.unsplash.com/photo-1569144654912-28a8e3f450c2?w=800',
        'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=800',
      ],
      rating: 4.8,
      reviews: 215,
      year: 2024,
      transmission: 'Manual 6-Speed',
      seats: 4,
      luggage: 2,
      fuelType: 'Petrol',
      range: '380 miles',
      description: 'Iconic American muscle car with powerful V8 engine, thrilling performance, and unmistakable road presence.',
      features: ['5.0L V8 Engine', 'Performance Package', 'Sport Exhaust', 'Launch Control', 'Track Apps', 'Premium Audio', 'Recaro Seats', 'Digital Cluster'],
      available: true,
    },
    10: {
      name: 'Chevrolet Suburban',
      category: 'Full-Size SUV',
      price: 180,
      images: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      ],
      rating: 4.5,
      reviews: 187,
      year: 2023,
      transmission: 'Automatic 10-Speed',
      seats: 8,
      luggage: 6,
      fuelType: 'Petrol',
      range: '460 miles',
      description: 'Full-size SUV perfect for large families. Maximum space, comfort, and towing capability for any adventure.',
      features: ['8-Passenger Seating', 'Rear Entertainment', 'Tow Package', 'Power Liftgate', 'Wireless Charging', 'Safety Suite', 'Tri-Zone Climate', 'Bose Audio'],
      available: true,
    },
    11: {
      name: 'Nissan Leaf Plus',
      category: 'Electric Hatchback',
      price: 70,
      images: [
        'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
      ],
      rating: 4.4,
      reviews: 256,
      year: 2024,
      transmission: 'Automatic',
      seats: 5,
      luggage: 3,
      fuelType: 'Electric',
      range: '226 miles',
      description: 'Affordable electric vehicle with practical range, comfortable interior, and advanced driver assistance features.',
      features: ['ProPILOT Assist', 'e-Pedal', 'Fast Charging', 'Climate Control', 'Apple CarPlay', 'Safety Shield 360', 'LED Headlights', 'Around View Monitor'],
      available: true,
    },
    12: {
      name: 'Volkswagen ID.4',
      category: 'Electric SUV',
      price: 95,
      images: [
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
        'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      ],
      rating: 4.6,
      reviews: 178,
      year: 2024,
      transmission: 'Automatic',
      seats: 5,
      luggage: 4,
      fuelType: 'Electric',
      range: '275 miles',
      description: 'Modern electric SUV with spacious interior, intuitive technology, and impressive range for daily driving.',
      features: ['AWD Available', 'Panoramic Sunroof', 'AR Head-Up Display', 'Fast Charging', 'Travel Assist', 'LED Matrix Lights', 'Wireless Charging', 'Voice Control'],
      available: true,
    },
    13: {
      name: 'Lexus ES 350',
      category: 'Luxury Sedan',
      price: 125,
      images: [
        'https://images.unsplash.com/photo-1623869675781-80aa31f92037?w=800',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
      ],
      rating: 4.8,
      reviews: 203,
      year: 2024,
      transmission: 'Automatic 8-Speed',
      seats: 5,
      luggage: 3,
      fuelType: 'Petrol',
      range: '480 miles',
      description: 'Refined luxury sedan with exceptional comfort, reliability, and premium features. The epitome of Japanese luxury.',
      features: ['Lexus Safety System+', 'Mark Levinson Audio', 'Heated/Cooled Seats', 'Panoramic View Monitor', 'Adaptive Cruise', 'Wireless Charging', 'Premium Leather', 'Ambient Lighting'],
      available: true,
    },
    14: {
      name: 'Mazda CX-5 Turbo',
      category: 'Compact SUV',
      price: 90,
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
      ],
      rating: 4.7,
      reviews: 289,
      year: 2024,
      transmission: 'Automatic 6-Speed',
      seats: 5,
      luggage: 4,
      fuelType: 'Petrol',
      range: '440 miles',
      description: 'Stylish compact SUV with sporty handling, premium interior, and excellent build quality.',
      features: ['Skyactiv Technology', 'BOSE Audio', 'i-Activsense Safety', 'Leather Interior', 'Sunroof', 'Apple CarPlay', 'Head-Up Display', 'Adaptive Headlights'],
      available: true,
    },
    15: {
      name: 'Jeep Wrangler Rubicon',
      category: 'Off-Road SUV',
      price: 150,
      images: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
      ],
      rating: 4.6,
      reviews: 312,
      year: 2024,
      transmission: 'Automatic 8-Speed',
      seats: 5,
      luggage: 3,
      fuelType: 'Petrol',
      range: '380 miles',
      description: 'Legendary off-road vehicle with removable top and doors. Built for adventure with unmatched capability.',
      features: ['4x4 Rock-Trac', 'Removable Doors & Top', 'Skid Plates', 'Tow Hooks', 'Off-Road Pages', 'Locking Differentials', 'Alpine Audio', 'Uconnect System'],
      available: true,
    },
  }

  const vehicle = vehicleDatabase[id]

  if (!vehicle) {
    return (
      <Container className="py-5 text-center">
        <h1 className="display-4 mb-3">Vehicle Not Found</h1>
        <p className="text-muted mb-4">The vehicle you're looking for doesn't exist.</p>
        <Button as={Link} to="/search" variant="primary">
          Browse All Vehicles
        </Button>
      </Container>
    )
  }

  const handleBookNow = () => {
    if (!user) {
      // Redirect to sign in, then return here
      navigate('/signin', { state: { from: `/vehicle/${id}` } })
      return
    }
    // User is logged in, proceed to payment
    navigate(`/payment/${id}`)
  }

  return (
    <Container className="py-5">
      <Row>
        {/* Image Gallery */}
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm mb-3">
            <Card.Img 
              variant="top" 
              src={vehicle.images[0]} 
              style={{ height: '400px', objectFit: 'cover', borderRadius: '12px' }}
              alt={vehicle.name}
            />
          </Card>
          
          <Row>
            {vehicle.images.slice(1).map((image, index) => (
              <Col key={index} xs={6} className="mb-3">
                <Card className="border-0 shadow-sm">
                  <Card.Img 
                    src={image} 
                    style={{ height: '200px', objectFit: 'cover', borderRadius: '12px' }}
                    alt={`${vehicle.name} ${index + 2}`}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Description */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Description</h4>
              <p className="text-muted">{vehicle.description}</p>
              
              <h5 className="fw-bold mb-3 mt-4">Features</h5>
              <Row>
                {vehicle.features.map((feature, index) => (
                  <Col key={index} sm={6} md={4} className="mb-2">
                    <div className="d-flex align-items-center">
                      <span className="text-success me-2">✓</span>
                      <span>{feature}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Booking Card */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h3 className="fw-bold mb-1">{vehicle.name}</h3>
                  <Badge bg="secondary">{vehicle.category}</Badge>
                  <div className="text-muted small mt-1">{vehicle.year}</div>
                </div>
                {vehicle.available ? (
                  <Badge bg="success">Available</Badge>
                ) : (
                  <Badge bg="danger">Unavailable</Badge>
                )}
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="text-warning fs-5">⭐ {vehicle.rating}</div>
                <span className="text-muted ms-2">({vehicle.reviews} reviews)</span>
              </div>

              <div className="price-tag mb-4">
                ${vehicle.price}<small className="text-muted fs-6">/day</small>
              </div>

              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>🚗 Transmission</span>
                  <span className="fw-semibold">{vehicle.transmission}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>👥 Seats</span>
                  <span className="fw-semibold">{vehicle.seats} people</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>🧳 Luggage</span>
                  <span className="fw-semibold">{vehicle.luggage} bags</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>⚡ Fuel Type</span>
                  <span className="fw-semibold">{vehicle.fuelType}</span>
                </ListGroup.Item>
                {vehicle.range && (
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span>🔋 Range</span>
                    <span className="fw-semibold">{vehicle.range}</span>
                  </ListGroup.Item>
                )}
              </ListGroup>

              <Button 
                onClick={handleBookNow}
                variant="primary" 
                size="lg" 
                className="w-100 mb-3"
                disabled={!vehicle.available}
              >
                {!user ? '🔒 Sign In to Book' : vehicle.available ? 'Book Now' : 'Unavailable'}
              </Button>
              
              {!user && (
                <p className="text-muted small text-center mb-3">
                  You need to sign in to make a booking
                </p>
              )}
              
              <Button 
                variant="outline-primary" 
                size="lg" 
                className="w-100"
              >
                Contact Us
              </Button>

              <div className="bg-light p-3 rounded mt-3">
                <p className="small mb-1 fw-semibold">📞 Need help?</p>
                <p className="small text-muted mb-0">
                  Call us at <a href="tel:+1234567890" className="text-decoration-none">+1 (234) 567-890</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}