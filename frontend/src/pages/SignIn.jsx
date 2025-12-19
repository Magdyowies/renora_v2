import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

export default function SignIn() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data) => {
    try {
      console.log('Sign in data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Use auth context login
      const { isAdmin } = login(data.email, data.password)
      
      if (isAdmin) {
        toast.success('Welcome back, Admin!')
        navigate('/dashboard')
      } else {
        toast.success('Signed in successfully!')
        navigate('/') // Regular users go to home
      }
    } catch (error) {
      toast.error('Sign in failed. Please try again.')
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Sign in to your account</p>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Admin: admin@rentora.com | User: any other email
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    {...register('remember')}
                  />
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted mb-3">Or sign in with</p>
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" className="flex-fill">
                    <i className="bi bi-google me-2"></i> Google
                  </Button>
                  <Button variant="outline-secondary" className="flex-fill">
                    <i className="bi bi-facebook me-2"></i> Facebook
                  </Button>
                </div>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="text-decoration-none fw-bold">
                    Sign up
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}