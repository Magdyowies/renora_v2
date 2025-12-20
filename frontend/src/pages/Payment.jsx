import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, ListGroup, Alert, Badge, Spinner } from 'react-bootstrap'
import { format } from 'date-fns'; // Import format for date display
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import paymentsService from '../services/paymentsService' // Import paymentsService
import bookingsService from '../services/bookingsService' // Import bookingsService
import LoadingSpinner from '../components/LoadingSpinner' // Assuming LoadingSpinner is directly in components

// Payment-related components
import WalletBalance from '../components/payments/WalletBalance'
import WalletTransactions from '../components/payments/WalletTransactions'
import PaymentHistory from '../components/payments/PaymentHistory'
import ApplyPromoCode from '../components/payments/ApplyPromoCode'

const paymentSchema = z.object({
  // Card details are conditional based on payment method
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  billingAddress: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
}).superRefine((data, ctx) => {
    // Only validate card details if method is not 'wallet'
    // This logic will be handled more explicitly in onSubmit based on selectedPaymentMethod
    // For Zod schema, it's difficult to make fields conditionally required based on dynamic state outside the schema.
    // We'll rely more on onSubmit validation and backend.
    if (data.method !== 'wallet') { // Placeholder for conditional validation
      if (!data.cardNumber) ctx.addIssue({ path: ['cardNumber'], message: 'Card number is required' });
      if (!data.cardName) ctx.addIssue({ path: ['cardName'], message: 'Card name is required' });
      if (!data.expiryDate) ctx.addIssue({ path: ['expiryDate'], message: 'Expiry date is required' });
      if (!data.cvv) ctx.addIssue({ path: ['cvv'], message: 'CVV is required' });
    }
});

