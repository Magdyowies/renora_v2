import React, { useState, useEffect } from 'react';
import paymentsService from '../../services/paymentsService';
import LoadingSpinner from '../LoadingSpinner';
import toast from 'react-hot-toast';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { format } from 'date-fns';

const WalletTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await paymentsService.getWalletTransactions();
        setTransactions(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch wallet transactions.');
        toast.error('Failed to fetch wallet transactions.');
        console.error('Error fetching wallet transactions:', err);
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Card className="mb-4"><Card.Body className="text-danger">{error}</Card.Body></Card>;
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="fw-bold mb-3">Wallet Transactions History</h5>
        {transactions.length === 0 ? (
          <p className="text-muted text-center">No transactions found.</p>
        ) : (
          <ListGroup variant="flush">
            {transactions.map((tx) => (
              <ListGroup.Item key={tx.id || `${tx.created_at}-${tx.amount}`} className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold text-capitalize">
                    {tx.transaction_type}{' '}
                    {tx.transaction_type === 'payment' && <Badge bg="danger">-{tx.amount}</Badge>}
                    {tx.transaction_type === 'refund' && <Badge bg="success">+{tx.amount}</Badge>}
                    {tx.transaction_type === 'credit' && <Badge bg="info">+{tx.amount}</Badge>}
                  </div>
                  <small className="text-muted">{tx.description}</small>
                  {tx.reference_id && (
                    <small className="text-muted d-block">Ref: {tx.reference_id}</small>
                  )}
                </div>
                <div className="text-end">
                  <span className="fw-bold">
                    {tx.transaction_type === 'payment' ? '-' : '+'}{tx.amount?.toFixed(2)}{' EGP'}
                  </span>
                  <small className="text-muted d-block">
                    {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}
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

export default WalletTransactions;
