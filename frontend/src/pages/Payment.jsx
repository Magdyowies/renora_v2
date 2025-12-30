import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Badge, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";

import bookingsService from "../services/bookingsService";
import paymentsService from "../services/paymentsService";
import LoadingSpinner from "../components/LoadingSpinner";

import WalletBalance from "../components/payments/WalletBalance";
import WalletTransactions from "../components/payments/WalletTransactions";
import PaymentHistory from "../components/payments/PaymentHistory";
import ApplyPromoCode from "../components/payments/ApplyPromoCode";

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [processing, setProcessing] = useState(false);
  const [promoResult, setPromoResult] = useState(null);

  // =========================
  // Fetch booking details
  // =========================
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingsService.getBookingDetails(bookingId);
        setBooking(data);
      } catch (err) {
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  // =========================
  // Submit payment
  // =========================
  const handlePayment = async () => {
    try {
      setProcessing(true);

      const promoCodeToSend = promoResult?.code || "";
      await paymentsService.createPayment(bookingId, paymentMethod, promoCodeToSend);

      toast.success("Payment completed successfully");
      navigate("/dashboard", { state: { bookingCompleted: true } });
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const finalAmount = promoResult?.final_amount ?? booking.final_price;

  return (
    <Container className="py-5">
      <Row>
        {/* ===================== Payment Form ===================== */}
        <Col md={7}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <h4 className="fw-bold mb-4">Payment Method</h4>

              <Form.Group className="mb-3">
                <Form.Label>Select payment method</Form.Label>
                <Form.Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={processing}
                >
                  <option value="wallet">Wallet</option>
                  <option value="stripe">Credit Card</option>
                </Form.Select>
              </Form.Group>

              <Button
                variant="primary"
                size="lg"
                className="w-100"
                disabled={processing || booking.status !== "pending"}
                onClick={handlePayment}
              >
                {processing ? "Processing..." : `Pay $${Number(finalAmount).toFixed(2)}`}
              </Button>
            </Card.Body>
          </Card>

          {/* Promo Code */}
          <ApplyPromoCode
            bookingAmount={booking.base_price}
            onPromoApplied={setPromoResult}
          />
        </Col>

        {/* ===================== Order Summary ===================== */}
        <Col md={5}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">Order Summary</h5>

              {booking.vehicle_details.primary_image?.image && (
                <img
                  src={booking.vehicle_details.primary_image.image}
                  alt={booking.vehicle_details.name}
                  className="img-fluid rounded mb-3"
                />
              )}

              <h6 className="fw-bold">{booking.vehicle_details.name}</h6>
              <Badge bg="secondary" className="mb-3">
                {booking.vehicle_details.category_name}
              </Badge>

              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Pickup Date</span>
                  <span>{format(new Date(booking.pickup_date), "MMM dd, yyyy")}</span>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Return Date</span>
                  <span>{format(new Date(booking.return_date), "MMM dd, yyyy")}</span>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Total Days</span>
                  <span>{booking.total_days}</span>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Status</span>
                  <Badge bg="info">{booking.status}</Badge>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between px-0 fw-bold">
                  <span>Total</span>
                  <span>${Number(finalAmount).toFixed(2)}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Wallet & History */}
          <WalletBalance />
          <WalletTransactions />
          <PaymentHistory />
        </Col>
      </Row>
    </Container>
  );
}

