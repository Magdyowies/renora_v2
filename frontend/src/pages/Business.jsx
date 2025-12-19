import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'

export default function Business() {
  const navigate = useNavigate()
  const contactFormRef = useRef(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    fleetSize: ''
  })

  const benefits = [
    {
      icon: '💼',
      title: 'Corporate Accounts',
      description: 'Dedicated account management with customized rates and billing solutions for your business'
    },
    {
      icon: '📊',
      title: 'Fleet Management',
      description: 'Manage your entire company fleet from one dashboard with detailed reporting and analytics'
    },
    {
      icon: '💰',
      title: 'Volume Discounts',
      description: 'Save up to 30% with our tiered pricing structure for corporate and bulk bookings'
    },
    {
      icon: '🔄',
      title: 'Flexible Terms',
      description: 'From daily rentals to long-term leases, we offer flexible solutions that fit your needs'
    },
    {
      icon: '📱',
      title: 'Mobile App Access',
      description: 'Empower your team with our mobile app for easy booking and vehicle management on the go'
    },
    {
      icon: '🎯',
      title: 'Priority Support',
      description: '24/7 dedicated support line for all your business rental needs and emergency assistance'
    }
  ]

  const industries = [
    { name: 'Technology', icon: '💻' },
    { name: 'Healthcare', icon: '🏥' },
    { name: 'Finance', icon: '💵' },
    { name: 'Real Estate', icon: '🏢' },
    { name: 'Construction', icon: '🏗️' },
    { name: 'Consulting', icon: '📈' }
  ]

  const scrollToContact = () => {
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleGetStarted = () => {
    // Redirect to search page or open contact form
    navigate('/search')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Business inquiry:', formData)
    
    // Show success modal
    setShowModal(true)
    
    // Reset form
    setFormData({
      companyName: '',
      email: '',
      phone: '',
      fleetSize: ''
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div style={{ backgroundColor: '#fafafa' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '6rem 0'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-3 fw-bold mb-4">
                Rentora for Business
              </h1>
              <p className="lead mb-4">
                Power your business with flexible vehicle solutions. 
                From startups to enterprises, we provide scalable rental 
                solutions tailored to your company's needs.
              </p>
              <div className="d-flex gap-3">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  style={{ 
                    background: '#14b8a6', 
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 32px'
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg"
                  variant="outline-light"
                  onClick={scrollToContact}
                  style={{ 
                    borderRadius: '10px',
                    padding: '12px 32px'
                  }}
                >
                  Contact Sales
                </Button>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div 
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '3rem',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <h3 className="fw-bold mb-4">Trusted by 500+ Companies</h3>
                <div className="d-flex gap-3 mb-3">
                  {industries.slice(0, 3).map((industry, i) => (
                    <div 
                      key={i}
                      style={{
                        background: 'rgba(238, 203, 203, 0.2)',
                        padding: '1rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        flex: 1
                      }}
                    >
                      <div className="fs-2 mb-2">{industry.icon}</div>
                      <small>{industry.name}</small>
                    </div>
                  ))}
                </div>
                <div className="d-flex gap-3">
                  {industries.slice(3).map((industry, i) => (
                    <div 
                      key={i}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '1rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        flex: 1
                      }}
                    >
                      <div className="fs-2 mb-2">{industry.icon}</div>
                      <small>{industry.name}</small>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Benefits Section */}
      <Container className="py-5 my-5">
        <h2 className="text-center fw-bold mb-5">Why Businesses Choose Rentora</h2>
        <Row className="g-4">
          {benefits.map((benefit, index) => (
            <Col key={index} md={6} lg={4}>
              <Card className="border-0 shadow-sm h-100 card-hover" style={{ borderRadius: '16px' }}>
                <Card.Body className="p-4">
                  <h4 className="fw-bold mb-3">{benefit.title}</h4>
                  <p className="text-muted mb-0">{benefit.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Stats Section */}
      <div style={{ background: 'white', padding: '5rem 0' }}>
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-4 mb-md-0">
              <h2 className="fw-bold mb-2" style={{ fontSize: '3rem', color: '#14b8a6' }}>500+</h2>
              <p className="text-muted fw-semibold">Business Clients</p>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h2 className="fw-bold mb-2" style={{ fontSize: '3rem', color: '#14b8a6' }}>10K+</h2>
              <p className="text-muted fw-semibold">Fleet Vehicles</p>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h2 className="fw-bold mb-2" style={{ fontSize: '3rem', color: '#14b8a6' }}>98%</h2>
              <p className="text-muted fw-semibold">Client Satisfaction</p>
            </Col>
            <Col md={3}>
              <h2 className="fw-bold mb-2" style={{ fontSize: '3rem', color: '#14b8a6' }}>24/7</h2>
              <p className="text-muted fw-semibold">Support Available</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contact Form */}
      <Container className="py-5 my-5" ref={contactFormRef}>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5">
                <h2 className="fw-bold mb-4 text-center">Request a Business Account</h2>
                <p className="text-muted text-center mb-4">
                  Fill out the form below and our business team will contact you within 24 hours
                </p>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Company Name *</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          style={{ borderRadius: '10px' }}
                          placeholder="Acme Inc."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Work Email *</Form.Label>
                        <Form.Control
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          style={{ borderRadius: '10px' }}
                          placeholder="you@company.com"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Phone Number *</Form.Label>
                        <Form.Control
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          style={{ borderRadius: '10px' }}
                          placeholder="+1 (555) 000-0000"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Estimated Fleet Size *</Form.Label>
                        <Form.Select
                          required
                          value={formData.fleetSize}
                          onChange={(e) => setFormData({...formData, fleetSize: e.target.value})}
                          style={{ borderRadius: '10px' }}
                        >
                          <option value="">Select size</option>
                          <option value="1-5">1-5 vehicles</option>
                          <option value="6-20">6-20 vehicles</option>
                          <option value="21-50">21-50 vehicles</option>
                          <option value="50+">50+ vehicles</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 mt-3"
                    style={{ 
                      background: '#14b8a6', 
                      border: 'none',
                      borderRadius: '10px',
                      padding: '14px'
                    }}
                  >
                    Submit Request
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Success Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body className="text-center p-5">
          <div 
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem'
            }}
          >
            ✓
          </div>
          <h3 className="fw-bold mb-3">Request Submitted!</h3>
          <p className="text-muted mb-4">
            Thank you for your interest in Rentora for Business. 
            Our team will contact you within 24 hours to discuss your needs.
          </p>
          <Button 
            onClick={handleCloseModal}
            style={{ 
              background: '#14b8a6', 
              border: 'none',
              borderRadius: '10px',
              padding: '10px 30px'
            }}
          >
            Got it!
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  )
}