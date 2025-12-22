import React, { useState, useEffect } from 'react';
import paymentsService from '../../services/paymentsService';
import LoadingSpinner from '../LoadingSpinner';
import toast from 'react-hot-toast';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { format } from 'date-fns';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await paymentsService.getPaymentHistory();
        setPayments(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch payment history.');
        toast.error('Failed to fetch payment history.');
        console.error('Error fetching payment history:', err);
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Card className="mb-4"><Card.Body className="text-danger">{error}</Card.Body></Card>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      case 'refunded': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="fw-bold mb-3">Payment History</h5>
        {payments.length === 0 ? (
          <p className="text-muted text-center">No payments found.</p>
        ) : (
          <ListGroup variant="flush">
            {payments.map((payment) => (
              <ListGroup.Item key={payment.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">
                    Payment ID: {payment.id} for Booking: {payment.booking}
                  </div>
                  <small className="text-muted">Method: {payment.method}</small>
                </div>
                <div className="text-end">
                  <span className="fw-bold">${Number(payment.amount)?.toFixed(2)}</span>
                  <Badge bg={getStatusBadge(payment.status)} className="ms-2 text-capitalize">
                    {payment.status}
                  </Badge>
                  <small className="text-muted d-block">
                    {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                  </small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default PaymentHistory;
