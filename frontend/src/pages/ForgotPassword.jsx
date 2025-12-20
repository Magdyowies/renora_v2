import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call to send reset email
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Password reset requested for:', email)
    setEmailSent(true)
    toast.success('Password reset link sent to your email!')
    setIsSubmitting(false)
  }

  const handleResend = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Email resent successfully!')
    setIsSubmitting(false)
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      background: emailSent
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      fontSize: '2.5rem'
                    }}
                  >
                    {emailSent ? '✓' : '🔒'}
                  </div>
                  <h2 className="fw-bold mb-2">
                    {emailSent ? 'Check Your Email' : 'Forgot Password?'}
                  </h2>
                  <p className="text-muted">
                    {emailSent
                      ? 'We\'ve sent password reset instructions to your email'
                      : 'No worries! Enter your email and we\'ll send you reset instructions'}
                  </p>
                </div>

                {!emailSent ? (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          border: '2px solid #e2e8f0'
                        }}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 mb-3"
                      disabled={isSubmitting}
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>

                    <div className="text-center">
                      <Link
                        to="/signin"
                        className="text-decoration-none"
                        style={{ color: '#3b82f6', fontWeight: '500' }}
                      >
                        ← Back to Sign In
                      </Link>
                    </div>
                  </Form>
                ) : (
                  <div>
                    <Alert variant="success" className="mb-4">
                      <div className="d-flex align-items-start">
                        <span className="me-2">📧</span>
                        <div>
                          <strong>Email sent to: {email}</strong>
                          <p className="mb-0 mt-1 small">
                            Click the link in the email to reset your password. The link expires in 1 hour.
                          </p>
                        </div>
                      </div>
                    </Alert>

                    <div className="bg-light p-3 rounded mb-4">
                      <p className="small fw-semibold mb-2">Didn't receive the email?</p>
                      <ul className="small text-muted mb-0 ps-3">
                        <li>Check your spam or junk folder</li>
                        <li>Make sure you entered the correct email</li>
                        <li>Wait a few minutes for the email to arrive</li>
                      </ul>
                    </div>

                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="w-100 mb-3"
                      onClick={handleResend}
                      disabled={isSubmitting}
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Resending...
                        </>
                      ) : (
                        'Resend Email'
                      )}
                    </Button>

                    <div className="text-center">
                      <Link
                        to="/signin"
                        className="text-decoration-none"
                        style={{ color: '#3b82f6', fontWeight: '500' }}
                      >
                        ← Back to Sign In
                      </Link>
                    </div>
                  </div>
                )}

                <hr className="my-4" />

                <div className="text-center">
                  <p className="text-muted small mb-2">Need help?</p>
                  <Link
                    to="/contact"
                    className="text-decoration-none small"
                    style={{ color: '#3b82f6' }}
                  >
                    Contact Support
                  </Link>
                </div>
              </Card.Body>
            </Card>

            {/* Tips */}
            <Card className="border-0 shadow-sm mt-4" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">🔐 Password Reset Tips</h6>
                <ul className="small text-muted mb-0">
                  <li className="mb-2">Use a strong password with at least 8 characters</li>
                  <li className="mb-2">Include uppercase, lowercase, numbers, and symbols</li>
                  <li className="mb-2">Don't reuse passwords from other accounts</li>
                  <li>Consider using a password manager</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}