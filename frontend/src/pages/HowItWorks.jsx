import { Container, Row, Col, Card } from 'react-bootstrap'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: '🔍',
      title: 'Search & Select',
      description: 'Browse our extensive collection of premium vehicles. Use filters to find the perfect car that matches your needs and budget.'
    },
    {
      number: '02',
      icon: '📅',
      title: 'Book Online',
      description: 'Choose your pickup date, location, and duration. Complete your reservation in minutes with our seamless booking process.'
    },
    {
      number: '03',
      icon: '🔐',
      title: 'Verify & Pay',
      description: 'Upload your driving license and make a secure payment. We accept all major credit cards and digital payment methods.'
    },
    {
      number: '04',
      icon: <img
            src={"/favicon.png"}
            alt="Rentora Logo"
            style={{ height: "40px", width: "auto" }}
          />,
      title: 'Pick Up & Drive',
      description: 'Collect your vehicle from our convenient location. Our team will walk you through the vehicle features before you hit the road.'
    }
  ]

  const features = [
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Book in seconds with our streamlined process'
    },
    {
      icon: '🛡️',
      title: 'Fully Insured',
      description: 'All rentals include comprehensive insurance'
    },
    {
      icon: '💳',
      title: 'Flexible Payment',
      description: 'Multiple payment options available'
    },
    {
      icon: '📱',
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance'
    },
    {
      icon: '🔄',
      title: 'Free Cancellation',
      description: 'Cancel up to 24 hours before pickup'
    },
    {
      icon: '🌟',
      title: 'Premium Fleet',
      description: 'Only the newest, well-maintained vehicles'
    }
  ]

  return (
    <div style={{ backgroundColor: '#fafafa' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        color: 'white',
        padding: '5rem 0 4rem'
      }}>
        <Container>
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-3">How It Works</h1>
            <p className="lead" style={{ maxWidth: '700px', margin: '0 auto' }}>
              Renting a car with Rentora is simple, fast, and secure. 
              Follow these easy steps to get on the road in minutes.
            </p>
          </div>
        </Container>
      </div>

      {/* Steps Section */}
      <Container className="py-5">
        <Row className="g-4 my-5">
          {steps.map((step, index) => (
            <Col key={index} md={6} lg={3}>
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                <Card.Body className="p-4 text-center">
                  <div 
                    className="mb-3 fw-bold" 
                    style={{ 
                      fontSize: '3rem', 
                      color: '#e2e8f0',
                      fontFamily: 'monospace'
                    }}
                  >
                    {step.number}
                  </div>
                  
                  <h4 className="fw-bold mb-3">{step.title}</h4>
                  <p className="text-muted">{step.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Features Grid */}
      <div style={{ backgroundColor: 'white', padding: '5rem 0' }}>
        <Container>
          <h2 className="text-center fw-bold mb-5">Why Choose Rentora</h2>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} md={6} lg={4}>
                <div className="d-flex align-items-start">
                  
                  <div>
                    <h5 className="fw-bold mb-2">{feature.title}</h5>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* FAQ Section */}
      <Container className="py-5 my-5">
        <h2 className="text-center fw-bold mb-5">Frequently Asked Questions</h2>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-2">What do I need to rent a car?</h5>
                <p className="text-muted mb-0">
                  You need a valid driver's license, a credit card, and to be at least 21 years old. 
                  International drivers may need an International Driving Permit.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-2">Can I modify or cancel my booking?</h5>
                <p className="text-muted mb-0">
                  Yes! You can modify or cancel your booking up to 24 hours before pickup for a full refund. 
                  Changes can be made through your dashboard.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-2">Is insurance included?</h5>
                <p className="text-muted mb-0">
                  All rentals include comprehensive insurance coverage. Additional coverage options 
                  are available at checkout for extra peace of mind.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-2">What if I have an accident or breakdown?</h5>
                <p className="text-muted mb-0">
                  We provide 24/7 roadside assistance. Contact our support team immediately, 
                  and we'll guide you through the process and arrange help if needed.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}