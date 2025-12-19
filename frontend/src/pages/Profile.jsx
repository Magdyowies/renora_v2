import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'San Francisco',
    zipCode: '94102',
    country: 'United States'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Update user context
    updateUser({ name: formData.name, email: formData.email })
    
    toast.success('Profile updated successfully!')
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street',
      city: 'San Francisco',
      zipCode: '94102',
      country: 'United States'
    })
    setIsEditing(false)
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Container>
        <div className="mb-4">
          <h1 className="fw-bold mb-2">My Profile</h1>
          <p className="text-muted">Manage your account information</p>
        </div>

        <Row>
          {/* Profile Card */}
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <div 
                  style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    margin: '0 auto 1.5rem',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h4 className="fw-bold mb-1">{user?.name || 'User'}</h4>
                <p className="text-muted mb-3">{user?.email}</p>
                <div className="d-flex gap-2 justify-content-center mb-3">
                  {user?.isAdmin && (
                    <span className="badge bg-warning text-dark">Admin</span>
                  )}
                  <span className="badge bg-success">Verified</span>
                </div>
                <Button 
                  variant="outline-primary" 
                  className="w-100"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
              </Card.Body>
            </Card>

            {/* Stats Card */}
            <Card className="border-0 shadow-sm mt-3">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">Account Stats</h6>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Total Bookings</span>
                    <span className="fw-bold">3</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Total Spent</span>
                    <span className="fw-bold">$3,190</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Loyalty Points</span>
                    <span className="fw-bold text-primary">1,250 pts</span>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Member Since</span>
                    <span className="fw-bold">Jan 2024</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Information Form */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Personal Information</h5>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          disabled={!isEditing}
                          style={{ borderRadius: '10px' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={!isEditing}
                          style={{ borderRadius: '10px' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={!isEditing}
                          style={{ borderRadius: '10px' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Country</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                          disabled={!isEditing}
                          style={{ borderRadius: '10px' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Street Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      disabled={!isEditing}
                      style={{ borderRadius: '10px' }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">City</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          disabled={!isEditing}
                          style={{ borderRadius: '10px' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Zip Code</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                          disabled={!isEditing}
                          style={{ borderRadius: '10px' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {isEditing && (
                    <div className="d-flex gap-2 mt-4">
                      <Button 
                        type="submit" 
                        variant="primary"
                        style={{ borderRadius: '10px' }}
                      >
                        Save Changes
                      </Button>
                      <Button 
                        type="button"
                        variant="outline-secondary"
                        onClick={handleCancel}
                        style={{ borderRadius: '10px' }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>

            {/* Security Card */}
            <Card className="border-0 shadow-sm mt-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Security</h5>
                <div className="mb-3">
                  <Button variant="outline-primary" style={{ borderRadius: '10px' }}>
                    Change Password
                  </Button>
                </div>
                <div>
                  <Button variant="outline-danger" style={{ borderRadius: '10px' }}>
                    Delete Account
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}