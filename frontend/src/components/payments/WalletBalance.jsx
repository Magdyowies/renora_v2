import React, { useState, useEffect } from 'react';
import paymentsService from '../../services/paymentsService';
import LoadingSpinner from '../LoadingSpinner';
import toast from 'react-hot-toast';
import { Card } from 'react-bootstrap';

const WalletBalance = () => {
  const [balance, setBalance] = useState(null);
  const [currency, setCurrency] = useState('EGP');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await paymentsService.getWalletBalance();
        setBalance(data.balance);
        setCurrency(data.currency);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch wallet balance.');
        toast.error('Failed to fetch wallet balance.');
        console.error('Error fetching wallet balance:', err);
        setIsLoading(false);
      }
    };
    fetchBalance();
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
        <h5 className="fw-bold mb-3">Wallet Balance</h5>
        <h2 className="display-4 fw-bold text-primary">
          {balance?.toFixed(2)} {currency}
        </h2>
      </Card.Body>
    </Card>
  );
};

export default WalletBalance;
