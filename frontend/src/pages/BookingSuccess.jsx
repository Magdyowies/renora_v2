import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap';
import bookingsService from '../services/bookingsService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function BookingSuccess() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!bookingId) {
      setError('Invalid booking link. Please check your bookings or try again.');
      setLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const data = await bookingsService.getBookingDetails(bookingId);
        setBookingDetails(data);
      } catch (err) {
        setError('Failed to fetch booking details. Please try again.');
        console.error('Fetch booking details error:', err);
        toast.error('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, isAuthenticated, navigate]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading booking details...</p>
      </Container>
    );
  }

  if (error || !bookingDetails) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error || 'Booking details could not be loaded.'}</p>
          <hr />
          <Button as={Link} to="/my-bookings" variant="primary">
            Go to My Bookings
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 text-center">
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
                  <span style={{ fontSize: '3rem', color: 'white' }}>✓</span>
                </div>
              </div>
              <h2 className="fw-bold mb-3">Booking Created Successfully!</h2>
              <p className="text-muted mb-4">
                Your booking has been created. Proceed to payment to confirm your reservation.
              </p>

              <Alert variant="success" className="text-start mb-4">
                <h5 className="fw-bold mb-2">Booking Summary</h5>
                <Row className="mb-2">
                  <Col xs={5} className="text-muted">Booking ID:</Col>
                  <Col xs={7} className="fw-semibold">#{bookingDetails.id}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={5} className="text-muted">Vehicle:</Col>
                  <Col xs={7} className="fw-semibold">{bookingDetails.vehicle_details.name}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={5} className="text-muted">Dates:</Col>
                  <Col xs={7} className="fw-semibold">
                    {format(new Date(bookingDetails.pickup_date), 'MMM dd, yyyy')} - {format(new Date(bookingDetails.return_date), 'MMM dd, yyyy')}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={5} className="text-muted">Total Price:</Col>
                  <Col xs={7} className="fw-semibold">${Number(bookingDetails.final_price)?.toFixed(2)}</Col>
                </Row>
                <Row>
                  <Col xs={5} className="text-muted">Status:</Col>
                  <Col xs={7}>
                    <Badge bg="warning" className="text-capitalize">
                      {bookingDetails.status}
                    </Badge>
                  </Col>
                </Row>
              </Alert>

              <Button 
                as={Link} 
                to={`/payment/${bookingDetails.id}`} 
                variant="primary" 
                size="lg" 
                className="w-100"
              >
                Proceed to Payment
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
