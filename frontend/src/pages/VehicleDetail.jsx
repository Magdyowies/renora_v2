import { useParams, Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Badge, ListGroup, Alert } from 'react-bootstrap' // Added Alert for consistency
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import bookingsService from '../services/bookingsService'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import api from '../services/api'
import { getVehiclePrimaryImage } from '../utils/imageUtils' // Import the new utility

export default function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingProcessing, setBookingProcessing] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    setBookingProcessing(false);
    const fetchVehicleDetails = async () => {
      try {
        const response = await api.get(`/vehicles/${id}/`);
        setVehicle(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error('Vehicle not found.');
          navigate('/search');
        } else {
          setError('Failed to fetch vehicle details.');
          console.error('Fetch vehicle details error:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [id, navigate]);

  const handleBookNow = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/vehicle/${id}` } });
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error("Please select both a pickup and return date.");
      return;
    }
    if (new Date(pickupDate) >= new Date(returnDate)) {
      toast.error("Return date must be after the pickup date.");
      return;
    }
    setBookingProcessing(true);
    try {
      const bookingData = {
        vehicle: id,
        pickup_date: pickupDate,
        return_date: returnDate,
        pickup_location: vehicle.location || "Default Pickup Location",
        return_location: vehicle.location || "Default Return Location",
        promo_code: promoCode,
      };
      const newBooking = await bookingsService.createBooking(bookingData);
      if (newBooking && newBooking.id) {
        toast.success('Booking created successfully!');
        navigate(`/booking-success/${newBooking.id}`);
      } else {
        throw new Error("Booking creation did not return a valid ID.");
      }
    } catch (err) {
      let errorMessage = 'Booking failed. Please try again.';
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          const fieldErrors = Object.keys(errorData)
            .filter(key => Array.isArray(errorData[key]) && errorData[key].length > 0)
            .map(key => `${key.replace(/_/g, ' ')}: ${errorData[key].join(', ')}`)
            .join('; ');
          if (fieldErrors) {
            errorMessage = `Booking failed: ${fieldErrors}`;
          } else {
            errorMessage = 'Booking failed due to an unexpected server error.';
          }
        }
      }
      toast.error(errorMessage);
      console.error('Create booking error:', err);
    } finally {
      setBookingProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !vehicle) {
    return (
      <Container className="py-5 text-center">
        <h1 className="display-4 mb-3">{error || 'Vehicle Not Found'}</h1>
        <p className="text-muted mb-4">The vehicle you're looking for doesn't exist or failed to load.</p>
        <Button as={Link} to="/search" variant="primary">
          Browse All Vehicles
        </Button>
      </Container>
    );
  }

  const primaryImageUrl = getVehiclePrimaryImage(vehicle);
  const galleryImages = vehicle.images?.filter(img => img.image_url && img.image_url !== primaryImageUrl) || []; // Filter out primary image and ensure image_url exists

  return (
    <Container className="py-5">
      <Row>
        {/* Image Gallery */}
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm mb-3">
            <Card.Img
              variant="top"
              src={primaryImageUrl}
              style={{ height: '400px', objectFit: 'cover', borderRadius: '12px' }}
              alt={vehicle.name}
            />
          </Card>
          
          <Row>
            {galleryImages.map((image, index) => (
              <Col key={image.id || index} xs={6} sm={4} md={3} className="mb-3"> {/* Use image.id for key */}
                <Card className="border-0 shadow-sm">
                  <Card.Img
                    src={image.image_url}
                    style={{ height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                    alt={`${vehicle.name} - view ${index + 1}`}
                    loading="lazy"
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Description */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Description</h4>
              <p className="text-muted">{vehicle.description}</p>
              <h5 className="fw-bold mb-3 mt-4">Features</h5>
              <Row>
                {Array.isArray(vehicle.features) && vehicle.features.map((feature, index) => (
                  <Col key={index} sm={6} md={4} className="mb-2">
                    <div className="d-flex align-items-center">
                      <span className="text-success me-2">✓</span>
                      <span>{feature.name || feature}</span> {/* Adjusted for feature format */}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Booking Card */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h3 className="fw-bold mb-1">{vehicle.name}</h3>
                  <Badge bg="secondary">{vehicle.category?.name}</Badge> {/* Use optional chaining */}
                  <div className="text-muted small mt-1">{vehicle.year}</div>
                </div>
                {vehicle.status === 'available' ? (
                  <Badge bg="success">Available</Badge>
                ) : (
                  <Badge bg="danger">Unavailable</Badge>
                )}
              </div>
              <div className="d-flex align-items-center mb-4">
                <div className="text-warning fs-5">⭐ {vehicle.rating || 'N/A'}</div>
                <span className="text-muted ms-2">({vehicle.total_reviews || 0} reviews)</span> {/* Use total_reviews */}
              </div>
              <div className="price-tag mb-4">
                ${vehicle.price_per_day}<small className="text-muted fs-6">/day</small>
              </div>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="px-0">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Pickup Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Return Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">

                </ListGroup.Item>
              </ListGroup>
              <Button
                variant="primary"
                className="w-100"
                onClick={handleBookNow}
                disabled={bookingProcessing || vehicle.status !== 'available'} 
              >
                {bookingProcessing ? 'Processing...' : 'Book Now'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}