export default function Payment() {
  const { bookingId } = useParams() // Changed from vehicleId to bookingId
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [bookingDetails, setBookingDetails] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(true)
  const [bookingError, setBookingError] = useState(null)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet') // Default to wallet
  const [promoCodeResult, setPromoCodeResult] = useState(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0); // To check wallet balance before payment


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
  })

  // =========================
  // Fetch Booking Details on Mount
  // =========================
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return;
    }

    if (!bookingId) {
      setBookingError('Invalid payment link. Please check your bookings or try again.'); // Updated message
      setBookingLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const data = await bookingsService.getBookingDetails(bookingId);
        // CRITICAL RULE: User can ONLY pay for their own booking
        if (data.customer.id !== user.id) {
          setBookingError('You are not authorized to pay for this booking.');
          toast.error('You are not authorized to pay for this booking.');
          setBookingLoading(false);
          return;
        }
        setBookingDetails(data);
      } catch (err) {
        setBookingError('Failed to fetch booking details. Please try again later.');
        toast.error('Failed to fetch booking details.');
        console.error('Error fetching booking details:', err);
      } finally {
        setBookingLoading(false);
      }
    };

    const fetchWalletInitialBalance = async () => {
      try {
        const wallet = await paymentsService.getWalletBalance();
        setWalletBalance(wallet.balance);
      } catch (err) {
        // Log error, but don't stop payment flow if wallet balance fetch fails
        console.error('Failed to fetch initial wallet balance:', err);
      }
    };

    fetchBookingDetails();
    fetchWalletInitialBalance();
  }, [bookingId, navigate, location, user]);

  // =========================
  // Payment Submission
  // =========================
  const onSubmit = async () => {
    setPaymentProcessing(true);
    setPaymentSuccess(false);

    if (!bookingDetails) {
      toast.error('Booking details not loaded.');
      setPaymentProcessing(false);
      return;
    }

    // Determine final amount to pay
    const amountToPay = promoCodeResult?.final_amount || bookingDetails.total_price;

    // Validate wallet balance if paying with wallet
    if (selectedPaymentMethod === 'wallet' && walletBalance < amountToPay) {
      toast.error('Insufficient wallet balance. Please choose another payment method or top up your wallet.');
      setPaymentProcessing(false);
      return;
    }

    try {
      const paymentPayload = {
        booking_id: bookingDetails.id,
        method: selectedPaymentMethod,
        promo_code: promoCodeResult?.valid ? promoCodeResult.code : null,
      };

      const result = await paymentsService.createPayment(paymentPayload.booking_id, paymentPayload.method, paymentPayload.promo_code);

      if (result.redirect_url) {
        // Redirect to external payment gateway (e.g., Stripe, PayPal)
        window.location.href = result.redirect_url;
      } else {
        // Assume payment is completed or pending if no redirect
        setPaymentSuccess(true);
        toast.success(`Payment status: ${result.status}. You will be redirected shortly.`);
        
        // Update wallet balance after successful wallet payment
        if (selectedPaymentMethod === 'wallet') {
          const updatedWallet = await paymentsService.getWalletBalance();
          setWalletBalance(updatedWallet.balance);
        }

        setTimeout(() => {
          navigate('/dashboard'); // Or '/my-bookings'
        }, 2000);
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment creation error:', error);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // =========================
  // Initial Loading and Error Handling for Booking
  // =========================
  if (bookingLoading) {
    return <LoadingSpinner />;
  }

  // Handle missing bookingId first if not loading and bookingId is not present
  if (!bookingId) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error!</Alert.Heading>
          <p>Invalid payment link. Please check your bookings.</p>
          <hr />
          <Button as={Link} to="/my-bookings" variant="primary">
            Go to My Bookings
          </Button>
        </Alert>
      </Container>
    );
  }

  if (bookingError || !bookingDetails) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{bookingError || 'Failed to load booking details.'}</p>
          <hr />
          <Button onClick={() => navigate('/my-bookings')} variant="primary">
            Go to My Bookings
          </Button>
        </Alert>
      </Container>
    );
  }

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
                  <strong>Booking ID:</strong> #{bookingDetails.id}<br />
                  <strong>Amount Paid:</strong> ${promoCodeResult?.final_amount?.toFixed(2) || bookingDetails.total_price?.toFixed(2)}
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

  // Final amount to display (after potential promo code)
  const finalDisplayAmount = promoCodeResult?.final_amount || bookingDetails.total_price;


  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h2 className="fw-bold mb-4">Complete Your Payment</h2>
          
          <Alert variant="info" className="mb-4">
            <strong>Logged in as:</strong> {user?.email}
          </Alert>
          
          <Row>
            {/* Payment Form */}
            <Col md={7} className="mb-4">
              <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Payment Information</h5>
                  
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Payment Method Selector */}
                    <Form.Group className="mb-3">
                      <Form.Label>Select Payment Method</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedPaymentMethod}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        disabled={paymentProcessing}
                      >
                        <option value="wallet">Wallet Balance ({walletBalance?.toFixed(2)} EGP available)</option>
                        <option value="stripe">Credit Card (Stripe)</option>
                        {/* <option value="paypal">PayPal</option>
                        <option value="fawry">Fawry</option> */}
                      </Form.Control>
                    </Form.Group>

                    {/* Credit Card Details (Conditional) */}
                    {selectedPaymentMethod === 'stripe' && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Card Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength={16}
                            {...register('cardNumber', { required: "Card number is required" })}
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
                            {...register('cardName', { required: "Cardholder name is required" })}
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
                                {...register('expiryDate', { required: "Expiry date is required" })}
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
                                {...register('cvv', { required: "CVV is required" })}
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
                            {...register('billingAddress', { required: "Billing address is required" })}
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
                                {...register('city', { required: "City is required" })}
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
                                {...register('zipCode', { required: "Zip code is required" })}
                                isInvalid={!!errors.zipCode}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.zipCode?.message}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </>
                    )}

                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="w-100 mt-3"
                      disabled={paymentProcessing || !bookingDetails || bookingDetails.status !== 'pending'}
                    >
                      {paymentProcessing ? 'Processing...' : `Pay $${finalDisplayAmount?.toFixed(2)}`}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

              {/* Promo Code Section */}
              {bookingDetails && (
                <ApplyPromoCode 
                  bookingAmount={bookingDetails.total_price} 
                  onPromoApplied={setPromoCodeResult} 
                />
              )}
            </Col>

            {/* Order Summary & Wallet / History */}
            <Col md={5}>
              <Card className="shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Order Summary</h5>
                  
                  {bookingDetails.vehicle.primary_image?.image && ( // Changed from .image to .primary_image?.image
                    <div className="mb-3">
                      <img 
                        src={bookingDetails.vehicle.primary_image.image} 
                        alt={bookingDetails.vehicle.name}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <h6 className="fw-bold">{bookingDetails.vehicle.name}</h6>
                    <Badge bg="secondary">{bookingDetails.vehicle.category_name}</Badge> {/* Changed .category to .category_name */}
                    <p className="text-muted small mb-2 mt-2">Booking ID: {bookingDetails.id}</p>
                  </div>

                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Vehicle Daily Rate</span>
                      <span className="fw-semibold">${bookingDetails.vehicle.daily_rate?.toFixed(2)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Pickup Date</span>
                      <span className="fw-semibold">{format(new Date(bookingDetails.pickup_date), 'MMM dd, yyyy')}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Return Date</span>
                      <span className="fw-semibold">{format(new Date(bookingDetails.return_date), 'MMM dd, yyyy')}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Total Days</span>
                      <span className="fw-semibold">{bookingDetails.total_days} days</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Booking Status</span>
                      <Badge bg="info" className="text-capitalize">{bookingDetails.status}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Booking Total</span>
                      <span className="fw-semibold">${bookingDetails.total_price?.toFixed(2)}</span>
                    </ListGroup.Item>
                    {promoCodeResult?.valid && (
                      <>
                        <ListGroup.Item className="d-flex justify-content-between px-0 text-success">
                          <span>Promo Discount</span>
                          <span className="fw-semibold">-${promoCodeResult.discount_amount?.toFixed(2)}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0 fw-bold">
                          <span>Amount after discount</span>
                          <span className="fw-semibold">${promoCodeResult.final_amount?.toFixed(2)}</span>
                        </ListGroup.Item>
                      </>
                    )}
                  </ListGroup>

                  <hr />

                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold fs-5">Total Payment</span>
                    <span className="fw-bold fs-5 text-primary">${finalDisplayAmount?.toFixed(2)}</span>
                  </div>

                  <div className="bg-light p-3 rounded">
                    <p className="small mb-2 fw-semibold">🔒 Secure Payment</p>
                    <p className="small text-muted mb-0">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Wallet and History Components (Read-only) */}
              <WalletBalance />
              <WalletTransactions />
              <PaymentHistory />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}