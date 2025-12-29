import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import profileService from '../services/profileService'
import userStatsService from '../services/userStatsService' // Import userStatsService
import LoadingSpinner from '../components/LoadingSpinner'

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [userStats, setUserStats] = useState(null) // Add state for user stats
  const [userStatsLoading, setUserStatsLoading] = useState(true) // Add state for user stats loading

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    country: '',
    driver_license: '',
    driver_license_expiry: '',
    avatar: null,
  })

  /* =========================
     Fetch profile and user stats
  ========================= */
  useEffect(() => {
    if (!isAuthenticated) {
      if (!authLoading) {
        setProfileLoading(false)
        setUserStatsLoading(false) // Also set stats loading to false if not authenticated
      }
      return
    }

    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile()
        setProfileData(data)
        setFormData({
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          driver_license: data.driver_license || '',
          driver_license_expiry: data.driver_license_expiry || '',
          avatar: null,
        })
      } catch (error) {
        toast.error('Failed to fetch profile')
        console.error(error)
      } finally {
        setProfileLoading(false)
      }
    }

    const fetchUserStats = async () => {
      try {
        if (user?.id) { // Ensure user.id is available before fetching stats
          const stats = await userStatsService.getUserStats(user.id);
          setUserStats(stats);
        }
      } catch (error) {
        toast.error('Failed to fetch user stats');
        console.error(error);
      } finally {
        setUserStatsLoading(false);
      }
    };

    fetchProfile()
    fetchUserStats(); // Call fetchUserStats
  }, [isAuthenticated, authLoading, user?.id]) // Depend on user.id

  /* =========================
     Handlers
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      avatar: e.target.files[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const payload = new FormData()
      payload.append('address', formData.address)
      payload.append('city', formData.city)
      payload.append('country', formData.country)
      payload.append('driver_license', formData.driver_license)
      payload.append('driver_license_expiry', formData.driver_license_expiry)

      if (formData.avatar) {
        payload.append('avatar', formData.avatar)
      }

      const updated = await profileService.updateProfile(payload)
      setProfileData(updated)
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = () => {
    if (!profileData) return
    setFormData({
      address: profileData.address || '',
      city: profileData.city || '',
      country: profileData.country || '',
      driver_license: profileData.driver_license || '',
      driver_license_expiry: profileData.driver_license_expiry || '',
      avatar: null,
    })
    setIsEditing(false)
  }

  /* =========================
     Loading
  ========================= */
  if (profileLoading || authLoading || userStatsLoading) { // Update loading condition
    return <LoadingSpinner />
  }

  const displayUserName = user?.first_name || user?.email || 'User'
  const isAdmin = user?.role === 'admin'

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        <h1 className="fw-bold mb-2">My Profile</h1>
        <p className="text-muted mb-4">Manage your account information</p>

        <Row>
          {/* ================= Profile Card ================= */}
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: '#0d9488',
                    color: '#fff',
                    fontSize: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  {displayUserName.charAt(0).toUpperCase()}
                </div>

                <h4 className="fw-bold">{displayUserName}</h4>
                <p className="text-muted">{user?.email}</p>

                {isAdmin && <span className="badge bg-warning text-dark">Admin</span>}

                <Button
                  className="w-100 mt-3"
                  variant="outline-primary"
                  onClick={() => setIsEditing((v) => !v)}
                  disabled={updating}
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
              </Card.Body>
            </Card>

            {/* Account Stats Card - Dynamic */}
            {userStats && (
            <Card className="border-0 shadow-sm mt-3">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">Account Stats</h6>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Total Bookings</span>
                    <span className="fw-bold">{userStats.totalBookings}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Total Spent</span>
                    <span className="fw-bold">${userStats.totalSpent.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Active Rentals</span>
                    <span className="fw-bold">{userStats.activeRentals}</span>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Completed Rentals</span>
                    <span className="fw-bold">{userStats.completedRentals}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
            )}
          </Col>

          {/* ================= Form ================= */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-bold mb-4">Personal Information</h5>

                <Form onSubmit={handleSubmit}>
                  {/* Read only */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control value={user?.email || ''} disabled />
                  </Form.Group>

                  {/* Editable */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!isEditing || updating}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!isEditing || updating}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          disabled={!isEditing || updating}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Driver License Expiry</Form.Label>
                        <Form.Control
                          type="date"
                          name="driver_license_expiry"
                          value={formData.driver_license_expiry}
                          onChange={handleChange}
                          disabled={!isEditing || updating}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Driver License</Form.Label>
                    <Form.Control
                      name="driver_license"
                      value={formData.driver_license}
                      onChange={handleChange}
                      disabled={!isEditing || updating}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Avatar</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={!isEditing || updating}
                    />
                  </Form.Group>

                  {isEditing && (
                    <div className="d-flex gap-2 mt-4">
                      <Button type="submit" disabled={updating}>
                        {updating ? 'Saving...' : 'Save'}
                      </Button>
                      <Button variant="outline-secondary" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}