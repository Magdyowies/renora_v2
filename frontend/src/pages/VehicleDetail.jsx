import { useParams, Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react' // Import useState and useEffect
import bookingsService from '../services/bookingsService' // Import bookingsService
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import toast from 'react-hot-toast'; // Import toast
import api from '../services/api'; // Import api

export default function VehicleDetail() {

  const { id } = useParams()

  const navigate = useNavigate()

  const { user } = useAuth()

  const [vehicle, setVehicle] = useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  const [bookingProcessing, setBookingProcessing] = useState(false);





  useEffect(() => {

    const fetchVehicleDetails = async () => {

      try {

        // This endpoint is assumed to exist. If not, this will fail.

        const response = await api.get(`/vehicles/${id}/`); 

        setVehicle(response.data);

            } catch (err) {

              if (err.response?.status === 404) {

                toast.error('Vehicle not found.');

                navigate('/search'); // Redirect to search page

              } else {

                setError('Failed to fetch vehicle details.');

                console.error('Fetch vehicle details error:', err);

              }

            } finally {

              setLoading(false);

            }

          };

    fetchVehicleDetails();

  }, [id]);



  const handleBookNow = async () => {

    if (!user) {

      navigate('/login', { state: { from: `/vehicle/${id}` } });

      return;

    }



    setBookingProcessing(true);

    try {

      // These dates are placeholders. A real implementation would use a date picker.

      const bookingData = {

        vehicle: id,

        start_date: new Date().toISOString().split('T')[0],

        end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

      };

      const newBooking = await bookingsService.createBooking(bookingData);

      

      if (newBooking && newBooking.id) {

        toast.success('Booking created! Proceed to payment.');

        navigate(`/payment/${newBooking.id}`);

      } else {

        throw new Error("Booking creation did not return a valid ID.");

      }



    } catch (err) {

      toast.error('Failed to create booking. Please try again.');

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



  return (

    <Container className="py-5">

      <Row>

        {/* Image Gallery */}

        <Col lg={8} className="mb-4">

          <Card className="border-0 shadow-sm mb-3">

            <Card.Img 

              variant="top" 

              src={vehicle.images[0]?.image || 'https://via.placeholder.com/800x400'} 

              style={{ height: '400px', objectFit: 'cover', borderRadius: '12px' }}

              alt={vehicle.name}

            />

          </Card>

          

          <Row>

            {vehicle.images?.slice(1).map((image, index) => (

              <Col key={image.id} xs={6} className="mb-3">

                <Card className="border-0 shadow-sm">

                  <Card.Img 

                    src={image.image} 

                    style={{ height: '200px', objectFit: 'cover', borderRadius: '12px' }}

                    alt={`${vehicle.name} ${index + 2}`}

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

                {vehicle.features?.map((feature, index) => (

                  <Col key={index} sm={6} md={4} className="mb-2">

                    <div className="d-flex align-items-center">

                      <span className="text-success me-2">✓</span>

                      <span>{feature.name}</span>

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

                  <Badge bg="secondary">{vehicle.category_name}</Badge>

                  <div className="text-muted small mt-1">{vehicle.year}</div>

                </div>

                {vehicle.is_available ? (

                  <Badge bg="success">Available</Badge>

                ) : (

                  <Badge bg="danger">Unavailable</Badge>

                )}

              </div>



              <div className="d-flex align-items-center mb-4">

                <div className="text-warning fs-5">⭐ {vehicle.rating || 'N/A'}</div>

                <span className="text-muted ms-2">({vehicle.reviews_count || 0} reviews)</span>

              </div>



              <div className="price-tag mb-4">

                ${vehicle.daily_rate}<small className="text-muted fs-6">/day</small>

              </div>



              <ListGroup variant="flush" className="mb-4">

                <ListGroup.Item className="d-flex justify-content-between px-0">

                  <span>🚗 Transmission</span>

                  <span className="fw-semibold">{vehicle.transmission}</span>

                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between px-0">

                  <span>👥 Seats</span>

                  <span className="fw-semibold">{vehicle.seats} people</span>

                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between px-0">

                  <span>🧳 Luggage</span>

                  <span className="fw-semibold">{vehicle.luggage_capacity} bags</span>

                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between px-0">

                  <span>⚡ Fuel Type</span>

                  <span className="fw-semibold">{vehicle.fuel_type}</span>

                </ListGroup.Item>

                {vehicle.range && (

                  <ListGroup.Item className="d-flex justify-content-between px-0">

                    <span>🔋 Range</span>

                    <span className="fw-semibold">{vehicle.range}</span>

                  </ListGroup.Item>

                )}

              </ListGroup>



              <Button 

                onClick={handleBookNow}

                variant="primary" 

                size="lg" 

                className="w-100 mb-3"

                disabled={!vehicle.is_available || bookingProcessing}

              >

                {bookingProcessing ? 'Processing...' : (!user ? '🔒 Sign In to Book' : vehicle.is_available ? 'Book Now & Pay' : 'Unavailable')}

              </Button>

              

              {!user && (

                <p className="text-muted small text-center mb-3">

                  You need to sign in to make a booking

                </p>

              )}

              

              <Button 

                variant="outline-primary" 

                size="lg" 

                className="w-100"

              >

                Contact Us

              </Button>



              <div className="bg-light p-3 rounded mt-3">

                <p className="small mb-1 fw-semibold">📞 Need help?</p>

                <p className="small text-muted mb-0">

                  Call us at <a href="tel:+1234567890" className="text-decoration-none">+1 (234) 567-890</a>

                </p>

              </div>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>

  )

}
