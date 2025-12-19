import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, ListGroup, Alert, Badge } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardName: z.string().min(2, 'Name must be at least 2 characters'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  billingAddress: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'Zip code is required'),
})

export default function Payment() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [days, setDays] = useState(5)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(paymentSchema),
  })

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      // Store the intended destination
      navigate('/signin', { 
        state: { from: location.pathname }
      })
    }
  }, [user, navigate, location])

  // Vehicle database with all 15 vehicles
  const vehicles = {
    1: { name: 'Tesla Model Y Performance', pricePerDay: 129, category: 'Electric SUV', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400' },
    2: { name: 'Porsche 911 Carrera', pricePerDay: 350, category: 'Sports Car', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400' },
    3: { name: 'Mercedes-Benz G-Class', pricePerDay: 400, category: 'Luxury SUV', image: 'https://images.unsplash.com/photo-1617531653520-bd4f03619e05?w=400' },
    4: { name: 'BMW M4 Competition', pricePerDay: 299, category: 'Sports Coupe', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400' },
    5: { name: 'Range Rover Autobiography', pricePerDay: 450, category: 'Luxury SUV', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400' },
    6: { name: 'Audi RS e-tron GT', pricePerDay: 399, category: 'Electric Sedan', image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=400' },
    7: { name: 'Toyota Camry Hybrid', pricePerDay: 85, category: 'Sedan', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400' },
    8: { name: 'Honda Accord Sport', pricePerDay: 75, category: 'Sedan', image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400' },
    9: { name: 'Ford Mustang GT', pricePerDay: 199, category: 'Sports Car', image: 'https://images.unsplash.com/photo-1584345604476-8ec5f12e42dd?w=400' },
    10: { name: 'Chevrolet Suburban', pricePerDay: 180, category: 'Full-Size SUV', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400' },
    11: { name: 'Nissan Leaf Plus', pricePerDay: 70, category: 'Electric Hatchback', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400' },
    12: { name: 'Volkswagen ID.4', pricePerDay: 95, category: 'Electric SUV', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400' },
    13: { name: 'Lexus ES 350', pricePerDay: 125, category: 'Luxury Sedan', image: 'https://images.unsplash.com/photo-1623869675781-80aa31f92037?w=400' },
    14: { name: 'Mazda CX-5 Turbo', pricePerDay: 90, category: 'Compact SUV', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400' },
    15: { name: 'Jeep Wrangler Rubicon', pricePerDay: 150, category: 'Off-Road SUV', image: 'https://images.unsplash.com/photo-1606016159991-35e6b36d0ea7?w=400' },
  }

  const vehicleData = vehicles[vehicleId] || { name: 'Unknown Vehicle', pricePerDay: 100, category: 'Vehicle', image: '' }

  const insurance = 25
  const tax = Math.round(vehicleData.pricePerDay * days * 0.08) // 8% tax
  const subtotal = vehicleData.pricePerDay * days
  const total = subtotal + insurance + tax

  const onSubmit = async (data) => {
    try {
      console.log('Payment data:', data)
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create booking object
      const booking = {
        id: Date.now(),
        vehicleId: vehicleId,
        vehicle: vehicleData.name,
        vehicleCategory: vehicleData.category,
        vehicleImage: vehicleData.image,
        customer: user.name || user.email,
        customerEmail: user.email,
        customerPhone: user.phone || 'N/A',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        pickupLocation: data.city,
        dropoffLocation: data.city,
        status: 'active',
        total: total,
        pricePerDay: vehicleData.pricePerDay,
        days: days,
        paymentMethod: 'Credit Card',
        cardLast4: data.cardNumber.slice(-4),
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage (simulating API call)
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      existingBookings.push(booking)
      localStorage.setItem('bookings', JSON.stringify(existingBookings))
      
      setPaymentSuccess(true)
      toast.success(`Payment of $${total} successful!`)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    }
  }

  // Show loading if not authenticated
  if (!user) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Redirecting to sign in...</p>
      </Container>
    )
  }

  // Show success message
  if (paymentSuccess) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                    }}
                  >
                    <span style={{ fontSize: '3rem' }}>✓</span>
                  </div>
                </div>
                <h2 className="fw-bold mb-3">Payment Successful!</h2>
                <p className="text-muted mb-4">
                  Your booking has been confirmed. You will receive a confirmation email shortly.
                </p>
                <Alert variant="success" className="mb-4">
                  <strong>Booking ID:</strong> #{Date.now()}<br />
                  <strong>Amount Paid:</strong> ${total}
                </Alert>
                <p className="text-muted small mb-4">
                  Redirecting to dashboard...
                </p>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h2 className="fw-bold mb-4">Complete Your Payment</h2>
          
          <Alert variant="info" className="mb-4">
            <strong>Logged in as:</strong> {user.email}
          </Alert>
          
          <Row>
            {/* Payment Form */}
            <Col md={7} className="mb-4">
              <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Payment Information</h5>
                  
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={16}
                        {...register('cardNumber')}
                        isInvalid={!!errors.cardNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cardNumber?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Cardholder Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="John Doe"
                        {...register('cardName')}
                        isInvalid={!!errors.cardName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cardName?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            {...register('expiryDate')}
                            isInvalid={!!errors.expiryDate}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.expiryDate?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="123"
                            maxLength={4}
                            {...register('cvv')}
                            isInvalid={!!errors.cvv}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.cvv?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr className="my-4" />

                    <h5 className="fw-bold mb-3">Billing Address</h5>

                    <Form.Group className="mb-3">
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="123 Main Street"
                        {...register('billingAddress')}
                        isInvalid={!!errors.billingAddress}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.billingAddress?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="New York"
                            {...register('city')}
                            isInvalid={!!errors.city}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.city?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Zip Code</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="10001"
                            {...register('zipCode')}
                            isInvalid={!!errors.zipCode}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.zipCode?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="w-100 mt-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : `Pay $${total}`}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Order Summary */}
            <Col md={5}>
              <Card className="shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Order Summary</h5>
                  
                  {vehicleData.image && (
                    <div className="mb-3">
                      <img 
                        src={vehicleData.image} 
                        alt={vehicleData.name}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <h6 className="fw-bold">{vehicleData.name}</h6>
                    <Badge bg="secondary">{vehicleData.category}</Badge>
                    <p className="text-muted small mb-2 mt-2">
                      Rental Duration
                    </p>
                    <Form.Select 
                      value={days}
                      onChange={(e) => setDays(parseInt(e.target.value))}
                      className="mb-2"
                    >
                      <option value="1">1 day</option>
                      <option value="2">2 days</option>
                      <option value="3">3 days</option>
                      <option value="5">5 days</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </Form.Select>
                  </div>

                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Rental (${vehicleData.pricePerDay} × {days} days)</span>
                      <span className="fw-semibold">${subtotal}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Insurance</span>
                      <span className="fw-semibold">${insurance}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Tax (8%)</span>
                      <span className="fw-semibold">${tax}</span>
                    </ListGroup.Item>
                  </ListGroup>

                  <hr />

                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold fs-5">Total</span>
                    <span className="fw-bold fs-5 text-primary">${total}</span>
                  </div>

                  <div className="bg-light p-3 rounded">
                    <p className="small mb-2 fw-semibold">🔒 Secure Payment</p>
                    <p className="small text-muted mb-0">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}