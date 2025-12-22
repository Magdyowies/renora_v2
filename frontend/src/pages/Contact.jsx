import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Contact form submitted:', formData)
    toast.success('Message sent successfully! We\'ll get back to you soon.')
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
    
    setIsSubmitting(false)
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingTop: '3rem', paddingBottom: '4rem' }}>
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>Get in Touch</h1>
          <p className="text-muted fs-5">We're here to help! Reach out to us anytime.</p>
        </div>

        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <h3 className="fw-bold mb-4">Send us a Message</h3>
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Magdy Mustafa"
                          required
                          style={{ padding: '12px', borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ras@rentora.com"
                          required
                          style={{ padding: '12px', borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+20 100 123 4567"
                          style={{ padding: '12px', borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Subject *</Form.Label>
                        <Form.Select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          style={{ padding: '12px', borderRadius: '8px' }}
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="booking">Booking Question</option>
                          <option value="vehicle">Vehicle Information</option>
                          <option value="payment">Payment Issue</option>
                          <option value="business">Business Partnership</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      required
                      style={{ padding: '12px', borderRadius: '8px' }}
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    disabled={isSubmitting}
                    style={{ borderRadius: '8px', padding: '12px 40px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Contact Information</h5>
                
                <div className="mb-4">
                  <div className="d-flex align-items-start mb-3">
                    <div 
                      className="me-3"
                      style={{
                        width: '45px',
                        height: '45px',
                        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem'
                      }}
                    >
                      📞
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Phone</h6>
                      <p className="text-muted mb-0">+20 100 123 4567</p>
                      <p className="text-muted mb-0">Mon-Fri, 8AM-8PM</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3">
                    <div 
                      className="me-3"
                      style={{
                        width: '45px',
                        height: '45px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem'
                      }}
                    >
                      ✉️
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Email</h6>
                      <p className="text-muted mb-0">info@rentora.com</p>
                      <p className="text-muted mb-0">support@rentora.com</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3">
                    <div 
                      className="me-3"
                      style={{
                        width: '45px',
                        height: '45px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem'
                      }}
                    >
                      📍
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Address</h6>
                      <p className="text-muted mb-0">ITI-zagazig</p>
                      <p className="text-muted mb-0">SSharkia-Egypt</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div 
                      className="me-3"
                      style={{
                        width: '45px',
                        height: '45px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem'
                      }}
                    >
                      🕐
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Business Hours</h6>
                      <p className="text-muted mb-0">Mon-Fri: 8AM - 8PM</p>
                      <p className="text-muted mb-0">Sat-Sun: 9AM - 6PM</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

           
          </Col>
        </Row>

        {/* FAQ Section */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <h3 className="fw-bold mb-4 text-center">Frequently Asked Questions</h3>
                
                <Row>
                  <Col md={6} className="mb-4">
                    <h5 className="fw-bold mb-2">How do I book a vehicle?</h5>
                    <p className="text-muted">
                      Simply browse our vehicles, select your preferred car, choose your dates, and complete the booking process. You'll receive instant confirmation.
                    </p>
                  </Col>

                  <Col md={6} className="mb-4">
                    <h5 className="fw-bold mb-2">What payment methods do you accept?</h5>
                    <p className="text-muted">
                      We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital payment methods.
                    </p>
                  </Col>

                  <Col md={6} className="mb-4">
                    <h5 className="fw-bold mb-2">Can I cancel my booking?</h5>
                    <p className="text-muted">
                      Yes! You can cancel upcoming bookings from your dashboard. Cancellation policies vary based on how close to the pickup date you cancel.
                    </p>
                  </Col>

                  <Col md={6} className="mb-4">
                    <h5 className="fw-bold mb-2">Do you offer long-term rentals?</h5>
                    <p className="text-muted">
                      Absolutely! We offer special rates for long-term rentals (1 month+). Contact us for customized pricing and availability.
                    </p>
                  </Col>

                  <Col md={6} className="mb-4">
                    <h5 className="fw-bold mb-2">Is insurance included?</h5>
                    <p className="text-muted">
                      Basic insurance is included with all rentals. You can upgrade to premium coverage during the booking process for additional protection.
                    </p>
                  </Col>

                  <Col md={6} className="mb-4">
                    <h5 className="fw-bold mb-2">What if I have an emergency?</h5>
                    <p className="text-muted">
                      We provide 24/7 roadside assistance for all our vehicles. Contact our emergency hotline anytime at +1 (234) 567-8999.
                    </p>
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    Still have questions? <a href="#" className="text-decoration-none">Visit our Help Center</a>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  )
}